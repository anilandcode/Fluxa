// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Public API
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins once
gsap.registerPlugin(ScrollTrigger);

// ── Core ──────────────────────────────────────────────────
export { FluxaMotion } from './core/orchestrator';
export { ScrollController } from './core/scroll-controller';
export { TimelineManager } from './core/timeline-manager';

// ── Preset System ─────────────────────────────────────────
export { registerPreset, getPreset, listPresets, listPresetsDetailed, mergePreset } from './presets/registry';
export type {
  MotionPreset,
  FluxaMotionOptions,
  AnimationStep,
  ScrollSectionConfig,
  RevealConfig,
  ParallaxConfig,
  StaggerConfig,
  ScrollConfig,
  DurationTiers,
  EaseConfig,
  TypographyConfig,
  RevealDirection,
  RevealType,
  TypographyAnimation,
  StaggerFrom,
} from './presets/types';

// ── Built-in Presets ──────────────────────────────────────
export { applePreset } from './presets/apple';
export { startupPreset } from './presets/startup';
export { luxuryPreset } from './presets/luxury';
export { editorialPreset } from './presets/editorial';
export { cyberpunkPreset } from './presets/cyberpunk';
export { minimalPreset } from './presets/minimal';
export { brutalistPreset } from './presets/brutalist';

// ── Animation Factories ──────────────────────────────────
export { fadeReveal, slideReveal, maskReveal, clipReveal, createReveal } from './animations/reveals';
export { createParallaxLayer, depthParallax, imageParallax } from './animations/parallax';
export { cascadeStagger, waveStagger, randomStagger, edgeStagger, createStagger } from './animations/stagger';
export { splitText, splitTextReveal, scaleHeading, scrambleText, letterSpacingReveal } from './animations/typography';
export { pinnedSection, horizontalScroll, scrollCounter, scrollProgress } from './animations/scroll-sequences';

// ── Utilities ─────────────────────────────────────────────
export { FluxaEasing, getEasing } from './utils/easing';
export { withAccessibility, MEDIA_CONDITIONS, getEffectiveDuration, getEffectiveIntensity } from './utils/accessibility';

// ── Auto-register built-in presets ────────────────────────
import { registerPreset } from './presets/registry';
import { applePreset } from './presets/apple';
import { startupPreset } from './presets/startup';
import { luxuryPreset } from './presets/luxury';
import { editorialPreset } from './presets/editorial';
import { cyberpunkPreset } from './presets/cyberpunk';
import { minimalPreset } from './presets/minimal';
import { brutalistPreset } from './presets/brutalist';

registerPreset(applePreset);
registerPreset(startupPreset);
registerPreset(luxuryPreset);
registerPreset(editorialPreset);
registerPreset(cyberpunkPreset);
registerPreset(minimalPreset);
registerPreset(brutalistPreset);
