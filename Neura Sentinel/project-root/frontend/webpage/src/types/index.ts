export interface TrafficData {
  id: string;
  timestamp: number;
  source: string;
  destination: string;
  protocol: string;
  type: TrafficType;
  size: number;
  packetCount?: number;
  status: TrafficStatus;
}

export interface ThreatData {
  id: string;
  timestamp: number;
  source: string;
  destination: string;
  type: ThreatType;
  severity: ThreatSeverity;
  status: ThreatStatus;
  details: string;
}

export interface NetworkStat {
  name: string;
  value: number;
  delta?: number;
  unit: string;
}

export interface TimeSeriesData {
  time: string;
  value: number;
}

export type TrafficType =
  | 'HTTP'
  | 'HTTPS'
  | 'DNS'
  | 'SSH'
  | 'FTP'
  | 'SMTP'
  | 'P2P'
  | 'Media'
  | 'VoIP'
  | 'BENIGN'
  | 'MALICIOUS'
  | 'DOS'
  | 'DDOS'
  | 'Unknown'; // Fallback for robustness

export type TrafficStatus =
  | 'normal'
  | 'suspicious'
  | 'blocked';

export type ThreatType =
  | 'Port Scan'
  | 'DDoS'
  | 'Brute Force'
  | 'Malware'
  | 'Data Exfiltration'
  | 'Phishing'
  | 'Other';

export type ThreatSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type ThreatStatus =
  | 'detected'
  | 'investigating'
  | 'mitigated'
  | 'resolved';

