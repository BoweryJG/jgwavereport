import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { TideData } from '../types/surf';
import { format } from 'date-fns';
import { Waves, ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface TideChartProps {
  tideData: TideData[];
  currentTime?: Date;
}

export const TideChart: React.FC<TideChartProps> = ({ tideData, currentTime = new Date() }) => {
  // Generate smooth tide curve data points
  const generateTideCurve = () => {
    const curveData = [];
    const sortedTides = [...tideData].sort((a, b) => a.time.getTime() - b.time.getTime());
    
    for (let i = 0; i < sortedTides.length - 1; i++) {
      const current = sortedTides[i];
      const next = sortedTides[i + 1];
      const timeDiff = next.time.getTime() - current.time.getTime();
      const heightDiff = next.height - current.height;
      
      // Generate intermediate points for smooth curve
      for (let j = 0; j <= 12; j++) {
        const ratio = j / 12;
        const time = new Date(current.time.getTime() + timeDiff * ratio);
        // Use sine curve for smooth transition
        const sineRatio = (Math.sin((ratio - 0.5) * Math.PI) + 1) / 2;
        const height = current.height + heightDiff * sineRatio;
        
        curveData.push({
          time: format(time, 'HH:mm'),
          height: Math.round(height * 10) / 10,
          fullTime: time
        });
      }
    }
    
    return curveData;
  };

  const curveData = generateTideCurve();
  const nextTide = tideData.find(tide => tide.time > currentTime);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Waves /> Tide Chart
        </Typography>
        {nextTide && (
          <Chip
            icon={nextTide.type === 'high' ? <ArrowUpward /> : <ArrowDownward />}
            label={`Next ${nextTide.type}: ${format(nextTide.time, 'h:mm a')} (${nextTide.height.toFixed(1)}ft)`}
            color={nextTide.type === 'high' ? 'primary' : 'secondary'}
            variant="outlined"
          />
        )}
      </Box>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={curveData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00acc1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00acc1" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            interval={24}
          />
          <YAxis 
            label={{ value: 'Height (ft)', angle: -90, position: 'insideLeft' }}
            domain={['dataMin - 0.5', 'dataMax + 0.5']}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="body2">
                      Time: {payload[0].payload.time}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      Height: {payload[0].value} ft
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
          <ReferenceLine 
            x={format(currentTime, 'HH:mm')} 
            stroke="#ff5722" 
            strokeDasharray="5 5"
            label={{ value: "Now", position: "top" }}
          />
          <Line 
            type="monotone" 
            dataKey="height" 
            stroke="#00acc1" 
            strokeWidth={3}
            fill="url(#tideGradient)"
            dot={false}
          />
          {tideData.map((tide, index) => (
            <ReferenceLine
              key={index}
              x={format(tide.time, 'HH:mm')}
              stroke={tide.type === 'high' ? '#4caf50' : '#f44336'}
              strokeDasharray="3 3"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};