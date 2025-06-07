import { SurfLocation, SurfReport, HistoricalData } from '../types/surf';
import { NoaaService } from './noaaService';
import { MarineWeatherService } from './marineWeatherService';

export class SurfDataService {
  private noaaService: NoaaService;
  private marineService: MarineWeatherService;

  constructor() {
    this.noaaService = new NoaaService();
    this.marineService = new MarineWeatherService();
  }

  async getSurfReport(location: SurfLocation): Promise<SurfReport | null> {
    try {
      // Fetch all data in parallel
      const [waveConditions, swellData, windData, tideData, waterTemp, forecast] = await Promise.all([
        this.marineService.getWaveConditions(location),
        this.marineService.getSwellData(location),
        this.noaaService.getWindData(location),
        this.noaaService.getTidePredictions(location, 2),
        this.noaaService.getWaterTemperature(location),
        this.marineService.getSevenDayForecast(location)
      ]);

      if (!waveConditions) {
        throw new Error('Unable to fetch wave conditions');
      }

      // Calculate overall rating
      const rating = this.calculateOverallRating(
        waveConditions,
        windData,
        swellData[0]
      );

      // Add tide data to forecast
      const forecastWithTides = forecast.map(day => {
        const dayTides = tideData.filter(tide => 
          tide.time.toDateString() === day.date.toDateString()
        );
        return { ...day, tide: dayTides };
      });

      const report: SurfReport = {
        location,
        timestamp: new Date(),
        conditions: {
          waves: waveConditions,
          swell: swellData,
          wind: windData || {
            speed: 0,
            gusts: 0,
            direction: 0,
            compassDirection: 'N',
            unit: 'mph'
          },
          tide: tideData.filter(tide => {
            const now = new Date();
            return tide.time > now && tide.time < new Date(now.getTime() + 24 * 60 * 60 * 1000);
          }),
          water: {
            temperature: waterTemp || 0,
            unit: 'F',
            clarity: 'fair' // Default, would need additional data source
          }
        },
        forecast: forecastWithTides,
        rating,
        alerts: this.generateAlerts(waveConditions, windData)
      };

      return report;
    } catch (error) {
      console.error('Error fetching surf report:', error);
      return null;
    }
  }

  async getHistoricalData(location: SurfLocation, days: number = 7): Promise<HistoricalData[]> {
    // This would typically fetch from a historical database
    // For now, we'll generate sample data
    const historicalData: HistoricalData[] = [];
    const today = new Date();

    for (let i = days; i > 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      historicalData.push({
        date,
        waves: {
          height: {
            min: Math.random() * 2 + 1,
            max: Math.random() * 4 + 2,
            average: Math.random() * 3 + 1.5,
            unit: 'ft'
          },
          period: Math.floor(Math.random() * 6) + 6,
          direction: Math.floor(Math.random() * 360),
          quality: ['poor', 'fair', 'good', 'excellent'][Math.floor(Math.random() * 4)] as any
        },
        wind: {
          speed: Math.floor(Math.random() * 20) + 5,
          gusts: Math.floor(Math.random() * 30) + 10,
          direction: Math.floor(Math.random() * 360),
          compassDirection: 'NW',
          unit: 'mph'
        },
        rating: Math.floor(Math.random() * 5) + 5
      });
    }

    return historicalData;
  }

  private calculateOverallRating(
    waves: any,
    wind: any,
    swell: any
  ): number {
    let rating = 5;

    // Wave height factor
    if (waves.height.average >= 4) rating += 2;
    else if (waves.height.average >= 2) rating += 1;

    // Wave period factor
    if (waves.period >= 10) rating += 1;

    // Wind factor
    if (wind) {
      if (wind.speed < 10) rating += 1;
      else if (wind.speed > 20) rating -= 1;
    }

    // Swell factor
    if (swell && swell.period >= 12) rating += 1;

    return Math.min(10, Math.max(1, rating));
  }

  private generateAlerts(waves: any, wind: any): string[] {
    const alerts: string[] = [];

    if (waves.height.max > 8) {
      alerts.push('⚠️ High surf advisory - waves exceeding 8ft');
    }

    if (wind && wind.speed > 25) {
      alerts.push('💨 Strong wind warning - winds exceeding 25mph');
    }

    if (waves.quality === 'excellent') {
      alerts.push('🏄 Excellent conditions - get out there!');
    }

    return alerts;
  }
}