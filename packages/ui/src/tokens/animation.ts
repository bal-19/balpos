/**
 * Forest & Cream Design System - Animation Tokens
 *
 * Motion framework with timing functions and easing curves
 * Includes performance monitoring and accessibility compliance
 */

import type {
    AnimationTokens,
    AnimationDuration,
    AnimationEasing,
} from "./types.js";

// Animation Duration Tokens
export const animationDuration: AnimationDuration = {
    fast: "150ms", // Hover states and micro-interactions
    medium: "200ms", // Page transitions and state changes
    slow: "250ms", // Modal and drawer animations
    loading: "1500ms", // Loading and pulse animations
} as const;

// Animation Easing Functions
export const animationEasing: AnimationEasing = {
    easeOut: "cubic-bezier(0.0, 0.0, 0.2, 1)", // Default for most animations
    easeIn: "cubic-bezier(0.4, 0.0, 1, 1)", // Entrance animations
    easeInOut: "cubic-bezier(0.4, 0.0, 0.2, 1)", // Complex state transitions
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", // Playful interactions
} as const;

// Complete Animation Token System
export const animation: AnimationTokens = {
    duration: animationDuration,
    easing: animationEasing,
} as const;

// Animation Presets for Common Interactions
export const animationPresets = {
    // Button hover animations
    buttonHover: {
        duration: animationDuration.fast,
        easing: animationEasing.easeOut,
        properties: ["transform", "box-shadow"],
        transform: "scale(1.02)",
    },

    // Page transitions
    pageTransition: {
        duration: animationDuration.medium,
        easing: animationEasing.easeInOut,
        properties: ["opacity", "transform"],
        opacity: [0, 1],
        transform: ["translateY(8px)", "translateY(0)"],
    },

    // Modal animations
    modalSlideUp: {
        duration: animationDuration.slow,
        easing: animationEasing.easeInOut,
        properties: ["transform", "opacity"],
        transform: ["translateY(100%)", "translateY(0)"],
        opacity: [0, 1],
    },

    // Loading pulse
    loadingPulse: {
        duration: animationDuration.loading,
        easing: animationEasing.easeInOut,
        properties: ["opacity"],
        opacity: [0.4, 1, 0.4],
        iterationCount: "infinite",
    },

    // Fade in
    fadeIn: {
        duration: animationDuration.medium,
        easing: animationEasing.easeOut,
        properties: ["opacity"],
        opacity: [0, 1],
    },

    // Scale in
    scaleIn: {
        duration: animationDuration.fast,
        easing: animationEasing.bounce,
        properties: ["transform", "opacity"],
        transform: ["scale(0.8)", "scale(1)"],
        opacity: [0, 1],
    },

    // Drawer slide
    drawerSlide: {
        duration: animationDuration.slow,
        easing: animationEasing.easeInOut,
        properties: ["transform"],
        transform: ["translateX(-100%)", "translateX(0)"],
    },
} as const;

// Animation Utility Functions
export function createAnimation(
    properties: string[],
    duration: string = animationDuration.medium,
    easing: string = animationEasing.easeOut,
    delay: string = "0ms",
): string {
    return properties
        .map((prop) => `${prop} ${duration} ${easing} ${delay}`)
        .join(", ");
}

export function createTransition(
    property: string,
    duration: keyof AnimationDuration = "medium",
    easing: keyof AnimationEasing = "easeOut",
    delay: string = "0ms",
): string {
    return `${property} ${animationDuration[duration]} ${animationEasing[easing]} ${delay}`;
}

export function createKeyframes(
    name: string,
    keyframes: Record<string, Record<string, string>>,
): string {
    const keyframeRules = Object.entries(keyframes)
        .map(([percent, styles]) => {
            const styleRules = Object.entries(styles)
                .map(([prop, value]) => `${prop}: ${value};`)
                .join(" ");
            return `${percent} { ${styleRules} }`;
        })
        .join(" ");

    return `@keyframes ${name} { ${keyframeRules} }`;
}

// Hardware-accelerated properties for smooth animations
export const hardwareAcceleratedProperties = [
    "transform",
    "opacity",
    "filter",
    "backdrop-filter",
] as const;

// Performance monitoring utilities
export function shouldUseGPUAcceleration(): boolean {
    if (typeof window === "undefined") return false;

    // Check for hardware acceleration support
    const canvas = document.createElement("canvas");
    const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
}

export function respectsReducedMotion(): boolean {
    if (typeof window === "undefined") return false;

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getOptimalAnimationDuration(baseMs: number): string {
    if (respectsReducedMotion()) {
        return "0ms"; // Instant transitions for reduced motion
    }

    // Scale duration based on device performance
    const connection = (navigator as any)?.connection;
    if (
        connection?.effectiveType === "slow-2g" ||
        connection?.effectiveType === "2g"
    ) {
        return `${Math.min(baseMs * 0.5, 100)}ms`; // Faster on slow connections
    }

    return `${baseMs}ms`;
}

// CSS Custom Properties for animations
export function getCSSAnimationProperties(): Record<string, string> {
    return {
        "--animation-duration-fast": animationDuration.fast,
        "--animation-duration-medium": animationDuration.medium,
        "--animation-duration-slow": animationDuration.slow,
        "--animation-duration-loading": animationDuration.loading,
        "--animation-easing-out": animationEasing.easeOut,
        "--animation-easing-in": animationEasing.easeIn,
        "--animation-easing-in-out": animationEasing.easeInOut,
        "--animation-easing-bounce": animationEasing.bounce,
    };
}

// Export individual objects for convenience
export { animationDuration as duration };
export { animationEasing as easing };
export { animationPresets as presets };

// Export default
export default animation;
