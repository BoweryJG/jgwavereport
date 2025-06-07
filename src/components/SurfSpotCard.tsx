import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Divider,
  IconButton,
  Collapse,
  Alert,
  alpha,
  useTheme
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import {
  Waves,
  Air,
  Thermostat,
  Schedule,
  ExpandMore,
  Videocam,
  LocationOn,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { SurfReport } from '../types/surf';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const ExpandMoreIcon = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'expand',
})<{ expand: boolean }>(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const AnimatedWaveIcon = styled(Waves)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(17, 25, 40, 0.9)'
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid',
  borderColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 60px rgba(0, 0, 0, 0.5)'
      : '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
}));

const MetricBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  background: alpha(theme.palette.primary.main, 0.05),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.1),
    transform: 'scale(1.02)',
  },
}));

interface SurfSpotCardProps {
  report: SurfReport;
  onWebcamClick?: () => void;
}

export const SurfSpotCard: React.FC<SurfSpotCardProps> = ({ report, onWebcamClick }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const { location, conditions, rating, alerts } = report;

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'success';
      case 'good': return 'primary';
      case 'fair': return 'warning';
      default: return 'default';
    }
  };

  const getQualityGradient = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'linear-gradient(135deg, #00C851 0%, #00ff88 100%)';
      case 'good': return 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)';
      case 'fair': return 'linear-gradient(135deg, #FF6B00 0%, #FFD93D 100%)';
      default: return 'linear-gradient(135deg, #757575 0%, #9E9E9E 100%)';
    }
  };

  return (
    <StyledCard elevation={0}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="div"
          sx={{
            height: 240,
            background: getQualityGradient(conditions.waves.quality),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              animation: `${pulse} 3s ease-in-out infinite`,
            }
          }}
        >
          <AnimatedWaveIcon sx={{ fontSize: 100, color: 'white', opacity: 0.3 }} />
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            {location.webcamUrl && (
              <IconButton 
                onClick={onWebcamClick}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,1)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <Videocam />
              </IconButton>
            )}
          </Box>
          <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              {location.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn fontSize="small" /> {location.region}
            </Typography>
          </Box>
        </CardMedia>
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Rating value={rating / 2} precision={0.5} readOnly />
          <Chip 
            label={conditions.waves.quality} 
            color={getQualityColor(conditions.waves.quality) as any}
            size="small"
          />
        </Box>

        {alerts && alerts.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {alerts.map((alert, index) => (
              <Alert key={index} severity={alert.includes('warning') ? 'warning' : 'info'} sx={{ mb: 1 }}>
                {alert}
              </Alert>
            ))}
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MetricBox>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Waves color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {conditions.waves.height.min}-{conditions.waves.height.max} ft
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Wave Height
                  </Typography>
                </Box>
              </Box>
            </MetricBox>
          </Grid>
          
          <Grid item xs={6}>
            <MetricBox>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {conditions.waves.period}s
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Period
                  </Typography>
                </Box>
              </Box>
            </MetricBox>
          </Grid>
          
          <Grid item xs={6}>
            <MetricBox>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Air color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {conditions.wind.speed} {conditions.wind.unit}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {conditions.wind.compassDirection} Wind
                  </Typography>
                </Box>
              </Box>
            </MetricBox>
          </Grid>
          
          <Grid item xs={6}>
            <MetricBox>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Thermostat color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {conditions.water.temperature}°{conditions.water.unit}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Water Temp
                  </Typography>
                </Box>
              </Box>
            </MetricBox>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Next Tide: {conditions.tide[0]?.type} at {conditions.tide[0]?.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </Typography>
          <ExpandMoreIcon
            expand={expanded}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMore />
          </ExpandMoreIcon>
        </Box>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {location.spotInfo && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Spot Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Best Tide: {location.spotInfo.bestTide}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Best Wind: {location.spotInfo.bestWind}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Suitable for: {location.spotInfo.surfLevel.join(', ')}
              </Typography>
            </Box>
          )}
          
          {conditions.swell.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Swell Data
              </Typography>
              {conditions.swell.map((swell, index) => (
                <Typography key={index} variant="body2" color="text.secondary">
                  {swell.height}ft @ {swell.period}s from {swell.compassDirection}
                </Typography>
              ))}
            </Box>
          )}
        </CardContent>
      </Collapse>
    </StyledCard>
  );
};