import Lenis from 'lenis';

/** Animation reveal direction */
type RevealDirection = 'up' | 'down' | 'left' | 'right';
/** Reveal animation type */
type RevealType = 'fade' | 'slide' | 'mask' | 'clip';
/** Typography animation style */
type TypographyAnimation = 'fade' | 'slide' | 'split' | 'scramble' | 'scale';
/** Stagger origin point */
type StaggerFrom = 'start' | 'center' | 'end' | 'edges' | 'random';
/** Configuration for a reveal animation */
interface RevealConfig {
    type: RevealType;
    direction: RevealDirection;
    distance: number;
    /** Whether to use autoAlpha (visibility + opacity) */
    autoAlpha: boolean;
}
/** Parallax configuration */
interface ParallaxConfig {
    /** Movement strength multiplier (0–1) */
    strength: number;
    /** Number of depth layers */
    layers: number;
    /** Base speed for the slowest layer */
    baseSpeed: number;
}
/** Stagger configuration */
interface StaggerConfig {
    /** Total stagger time across all elements */
    amount: number;
    /** Origin point for stagger distribution */
    from: StaggerFrom;
    /** Easing applied to the stagger distribution */
    ease?: string;
}
/** Scroll behavior configuration */
interface ScrollConfig {
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
interface DurationTiers {
    /** Quick micro-interactions (100–300ms) */
    fast: number;
    /** Standard animations (300–800ms) */
    normal: number;
    /** Cinematic, dramatic reveals (800–2000ms) */
    slow: number;
}
/** Easing configuration for different animation phases */
interface EaseConfig {
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
interface TypographyConfig {
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
interface DesignLanguage {
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
        fontUrl?: string;
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
interface MotionPreset {
    /** Unique preset identifier */
    name: string;
    /** Human-readable description */
    description: string;
    /** Visual mood keywords for AI matching */
    keywords: string[];
    duration: DurationTiers;
    stagger: StaggerConfig;
    ease: EaseConfig;
    /** Global intensity multiplier (0–1). 0 = nearly static, 1 = maximum motion */
    intensity: number;
    /** Default reveal animations */
    reveals: RevealConfig[];
    /** Parallax defaults */
    parallax: ParallaxConfig;
    typography: TypographyConfig;
    scroll: ScrollConfig;
    design: DesignLanguage;
}
/** Options passed to FluxaMotion constructor */
interface FluxaMotionOptions {
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
interface AnimationStep {
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
interface ScrollSectionConfig {
    trigger: string | Element;
    animation: gsap.core.Timeline | gsap.core.Tween;
    start?: string;
    end?: string;
    scrub?: number | boolean;
    pin?: boolean;
    snap?: number | number[] | string;
    markers?: boolean;
}

/**
 * ScrollController manages smooth scrolling (Lenis) and
 * synchronizes it with GSAP ScrollTrigger.
 */
declare class ScrollController {
    private lenis;
    private rafId;
    private config;
    constructor(config: ScrollConfig);
    /** Initialize Lenis smooth scrolling and wire to ScrollTrigger. */
    init(): void;
    /** Get the Lenis instance for external use. */
    getLenis(): Lenis | null;
    /** Scroll to a target (element, position, or selector). */
    scrollTo(target: string | number | Element, options?: {
        offset?: number;
        duration?: number;
        immediate?: boolean;
    }): void;
    /** Temporarily stop smooth scrolling. */
    stop(): void;
    /** Resume smooth scrolling. */
    start(): void;
    /** Recalculate ScrollTrigger positions. Call after DOM changes. */
    refresh(): void;
    /** Clean up everything. */
    destroy(): void;
}

/**
 * TimelineManager creates and coordinates GSAP timelines
 * with preset-driven defaults (duration, ease, stagger).
 */
declare class TimelineManager {
    private preset;
    private timelines;
    constructor(preset: MotionPreset);
    /** Create a new timeline with preset defaults. */
    createTimeline(config?: gsap.TimelineVars): gsap.core.Timeline;
    /** Add a sequence of animation steps to a timeline. */
    addSequence(timeline: gsap.core.Timeline, steps: AnimationStep[]): gsap.core.Timeline;
    /** Add multiple animations that play at the same time. */
    addParallel(timeline: gsap.core.Timeline, animations: AnimationStep[], position?: string | number): gsap.core.Timeline;
    /** Create an intro timeline (fade-in, stagger reveal). */
    createIntro(container: Element, selectors?: {
        heading?: string;
        text?: string;
        items?: string;
        media?: string;
    }): gsap.core.Timeline;
    /** Kill all managed timelines. */
    destroy(): void;
}

/**
 * FluxaMotion — the top-level animation controller.
 *
 * Usage:
 * ```ts
 * const fluxa = new FluxaMotion({
 *   container: '.hero-section',
 *   preset: 'apple',
 * });
 * fluxa.play();
 * // later:
 * fluxa.destroy();
 * ```
 */
declare class FluxaMotion {
    private container;
    private preset;
    private scrollController;
    private timelineManager;
    private matchMedia;
    private introTimeline;
    private debug;
    constructor(options: FluxaMotionOptions);
    /** Initialize all subsystems and set up accessibility. */
    init(): FluxaMotion;
    /** Play the intro animation. */
    play(): FluxaMotion;
    /** Pause the intro animation. */
    pause(): FluxaMotion;
    /** Reverse the intro animation. */
    reverse(): FluxaMotion;
    /** Get the current preset. */
    getPreset(): MotionPreset;
    /** Get the scroll controller for external use. */
    getScrollController(): ScrollController;
    /** Get the timeline manager for external use. */
    getTimelineManager(): TimelineManager;
    /** Switch to a different preset at runtime. */
    switchPreset(presetName: string, overrides?: Partial<MotionPreset>): FluxaMotion;
    /** Clean up all animations, ScrollTriggers, and Lenis. */
    destroy(): void;
}

/** Register a preset. Overwrites if name already exists. */
declare function registerPreset(preset: MotionPreset): void;
/** Get a preset by name. Returns undefined if not found. */
declare function getPreset(name: string): MotionPreset | undefined;
/** List all registered preset names. */
declare function listPresets(): string[];
/** List all registered presets with metadata. */
declare function listPresetsDetailed(): Array<{
    name: string;
    description: string;
    keywords: string[];
}>;
/** Deep-merge a base preset with partial overrides. */
declare function mergePreset(base: MotionPreset, overrides: Partial<MotionPreset>): MotionPreset;

/** Apple — subtle, precise, calm. Inspired by apple.com product pages. */
declare const applePreset: MotionPreset;

/** Startup — energetic, sharp, bold. Inspired by Y Combinator launches. */
declare const startupPreset: MotionPreset;

/** Luxury — slow, cinematic, refined. Inspired by high-end fashion and luxury brands. */
declare const luxuryPreset: MotionPreset;

/** Editorial — immersive, narrative, scroll-driven. Inspired by long-form storytelling sites. */
declare const editorialPreset: MotionPreset;

/** Cyberpunk — neon, glitch, high-energy. Inspired by sci-fi interfaces. */
declare const cyberpunkPreset: MotionPreset;

/** Minimal — clean, reduced, functional. Less is more. */
declare const minimalPreset: MotionPreset;

/** Brutalist — raw, bold, unconventional. Hard cuts, no polish. */
declare const brutalistPreset: MotionPreset;

/**
 * Fade reveal — elements fade in with optional directional movement.
 */
declare function fadeReveal(targets: gsap.TweenTarget, config?: {
    direction?: RevealDirection;
    distance?: number;
    duration?: number;
    ease?: string;
    stagger?: number | gsap.StaggerVars;
    delay?: number;
}): gsap.core.Tween;
/**
 * Slide reveal — elements slide in from off-screen with full opacity.
 */
declare function slideReveal(targets: gsap.TweenTarget, config?: {
    direction?: RevealDirection;
    distance?: number;
    duration?: number;
    ease?: string;
    stagger?: number | gsap.StaggerVars;
}): gsap.core.Tween;
/**
 * Mask reveal — elements revealed via clip-path animation.
 * Creates a cinematic "wipe" effect.
 */
declare function maskReveal(targets: gsap.TweenTarget, config?: {
    direction?: RevealDirection;
    duration?: number;
    ease?: string;
    stagger?: number | gsap.StaggerVars;
}): gsap.core.Tween;
/**
 * Clip reveal — circular or custom clip-path expansion.
 */
declare function clipReveal(targets: gsap.TweenTarget, config?: {
    shape?: 'circle' | 'ellipse';
    duration?: number;
    ease?: string;
    stagger?: number | gsap.StaggerVars;
}): gsap.core.Tween;
/**
 * Creates a reveal animation from a RevealConfig.
 * Used by the orchestrator to apply preset reveals.
 */
declare function createReveal(targets: gsap.TweenTarget, revealConfig: RevealConfig, options?: {
    duration?: number;
    ease?: string;
    stagger?: number;
}): gsap.core.Tween;

/**
 * Creates a single parallax layer — an element that moves at a
 * different rate than the scroll, creating depth.
 *
 * Uses transform `y` for GPU-accelerated performance.
 */
declare function createParallaxLayer(target: gsap.TweenTarget, config?: {
    /** Speed multiplier. Negative = moves opposite to scroll */
    speed?: number;
    /** ScrollTrigger trigger element */
    trigger?: string | Element;
    /** Start position */
    start?: string;
    /** End position */
    end?: string;
    /** Scrub smoothing */
    scrub?: number | boolean;
}): gsap.core.Tween;
/**
 * Creates a multi-layer depth parallax system.
 * Each child at increasing depth moves progressively slower.
 *
 * @param container - Parent element containing parallax layers
 * @param layers - Array of layer configs (or auto-discover via [data-parallax-speed])
 */
declare function depthParallax(container: string | Element, config?: {
    /** Number of automatic depth layers */
    layerCount?: number;
    /** Base speed for shallowest layer */
    baseSpeed?: number;
    /** Speed multiplier per depth level */
    depthMultiplier?: number;
    /** Layer selector pattern (uses nth-child) */
    layerSelector?: string;
    /** Scrub smoothing */
    scrub?: number | boolean;
}): gsap.core.Tween[];
/**
 * Image parallax — the classic "background moves slower" effect.
 * Scales the image slightly larger to prevent gaps during movement.
 */
declare function imageParallax(target: gsap.TweenTarget, config?: {
    speed?: number;
    trigger?: string | Element;
    scrub?: number | boolean;
}): gsap.core.Tween;

/**
 * Cascade stagger — sequential reveal from one edge.
 * Classic Apple-style: items appear one after another.
 */
declare function cascadeStagger(targets: gsap.TweenTarget, config?: {
    from?: StaggerFrom;
    amount?: number;
    duration?: number;
    ease?: string;
    y?: number;
}): gsap.core.Tween;
/**
 * Wave stagger — elements ripple from center outward.
 * Creates a breathing, organic feel.
 */
declare function waveStagger(targets: gsap.TweenTarget, config?: {
    amount?: number;
    duration?: number;
    ease?: string;
    y?: number;
    scale?: number;
}): gsap.core.Tween;
/**
 * Random stagger — chaotic, unpredictable reveal order.
 * Great for grid layouts, galleries, and cyberpunk aesthetics.
 */
declare function randomStagger(targets: gsap.TweenTarget, config?: {
    amount?: number;
    duration?: number;
    ease?: string;
    y?: number;
    rotation?: number;
}): gsap.core.Tween;
/**
 * Edge stagger — items reveal from both edges toward center.
 * Dramatic, symmetrical feel.
 */
declare function edgeStagger(targets: gsap.TweenTarget, config?: {
    amount?: number;
    duration?: number;
    ease?: string;
    y?: number;
}): gsap.core.Tween;
/**
 * Creates a stagger animation from a StaggerFrom configuration.
 * Used by the orchestrator to apply preset stagger patterns.
 */
declare function createStagger(targets: gsap.TweenTarget, from: StaggerFrom, options?: {
    amount?: number;
    duration?: number;
    ease?: string;
    y?: number;
}): gsap.core.Tween;

/** Splits text into character or word spans for animation. */
declare function splitText(element: Element, type?: 'chars' | 'words' | 'lines'): Element[];
/** Split text reveal — characters or words animate in sequentially. */
declare function splitTextReveal(target: string | Element, config?: {
    type?: 'chars' | 'words';
    duration?: number;
    ease?: string;
    staggerAmount?: number;
    y?: number;
    rotationX?: number;
}): {
    tween: gsap.core.Tween;
    elements: Element[];
    revert: () => void;
};
/** Scale heading — dramatic hero-section impact. */
declare function scaleHeading(targets: gsap.TweenTarget, config?: {
    fromScale?: number;
    duration?: number;
    ease?: string;
    stagger?: number;
}): gsap.core.Tween;
/** Scramble text — characters randomly resolve into final text. */
declare function scrambleText(target: string | Element, config?: {
    duration?: number;
    ease?: string;
    chars?: string;
}): {
    timeline: gsap.core.Timeline;
    revert: () => void;
};
/** Letter spacing reveal — text breathes in with expanding spacing. */
declare function letterSpacingReveal(targets: gsap.TweenTarget, config?: {
    fromSpacing?: string;
    toSpacing?: string;
    duration?: number;
    ease?: string;
}): gsap.core.Tween;

/** Pin a section and scrub through an animation timeline. */
declare function pinnedSection(trigger: string | Element, timeline: gsap.core.Timeline, config?: {
    start?: string;
    end?: string;
    scrub?: number | boolean;
    snap?: number | number[] | string;
    markers?: boolean;
}): gsap.core.Timeline;
/** Horizontal scroll — pin container, scrub content sideways. */
declare function horizontalScroll(container: string | Element, content: string | Element, config?: {
    end?: string;
    scrub?: number | boolean;
    snap?: number;
    markers?: boolean;
}): gsap.core.Tween | null;
/** Counter animation — number counts up during scroll. */
declare function scrollCounter(target: string | Element, config?: {
    endValue?: number;
    duration?: number;
    trigger?: string | Element;
    start?: string;
    end?: string;
    scrub?: number | boolean;
}): gsap.core.Tween | null;
/** Progress bar — visual scroll progress indicator. */
declare function scrollProgress(target: string | Element, config?: {
    trigger?: string | Element;
    start?: string;
    end?: string;
    direction?: 'horizontal' | 'vertical';
}): gsap.core.Tween;

/**
 * Emotional easing curves mapped to moods.
 * These are curated GSAP ease strings that evoke specific feelings.
 */
declare const FluxaEasing: {
    /** Gentle, barely-there ease — Apple-like subtlety */
    readonly calm: "power1.out";
    /** Smooth deceleration — refined, professional */
    readonly smooth: "power2.out";
    /** Soft entrance — elegant and understated */
    readonly gentle: "sine.out";
    /** Crisp entrance — modern SaaS feel */
    readonly crisp: "power2.out";
    /** Sharp stop — decisive, intentional */
    readonly sharp: "power3.out";
    /** Precise in-out — balanced symmetry */
    readonly precise: "power2.inOut";
    /** Cinematic entrance — slow buildup, confident arrival */
    readonly cinematic: "power3.inOut";
    /** Dramatic reveal — builds tension, releases */
    readonly dramatic: "power4.out";
    /** Grand entrance — exponential drama */
    readonly grand: "expo.out";
    /** Bouncy overshoot — playful, startup energy */
    readonly bounce: "back.out(1.7)";
    /** Elastic snap — attention-grabbing */
    readonly elastic: "elastic.out(1, 0.3)";
    /** Snappy — quick and decisive */
    readonly snappy: "power4.out";
    /** No easing — raw, mechanical, brutalist */
    readonly linear: "none";
    /** Constant speed — for scroll-scrubbed animations */
    readonly scrub: "none";
    /** Quick exit — faster than entrance (best practice) */
    readonly exitFast: "power2.in";
    /** Gentle exit */
    readonly exitSmooth: "power1.in";
    /** Dramatic exit */
    readonly exitDramatic: "power3.in";
};
/**
 * Get an easing value by mood keyword.
 * Falls back to 'power2.out' for unrecognized moods.
 */
declare function getEasing(mood: string): string;

/**
 * Standard media condition names used across Fluxa.
 */
declare const MEDIA_CONDITIONS: {
    readonly isDesktop: "(min-width: 1024px)";
    readonly isTablet: "(min-width: 768px) and (max-width: 1023px)";
    readonly isMobile: "(max-width: 767px)";
    readonly reduceMotion: "(prefers-reduced-motion: reduce)";
};
/**
 * Wraps an animation setup function to respect prefers-reduced-motion.
 * When reduced motion is preferred, the callback receives { reduceMotion: true }
 * and animations should use duration: 0 or be skipped entirely.
 *
 * @param callback - Animation setup function
 * @param scope - Optional scope element for selector scoping
 * @returns The matchMedia instance (call .revert() on cleanup)
 */
declare function withAccessibility(callback: (conditions: {
    isDesktop: boolean;
    isTablet: boolean;
    isMobile: boolean;
    reduceMotion: boolean;
}) => void | (() => void), scope?: Element | null): gsap.MatchMedia;
/**
 * Gets the effective duration based on reduced motion preference.
 * Returns 0 when reduced motion is preferred.
 */
declare function getEffectiveDuration(duration: number, reduceMotion: boolean): number;
/**
 * Gets effective intensity (0 when reduced motion).
 */
declare function getEffectiveIntensity(intensity: number, reduceMotion: boolean): number;

export { type AnimationStep, type DurationTiers, type EaseConfig, FluxaEasing, FluxaMotion, type FluxaMotionOptions, MEDIA_CONDITIONS, type MotionPreset, type ParallaxConfig, type RevealConfig, type RevealDirection, type RevealType, type ScrollConfig, ScrollController, type ScrollSectionConfig, type StaggerConfig, type StaggerFrom, TimelineManager, type TypographyAnimation, type TypographyConfig, applePreset, brutalistPreset, cascadeStagger, clipReveal, createParallaxLayer, createReveal, createStagger, cyberpunkPreset, depthParallax, edgeStagger, editorialPreset, fadeReveal, getEasing, getEffectiveDuration, getEffectiveIntensity, getPreset, horizontalScroll, imageParallax, letterSpacingReveal, listPresets, listPresetsDetailed, luxuryPreset, maskReveal, mergePreset, minimalPreset, pinnedSection, randomStagger, registerPreset, scaleHeading, scrambleText, scrollCounter, scrollProgress, slideReveal, splitText, splitTextReveal, startupPreset, waveStagger, withAccessibility };
