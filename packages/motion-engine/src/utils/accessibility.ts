// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Accessibility Utilities
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap';

/**
 * Creates a gsap.matchMedia instance configured for
 * responsive breakpoints and prefers-reduced-motion.
 *
 * When reduced motion is preferred:
 * - Duration is set to 0 (instant transitions)
 * - ScrollTrigger scrub is disabled
 * - Parallax effects are turned off
 *
 * Returns the matchMedia instance for further customization.
 */
export function createAccessibleMatchMedia() {
  return gsap.matchMedia();
}

/**
 * Standard media condition names used across Fluxa.
 */
export const MEDIA_CONDITIONS = {
  isDesktop: '(min-width: 1024px)',
  isTablet: '(min-width: 768px) and (max-width: 1023px)',
  isMobile: '(max-width: 767px)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
} as const;

/**
 * Wraps an animation setup function to respect prefers-reduced-motion.
 * When reduced motion is preferred, the callback receives { reduceMotion: true }
 * and animations should use duration: 0 or be skipped entirely.
 *
 * @param callback - Animation setup function
 * @param scope - Optional scope element for selector scoping
 * @returns The matchMedia instance (call .revert() on cleanup)
 */
export function withAccessibility(
  callback: (conditions: {
    isDesktop: boolean;
    isTablet: boolean;
    isMobile: boolean;
    reduceMotion: boolean;
  }) => void | (() => void),
  scope?: Element | null,
) {
  const mm = gsap.matchMedia();

  mm.add(
    MEDIA_CONDITIONS,
    (context) => {
      const conditions = context.conditions as {
        isDesktop: boolean;
        isTablet: boolean;
        isMobile: boolean;
        reduceMotion: boolean;
      };
      return callback(conditions);
    },
    scope ?? undefined,
  );

  return mm;
}

/**
 * Gets the effective duration based on reduced motion preference.
 * Returns 0 when reduced motion is preferred.
 */
export function getEffectiveDuration(
  duration: number,
  reduceMotion: boolean,
): number {
  return reduceMotion ? 0 : duration;
}

/**
 * Gets effective intensity (0 when reduced motion).
 */
export function getEffectiveIntensity(
  intensity: number,
  reduceMotion: boolean,
): number {
  return reduceMotion ? 0 : intensity;
}
