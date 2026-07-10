/**
 * Forest & Cream Design System - Color Tokens
 *
 * Complete color system with Forest Green (#1A3A32) and Warm Cream (#FAF9F5)
 * following WCAG AA accessibility standards
 */

import type {
    ColorTokens,
    BrandColors,
    SemanticColors,
    TextColors,
    ColorScale,
} from "./types.js";

// Primary Brand Colors
export const brandColors: BrandColors = {
    forest: "#1A3A32",
    cream: "#FAF9F5",
    accent: "#2D5A4F", // Generated darker variant of forest green
} as const;

// Semantic Colors
export const semanticColors: SemanticColors = {
    success: "#059669", // Emerald 600
    warning: "#D97706", // Amber 600
    error: "#DC2626", // Red 600
    info: "#2563EB", // Blue 600
} as const;

// Neutral Color Scale
export const neutralColors: ColorScale = {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
    950: "#030712",
} as const;

// Text Colors with proper opacity levels
export const textColors: TextColors = {
    primary: "rgba(17, 24, 39, 0.87)", // Gray 900 at 87% opacity
    secondary: "rgba(17, 24, 39, 0.60)", // Gray 900 at 60% opacity
    disabled: "rgba(17, 24, 39, 0.38)", // Gray 900 at 38% opacity
    inverse: "#FFFFFF", // White text for dark backgrounds
} as const;

// Complete Color Token System
export const colors: ColorTokens = {
    brand: brandColors,
    semantic: semanticColors,
    neutral: neutralColors,
    text: textColors,
} as const;

// Color Utility Functions
export function generateColorPalette(primaryColor: string): ColorScale {
    // This is a simplified color palette generator
    // In a real implementation, you'd use a more sophisticated algorithm
    const base = primaryColor;

    return {
        50: lighten(base, 0.95),
        100: lighten(base, 0.9),
        200: lighten(base, 0.75),
        300: lighten(base, 0.6),
        400: lighten(base, 0.45),
        500: base,
        600: darken(base, 0.15),
        700: darken(base, 0.3),
        800: darken(base, 0.45),
        900: darken(base, 0.6),
        950: darken(base, 0.75),
    };
}

export function validateContrast(
    foreground: string,
    background: string,
    isLargeText: boolean = false,
): boolean {
    const fgLuminance = getRelativeLuminance(foreground);
    const bgLuminance = getRelativeLuminance(background);

    const ratio =
        (Math.max(fgLuminance, bgLuminance) + 0.05) /
        (Math.min(fgLuminance, bgLuminance) + 0.05);

    // WCAG AA standard requires 4.5:1 for normal text, 3:1 for large text
    return ratio >= (isLargeText ? 3 : 4.5);
}

export function getContrastingTextColor(backgroundColor: string): string {
    const luminance = getRelativeLuminance(backgroundColor);
    return luminance > 0.5 ? textColors.primary : textColors.inverse;
}

// Helper Functions
function lighten(color: string, amount: number): string {
    // Simplified lighten function - in production, use a proper color manipulation library
    const hex = color.replace("#", "");
    const num = parseInt(hex, 16);
    const r = Math.min(
        255,
        Math.floor((num >> 16) + (255 - (num >> 16)) * amount),
    );
    const g = Math.min(
        255,
        Math.floor(
            ((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * amount,
        ),
    );
    const b = Math.min(
        255,
        Math.floor((num & 0x0000ff) + (255 - (num & 0x0000ff)) * amount),
    );

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function darken(color: string, amount: number): string {
    // Simplified darken function - in production, use a proper color manipulation library
    const hex = color.replace("#", "");
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
    const g = Math.max(0, Math.floor(((num >> 8) & 0x00ff) * (1 - amount)));
    const b = Math.max(0, Math.floor((num & 0x0000ff) * (1 - amount)));

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function getRelativeLuminance(color: string): number {
    // Simplified luminance calculation - in production, use a proper color library
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    );

    return 0.2126 * (rs || 0) + 0.7152 * (gs || 0) + 0.0722 * (bs || 0);
}

// Export individual color scales for convenience
export { brandColors as brand };
export { semanticColors as semantic };
export { neutralColors as neutral };
export { textColors as text };
