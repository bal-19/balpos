/**
 * Forest & Cream Design System - Spacing Tokens
 *
 * 4px base unit spacing system with consistent scale
 */

import type { SpacingTokens, SpacingValue } from "./types.js";

// Spacing Scale Values
const spacingScale: SpacingValue[] = [4, 8, 12, 16, 24, 32, 48, 64] as const;

// Complete Spacing Token System
export const spacing: SpacingTokens = {
    base: 4,
    scale: spacingScale,
    xs: 4, // 4px - extra small
    sm: 8, // 8px - small
    md: 12, // 12px - medium
    lg: 16, // 16px - large
    xl: 24, // 24px - extra large
    "2xl": 32, // 32px - 2x extra large
    "3xl": 48, // 48px - 3x extra large
    "4xl": 64, // 64px - 4x extra large
} as const;

// Spacing Utility Functions
export function getSpacing(size: keyof SpacingTokens): number | SpacingValue[] {
    return spacing[size];
}

export function getSpacingPx(
    size: keyof Omit<SpacingTokens, "base" | "scale">,
): string {
    const value = spacing[size as keyof typeof spacing];
    if (typeof value === "number") {
        return `${value}px`;
    }
    return "0px";
}

export function getSpacingRem(
    size: keyof Omit<SpacingTokens, "base" | "scale">,
): string {
    const value = spacing[size as keyof typeof spacing];
    if (typeof value === "number") {
        return `${value / 16}rem`;
    }
    return "0rem";
}

// Create spacing object with px and rem values
export function createSpacingUtilities() {
    const utilities: Record<string, { px: string; rem: string }> = {};

    Object.entries(spacing).forEach(([key, value]) => {
        if (typeof value === "number" && key !== "base") {
            utilities[key] = {
                px: `${value}px`,
                rem: `${value / 16}rem`,
            };
        }
    });

    return utilities;
}

// Generate Tailwind spacing configuration
export function getTailwindSpacing(): Record<string, string> {
    const tailwindSpacing: Record<string, string> = {};

    Object.entries(spacing).forEach(([key, value]) => {
        if (typeof value === "number" && key !== "base") {
            tailwindSpacing[key] = `${value}px`;
        }
    });

    // Add scale values as numeric keys
    spacingScale.forEach((value, index) => {
        tailwindSpacing[index.toString()] = `${value}px`;
        tailwindSpacing[value.toString()] = `${value}px`;
    });

    return tailwindSpacing;
}

// Border Radius Tokens (using 8px as Round Eight)
export const borderRadius = {
    none: "0px",
    small: "4px",
    medium: "8px", // Round Eight - primary border radius
    large: "12px",
    full: "50%",
} as const;

// Export individual values for convenience
export { spacingScale as scale };
export const base = spacing.base;

// Export default
export default spacing;
