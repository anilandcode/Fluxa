// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Preset Registry
// ─────────────────────────────────────────────────────────────

import type { MotionPreset } from './types';

const presets = new Map<string, MotionPreset>();

/** Register a preset. Overwrites if name already exists. */
export function registerPreset(preset: MotionPreset): void {
  presets.set(preset.name, preset);
}

/** Get a preset by name. Returns undefined if not found. */
export function getPreset(name: string): MotionPreset | undefined {
  return presets.get(name);
}

/** List all registered preset names. */
export function listPresets(): string[] {
  return Array.from(presets.keys());
}

/** List all registered presets with metadata. */
export function listPresetsDetailed(): Array<{ name: string; description: string; keywords: string[] }> {
  return Array.from(presets.values()).map(p => ({ name: p.name, description: p.description, keywords: p.keywords }));
}

/** Deep-merge a base preset with partial overrides. */
export function mergePreset(base: MotionPreset, overrides: Partial<MotionPreset>): MotionPreset {
  return {
    ...base,
    ...overrides,
    duration: { ...base.duration, ...(overrides.duration ?? {}) },
    stagger: { ...base.stagger, ...(overrides.stagger ?? {}) },
    ease: { ...base.ease, ...(overrides.ease ?? {}) },
    reveals: overrides.reveals ?? base.reveals,
    parallax: { ...base.parallax, ...(overrides.parallax ?? {}) },
    typography: { ...base.typography, ...(overrides.typography ?? {}) },
    scroll: { ...base.scroll, ...(overrides.scroll ?? {}) },
  } as MotionPreset;
}
