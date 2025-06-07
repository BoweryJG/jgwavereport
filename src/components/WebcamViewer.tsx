import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { Close, Refresh } from '@mui/icons-material';
import { SurfLocation } from '../types/surf';

interface WebcamViewerProps {
  open: boolean;
  onClose: () => void;
  location: SurfLocation;
}

export const WebcamViewer: React.FC<WebcamViewerProps> = ({ open, onClose, location }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {location.name} - Live Webcam
        </Typography>
        <Box>
          <IconButton onClick={handleRefresh} size="small" sx={{ mr: 1 }}>
            <Refresh />
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {loading && !error && (
            <Box sx={{ 
              position: 'absolute', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Loading webcam feed...
              </Typography>
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Unable to load webcam feed. The camera may be temporarily offline.
            </Alert>
          )}

          {location.webcamUrl && !error && (
            <Box sx={{ 
              width: '100%', 
              height: '100%',
              bgcolor: 'black',
              borderRadius: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <iframe
                key={refreshKey}
                src={location.webcamUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
                title={`${location.name} Webcam`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          )}
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
            Last refreshed: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};