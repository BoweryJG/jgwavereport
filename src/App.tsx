import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SurfDashboard } from './components/SurfDashboard';
import { WaveBackground } from './components/WaveBackground';
import { lightTheme, darkTheme } from './theme/theme';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <WaveBackground />
        <SurfDashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
