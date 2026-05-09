export type LayerId = 'methane' | 'no2' | 'pm25' | 'co' | 'wildfire';

export type Severity = 'low' | 'medium' | 'high';

export interface PollutionPoint {
  id: string;
  layerId: LayerId;
  lat: number;
  lon: number;
  value: number;
  unit: string;
  timestamp: string;
  severity: Severity;
}

export type Urgency = 'Safe' | 'Caution' | 'Avoid';

export interface AIBriefing {
  explanation: string;
  action: string;
  urgency: Urgency;
}

export interface CitizenReport {
  _id?: string;
  _rev?: string;
  type: 'report';
  layerId: LayerId;
  description: string;
  lat: number;
  lon: number;
  timestamp: string;
  severity: Severity;
}
