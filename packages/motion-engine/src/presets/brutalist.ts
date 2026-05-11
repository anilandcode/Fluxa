import type { MotionPreset } from './types';

/** Brutalist — raw, bold, unconventional. Hard cuts, no polish. */
export const brutalistPreset: MotionPreset = {
  name: 'brutalist',
  description: 'Raw, bold transitions, hard cuts, no easing, unconventional timing, high contrast',
  keywords: ['brutalist', 'raw', 'bold', 'hard', 'unconventional', 'experimental'],
  duration: { fast: 0.1, normal: 0.2, slow: 0.4 },
  stagger: { amount: 0.3, from: 'random' },
  ease: { enter: 'none', exit: 'none', move: 'none', scrub: 'none' },
  intensity: 0.8,
  reveals: [{ type: 'slide', direction: 'up', distance: 100, autoAlpha: false }],
  parallax: { strength: 0.0, layers: 0, baseSpeed: 0 },
  typography: { animation: 'scale', split: false, splitType: 'words', letterSpacing: false },
  scroll: { scrub: true, pin: false, snap: false, smooth: false, smoothness: 1.0 },
  design: {
    colors: {
      bg: '#FFFFFF',
      surface: '#EEEEEE',
      border: '#000000',
      text: '#000000',
      textSecondary: '#333333',
      accent: '#FF0000',
      accentGlow: 'rgba(255, 0, 0, 0)',
    },
    typography: {
      fontFamily: "'Archivo Black', sans-serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap",
      headingTracking: "-0.05em",
      baseLeading: "1.1",
    },
    rhythm: {
      radius: "0px",
      containerPadding: "16px",
      itemGap: "12px",
    },
    atmosphere: {
      shadowStrength: 1.0,
      glassmorphism: false,
      borderWidth: "4px",
    }
  }
};
