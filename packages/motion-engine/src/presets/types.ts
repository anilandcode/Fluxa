// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Preset Type Definitions
// ─────────────────────────────────────────────────────────────

/** Animation reveal direction */
export type RevealDirection = 'up' | 'down' | 'left' | 'right';

/** Reveal animation type */
export type RevealType = 'fade' | 'slide' | 'mask' | 'clip';

/** Typography animation style */
export type TypographyAnimation = 'fade' | 'slide' | 'split' | 'scramble' | 'scale';

/** Stagger origin point */
export type StaggerFrom = 'start' | 'center' | 'end' | 'edges' | 'random';

/** Configuration for a reveal animation */
export interface RevealConfig {
  type: RevealType;
  direction: RevealDirection;
  distance: number;
  /** Whether to use autoAlpha (visibility + opacity) */
  autoAlpha: boolean;
}

/** Parallax configuration */
export interface ParallaxConfig {
  /** Movement strength multiplier (0–1) */
  strength: number;
  /** Number of depth layers */
  layers: number;
  /** Base speed for the slowest layer */
  baseSpeed: number;
}

/** Stagger configuration */
export interface StaggerConfig {
  /** Total stagger time across all elements */
  amount: number;
  /** Origin point for stagger distribution */
  from: StaggerFrom;
  /** Easing applied to the stagger distribution */
  ease?: string;
}

/** Scroll behavior configuration */
export interface ScrollConfig {
  /** Scrub smoothing (true = direct, number = seconds lag) */
  scrub: number | boolean;
  /** Pin sections during scroll */
  pin: boolean;
  /** Snap to sections */
  snap: boolean;
  /** Smooth scrolling via Lenis */
  smooth: boolean;
  /** Lenis lerp value (0–1, lower = smoother) */
  smoothness: number;
}

/** Duration tiers for different animation speeds */
export interface DurationTiers {
  /** Quick micro-interactions (100–300ms) */
  fast: number;
  /** Standard animations (300–800ms) */
  normal: number;
  /** Cinematic, dramatic reveals (800–2000ms) */
  slow: number;
}

/** Easing configuration for different animation phases */
export interface EaseConfig {
  /** Easing for entrance/reveal animations */
  enter: string;
  /** Easing for exit/departure animations */
  exit: string;
  /** Easing for positional movement */
  move: string;
  /** Easing for scroll-scrubbed animations */
  scrub: string;
}

/** Typography motion configuration */
export interface TypographyConfig {
  /** Primary animation style for headings */
  animation: TypographyAnimation;
  /** Whether to split text into characters/words */
  split: boolean;
  /** Split granularity */
  splitType: 'chars' | 'words' | 'lines';
  /** Letter spacing animation */
  letterSpacing: boolean;
}

/** Design language definition (CSS variable targets) */
export interface DesignLanguage {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    accent: string;
    accentGlow: string;
  };
  typography: {
    fontFamily: string;
    fontUrl?: string; // Optional Google Fonts import URL
    headingTracking: string;
    baseLeading: string;
  };
  rhythm: {
    radius: string;
    containerPadding: string;
    itemGap: string;
  };
  atmosphere: {
    shadowStrength: number;
    glassmorphism: boolean;
    borderWidth: string;
  };
}

/**
 * Complete Motion Preset definition.
 *
 * Each preset encodes a distinct visual personality —
 * the timing, easing, intensity, and animation choices
 * that make a section "feel" like Apple, Luxury, Cyberpunk, etc.
 */
export interface MotionPreset {
  /** Unique preset identifier */
  name: string;
  /** Human-readable description */
  description: string;
  /** Visual mood keywords for AI matching */
  keywords: string[];

  // ── Timing ──────────────────────────────────────────────
  duration: DurationTiers;
  stagger: StaggerConfig;
  ease: EaseConfig;

  // ── Motion Character ────────────────────────────────────
  /** Global intensity multiplier (0–1). 0 = nearly static, 1 = maximum motion */
  intensity: number;
  /** Default reveal animations */
  reveals: RevealConfig[];
  /** Parallax defaults */
  parallax: ParallaxConfig;

  // ── Typography ──────────────────────────────────────────
  typography: TypographyConfig;

  // ── Scroll ──────────────────────────────────────────────
  scroll: ScrollConfig;

  // ── Design Language ──────────────────────────────────────
  design: DesignLanguage;
}

/** Options passed to FluxaMotion constructor */
export interface FluxaMotionOptions {
  /** Root container element or selector */
  container: HTMLElement | string;
  /** Preset name or custom preset object */
  preset: string | MotionPreset;
  /** Partial overrides merged on top of the preset */
  overrides?: Partial<MotionPreset>;
  /** Enable debug markers (dev only) */
  debug?: boolean;
}

/** Animation step for the timeline manager */
export interface AnimationStep {
  /** Target elements (selector or elements) */
  targets: string | Element | Element[];
  /** GSAP vars (properties to animate) */
  vars: gsap.TweenVars;
  /** GSAP position parameter */
  position?: string | number;
  /** Optional label */
  label?: string;
}

/** Scroll-triggered section config */
export interface ScrollSectionConfig {
  trigger: string | Element;
  animation: gsap.core.Timeline | gsap.core.Tween;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  pin?: boolean;
  snap?: number | number[] | string;
  markers?: boolean;
}
