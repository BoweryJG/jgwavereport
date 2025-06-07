import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Box, Paper, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SurfLocation, HistoricalData } from '../types/surf';
import { SurfDataService } from '../services/surfDataService';
import { format } from 'date-fns';

interface HistoricalChartProps {
  location: SurfLocation;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({ location }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [viewMode, setViewMode] = useState<'wave' | 'rating'>('wave');
  const surfDataService = new SurfDataService();

  useEffect(() => {
    const fetchHistoricalData = async () => {
      const data = await surfDataService.getHistoricalData(location, 7);
      setHistoricalData(data);
    };
    fetchHistoricalData();
  }, [location]);

  const chartData = historicalData.map(data => ({
    date: format(data.date, 'MMM dd'),
    waveMin: data.waves.height.min,
    waveMax: data.waves.height.max,
    waveAvg: data.waves.height.average,
    period: data.waves.period,
    windSpeed: data.wind.speed,
    rating: data.rating,
    quality: data.waves.quality
  }));

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'wave' | 'rating') => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Past 7 Days Analysis
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="wave">Wave Data</ToggleButton>
          <ToggleButton value="rating">Conditions Rating</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'wave' ? (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3f51b5" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" label={{ value: 'Wave Height (ft)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Period (s)', angle: 90, position: 'insideRight' }} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2">{label}</Typography>
                      <Typography variant="body2" color="primary">
                        Wave Range: {payload[0]?.payload.waveMin} - {payload[0]?.payload.waveMax} ft
                      </Typography>
                      <Typography variant="body2">
                        Average: {payload[0]?.payload.waveAvg} ft
                      </Typography>
                      <Typography variant="body2">
                        Period: {payload[0]?.payload.period}s
                      </Typography>
                      <Typography variant="body2">
                        Wind: {payload[0]?.payload.windSpeed} mph
                      </Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />
            <Bar yAxisId="left" dataKey="waveAvg" fill="#3f51b5" opacity={0.6} />
            <Line yAxisId="left" type="monotone" dataKey="waveMax" stroke="#f44336" strokeWidth={2} dot={{ fill: '#f44336' }} />
            <Line yAxisId="right" type="monotone" dataKey="period" stroke="#4caf50" strokeWidth={2} dot={{ fill: '#4caf50' }} />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} label={{ value: 'Rating', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2">{label}</Typography>
                      <Typography variant="body2" color="primary">
                        Rating: {payload[0].value}/10
                      </Typography>
                      <Typography variant="body2">
                        Quality: {payload[0]?.payload.quality}
                      </Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="rating" 
              fill="#2196f3"
              shape={(props: any) => {
                const { x, y, width, height, payload } = props;
                let fill = '#f44336';
                if (payload.rating >= 8) fill = '#4caf50';
                else if (payload.rating >= 6) fill = '#2196f3';
                else if (payload.rating >= 4) fill = '#ff9800';
                
                return <rect x={x} y={y} width={width} height={height} fill={fill} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {Math.max(...chartData.map(d => d.waveMax))}ft
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Biggest Wave
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {Math.round(chartData.reduce((acc, d) => acc + d.waveAvg, 0) / chartData.length * 10) / 10}ft
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Average Height
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {Math.max(...chartData.map(d => d.rating))}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Best Day Rating
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};