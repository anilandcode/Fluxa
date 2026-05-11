// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Curated Easing Library
// ─────────────────────────────────────────────────────────────

/**
 * Emotional easing curves mapped to moods.
 * These are curated GSAP ease strings that evoke specific feelings.
 */
export const FluxaEasing = {
  // ── Calm & Subtle ──────────────────────────────────────
  /** Gentle, barely-there ease — Apple-like subtlety */
  calm: 'power1.out',
  /** Smooth deceleration — refined, professional */
  smooth: 'power2.out',
  /** Soft entrance — elegant and understated */
  gentle: 'sine.out',

  // ── Precise & Clean ────────────────────────────────────
  /** Crisp entrance — modern SaaS feel */
  crisp: 'power2.out',
  /** Sharp stop — decisive, intentional */
  sharp: 'power3.out',
  /** Precise in-out — balanced symmetry */
  precise: 'power2.inOut',

  // ── Dramatic & Cinematic ───────────────────────────────
  /** Cinematic entrance — slow buildup, confident arrival */
  cinematic: 'power3.inOut',
  /** Dramatic reveal — builds tension, releases */
  dramatic: 'power4.out',
  /** Grand entrance — exponential drama */
  grand: 'expo.out',

  // ── Energetic & Bold ───────────────────────────────────
  /** Bouncy overshoot — playful, startup energy */
  bounce: 'back.out(1.7)',
  /** Elastic snap — attention-grabbing */
  elastic: 'elastic.out(1, 0.3)',
  /** Snappy — quick and decisive */
  snappy: 'power4.out',

  // ── Linear & Raw ───────────────────────────────────────
  /** No easing — raw, mechanical, brutalist */
  linear: 'none',
  /** Constant speed — for scroll-scrubbed animations */
  scrub: 'none',

  // ── Exit Easings ───────────────────────────────────────
  /** Quick exit — faster than entrance (best practice) */
  exitFast: 'power2.in',
  /** Gentle exit */
  exitSmooth: 'power1.in',
  /** Dramatic exit */
  exitDramatic: 'power3.in',
} as const;

export type FluxaEasingKey = keyof typeof FluxaEasing;

/**
 * Get an easing value by mood keyword.
 * Falls back to 'power2.out' for unrecognized moods.
 */
export function getEasing(mood: string): string {
  const key = mood.toLowerCase() as FluxaEasingKey;
  return FluxaEasing[key] ?? FluxaEasing.smooth;
}
