import { SurfLocation } from '../types/surf';

export const SURF_LOCATIONS: SurfLocation[] = [
  {
    id: 'smith-point',
    name: 'Smith Point',
    region: 'Long Island, NY',
    coordinates: {
      latitude: 40.7273,
      longitude: -72.8689
    },
    webcamUrl: 'https://thesurfersview.com/live-cams/new-york/fire-island-beach-cam-and-surf-report/',
    spotInfo: {
      bestTide: 'Mid to high tide',
      bestWind: 'N, NW, W',
      surfLevel: ['Beginner', 'Intermediate', 'Advanced']
    }
  },
  {
    id: 'long-beach',
    name: 'Long Beach',
    region: 'Long Island, NY',
    coordinates: {
      latitude: 40.5885,
      longitude: -73.6579
    },
    webcamUrl: 'https://thesurfersview.com/live-cams/new-york/long-beach-cam-and-surf-report/',
    spotInfo: {
      bestTide: 'All tides',
      bestWind: 'N, NE, NW',
      surfLevel: ['Beginner', 'Intermediate']
    }
  },
  {
    id: 'montauk',
    name: 'Montauk Point',
    region: 'Long Island, NY',
    coordinates: {
      latitude: 41.0715,
      longitude: -71.8561
    },
    webcamUrl: 'https://www.surf-forecast.com/breaks/Montauk-Point-Turtles/webcams/latest',
    spotInfo: {
      bestTide: 'Mid to high tide',
      bestWind: 'W, NW, SW',
      surfLevel: ['Intermediate', 'Advanced', 'Expert']
    }
  },
  {
    id: 'brick-nj',
    name: 'Brick Beach',
    region: 'New Jersey',
    coordinates: {
      latitude: 40.0584,
      longitude: -74.0343
    },
    webcamUrl: 'https://njbeachcams.com/central-new-jersey/brick-weather-beach-cam-and-surf-report/',
    spotInfo: {
      bestTide: 'Low to mid tide',
      bestWind: 'W, NW, SW',
      surfLevel: ['Beginner', 'Intermediate']
    }
  }
];