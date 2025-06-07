import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const wave = keyframes`
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.55);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
`;

const WaveContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #0a1929 0%, #001e3c 50%, #0a1929 100%)',
  zIndex: -1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at center top, rgba(29, 78, 216, 0.15), transparent 50%)',
  },
}));

const WaveElement = styled(Box)<{ delay?: number; opacity?: number }>(({ delay = 0, opacity = 0.5 }) => ({
  position: 'absolute',
  left: 0,
  width: '200%',
  height: '100%',
  background: `linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, ${opacity * 0.03}), 
    transparent
  )`,
  animation: `${wave} 15s cubic-bezier(0.36, 0.45, 0.63, 0.53) ${delay}s infinite`,
  transform: 'translate3d(0, 0, 0)',
}));

const WaveSvg = styled('svg')({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '30vh',
  minHeight: '100px',
  maxHeight: '150px',
});

export const WaveBackground: React.FC = () => {
  return (
    <WaveContainer>
      <WaveElement delay={0} opacity={0.7} />
      <WaveElement delay={-5} opacity={0.5} />
      <WaveElement delay={-10} opacity={0.3} />
      
      <WaveSvg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(29, 78, 216, 0.2)" />
            <stop offset="100%" stopColor="rgba(29, 78, 216, 0.05)" />
          </linearGradient>
        </defs>
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="url(#wave-gradient)"
          opacity="0.3"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z;
              M421.39,46.44c58-10.79,114.16-20.13,172-31.86,82.39-16.72,168.19-27.73,250.45-10.39C923.78,21,1006.67,62,1085.66,82.83c70.05,18.48,146.53,36.09,214.34,13V0H0V17.35A600.21,600.21,0,0,0,421.39,46.44Z;
              M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          />
        </path>
      </WaveSvg>
    </WaveContainer>
  );
};