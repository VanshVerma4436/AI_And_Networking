import os
import sys
import time
import pyshark
import asyncio
import requests
from collections import defaultdict

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

from utils.websocket_manager import connected_clients

BACKEND_URL = "http://127.0.0.1:8000/traffic/classify"
RUNNING_FLAG = None


def set_running_flag(flag):
    global RUNNING_FLAG
    RUNNING_FLAG = flag


class FeatureExtractor:
    def __init__(self):
        self.flows = defaultdict(lambda: {
            'start_time': None,
            'fwd_packets': 0,
            'bwd_packets': 0,
            'fwd_bytes': 0,
            'bwd_bytes': 0
        })
        self.last_processed = defaultdict(lambda: 0.0)
        self.flow_metadata = {}

    def get_flow_key(self, packet):
        return (packet['src_ip'], packet['dst_ip'], packet['src_port'], packet['dst_port'], packet['protocol'])

    def update_flow(self, packet, timestamp):
        flow_key = self.get_flow_key(packet)
        flow = self.flows[flow_key]

        if flow['start_time'] is None:
            flow['start_time'] = timestamp

        self.flow_metadata[flow_key] = {
            'src_ip': packet['src_ip'],
            'dst_ip': packet['dst_ip']
        }

        size = packet['packet_size']
        if packet['src_ip'] < packet['dst_ip']:
            flow['fwd_packets'] += 1
            flow['fwd_bytes'] += size
        else:
            flow['bwd_packets'] += 1
            flow['bwd_bytes'] += size

        return flow_key

    def extract_features(self, flow_key, timestamp):
        flow = self.flows[flow_key]
        duration = timestamp - flow['start_time'] if flow['start_time'] else 0

        features = {
            'Flow Duration': duration,
            'Total Fwd Packets': flow['fwd_packets'],
            'Total Backward Packets': flow['bwd_packets'],
            'Total Length of Fwd Packets': flow['fwd_bytes'],
            'Total Length of Bwd Packets': flow['bwd_bytes'],
            'src_ip': self.flow_metadata[flow_key]['src_ip'],
            'dst_ip': self.flow_metadata[flow_key]['dst_ip'],
            'timestamp': int(timestamp * 1000)
        }

        self.flows[flow_key] = {
            'start_time': None,
            'fwd_packets': 0,
            'bwd_packets': 0,
            'fwd_bytes': 0,
            'bwd_bytes': 0
        }

        self.last_processed[flow_key] = timestamp
        return features

    def send_to_backend_and_ws(self, features):
        try:
            response = requests.post(BACKEND_URL, json={
                "Flow_Duration": features['Flow Duration'],
                "Total_Fwd_Packets": features['Total Fwd Packets'],
                "Total_Backward_Packets": features['Total Backward Packets'],
                "Total_Length_of_Fwd_Packets": features['Total Length of Fwd Packets'],
                "Total_Length_of_Bwd_Packets": features['Total Length of Bwd Packets'],
            })

            if response.status_code == 200:
                label = response.json().get("label")
                payload = {
                    "fwd": features['Total Fwd Packets'],
                    "bwd": features['Total Backward Packets'],
                    "label": label,
                    "src_ip": features['src_ip'],
                    "dst_ip": features['dst_ip'],
                    "timestamp": features['timestamp']
                }
                asyncio.run(self.broadcast_ws(payload))
            else:
                print(f"[HTTP ERROR] {response.status_code}: {response.text}")
        except Exception as e:
            print("[SEND ERROR]", str(e))

    async def broadcast_ws(self, data):
        for ws in connected_clients.copy():
            try:
                await ws.send_json(data)
            except Exception:
                connected_clients.remove(ws)


def packet_to_dict(packet):
    try:
        if hasattr(packet, 'ip'):
            src_ip = packet.ip.src
            dst_ip = packet.ip.dst
        elif hasattr(packet, 'ipv6'):
            src_ip = packet.ipv6.src
            dst_ip = packet.ipv6.dst
        else:
            return None

        if packet.transport_layer:
            proto = packet.transport_layer
            src_port = packet[proto.lower()].srcport
            dst_port = packet[proto.lower()].dstport
        elif hasattr(packet, 'icmp'):
            proto = 'ICMP'
            src_port = dst_port = 0
        else:
            return None

        return {
            'src_ip': src_ip,
            'dst_ip': dst_ip,
            'src_port': int(src_port),
            'dst_port': int(dst_port),
            'protocol': proto,
            'packet_size': int(packet.length)
        }
    except Exception:
        return None


def capture_packets(interface='\\Device\\NPF_{FCF2AC5C-4FCF-4F0F-8B35-DDEAAAF4F4CE}', batch_interval=10):
    print(f"[Sniffer] Capturing on interface: {interface}")
    extractor = FeatureExtractor()
    capture = pyshark.LiveCapture(interface=interface)
    last_batch = time.time()
    flows = set()

    for pkt in capture.sniff_continuously():
        if RUNNING_FLAG and not RUNNING_FLAG.value:
            print("[Sniffer] Graceful stop triggered.")
            break

        now = time.time()
        pkt_dict = packet_to_dict(pkt)
        if pkt_dict:
            flow_key = extractor.update_flow(pkt_dict, now)
            flows.add(flow_key)

        if now - last_batch >= batch_interval:
            for flow in flows:
                features = extractor.extract_features(flow, now)
                print("[FEATURES]", features)
                extractor.send_to_backend_and_ws(features)
            flows.clear()
            last_batch = now


if __name__ == "__main__":
    try:
        class DummyFlag:
            value = True

        set_running_flag(DummyFlag())
        capture_packets()  # default interface set above
    except KeyboardInterrupt:
        print("[Sniffer] Stopped by user")
    except Exception as e:
        print("[Sniffer ERROR]", str(e))
