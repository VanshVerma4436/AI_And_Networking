export interface NetworkStat {
  name: string;
  value: number | string | null;
  unit?: string;
  delta?: number;
  percentage?: number;
}
