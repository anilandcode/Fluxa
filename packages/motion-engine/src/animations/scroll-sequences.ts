// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Scroll Sequence Animations
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Pin a section and scrub through an animation timeline. */
export function pinnedSection(
  trigger: string | Element,
  timeline: gsap.core.Timeline,
  config: { start?: string; end?: string; scrub?: number | boolean; snap?: number | number[] | string; markers?: boolean } = {},
) {
  const { start = 'top top', end = '+=2000', scrub = 1, snap, markers = false } = config;
  const stVars: Record<string, unknown> = { trigger: trigger as string, start, end, scrub, pin: true, markers, anticipatePin: 1, animation: timeline };
  if (snap !== undefined) stVars.snap = snap;
  ScrollTrigger.create(stVars as ScrollTrigger.Vars);
  return timeline;
}

/** Horizontal scroll — pin container, scrub content sideways. */
export function horizontalScroll(
  container: string | Element,
  content: string | Element,
  config: { end?: string; scrub?: number | boolean; snap?: number; markers?: boolean } = {},
) {
  const { end, scrub = 1, snap, markers = false } = config;
  const contentEl = typeof content === 'string' ? document.querySelector(content) : content;
  if (!contentEl) return null;

  const scrollWidth = (contentEl as HTMLElement).scrollWidth - window.innerWidth;
  const scrollEnd = end ?? `+=${scrollWidth}`;

  const tween = gsap.to(contentEl, {
    x: -scrollWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: container as string,
      start: 'top top',
      end: scrollEnd,
      scrub,
      pin: true,
      markers,
      snap: snap ? { snapTo: 1 / (Math.round(scrollWidth / window.innerWidth)), duration: 0.3 } : undefined,
      anticipatePin: 1,
    },
  });

  return tween;
}

/** Counter animation — number counts up during scroll. */
export function scrollCounter(
  target: string | Element,
  config: { endValue?: number; duration?: number; trigger?: string | Element; start?: string; end?: string; scrub?: number | boolean } = {},
) {
  const { endValue = 100, duration = 2, trigger, start = 'top 80%', end = 'bottom 20%', scrub = true } = config;
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;

  return gsap.to({ val: 0 }, {
    val: endValue, duration, ease: 'none',
    scrollTrigger: { trigger: (trigger as string) ?? (target as string), start, end, scrub },
    onUpdate: function () {
      el.textContent = Math.round(this.targets()[0].val).toString();
    },
  });
}

/** Progress bar — visual scroll progress indicator. */
export function scrollProgress(
  target: string | Element,
  config: { trigger?: string | Element; start?: string; end?: string; direction?: 'horizontal' | 'vertical' } = {},
) {
  const { trigger, start = 'top top', end = 'bottom bottom', direction = 'horizontal' } = config;
  const prop = direction === 'horizontal' ? 'scaleX' : 'scaleY';

  gsap.set(target, { transformOrigin: direction === 'horizontal' ? 'left center' : 'center top', [prop]: 0 });

  return gsap.to(target, {
    [prop]: 1, ease: 'none',
    scrollTrigger: { trigger: (trigger as string) ?? (target as string), start, end, scrub: true },
  });
}
