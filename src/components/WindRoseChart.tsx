import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Box, Paper, Typography } from '@mui/material';
import { WindConditions } from '../types/surf';

interface WindRoseChartProps {
  windData: WindConditions;
}

export const WindRoseChart: React.FC<WindRoseChartProps> = ({ windData }) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  
  const data = directions.map(direction => {
    const isCurrentDirection = windData.compassDirection.includes(direction);
    return {
      direction,
      speed: isCurrentDirection ? windData.speed : 0,
      gusts: isCurrentDirection ? windData.gusts : 0
    };
  });

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Wind Conditions
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1">
          {windData.speed} {windData.unit} from {windData.compassDirection}
        </Typography>
        {windData.gusts > windData.speed && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Gusts to {windData.gusts} {windData.unit}
          </Typography>
        )}
      </Box>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="direction" />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, Math.max(30, windData.gusts)]} 
            tickCount={4}
          />
          <Radar 
            name="Wind Speed" 
            dataKey="speed" 
            stroke="#2196f3" 
            fill="#2196f3" 
            fillOpacity={0.6} 
          />
          <Radar 
            name="Gusts" 
            dataKey="gusts" 
            stroke="#f44336" 
            fill="#f44336" 
            fillOpacity={0.3} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </Paper>
  );
};