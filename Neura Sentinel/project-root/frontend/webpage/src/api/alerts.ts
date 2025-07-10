// src/api/alerts.ts

export interface Alert {
  id: string;
  type: string;
  severity: string;
  status: string;
  source: string;
  destination: string;
  details: string;
  timestamp: number;
}

export async function getAlertData(): Promise<Alert[]> {
  try {
    const response = await fetch("http://localhost:8000/alerts/");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Alert[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch alert data:", error);
    throw error;
  }
}
