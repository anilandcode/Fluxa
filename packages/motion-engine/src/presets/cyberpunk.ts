import type { MotionPreset } from './types';

/** Cyberpunk — neon, glitch, high-energy. Inspired by sci-fi interfaces. */
export const cyberpunkPreset: MotionPreset = {
  name: 'cyberpunk',
  description: 'Neon glow effects, glitch-style reveals, high-energy transitions, digital aesthetic',
  keywords: ['cyberpunk', 'neon', 'glitch', 'futuristic', 'digital', 'sci-fi'],
  duration: { fast: 0.15, normal: 0.3, slow: 0.6 },
  stagger: { amount: 0.5, from: 'random' },
  ease: { enter: 'expo.out', exit: 'power4.in', move: 'power4.out', scrub: 'none' },
  intensity: 0.9,
  reveals: [
    { type: 'clip', direction: 'up', distance: 0, autoAlpha: true },
    { type: 'slide', direction: 'left', distance: 100, autoAlpha: true },
  ],
  parallax: { strength: 0.4, layers: 4, baseSpeed: -0.2 },
  typography: { animation: 'scramble', split: true, splitType: 'chars', letterSpacing: true },
  scroll: { scrub: 0.3, pin: true, snap: false, smooth: true, smoothness: 0.04 },
  design: {
    colors: {
      bg: '#000000',
      surface: '#0A0A0A',
      border: '#00FF41',
      text: '#E0E0E0',
      textSecondary: '#00FF41',
      accent: '#FF003C',
      accentGlow: 'rgba(255, 0, 60, 0.3)',
    },
    typography: {
      fontFamily: "'Space Mono', monospace",
      fontUrl: "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
      headingTracking: "-0.05em",
      baseLeading: "1.4",
    },
    rhythm: {
      radius: "0px",
      containerPadding: "16px",
      itemGap: "8px",
    },
    atmosphere: {
      shadowStrength: 1.0,
      glassmorphism: false,
      borderWidth: "2px",
    }
  }
};
