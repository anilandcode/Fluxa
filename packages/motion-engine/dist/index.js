'use strict';

var gsap4 = require('gsap');
var ScrollTrigger = require('gsap/ScrollTrigger');
var Lenis = require('lenis');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var gsap4__default = /*#__PURE__*/_interopDefault(gsap4);
var Lenis__default = /*#__PURE__*/_interopDefault(Lenis);

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/presets/registry.ts
var registry_exports = {};
__export(registry_exports, {
  getPreset: () => getPreset,
  listPresets: () => listPresets,
  listPresetsDetailed: () => listPresetsDetailed,
  mergePreset: () => mergePreset,
  registerPreset: () => registerPreset
});
function registerPreset(preset) {
  presets.set(preset.name, preset);
}
function getPreset(name) {
  return presets.get(name);
}
function listPresets() {
  return Array.from(presets.keys());
}
function listPresetsDetailed() {
  return Array.from(presets.values()).map((p) => ({ name: p.name, description: p.description, keywords: p.keywords }));
}
function mergePreset(base, overrides) {
  return {
    ...base,
    ...overrides,
    duration: { ...base.duration, ...overrides.duration ?? {} },
    stagger: { ...base.stagger, ...overrides.stagger ?? {} },
    ease: { ...base.ease, ...overrides.ease ?? {} },
    reveals: overrides.reveals ?? base.reveals,
    parallax: { ...base.parallax, ...overrides.parallax ?? {} },
    typography: { ...base.typography, ...overrides.typography ?? {} },
    scroll: { ...base.scroll, ...overrides.scroll ?? {} }
  };
}
var presets;
var init_registry = __esm({
  "src/presets/registry.ts"() {
    presets = /* @__PURE__ */ new Map();
  }
});

// src/core/orchestrator.ts
init_registry();
gsap4__default.default.registerPlugin(ScrollTrigger.ScrollTrigger);
var ScrollController = class {
  constructor(config) {
    this.lenis = null;
    this.rafId = null;
    this.config = config;
  }
  /** Initialize Lenis smooth scrolling and wire to ScrollTrigger. */
  init() {
    if (!this.config.smooth) return;
    this.lenis = new Lenis__default.default({
      lerp: this.config.smoothness,
      smoothWheel: true
    });
    this.lenis.on("scroll", ScrollTrigger.ScrollTrigger.update);
    gsap4__default.default.ticker.add((time) => {
      this.lenis?.raf(time * 1e3);
    });
    gsap4__default.default.ticker.lagSmoothing(0);
  }
  /** Get the Lenis instance for external use. */
  getLenis() {
    return this.lenis;
  }
  /** Scroll to a target (element, position, or selector). */
  scrollTo(target, options) {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (el instanceof Element) el.scrollIntoView({ behavior: "smooth" });
    }
  }
  /** Temporarily stop smooth scrolling. */
  stop() {
    this.lenis?.stop();
  }
  /** Resume smooth scrolling. */
  start() {
    this.lenis?.start();
  }
  /** Recalculate ScrollTrigger positions. Call after DOM changes. */
  refresh() {
    ScrollTrigger.ScrollTrigger.refresh();
  }
  /** Clean up everything. */
  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lenis?.destroy();
    this.lenis = null;
    ScrollTrigger.ScrollTrigger.getAll().forEach((t) => t.kill());
  }
};
var TimelineManager = class {
  constructor(preset) {
    this.timelines = [];
    this.preset = preset;
  }
  /** Create a new timeline with preset defaults. */
  createTimeline(config) {
    const tl = gsap4__default.default.timeline({
      defaults: {
        duration: this.preset.duration.normal,
        ease: this.preset.ease.enter
      },
      ...config
    });
    this.timelines.push(tl);
    return tl;
  }
  /** Add a sequence of animation steps to a timeline. */
  addSequence(timeline, steps) {
    steps.forEach((step) => {
      if (step.label) {
        timeline.addLabel(step.label, step.position);
      }
      timeline.to(step.targets, step.vars, step.position);
    });
    return timeline;
  }
  /** Add multiple animations that play at the same time. */
  addParallel(timeline, animations, position) {
    const startPos = position ?? "<";
    animations.forEach((anim, i) => {
      timeline.to(anim.targets, anim.vars, i === 0 ? startPos : "<");
    });
    return timeline;
  }
  /** Create an intro timeline (fade-in, stagger reveal). */
  createIntro(container, selectors = {}) {
    const tl = this.createTimeline({ paused: true });
    const { heading = "h1, h2, h3", text = "p", items = "[data-fluxa-item]", media = "img, video" } = selectors;
    const headings = container.querySelectorAll(heading);
    const texts = container.querySelectorAll(text);
    const staggerItems = container.querySelectorAll(items);
    const mediaEls = container.querySelectorAll(media);
    if (headings.length) {
      tl.from(headings, {
        autoAlpha: 0,
        y: this.preset.reveals[0]?.distance ?? 40,
        duration: this.preset.duration.normal,
        ease: this.preset.ease.enter,
        stagger: 0.1
      });
    }
    if (texts.length) {
      tl.from(texts, {
        autoAlpha: 0,
        y: 20,
        duration: this.preset.duration.fast,
        ease: this.preset.ease.enter,
        stagger: 0.05
      }, "-=0.3");
    }
    if (staggerItems.length) {
      tl.from(staggerItems, {
        autoAlpha: 0,
        y: this.preset.reveals[0]?.distance ?? 30,
        duration: this.preset.duration.normal,
        ease: this.preset.ease.enter,
        stagger: {
          amount: this.preset.stagger.amount,
          from: this.preset.stagger.from
        }
      }, "-=0.2");
    }
    if (mediaEls.length) {
      tl.from(mediaEls, {
        autoAlpha: 0,
        scale: 0.95,
        duration: this.preset.duration.slow,
        ease: this.preset.ease.enter,
        stagger: 0.1
      }, "-=0.4");
    }
    return tl;
  }
  /** Kill all managed timelines. */
  destroy() {
    this.timelines.forEach((tl) => tl.kill());
    this.timelines = [];
  }
};
var MEDIA_CONDITIONS = {
  isDesktop: "(min-width: 1024px)",
  isTablet: "(min-width: 768px) and (max-width: 1023px)",
  isMobile: "(max-width: 767px)",
  reduceMotion: "(prefers-reduced-motion: reduce)"
};
function withAccessibility(callback, scope) {
  const mm = gsap4__default.default.matchMedia();
  mm.add(
    MEDIA_CONDITIONS,
    (context) => {
      const conditions = context.conditions;
      return callback(conditions);
    },
    scope ?? void 0
  );
  return mm;
}
function getEffectiveDuration(duration, reduceMotion) {
  return reduceMotion ? 0 : duration;
}
function getEffectiveIntensity(intensity, reduceMotion) {
  return reduceMotion ? 0 : intensity;
}

// src/core/orchestrator.ts
gsap4__default.default.registerPlugin(ScrollTrigger.ScrollTrigger);
var FluxaMotion = class {
  constructor(options) {
    this.matchMedia = null;
    this.introTimeline = null;
    const el = typeof options.container === "string" ? document.querySelector(options.container) : options.container;
    if (!el) {
      throw new Error(`[FluxaMotion] Container not found: ${options.container}`);
    }
    this.container = el;
    this.debug = options.debug ?? false;
    let basePreset;
    if (typeof options.preset === "string") {
      const found = getPreset(options.preset);
      if (!found) {
        throw new Error(`[FluxaMotion] Preset not found: "${options.preset}". Available: ${listPresetsFromRegistry()}`);
      }
      basePreset = found;
    } else {
      basePreset = options.preset;
    }
    this.preset = options.overrides ? mergePreset(basePreset, options.overrides) : basePreset;
    gsap4__default.default.defaults({
      duration: this.preset.duration.normal,
      ease: this.preset.ease.enter
    });
    this.scrollController = new ScrollController(this.preset.scroll);
    this.timelineManager = new TimelineManager(this.preset);
  }
  /** Initialize all subsystems and set up accessibility. */
  init() {
    this.matchMedia = withAccessibility(
      (conditions) => {
        if (conditions.reduceMotion) {
          gsap4__default.default.defaults({ duration: 0 });
        } else {
          gsap4__default.default.defaults({ duration: this.preset.duration.normal });
        }
        if (!conditions.reduceMotion) {
          this.scrollController.init();
        }
        this.introTimeline = this.timelineManager.createIntro(this.container);
        return () => {
          this.introTimeline?.kill();
        };
      },
      this.container
    );
    return this;
  }
  /** Play the intro animation. */
  play() {
    if (!this.introTimeline) this.init();
    this.introTimeline?.play();
    return this;
  }
  /** Pause the intro animation. */
  pause() {
    this.introTimeline?.pause();
    return this;
  }
  /** Reverse the intro animation. */
  reverse() {
    this.introTimeline?.reverse();
    return this;
  }
  /** Get the current preset. */
  getPreset() {
    return this.preset;
  }
  /** Get the scroll controller for external use. */
  getScrollController() {
    return this.scrollController;
  }
  /** Get the timeline manager for external use. */
  getTimelineManager() {
    return this.timelineManager;
  }
  /** Switch to a different preset at runtime. */
  switchPreset(presetName, overrides) {
    const newPreset = getPreset(presetName);
    if (!newPreset) {
      console.warn(`[FluxaMotion] Preset not found: "${presetName}"`);
      return this;
    }
    this.introTimeline?.kill();
    this.timelineManager.destroy();
    this.preset = overrides ? mergePreset(newPreset, overrides) : newPreset;
    this.timelineManager = new TimelineManager(this.preset);
    gsap4__default.default.defaults({
      duration: this.preset.duration.normal,
      ease: this.preset.ease.enter
    });
    gsap4__default.default.set(this.container.querySelectorAll("*"), { clearProps: "all" });
    this.introTimeline = this.timelineManager.createIntro(this.container);
    this.introTimeline.play();
    return this;
  }
  /** Clean up all animations, ScrollTriggers, and Lenis. */
  destroy() {
    this.introTimeline?.kill();
    this.introTimeline = null;
    this.timelineManager.destroy();
    this.scrollController.destroy();
    this.matchMedia?.revert();
    this.matchMedia = null;
  }
};
function listPresetsFromRegistry() {
  try {
    const { listPresets: listPresets2 } = (init_registry(), __toCommonJS(registry_exports));
    return listPresets2().join(", ");
  } catch {
    return "(unknown)";
  }
}

// src/index.ts
init_registry();

// src/presets/apple.ts
var applePreset = {
  name: "apple",
  description: "Subtle motion, smooth stagger reveals, precise easing, elegant parallax, calm pacing",
  keywords: ["subtle", "clean", "precise", "calm", "minimal", "premium"],
  duration: { fast: 0.4, normal: 0.8, slow: 1.2 },
  stagger: { amount: 0.15, from: "start" },
  ease: { enter: "power3.out", exit: "power2.in", move: "power3.inOut", scrub: "none" },
  intensity: 0.2,
  reveals: [{ type: "fade", direction: "up", distance: 25, autoAlpha: true }],
  parallax: { strength: 0.1, layers: 2, baseSpeed: -0.05 },
  typography: { animation: "fade", split: false, splitType: "words", letterSpacing: false },
  scroll: { scrub: 1.5, pin: true, snap: false, smooth: true, smoothness: 0.05 },
  design: {
    colors: {
      bg: "#050505",
      surface: "#0A0A0A",
      border: "rgba(255, 255, 255, 0.06)",
      text: "#F3F4F6",
      textSecondary: "#9CA3AF",
      accent: "#E65C00",
      accentGlow: "rgba(230, 92, 0, 0.15)"
    },
    typography: {
      fontFamily: "'Inter', -apple-system, sans-serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      headingTracking: "-0.02em",
      baseLeading: "1.65"
    },
    rhythm: {
      radius: "16px",
      containerPadding: "24px",
      itemGap: "16px"
    },
    atmosphere: {
      shadowStrength: 0.5,
      glassmorphism: true,
      borderWidth: "1px"
    }
  }
};

// src/presets/startup.ts
var startupPreset = {
  name: "startup",
  description: "Energetic reveals, sharp transitions, layered parallax, bold typography, dynamic layouts",
  keywords: ["energetic", "bold", "sharp", "dynamic", "modern", "tech"],
  duration: { fast: 0.2, normal: 0.4, slow: 0.7 },
  stagger: { amount: 0.4, from: "start" },
  ease: { enter: "back.out(1.7)", exit: "power3.in", move: "power3.out", scrub: "none" },
  intensity: 0.7,
  reveals: [
    { type: "slide", direction: "up", distance: 80, autoAlpha: true },
    { type: "fade", direction: "left", distance: 60, autoAlpha: true }
  ],
  parallax: { strength: 0.3, layers: 3, baseSpeed: -0.15 },
  typography: { animation: "slide", split: true, splitType: "words", letterSpacing: false },
  scroll: { scrub: 0.5, pin: true, snap: false, smooth: true, smoothness: 0.06 },
  design: {
    colors: {
      bg: "#F8FAFC",
      surface: "#FFFFFF",
      border: "rgba(0, 0, 0, 0.05)",
      text: "#0F172A",
      textSecondary: "#64748B",
      accent: "#3B82F6",
      accentGlow: "rgba(59, 130, 246, 0.2)"
    },
    typography: {
      fontFamily: "'Outfit', sans-serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap",
      headingTracking: "-0.03em",
      baseLeading: "1.5"
    },
    rhythm: {
      radius: "24px",
      containerPadding: "32px",
      itemGap: "24px"
    },
    atmosphere: {
      shadowStrength: 0.15,
      glassmorphism: false,
      borderWidth: "1px"
    }
  }
};

// src/presets/luxury.ts
var luxuryPreset = {
  name: "luxury",
  description: "Slow cinematic transitions, premium spacing, elegant masking reveals, soft motion, refined typography",
  keywords: ["luxury", "cinematic", "elegant", "premium", "refined", "fashion"],
  duration: { fast: 0.5, normal: 1.2, slow: 2 },
  stagger: { amount: 0.5, from: "start" },
  ease: { enter: "power3.inOut", exit: "power2.in", move: "power3.inOut", scrub: "none" },
  intensity: 0.4,
  reveals: [{ type: "mask", direction: "up", distance: 0, autoAlpha: true }],
  parallax: { strength: 0.1, layers: 2, baseSpeed: -0.05 },
  typography: { animation: "split", split: true, splitType: "chars", letterSpacing: true },
  scroll: { scrub: 1.5, pin: true, snap: false, smooth: true, smoothness: 0.05 },
  design: {
    colors: {
      bg: "#0F0E0E",
      surface: "#151414",
      border: "rgba(212, 175, 55, 0.15)",
      text: "#FDFBF7",
      textSecondary: "#A8A29E",
      accent: "#D4AF37",
      // Gold
      accentGlow: "rgba(212, 175, 55, 0.1)"
    },
    typography: {
      fontFamily: "'Playfair Display', serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap",
      headingTracking: "0.02em",
      baseLeading: "1.8"
    },
    rhythm: {
      radius: "0px",
      containerPadding: "48px",
      itemGap: "32px"
    },
    atmosphere: {
      shadowStrength: 0.8,
      glassmorphism: false,
      borderWidth: "1px"
    }
  }
};

// src/presets/editorial.ts
var editorialPreset = {
  name: "editorial",
  description: "Immersive reading, image-focused layouts, cinematic transitions, scrolling narrative pacing",
  keywords: ["editorial", "storytelling", "immersive", "narrative", "reading", "magazine"],
  duration: { fast: 0.4, normal: 0.8, slow: 1.4 },
  stagger: { amount: 0.4, from: "start" },
  ease: { enter: "power2.inOut", exit: "power2.in", move: "power2.out", scrub: "none" },
  intensity: 0.5,
  reveals: [
    { type: "fade", direction: "up", distance: 50, autoAlpha: true },
    { type: "mask", direction: "left", distance: 0, autoAlpha: true }
  ],
  parallax: { strength: 0.2, layers: 3, baseSpeed: -0.08 },
  typography: { animation: "fade", split: false, splitType: "lines", letterSpacing: false },
  scroll: { scrub: 1, pin: true, snap: true, smooth: true, smoothness: 0.07 },
  design: {
    colors: {
      bg: "#F4F1EA",
      surface: "#FCFAF6",
      border: "#D6D3D1",
      text: "#1C1917",
      textSecondary: "#57534E",
      accent: "#D946EF",
      // Fuchsia
      accentGlow: "rgba(217, 70, 239, 0.15)"
    },
    typography: {
      fontFamily: "'Newsreader', serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap",
      headingTracking: "-0.01em",
      baseLeading: "1.6"
    },
    rhythm: {
      radius: "4px",
      containerPadding: "24px",
      itemGap: "16px"
    },
    atmosphere: {
      shadowStrength: 0.05,
      glassmorphism: false,
      borderWidth: "1px"
    }
  }
};

// src/presets/cyberpunk.ts
var cyberpunkPreset = {
  name: "cyberpunk",
  description: "Neon glow effects, glitch-style reveals, high-energy transitions, digital aesthetic",
  keywords: ["cyberpunk", "neon", "glitch", "futuristic", "digital", "sci-fi"],
  duration: { fast: 0.15, normal: 0.3, slow: 0.6 },
  stagger: { amount: 0.5, from: "random" },
  ease: { enter: "expo.out", exit: "power4.in", move: "power4.out", scrub: "none" },
  intensity: 0.9,
  reveals: [
    { type: "clip", direction: "up", distance: 0, autoAlpha: true },
    { type: "slide", direction: "left", distance: 100, autoAlpha: true }
  ],
  parallax: { strength: 0.4, layers: 4, baseSpeed: -0.2 },
  typography: { animation: "scramble", split: true, splitType: "chars", letterSpacing: true },
  scroll: { scrub: 0.3, pin: true, snap: false, smooth: true, smoothness: 0.04 },
  design: {
    colors: {
      bg: "#000000",
      surface: "#0A0A0A",
      border: "#00FF41",
      text: "#E0E0E0",
      textSecondary: "#00FF41",
      accent: "#FF003C",
      accentGlow: "rgba(255, 0, 60, 0.3)"
    },
    typography: {
      fontFamily: "'Space Mono', monospace",
      fontUrl: "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
      headingTracking: "-0.05em",
      baseLeading: "1.4"
    },
    rhythm: {
      radius: "0px",
      containerPadding: "16px",
      itemGap: "8px"
    },
    atmosphere: {
      shadowStrength: 1,
      glassmorphism: false,
      borderWidth: "2px"
    }
  }
};

// src/presets/minimal.ts
var minimalPreset = {
  name: "minimal",
  description: "Clean, reduced motion, functional transitions, whitespace-focused, calm pacing",
  keywords: ["minimal", "clean", "simple", "functional", "quiet", "zen"],
  duration: { fast: 0.3, normal: 0.5, slow: 0.8 },
  stagger: { amount: 0.2, from: "start" },
  ease: { enter: "sine.out", exit: "sine.in", move: "sine.inOut", scrub: "none" },
  intensity: 0.2,
  reveals: [{ type: "fade", direction: "up", distance: 20, autoAlpha: true }],
  parallax: { strength: 0.05, layers: 1, baseSpeed: -0.03 },
  typography: { animation: "fade", split: false, splitType: "words", letterSpacing: false },
  scroll: { scrub: 1, pin: false, snap: false, smooth: true, smoothness: 0.1 },
  design: {
    colors: {
      bg: "#FFFFFF",
      surface: "#FAFAFA",
      border: "transparent",
      text: "#000000",
      textSecondary: "#888888",
      accent: "#000000",
      accentGlow: "rgba(0, 0, 0, 0.05)"
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      headingTracking: "-0.04em",
      baseLeading: "1.8"
    },
    rhythm: {
      radius: "4px",
      containerPadding: "64px",
      itemGap: "48px"
    },
    atmosphere: {
      shadowStrength: 0.02,
      glassmorphism: false,
      borderWidth: "0px"
    }
  }
};

// src/presets/brutalist.ts
var brutalistPreset = {
  name: "brutalist",
  description: "Raw, bold transitions, hard cuts, no easing, unconventional timing, high contrast",
  keywords: ["brutalist", "raw", "bold", "hard", "unconventional", "experimental"],
  duration: { fast: 0.1, normal: 0.2, slow: 0.4 },
  stagger: { amount: 0.3, from: "random" },
  ease: { enter: "none", exit: "none", move: "none", scrub: "none" },
  intensity: 0.8,
  reveals: [{ type: "slide", direction: "up", distance: 100, autoAlpha: false }],
  parallax: { strength: 0, layers: 0, baseSpeed: 0 },
  typography: { animation: "scale", split: false, splitType: "words", letterSpacing: false },
  scroll: { scrub: true, pin: false, snap: false, smooth: false, smoothness: 1 },
  design: {
    colors: {
      bg: "#FFFFFF",
      surface: "#EEEEEE",
      border: "#000000",
      text: "#000000",
      textSecondary: "#333333",
      accent: "#FF0000",
      accentGlow: "rgba(255, 0, 0, 0)"
    },
    typography: {
      fontFamily: "'Archivo Black', sans-serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap",
      headingTracking: "-0.05em",
      baseLeading: "1.1"
    },
    rhythm: {
      radius: "0px",
      containerPadding: "16px",
      itemGap: "12px"
    },
    atmosphere: {
      shadowStrength: 1,
      glassmorphism: false,
      borderWidth: "4px"
    }
  }
};
var DIRECTION_MAP = {
  up: { prop: "y", value: 1 },
  down: { prop: "y", value: -1 },
  left: { prop: "x", value: 1 },
  right: { prop: "x", value: -1 }
};
function fadeReveal(targets, config = {}) {
  const {
    direction = "up",
    distance = 60,
    duration = 0.8,
    ease = "power2.out",
    stagger = 0.1,
    delay = 0
  } = config;
  const dir = DIRECTION_MAP[direction];
  return gsap4__default.default.from(targets, {
    autoAlpha: 0,
    [dir.prop]: distance * dir.value,
    duration,
    ease,
    stagger,
    delay
  });
}
function slideReveal(targets, config = {}) {
  const {
    direction = "up",
    distance = 120,
    duration = 0.6,
    ease = "power3.out",
    stagger = 0.08
  } = config;
  const dir = DIRECTION_MAP[direction];
  return gsap4__default.default.from(targets, {
    [dir.prop]: distance * dir.value,
    duration,
    ease,
    stagger
  });
}
function maskReveal(targets, config = {}) {
  const {
    direction = "up",
    duration = 1,
    ease = "power3.inOut",
    stagger = 0.15
  } = config;
  const clipPaths = {
    up: {
      from: "inset(100% 0% 0% 0%)",
      to: "inset(0% 0% 0% 0%)"
    },
    down: {
      from: "inset(0% 0% 100% 0%)",
      to: "inset(0% 0% 0% 0%)"
    },
    left: {
      from: "inset(0% 0% 0% 100%)",
      to: "inset(0% 0% 0% 0%)"
    },
    right: {
      from: "inset(0% 100% 0% 0%)",
      to: "inset(0% 0% 0% 0%)"
    }
  };
  const clip = clipPaths[direction];
  return gsap4__default.default.fromTo(
    targets,
    { clipPath: clip.from },
    {
      clipPath: clip.to,
      duration,
      ease,
      stagger
    }
  );
}
function clipReveal(targets, config = {}) {
  const {
    shape = "circle",
    duration = 1.2,
    ease = "power3.out",
    stagger = 0.1
  } = config;
  const from = shape === "circle" ? "circle(0% at 50% 50%)" : "ellipse(0% 0% at 50% 50%)";
  const to = shape === "circle" ? "circle(100% at 50% 50%)" : "ellipse(100% 100% at 50% 50%)";
  return gsap4__default.default.fromTo(
    targets,
    { clipPath: from },
    { clipPath: to, duration, ease, stagger }
  );
}
function createReveal(targets, revealConfig, options = {}) {
  const { type, direction, distance, autoAlpha } = revealConfig;
  switch (type) {
    case "fade":
      return fadeReveal(targets, { direction, distance, ...options });
    case "slide":
      return slideReveal(targets, { direction, distance, ...options });
    case "mask":
      return maskReveal(targets, { direction, ...options });
    case "clip":
      return clipReveal(targets, { ...options });
    default:
      return fadeReveal(targets, { direction, distance, ...options });
  }
}
gsap4__default.default.registerPlugin(ScrollTrigger.ScrollTrigger);
function createParallaxLayer(target, config = {}) {
  const {
    speed = -0.3,
    trigger,
    start = "top bottom",
    end = "bottom top",
    scrub = true
  } = config;
  const distance = speed * 100;
  return gsap4__default.default.to(target, {
    y: distance,
    ease: "none",
    scrollTrigger: {
      trigger: trigger ?? target,
      start,
      end,
      scrub
    }
  });
}
function depthParallax(container, config = {}) {
  const {
    layerCount = 3,
    baseSpeed = -0.1,
    depthMultiplier = 1.5,
    layerSelector = "[data-parallax]",
    scrub = 1
  } = config;
  const containerEl = typeof container === "string" ? document.querySelector(container) : container;
  if (!containerEl) return [];
  const layers = containerEl.querySelectorAll(layerSelector);
  const tweens = [];
  layers.forEach((layer, index) => {
    const customSpeed = layer.getAttribute("data-parallax-speed");
    const speed = customSpeed ? parseFloat(customSpeed) : baseSpeed * Math.pow(depthMultiplier, index);
    tweens.push(
      createParallaxLayer(layer, {
        speed,
        trigger: containerEl,
        scrub
      })
    );
  });
  return tweens;
}
function imageParallax(target, config = {}) {
  const { speed = -0.2, trigger, scrub = true } = config;
  gsap4__default.default.set(target, { scale: 1.15 });
  return createParallaxLayer(target, { speed, trigger, scrub });
}
function cascadeStagger(targets, config = {}) {
  const {
    from = "start",
    amount = 0.6,
    duration = 0.8,
    ease = "power2.out",
    y = 40
  } = config;
  return gsap4__default.default.from(targets, {
    autoAlpha: 0,
    y,
    duration,
    ease,
    stagger: {
      amount,
      from
    }
  });
}
function waveStagger(targets, config = {}) {
  const {
    amount = 0.8,
    duration = 0.6,
    ease = "power2.out",
    y = 30,
    scale = 0.95
  } = config;
  return gsap4__default.default.from(targets, {
    autoAlpha: 0,
    y,
    scale,
    duration,
    ease,
    stagger: {
      amount,
      from: "center",
      ease: "power1.inOut"
    }
  });
}
function randomStagger(targets, config = {}) {
  const {
    amount = 1,
    duration = 0.5,
    ease = "power3.out",
    y = 50,
    rotation = 0
  } = config;
  return gsap4__default.default.from(targets, {
    autoAlpha: 0,
    y,
    rotation,
    duration,
    ease,
    stagger: {
      amount,
      from: "random"
    }
  });
}
function edgeStagger(targets, config = {}) {
  const {
    amount = 0.6,
    duration = 0.7,
    ease = "power2.out",
    y = 40
  } = config;
  return gsap4__default.default.from(targets, {
    autoAlpha: 0,
    y,
    duration,
    ease,
    stagger: {
      amount,
      from: "edges"
    }
  });
}
function createStagger(targets, from, options = {}) {
  switch (from) {
    case "center":
      return waveStagger(targets, options);
    case "random":
      return randomStagger(targets, options);
    case "edges":
      return edgeStagger(targets, options);
    case "start":
    case "end":
    default:
      return cascadeStagger(targets, { ...options, from });
  }
}
function splitText(element, type = "words") {
  const text = element.textContent || "";
  element.textContent = "";
  if (type === "chars") {
    return text.split("").map((char) => {
      const span2 = document.createElement("span");
      span2.style.display = "inline-block";
      span2.style.whiteSpace = char === " " ? "pre" : "normal";
      span2.textContent = char;
      element.appendChild(span2);
      return span2;
    });
  }
  if (type === "words") {
    const words = text.split(/\s+/).filter(Boolean);
    return words.map((word, i) => {
      const span2 = document.createElement("span");
      span2.style.display = "inline-block";
      span2.textContent = word;
      element.appendChild(span2);
      if (i < words.length - 1) {
        element.appendChild(document.createTextNode("\xA0"));
      }
      return span2;
    });
  }
  const span = document.createElement("span");
  span.style.display = "block";
  span.textContent = text;
  element.appendChild(span);
  return [span];
}
function splitTextReveal(target, config = {}) {
  const { type = "words", duration = 0.6, ease = "power3.out", staggerAmount = 0.4, y = 40, rotationX = 0 } = config;
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return { tween: gsap4__default.default.to({}, {}), elements: [], revert: () => {
  } };
  const originalHTML = el.innerHTML;
  const parts = splitText(el, type);
  if (rotationX !== 0) el.style.perspective = "600px";
  const tween = gsap4__default.default.from(parts, { autoAlpha: 0, y, rotationX, duration, ease, stagger: { amount: staggerAmount, from: "start" } });
  return { tween, elements: parts, revert: () => {
    el.innerHTML = originalHTML;
  } };
}
function scaleHeading(targets, config = {}) {
  const { fromScale = 1.3, duration = 1, ease = "power3.out", stagger = 0.1 } = config;
  return gsap4__default.default.from(targets, { autoAlpha: 0, scale: fromScale, duration, ease, stagger });
}
function scrambleText(target, config = {}) {
  const { duration = 1.5, ease = "none", chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%" } = config;
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return { timeline: gsap4__default.default.timeline(), revert: () => {
  } };
  const originalText = el.textContent || "";
  const tl = gsap4__default.default.timeline();
  tl.to({ progress: 0 }, {
    progress: 1,
    duration,
    ease,
    onUpdate: function() {
      const p = this.targets()[0].progress;
      const len = Math.floor(p * originalText.length);
      let result = "";
      for (let i = 0; i < originalText.length; i++) {
        result += i < len ? originalText[i] : originalText[i] === " " ? " " : chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = result;
    }
  });
  return { timeline: tl, revert: () => {
    el.textContent = originalText;
  } };
}
function letterSpacingReveal(targets, config = {}) {
  const { fromSpacing = "0.3em", toSpacing = "0em", duration = 1, ease = "power2.out" } = config;
  return gsap4__default.default.fromTo(targets, { autoAlpha: 0, letterSpacing: fromSpacing }, { autoAlpha: 1, letterSpacing: toSpacing, duration, ease });
}
gsap4__default.default.registerPlugin(ScrollTrigger.ScrollTrigger);
function pinnedSection(trigger, timeline, config = {}) {
  const { start = "top top", end = "+=2000", scrub = 1, snap, markers = false } = config;
  const stVars = { trigger, start, end, scrub, pin: true, markers, anticipatePin: 1, animation: timeline };
  if (snap !== void 0) stVars.snap = snap;
  ScrollTrigger.ScrollTrigger.create(stVars);
  return timeline;
}
function horizontalScroll(container, content, config = {}) {
  const { end, scrub = 1, snap, markers = false } = config;
  const contentEl = typeof content === "string" ? document.querySelector(content) : content;
  if (!contentEl) return null;
  const scrollWidth = contentEl.scrollWidth - window.innerWidth;
  const scrollEnd = end ?? `+=${scrollWidth}`;
  const tween = gsap4__default.default.to(contentEl, {
    x: -scrollWidth,
    ease: "none",
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: scrollEnd,
      scrub,
      pin: true,
      markers,
      snap: snap ? { snapTo: 1 / Math.round(scrollWidth / window.innerWidth), duration: 0.3 } : void 0,
      anticipatePin: 1
    }
  });
  return tween;
}
function scrollCounter(target, config = {}) {
  const { endValue = 100, duration = 2, trigger, start = "top 80%", end = "bottom 20%", scrub = true } = config;
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return null;
  return gsap4__default.default.to({ val: 0 }, {
    val: endValue,
    duration,
    ease: "none",
    scrollTrigger: { trigger: trigger ?? target, start, end, scrub },
    onUpdate: function() {
      el.textContent = Math.round(this.targets()[0].val).toString();
    }
  });
}
function scrollProgress(target, config = {}) {
  const { trigger, start = "top top", end = "bottom bottom", direction = "horizontal" } = config;
  const prop = direction === "horizontal" ? "scaleX" : "scaleY";
  gsap4__default.default.set(target, { transformOrigin: direction === "horizontal" ? "left center" : "center top", [prop]: 0 });
  return gsap4__default.default.to(target, {
    [prop]: 1,
    ease: "none",
    scrollTrigger: { trigger: trigger ?? target, start, end, scrub: true }
  });
}

// src/utils/easing.ts
var FluxaEasing = {
  // ── Calm & Subtle ──────────────────────────────────────
  /** Gentle, barely-there ease — Apple-like subtlety */
  calm: "power1.out",
  /** Smooth deceleration — refined, professional */
  smooth: "power2.out",
  /** Soft entrance — elegant and understated */
  gentle: "sine.out",
  // ── Precise & Clean ────────────────────────────────────
  /** Crisp entrance — modern SaaS feel */
  crisp: "power2.out",
  /** Sharp stop — decisive, intentional */
  sharp: "power3.out",
  /** Precise in-out — balanced symmetry */
  precise: "power2.inOut",
  // ── Dramatic & Cinematic ───────────────────────────────
  /** Cinematic entrance — slow buildup, confident arrival */
  cinematic: "power3.inOut",
  /** Dramatic reveal — builds tension, releases */
  dramatic: "power4.out",
  /** Grand entrance — exponential drama */
  grand: "expo.out",
  // ── Energetic & Bold ───────────────────────────────────
  /** Bouncy overshoot — playful, startup energy */
  bounce: "back.out(1.7)",
  /** Elastic snap — attention-grabbing */
  elastic: "elastic.out(1, 0.3)",
  /** Snappy — quick and decisive */
  snappy: "power4.out",
  // ── Linear & Raw ───────────────────────────────────────
  /** No easing — raw, mechanical, brutalist */
  linear: "none",
  /** Constant speed — for scroll-scrubbed animations */
  scrub: "none",
  // ── Exit Easings ───────────────────────────────────────
  /** Quick exit — faster than entrance (best practice) */
  exitFast: "power2.in",
  /** Gentle exit */
  exitSmooth: "power1.in",
  /** Dramatic exit */
  exitDramatic: "power3.in"
};
function getEasing(mood) {
  const key = mood.toLowerCase();
  return FluxaEasing[key] ?? FluxaEasing.smooth;
}

// src/index.ts
init_registry();
gsap4__default.default.registerPlugin(ScrollTrigger.ScrollTrigger);
registerPreset(applePreset);
registerPreset(startupPreset);
registerPreset(luxuryPreset);
registerPreset(editorialPreset);
registerPreset(cyberpunkPreset);
registerPreset(minimalPreset);
registerPreset(brutalistPreset);

exports.FluxaEasing = FluxaEasing;
exports.FluxaMotion = FluxaMotion;
exports.MEDIA_CONDITIONS = MEDIA_CONDITIONS;
exports.ScrollController = ScrollController;
exports.TimelineManager = TimelineManager;
exports.applePreset = applePreset;
exports.brutalistPreset = brutalistPreset;
exports.cascadeStagger = cascadeStagger;
exports.clipReveal = clipReveal;
exports.createParallaxLayer = createParallaxLayer;
exports.createReveal = createReveal;
exports.createStagger = createStagger;
exports.cyberpunkPreset = cyberpunkPreset;
exports.depthParallax = depthParallax;
exports.edgeStagger = edgeStagger;
exports.editorialPreset = editorialPreset;
exports.fadeReveal = fadeReveal;
exports.getEasing = getEasing;
exports.getEffectiveDuration = getEffectiveDuration;
exports.getEffectiveIntensity = getEffectiveIntensity;
exports.getPreset = getPreset;
exports.horizontalScroll = horizontalScroll;
exports.imageParallax = imageParallax;
exports.letterSpacingReveal = letterSpacingReveal;
exports.listPresets = listPresets;
exports.listPresetsDetailed = listPresetsDetailed;
exports.luxuryPreset = luxuryPreset;
exports.maskReveal = maskReveal;
exports.mergePreset = mergePreset;
exports.minimalPreset = minimalPreset;
exports.pinnedSection = pinnedSection;
exports.randomStagger = randomStagger;
exports.registerPreset = registerPreset;
exports.scaleHeading = scaleHeading;
exports.scrambleText = scrambleText;
exports.scrollCounter = scrollCounter;
exports.scrollProgress = scrollProgress;
exports.slideReveal = slideReveal;
exports.splitText = splitText;
exports.splitTextReveal = splitTextReveal;
exports.startupPreset = startupPreset;
exports.waveStagger = waveStagger;
exports.withAccessibility = withAccessibility;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map