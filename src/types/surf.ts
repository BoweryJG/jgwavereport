export interface WaveConditions {
  height: {
    min: number;
    max: number;
    average: number;
    unit: 'ft' | 'm';
  };
  period: number; // seconds
  direction: number; // degrees
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface SwellData {
  height: number;
  period: number;
  direction: number;
  compassDirection: string;
}

export interface WindConditions {
  speed: number;
  gusts: number;
  direction: number;
  compassDirection: string;
  unit: 'mph' | 'kph' | 'kts';
}

export interface TideData {
  time: Date;
  height: number;
  type: 'high' | 'low';
}

export interface WaterConditions {
  temperature: number;
  unit: 'F' | 'C';
  clarity: 'murky' | 'fair' | 'clear';
}

export interface SurfLocation {
  id: string;
  name: string;
  region: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  webcamUrl?: string;
  spotInfo?: {
    bestTide: string;
    bestWind: string;
    surfLevel: string[];
  };
}

export interface SurfReport {
  location: SurfLocation;
  timestamp: Date;
  conditions: {
    waves: WaveConditions;
    swell: SwellData[];
    wind: WindConditions;
    tide: TideData[];
    water: WaterConditions;
  };
  forecast: SurfForecast[];
  rating: number; // 1-10
  alerts?: string[];
}

export interface SurfForecast {
  date: Date;
  waves: WaveConditions;
  wind: WindConditions;
  tide: TideData[];
  weather: {
    temperature: number;
    description: string;
    icon: string;
  };
  rating: number;
}

export interface HistoricalData {
  date: Date;
  waves: WaveConditions;
  wind: WindConditions;
  rating: number;
}