import axios from 'axios';
import { SurfLocation, WaveConditions, SwellData, SurfForecast } from '../types/surf';

// Using Open-Meteo Marine API (free and no API key required)
const MARINE_API_BASE = 'https://marine-api.open-meteo.com/v1/marine';

export class MarineWeatherService {
  async getWaveConditions(location: SurfLocation): Promise<WaveConditions | null> {
    try {
      const response = await axios.get(MARINE_API_BASE, {
        params: {
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
          current: 'wave_height,wave_direction,wave_period',
          hourly: 'wave_height,wave_direction,wave_period',
          timezone: 'America/New_York'
        }
      });

      const current = response.data.current;
      const hourly = response.data.hourly;
      
      // Calculate min/max from hourly data for next 24 hours
      const next24Hours = hourly.wave_height.slice(0, 24);
      const minHeight = Math.min(...next24Hours.filter((h: number) => h !== null));
      const maxHeight = Math.max(...next24Hours.filter((h: number) => h !== null));
      
      return {
        height: {
          min: this.metersToFeet(minHeight),
          max: this.metersToFeet(maxHeight),
          average: this.metersToFeet(current.wave_height),
          unit: 'ft'
        },
        period: Math.round(current.wave_period),
        direction: current.wave_direction,
        quality: this.calculateQuality(current.wave_height, current.wave_period)
      };
    } catch (error) {
      console.error('Error fetching wave conditions:', error);
      return null;
    }
  }

  async getSwellData(location: SurfLocation): Promise<SwellData[]> {
    try {
      const response = await axios.get(MARINE_API_BASE, {
        params: {
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
          current: 'swell_wave_height,swell_wave_direction,swell_wave_period',
          timezone: 'America/New_York'
        }
      });

      const current = response.data.current;
      
      // Primary swell
      const swells: SwellData[] = [];
      if (current.swell_wave_height) {
        swells.push({
          height: this.metersToFeet(current.swell_wave_height),
          period: Math.round(current.swell_wave_period),
          direction: current.swell_wave_direction,
          compassDirection: this.degreesToCompass(current.swell_wave_direction)
        });
      }
      
      return swells;
    } catch (error) {
      console.error('Error fetching swell data:', error);
      return [];
    }
  }

  async getSevenDayForecast(location: SurfLocation): Promise<SurfForecast[]> {
    try {
      const response = await axios.get(MARINE_API_BASE, {
        params: {
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
          daily: 'wave_height_max,wave_direction_dominant,wave_period_max',
          timezone: 'America/New_York'
        }
      });

      const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
          daily: 'temperature_2m_max,weathercode,windspeed_10m_max,winddirection_10m_dominant',
          timezone: 'America/New_York'
        }
      });

      const marineDaily = response.data.daily;
      const weatherDaily = weatherResponse.data.daily;
      const forecasts: SurfForecast[] = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(marineDaily.time[i]);
        const waveHeight = marineDaily.wave_height_max[i];
        const wavePeriod = marineDaily.wave_period_max[i];
        
        forecasts.push({
          date,
          waves: {
            height: {
              min: this.metersToFeet(waveHeight * 0.7),
              max: this.metersToFeet(waveHeight),
              average: this.metersToFeet(waveHeight * 0.85),
              unit: 'ft'
            },
            period: Math.round(wavePeriod),
            direction: marineDaily.wave_direction_dominant[i],
            quality: this.calculateQuality(waveHeight, wavePeriod)
          },
          wind: {
            speed: Math.round(weatherDaily.windspeed_10m_max[i] * 0.621371),
            gusts: Math.round(weatherDaily.windspeed_10m_max[i] * 0.621371 * 1.3),
            direction: weatherDaily.winddirection_10m_dominant[i],
            compassDirection: this.degreesToCompass(weatherDaily.winddirection_10m_dominant[i]),
            unit: 'mph'
          },
          tide: [], // Will be filled by NOAA service
          weather: {
            temperature: Math.round(weatherDaily.temperature_2m_max[i] * 9/5 + 32),
            description: this.getWeatherDescription(weatherDaily.weathercode[i]),
            icon: this.getWeatherIcon(weatherDaily.weathercode[i])
          },
          rating: this.calculateRating(waveHeight, wavePeriod, weatherDaily.windspeed_10m_max[i])
        });
      }

      return forecasts;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return [];
    }
  }

  private metersToFeet(meters: number): number {
    return Math.round(meters * 3.28084 * 10) / 10;
  }

  private degreesToCompass(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  private calculateQuality(heightMeters: number, period: number): 'poor' | 'fair' | 'good' | 'excellent' {
    const heightFt = this.metersToFeet(heightMeters);
    const score = (heightFt * 0.5) + (period * 0.5);
    
    if (score >= 10) return 'excellent';
    if (score >= 7) return 'good';
    if (score >= 4) return 'fair';
    return 'poor';
  }

  private calculateRating(heightMeters: number, period: number, windSpeed: number): number {
    const heightFt = this.metersToFeet(heightMeters);
    let rating = 5;
    
    // Wave size factor
    if (heightFt >= 4) rating += 2;
    else if (heightFt >= 2) rating += 1;
    
    // Period factor
    if (period >= 10) rating += 2;
    else if (period >= 8) rating += 1;
    
    // Wind factor (lower is better)
    if (windSpeed < 10) rating += 1;
    else if (windSpeed > 20) rating -= 1;
    
    return Math.min(10, Math.max(1, rating));
  }

  private getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Heavy rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail'
    };
    return weatherCodes[code] || 'Unknown';
  }

  private getWeatherIcon(code: number): string {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2 || code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 75) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '☁️';
  }
}