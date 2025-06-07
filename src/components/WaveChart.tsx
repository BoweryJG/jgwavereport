import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Paper, Typography } from '@mui/material';
import { SurfForecast } from '../types/surf';
import { format } from 'date-fns';

interface WaveChartProps {
  forecast: SurfForecast[];
  title?: string;
}

export const WaveChart: React.FC<WaveChartProps> = ({ forecast, title = 'Wave Height Forecast' }) => {
  const data = forecast.map(day => ({
    date: format(day.date, 'MMM dd'),
    min: day.waves.height.min,
    max: day.waves.height.max,
    avg: day.waves.height.average,
    period: day.waves.period,
    rating: day.rating
  }));

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Height (ft)', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2">{label}</Typography>
                    <Typography variant="body2" color="primary">
                      Wave Height: {payload[0].payload.min} - {payload[0].payload.max} ft
                    </Typography>
                    <Typography variant="body2">
                      Period: {payload[0].payload.period}s
                    </Typography>
                    <Typography variant="body2">
                      Rating: {payload[0].payload.rating}/10
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="max" 
            stroke="#1976d2" 
            fillOpacity={1} 
            fill="url(#colorWave)" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="avg" 
            stroke="#ff9800" 
            strokeWidth={2}
            dot={{ fill: '#ff9800' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};