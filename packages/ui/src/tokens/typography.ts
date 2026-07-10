/**
 * Forest & Cream Design System - Typography Tokens
 *
 * Geist font family with proper weight hierarchy following design specification
 */

import type {
    TypographyTokens,
    TypographyScale,
    TypographyStyle,
} from "./types.js";

// Typography Scale Definition
const typographyScale: TypographyScale = {
    display: {
        fontSize: "32px",
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
    },
    heading: {
        fontSize: "24px",
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
    },
    subheading: {
        fontSize: "20px",
        fontWeight: 500,
        lineHeight: 1.2,
        letterSpacing: "-0.005em",
    },
    body: {
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: 1.5,
    },
    caption: {
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: 1.4,
    },
    small: {
        fontSize: "12px",
        fontWeight: 400,
        lineHeight: 1.4,
    },
} as const;

// Complete Typography Token System
export const typography: TypographyTokens = {
    fontFamily:
        "Geist, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    scale: typographyScale,
} as const;

// Typography Utility Functions
export function getTypographyCSS(variant: keyof TypographyScale): string {
    const style = typography.scale[variant];
    return `
        font-family: ${typography.fontFamily};
        font-size: ${style.fontSize};
        font-weight: ${style.fontWeight};
        line-height: ${style.lineHeight};
        ${style.letterSpacing ? `letter-spacing: ${style.letterSpacing};` : ""}
    `.trim();
}

export function createTypographyClass(
    variant: keyof TypographyScale,
): Record<string, string> {
    const style = typography.scale[variant];
    return {
        fontFamily: typography.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight.toString(),
        lineHeight: style.lineHeight.toString(),
        ...(style.letterSpacing && { letterSpacing: style.letterSpacing }),
    };
}

// Export individual scale for convenience
export { typographyScale as scale };
export const fontFamily = typography.fontFamily;

// Export default
export default typography;
