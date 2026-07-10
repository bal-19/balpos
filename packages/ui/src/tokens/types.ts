/**
 * Forest & Cream Design System - TypeScript Types
 *
 * Complete TypeScript definitions for all design tokens
 */

// Color System Types
export interface ColorScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
}

export interface BrandColors {
    /** Forest Green - Primary brand color (#1A3A32) */
    forest: string;
    /** Warm Cream - Surface color (#FAF9F5) */
    cream: string;
    /** Generated accent color derived from forest green */
    accent: string;
}

export interface SemanticColors {
    success: string;
    warning: string;
    error: string;
    info: string;
}

export interface TextColors {
    /** Primary text - 87% opacity */
    primary: string;
    /** Secondary text - 60% opacity */
    secondary: string;
    /** Disabled text - 38% opacity */
    disabled: string;
    /** Text on colored backgrounds */
    inverse: string;
}

export interface ColorTokens {
    brand: BrandColors;
    semantic: SemanticColors;
    neutral: ColorScale;
    text: TextColors;
}

// Typography System Types
export interface TypographyStyle {
    fontSize: string;
    fontWeight: number;
    lineHeight: number;
    letterSpacing?: string;
}

export interface TypographyScale {
    display: TypographyStyle;
    heading: TypographyStyle;
    subheading: TypographyStyle;
    body: TypographyStyle;
    caption: TypographyStyle;
    small: TypographyStyle;
}

export interface TypographyTokens {
    fontFamily: string;
    scale: TypographyScale;
}

// Spacing System Types
export type SpacingValue = 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64;

export interface SpacingTokens {
    /** Base spacing unit in pixels */
    base: 4;
    /** Spacing scale array */
    scale: SpacingValue[];
    /** Named spacing tokens */
    xs: SpacingValue;
    sm: SpacingValue;
    md: SpacingValue;
    lg: SpacingValue;
    xl: SpacingValue;
    "2xl": SpacingValue;
    "3xl": SpacingValue;
    "4xl": SpacingValue;
}

// Border Radius Types
export interface BorderRadiusTokens {
    none: string;
    small: string;
    /** Round Eight - Default border radius */
    medium: string;
    large: string;
    full: string;
}

// Animation System Types
export interface AnimationDuration {
    /** Fast animations - hover states (150ms) */
    fast: string;
    /** Medium animations - page transitions (200ms) */
    medium: string;
    /** Slow animations - modals/drawers (250ms) */
    slow: string;
    /** Loading animations (1500ms) */
    loading: string;
}

export interface AnimationEasing {
    easeOut: string;
    easeIn: string;
    easeInOut: string;
    bounce: string;
}

export interface AnimationTokens {
    duration: AnimationDuration;
    easing: AnimationEasing;
}

// Complete Design Token System
export interface DesignTokens {
    colors: ColorTokens;
    typography: TypographyTokens;
    spacing: SpacingTokens;
    borderRadius: BorderRadiusTokens;
    animation: AnimationTokens;
}

// Theme Configuration Types
export interface ThemeConfiguration {
    id: string;
    name: string;
    colors: {
        primary: string;
        surface: string;
        customOverrides?: Record<string, string>;
    };
    preferences: {
        reducedMotion: boolean;
        highContrast: boolean;
        fontSize: "small" | "medium" | "large";
    };
}

// CSS Custom Properties Types
export type CSSCustomProperty = `--${string}`;

export interface CSSPropertyMap {
    [key: CSSCustomProperty]: string;
}

// Component State Types
export type ComponentVariant = "primary" | "secondary" | "tertiary";
export type ComponentSize = "small" | "medium" | "large";
export type ComponentState =
    | "default"
    | "hover"
    | "active"
    | "focus"
    | "disabled"
    | "loading"
    | "error"
    | "success";

// Performance Monitoring Types
export interface PerformanceMetrics {
    fps: number;
    animationCount: number;
    memoryUsage: number;
    renderTime: number;
    droppedFrames: number;
}

export interface PerformanceContext {
    application: string;
    component: string;
    userAgent: string;
    deviceType: "mobile" | "tablet" | "desktop";
}

export interface PerformanceData {
    timestamp: number;
    metrics: PerformanceMetrics;
    context: PerformanceContext;
    optimizations: {
        hardwareAcceleration: boolean;
        reducedMotion: boolean;
        performanceMode: boolean;
    };
}
