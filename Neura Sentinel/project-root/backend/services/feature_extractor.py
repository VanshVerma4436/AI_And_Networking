import pyshark
import requests
import logging
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def capture_packets(interface, duration=60):
    """Capture packets on the specified interface for the given duration."""
    logger.info(f"Starting packet capture on interface {interface} for {duration} seconds")
    capture = pyshark.LiveCapture(interface=interface)
    packets = []
    
    try:
        start_time = time.time()
        for packet in capture.sniff_continuously():
            packets.append(packet)
            if time.time() - start_time > duration:
                break
    except Exception as e:
        logger.error(f"Error capturing packets: {str(e)}")
        return []
    finally:
        capture.close()
    
    logger.info(f"Captured {len(packets)} packets")
    return packets

def extract_features(packets):
    """Extract features from captured packets."""
    if not packets:
        logger.warning("No packets captured")
        return None
    
    try:
        # Example feature extraction (simplified)
        flow_duration = 0.001234  # Placeholder
        total_fwd_packets = len(packets)
        total_bwd_packets = 0
        total_length_fwd = sum(int(packet.length) for packet in packets)
        total_length_bwd = 0

        features = {
            "Flow_Duration": flow_duration,
            "Total_Fwd_Packets": total_fwd_packets,
            "Total_Backward_Packets": total_bwd_packets,
            "Total_Length_of_Fwd_Packets": total_length_fwd,
            "Total_Length_of_Bwd_Packets": total_length_bwd
        }
        logger.info(f"Extracted features: {features}")
        return features
    except Exception as e:
        logger.error(f"Error extracting features: {str(e)}")
        return None

def classify_traffic(features):
    """Send features to the backend for classification."""
    if not features:
        logger.warning("No features to classify")
        return None
    
    try:
        url = "http://127.0.0.1:8000/traffic/classify"
        headers = {"Content-Type": "application/json"}
        response = requests.post(url, json=features, headers=headers, timeout=10)
        response.raise_for_status()
        label = response.json().get("label")
        logger.info(f"Predicted label: {label}")
        return label
    except requests.exceptions.RequestException as e:
        logger.error(f"Error sending request to backend: {str(e)}")
        return None

def main():
    interface = r"\Device\NPF_{FCF2AC5C-4FCF-4F0F-8B35-DDEAAAF4F4CE}"  # Wi-Fi interface
    duration = 10  # Reduced for faster testing
    packets = capture_packets(interface, duration)
    features = extract_features(packets)
    if features:
        label = classify_traffic(features)
        if label:
            print(f"Predicted Label: {label}")
        else:
            logger.error("Failed to classify traffic")
    else:
        logger.error("No features extracted")

if __name__ == "__main__":
    main()