import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Fab,
  useTheme,
  Paper
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import {
  Waves,
  Refresh,
  Timeline,
  LocationOn,
  WbSunny,
  DarkMode
} from '@mui/icons-material';
import { SurfSpotCard } from './SurfSpotCard';
import { SurfSpotSkeleton } from './SurfSpotSkeleton';
import { WaveChart } from './WaveChart';
import { WindRoseChart } from './WindRoseChart';
import { TideChart } from './TideChart';
import { WebcamViewer } from './WebcamViewer';
import { HistoricalChart } from './HistoricalChart';
import { SurfDataService } from '../services/surfDataService';
import { SURF_LOCATIONS } from '../config/locations';
import { SurfReport, SurfLocation } from '../types/surf';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`surf-tabpanel-${index}`}
      aria-labelledby={`surf-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface SurfDashboardProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const SurfDashboard: React.FC<SurfDashboardProps> = ({ isDarkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<SurfLocation>(SURF_LOCATIONS[0]);
  const [surfReport, setSurfReport] = useState<SurfReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const surfDataService = new SurfDataService();

  const fetchSurfData = async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await surfDataService.getSurfReport(selectedLocation);
      if (report) {
        setSurfReport(report);
        setLastUpdate(new Date());
      } else {
        setError('Unable to fetch surf data');
      }
    } catch (err) {
      setError('Error loading surf conditions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurfData();
    // Refresh data every 30 minutes
    const interval = setInterval(fetchSurfData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setSelectedLocation(SURF_LOCATIONS[newValue]);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark' 
            ? 'rgba(17, 25, 40, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          <Waves sx={{ mr: 2, fontSize: 32 }} />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              background: theme.palette.gradient.surf,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
            }}
          >
            JG Wave Report
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, opacity: 0.8 }}>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={toggleDarkMode}
            sx={{
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(180deg)',
              },
            }}
          >
            {isDarkMode ? <WbSunny /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="surf locations">
            {SURF_LOCATIONS.map((location, index) => (
              <Tab 
                key={location.id} 
                label={location.name} 
                icon={<LocationOn />} 
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {loading && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <SurfSpotSkeleton />
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, height: 300 }}>
                    <CircularProgress />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: 250 }}>
                    <CircularProgress />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: 250 }}>
                    <CircularProgress />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && surfReport && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <SurfSpotCard 
                  report={surfReport} 
                  onWebcamClick={() => setWebcamOpen(true)}
                />
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <WaveChart 
                      forecast={surfReport.forecast} 
                      title="7-Day Wave Height Forecast"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <WindRoseChart windData={surfReport.conditions.wind} />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TideChart 
                      tideData={surfReport.conditions.tide} 
                      currentTime={new Date()}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline /> Historical Data
              </Typography>
              <HistoricalChart location={selectedLocation} />
            </Box>

            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Detailed Forecast
              </Typography>
              <Grid container spacing={2}>
                {surfReport.forecast.slice(0, 7).map((day, index) => (
                  <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      bgcolor: index === 0 ? 'primary.light' : 'background.paper',
                      borderRadius: 1,
                      border: 1,
                      borderColor: index === 0 ? 'primary.main' : 'divider'
                    }}>
                      <Typography variant="subtitle2">
                        {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Typography>
                      <Typography variant="h6" sx={{ my: 1 }}>
                        {day.weather.icon}
                      </Typography>
                      <Typography variant="body2">
                        {day.waves.height.min}-{day.waves.height.max}ft
                      </Typography>
                      <Typography variant="caption" display="block">
                        {day.weather.temperature}°F
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </>
        )}

        <WebcamViewer 
          open={webcamOpen}
          onClose={() => setWebcamOpen(false)}
          location={selectedLocation}
        />

        <Fab
          color="primary"
          aria-label="refresh"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={fetchSurfData}
        >
          <Refresh />
        </Fab>
      </Container>
    </Box>
  );
};