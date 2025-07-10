// src/api/traffic.ts

export interface TrafficData {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  type: string;
  size: number;
  timestamp: number;
  status: 'normal' | 'suspicious' | 'blocked';
}

export async function getTrafficData(): Promise<TrafficData[]> {
  try {
    const response = await fetch("http://localhost:8000/traffic/");
    if (!response.ok) {
      throw new Error(`Failed to fetch traffic data: ${response.status}`);
    }
    const data: TrafficData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    throw error;
  }
}
