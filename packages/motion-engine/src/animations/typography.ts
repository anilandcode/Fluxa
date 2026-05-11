// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Kinetic Typography
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap';

/** Splits text into character or word spans for animation. */
export function splitText(
  element: Element,
  type: 'chars' | 'words' | 'lines' = 'words',
): Element[] {
  const text = element.textContent || '';
  element.textContent = '';

  if (type === 'chars') {
    return text.split('').map((char) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.whiteSpace = char === ' ' ? 'pre' : 'normal';
      span.textContent = char;
      element.appendChild(span);
      return span;
    });
  }

  if (type === 'words') {
    const words = text.split(/\s+/).filter(Boolean);
    return words.map((word, i) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = word;
      element.appendChild(span);
      if (i < words.length - 1) {
        element.appendChild(document.createTextNode('\u00A0'));
      }
      return span;
    });
  }

  const span = document.createElement('span');
  span.style.display = 'block';
  span.textContent = text;
  element.appendChild(span);
  return [span];
}

/** Split text reveal — characters or words animate in sequentially. */
export function splitTextReveal(
  target: string | Element,
  config: {
    type?: 'chars' | 'words';
    duration?: number;
    ease?: string;
    staggerAmount?: number;
    y?: number;
    rotationX?: number;
  } = {},
) {
  const { type = 'words', duration = 0.6, ease = 'power3.out', staggerAmount = 0.4, y = 40, rotationX = 0 } = config;
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return { tween: gsap.to({}, {}), elements: [] as Element[], revert: () => {} };

  const originalHTML = el.innerHTML;
  const parts = splitText(el, type);
  if (rotationX !== 0) (el as HTMLElement).style.perspective = '600px';

  const tween = gsap.from(parts, { autoAlpha: 0, y, rotationX, duration, ease, stagger: { amount: staggerAmount, from: 'start' } });
  return { tween, elements: parts, revert: () => { el.innerHTML = originalHTML; } };
}

/** Scale heading — dramatic hero-section impact. */
export function scaleHeading(targets: gsap.TweenTarget, config: { fromScale?: number; duration?: number; ease?: string; stagger?: number } = {}) {
  const { fromScale = 1.3, duration = 1.0, ease = 'power3.out', stagger = 0.1 } = config;
  return gsap.from(targets, { autoAlpha: 0, scale: fromScale, duration, ease, stagger });
}

/** Scramble text — characters randomly resolve into final text. */
export function scrambleText(target: string | Element, config: { duration?: number; ease?: string; chars?: string } = {}) {
  const { duration = 1.5, ease = 'none', chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%' } = config;
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return { timeline: gsap.timeline(), revert: () => {} };

  const originalText = el.textContent || '';
  const tl = gsap.timeline();
  tl.to({ progress: 0 }, {
    progress: 1, duration, ease,
    onUpdate: function () {
      const p = this.targets()[0].progress;
      const len = Math.floor(p * originalText.length);
      let result = '';
      for (let i = 0; i < originalText.length; i++) {
        result += i < len ? originalText[i] : originalText[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = result;
    },
  });
  return { timeline: tl, revert: () => { el.textContent = originalText; } };
}

/** Letter spacing reveal — text breathes in with expanding spacing. */
export function letterSpacingReveal(targets: gsap.TweenTarget, config: { fromSpacing?: string; toSpacing?: string; duration?: number; ease?: string } = {}) {
  const { fromSpacing = '0.3em', toSpacing = '0em', duration = 1.0, ease = 'power2.out' } = config;
  return gsap.fromTo(targets, { autoAlpha: 0, letterSpacing: fromSpacing }, { autoAlpha: 1, letterSpacing: toSpacing, duration, ease });
}
