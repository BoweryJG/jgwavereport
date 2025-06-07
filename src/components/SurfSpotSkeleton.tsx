import React from 'react';
import { Card, CardContent, Skeleton, Box, styled } from '@mui/material';
import { keyframes } from '@mui/material/styles';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const AnimatedSkeleton = styled(Skeleton)(({ theme }) => ({
  background: `linear-gradient(
    90deg,
    ${theme.palette.action.hover} 0%,
    ${theme.palette.action.selected} 50%,
    ${theme.palette.action.hover} 100%
  )`,
  backgroundSize: '1000px 100%',
  animation: `${shimmer} 2s infinite ease-out`,
}));

export const SurfSpotSkeleton: React.FC = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <AnimatedSkeleton variant="rectangular" height={200} />
      <CardContent>
        <AnimatedSkeleton variant="text" height={32} width="60%" sx={{ mb: 1 }} />
        <AnimatedSkeleton variant="text" height={20} width="40%" sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <AnimatedSkeleton variant="circular" width={40} height={40} />
          <AnimatedSkeleton variant="rectangular" width={100} height={40} />
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ display: 'flex', gap: 1 }}>
              <AnimatedSkeleton variant="circular" width={24} height={24} />
              <Box sx={{ flex: 1 }}>
                <AnimatedSkeleton variant="text" height={20} />
                <AnimatedSkeleton variant="text" height={16} width="60%" />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};