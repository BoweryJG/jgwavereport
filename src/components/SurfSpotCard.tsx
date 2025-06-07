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
  Alert
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import {
  Waves,
  Air,
  Thermostat,
  Schedule,
  ExpandMore,
  Videocam,
  LocationOn
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { SurfReport } from '../types/surf';

const ExpandMoreIcon = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'expand',
})<{ expand: boolean }>(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface SurfSpotCardProps {
  report: SurfReport;
  onWebcamClick?: () => void;
}

export const SurfSpotCard: React.FC<SurfSpotCardProps> = ({ report, onWebcamClick }) => {
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

  return (
    <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="div"
          sx={{
            height: 200,
            background: `linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Waves sx={{ fontSize: 80, color: 'white', opacity: 0.3 }} />
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            {location.webcamUrl && (
              <IconButton 
                onClick={onWebcamClick}
                sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Waves color="primary" />
              <Box>
                <Typography variant="h6">
                  {conditions.waves.height.min}-{conditions.waves.height.max} ft
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Wave Height
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule color="primary" />
              <Box>
                <Typography variant="h6">
                  {conditions.waves.period}s
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Period
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Air color="primary" />
              <Box>
                <Typography variant="h6">
                  {conditions.wind.speed} {conditions.wind.unit}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {conditions.wind.compassDirection} Wind
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Thermostat color="primary" />
              <Box>
                <Typography variant="h6">
                  {conditions.water.temperature}°{conditions.water.unit}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Water Temp
                </Typography>
              </Box>
            </Box>
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
    </Card>
  );
};