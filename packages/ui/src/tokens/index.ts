/**
 * Forest & Cream Design System - Design Tokens
 *
 * Comprehensive design token system providing colors, typography, spacing,
 * and animation tokens for the BalPOS restaurant operating system.
 */

export * from "./colors.js";
export * from "./typography.js";
export {
    spacing,
    borderRadius,
    getSpacing,
    getSpacingPx,
    getSpacingRem,
    createSpacingUtilities,
    getTailwindSpacing,
    base as spacingBase,
} from "./spacing.js";
export * from "./animation.js";
export * from "./types.js";
export * from "./css-properties.js";

// Re-export main token objects for convenience
import { colors } from "./colors.js";
import { typography } from "./typography.js";
import { spacing, borderRadius } from "./spacing.js";
import { animation } from "./animation.js";
import { getAllCSSProperties, generateCSSRoot } from "./css-properties.js";
import type { DesignTokens } from "./types.js";

// Complete design token system
export const designTokens: DesignTokens = {
    colors,
    typography,
    spacing,
    borderRadius,
    animation,
} as const;

// CSS Custom Properties
export const cssProperties = getAllCSSProperties();
export const cssRoot = generateCSSRoot();

// Export default tokens for easy import
export default designTokens;
