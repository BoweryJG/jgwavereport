import axios from 'axios';
import { SurfLocation, WindConditions, WaveConditions, TideData } from '../types/surf';

const NOAA_API_BASE = 'https://api.tidesandcurrents.noaa.gov/api/prod';
const NWS_API_BASE = 'https://api.weather.gov';

// NOAA Station IDs near our surf spots
const NOAA_STATIONS = {
  'smith-point': '8531680', // Fire Island Light, NY
  'long-beach': '8516945', // Kings Point, NY
  'montauk': '8510560', // Montauk, NY
  'brick-nj': '8534720', // Atlantic City, NJ
};

export class NoaaService {
  // Fetch water temperature from NOAA CO-OPS
  async getWaterTemperature(location: SurfLocation): Promise<number> {
    try {
      const stationId = NOAA_STATIONS[location.id as keyof typeof NOAA_STATIONS];
      const response = await axios.get(`${NOAA_API_BASE}/datagetter`, {
        params: {
          product: 'water_temperature',
          station: stationId,
          date: 'latest',
          units: 'english',
          time_zone: 'lst_ldt',
          format: 'json'
        }
      });
      
      if (response.data.data && response.data.data.length > 0) {
        return parseFloat(response.data.data[0].v);
      }
      return 0;
    } catch (error) {
      console.error('Error fetching water temperature:', error);
      return 0;
    }
  }

  // Fetch tide predictions
  async getTidePredictions(location: SurfLocation, days: number = 7): Promise<TideData[]> {
    try {
      const stationId = NOAA_STATIONS[location.id as keyof typeof NOAA_STATIONS];
      const beginDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0].replace(/-/g, '');
      
      const response = await axios.get(`${NOAA_API_BASE}/datagetter`, {
        params: {
          product: 'predictions',
          station: stationId,
          begin_date: beginDate,
          end_date: endDate,
          datum: 'MLLW',
          interval: 'hilo',
          units: 'english',
          time_zone: 'lst_ldt',
          format: 'json'
        }
      });
      
      if (response.data.predictions) {
        return response.data.predictions.map((pred: any) => ({
          time: new Date(pred.t),
          height: parseFloat(pred.v),
          type: pred.type === 'H' ? 'high' : 'low'
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching tide predictions:', error);
      return [];
    }
  }

  // Fetch wind data from NWS
  async getWindData(location: SurfLocation): Promise<WindConditions | null> {
    try {
      // First get the grid point for the location
      const pointResponse = await axios.get(
        `${NWS_API_BASE}/points/${location.coordinates.latitude},${location.coordinates.longitude}`
      );
      
      const { gridX, gridY, gridId } = pointResponse.data.properties;
      
      // Get the forecast for that grid point
      const forecastResponse = await axios.get(
        `${NWS_API_BASE}/gridpoints/${gridId}/${gridX},${gridY}`
      );
      
      const windSpeed = forecastResponse.data.properties.windSpeed.values[0];
      const windDirection = forecastResponse.data.properties.windDirection.values[0];
      const windGust = forecastResponse.data.properties.windGust.values[0];
      
      return {
        speed: this.convertKmhToMph(windSpeed.value),
        gusts: windGust ? this.convertKmhToMph(windGust.value) : 0,
        direction: windDirection.value,
        compassDirection: this.degreesToCompass(windDirection.value),
        unit: 'mph'
      };
    } catch (error) {
      console.error('Error fetching wind data:', error);
      return null;
    }
  }

  // Fetch marine forecast from NWS
  async getMarineForecast(location: SurfLocation): Promise<any> {
    try {
      const response = await axios.get(
        `${NWS_API_BASE}/points/${location.coordinates.latitude},${location.coordinates.longitude}`
      );
      
      const forecastUrl = response.data.properties.forecast;
      const forecastResponse = await axios.get(forecastUrl);
      
      return forecastResponse.data.properties.periods;
    } catch (error) {
      console.error('Error fetching marine forecast:', error);
      return [];
    }
  }

  // Convert kilometers per hour to miles per hour
  private convertKmhToMph(kmh: number): number {
    return Math.round(kmh * 0.621371);
  }

  // Convert degrees to compass direction
  private degreesToCompass(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }
}