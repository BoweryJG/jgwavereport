# JG Wave Report 🏄‍♂️

A stunning real-time surf forecasting tool for the northeastern United States, featuring live webcam feeds, NOAA data integration, and beautiful visualizations for surf conditions.

## Features

- **Real-time Surf Data**: Live wave height, swell period, and direction
- **Live Webcam Feeds**: Direct feeds from Smith Point, Long Beach, Montauk, and Brick Beach, NJ
- **NOAA Integration**: Official water temperature and tide predictions
- **7-Day Forecast**: Detailed wave and weather forecasts with stunning visualizations
- **Historical Analysis**: Past 7 days of surf conditions with trend analysis
- **Wind Rose Charts**: Visual representation of wind conditions
- **Tide Charts**: Interactive tide predictions with smooth curves
- **Mobile Responsive**: Works perfectly on all devices

## Locations Covered

1. **Smith Point** - Long Island, NY
2. **Long Beach** - Long Island, NY
3. **Montauk Point** - Long Island, NY
4. **Brick Beach** - New Jersey

## Technology Stack

- React with TypeScript
- Material-UI for stunning UI components
- Recharts for data visualization
- NOAA CO-OPS API for official marine data
- Open-Meteo Marine API for wave forecasts
- Live webcam integration

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jgwavereport.git
cd jgwavereport
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm start
```

## Deployment

The app is configured for easy deployment to Netlify:

1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the build settings from `netlify.toml`
3. Deploy!

## API Usage

This app uses only free, no-authentication-required APIs:

- **NOAA Tides & Currents**: Official US government marine data
- **National Weather Service API**: Weather and wind forecasts
- **Open-Meteo Marine API**: Wave height and swell data
- **Live Webcam Feeds**: Direct iframe integration from surf cam providers

## Features in Detail

### Wave Forecasting
- Minimum, maximum, and average wave heights
- Swell period and direction
- Wave quality ratings
- 7-day detailed forecasts

### Wind Analysis
- Real-time wind speed and direction
- Wind rose visualization
- Gust predictions
- Optimal wind conditions for each spot

### Tide Predictions
- High and low tide times
- Smooth tide curves
- Current tide position indicator
- Best tide recommendations for each spot

### Water Conditions
- Real-time water temperature
- Clarity estimates
- Safety alerts for extreme conditions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Acknowledgments

- NOAA for providing free marine data
- Open-Meteo for their excellent weather API
- The surf cam providers for their live feeds