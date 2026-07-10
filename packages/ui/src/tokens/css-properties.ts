/**
 * Forest & Cream Design System - CSS Custom Properties
 *
 * Generate CSS custom properties from design tokens for dynamic theming
 */

import { colors } from "./colors.js";
import { typography } from "./typography.js";
import { spacing, borderRadius } from "./spacing.js";
import { animation } from "./animation.js";
import type { CSSPropertyMap, CSSCustomProperty } from "./types.js";

// Generate CSS Custom Properties for Colors
export function getColorCSSProperties(): CSSPropertyMap {
    const properties: CSSPropertyMap = {};

    // Brand colors
    properties["--color-brand-forest"] = colors.brand.forest;
    properties["--color-brand-cream"] = colors.brand.cream;
    properties["--color-brand-accent"] = colors.brand.accent;

    // Semantic colors
    properties["--color-semantic-success"] = colors.semantic.success;
    properties["--color-semantic-warning"] = colors.semantic.warning;
    properties["--color-semantic-error"] = colors.semantic.error;
    properties["--color-semantic-info"] = colors.semantic.info;

    // Neutral colors
    Object.entries(colors.neutral).forEach(([scale, value]) => {
        properties[`--color-neutral-${scale}` as CSSCustomProperty] = value;
    });

    // Text colors
    properties["--color-text-primary"] = colors.text.primary;
    properties["--color-text-secondary"] = colors.text.secondary;
    properties["--color-text-disabled"] = colors.text.disabled;
    properties["--color-text-inverse"] = colors.text.inverse;

    return properties;
}

// Generate CSS Custom Properties for Typography
export function getTypographyCSSProperties(): CSSPropertyMap {
    const properties: CSSPropertyMap = {};

    // Font family
    properties["--font-family"] = typography.fontFamily;

    // Typography scale
    Object.entries(typography.scale).forEach(([variant, styles]) => {
        properties[`--font-size-${variant}` as CSSCustomProperty] =
            styles.fontSize;
        properties[`--font-weight-${variant}` as CSSCustomProperty] =
            styles.fontWeight.toString();
        properties[`--line-height-${variant}` as CSSCustomProperty] =
            styles.lineHeight.toString();

        if (styles.letterSpacing) {
            properties[`--letter-spacing-${variant}` as CSSCustomProperty] =
                styles.letterSpacing;
        }
    });

    return properties;
}

// Generate CSS Custom Properties for Spacing
export function getSpacingCSSProperties(): CSSPropertyMap {
    const properties: CSSPropertyMap = {};

    // Spacing scale
    properties["--spacing-base"] = `${spacing.base}px`;

    Object.entries(spacing).forEach(([key, value]) => {
        if (typeof value === "number" && key !== "base" && key !== "scale") {
            properties[`--spacing-${key}` as CSSCustomProperty] = `${value}px`;
        }
    });

    // Border radius
    Object.entries(borderRadius).forEach(([key, value]) => {
        properties[`--border-radius-${key}` as CSSCustomProperty] = value;
    });

    return properties;
}

// Generate CSS Custom Properties for Animation
export function getAnimationCSSProperties(): CSSPropertyMap {
    const properties: CSSPropertyMap = {};

    // Animation durations
    Object.entries(animation.duration).forEach(([key, value]) => {
        properties[`--animation-duration-${key}` as CSSCustomProperty] = value;
    });

    // Animation easing
    Object.entries(animation.easing).forEach(([key, value]) => {
        properties[`--animation-easing-${key}` as CSSCustomProperty] = value;
    });

    return properties;
}

// Combine all CSS Custom Properties
export function getAllCSSProperties(): CSSPropertyMap {
    return {
        ...getColorCSSProperties(),
        ...getTypographyCSSProperties(),
        ...getSpacingCSSProperties(),
        ...getAnimationCSSProperties(),
    };
}

// Generate CSS string for :root
export function generateCSSRoot(): string {
    const properties = getAllCSSProperties();
    const cssRules = Object.entries(properties)
        .map(([property, value]) => `  ${property}: ${value};`)
        .join("\n");

    return `:root {\n${cssRules}\n}`;
}

// Generate CSS string for a specific theme
export function generateThemeCSS(
    themeName: string,
    overrides: Partial<CSSPropertyMap> = {},
): string {
    const baseProperties = getAllCSSProperties();
    const themeProperties = { ...baseProperties, ...overrides };

    const cssRules = Object.entries(themeProperties)
        .map(([property, value]) => `  ${property}: ${value};`)
        .join("\n");

    return `[data-theme="${themeName}"] {\n${cssRules}\n}`;
}

// Utility to apply CSS properties dynamically
export function applyCSSProperties(
    element: HTMLElement,
    properties: CSSPropertyMap,
): void {
    Object.entries(properties).forEach(([property, value]) => {
        element.style.setProperty(property, value);
    });
}

// Utility to get CSS property value
export function getCSSProperty(
    property: CSSCustomProperty,
    element?: HTMLElement,
): string {
    const target = element || document.documentElement;
    return getComputedStyle(target).getPropertyValue(property).trim();
}

// Utility to set CSS property value
export function setCSSProperty(
    property: CSSCustomProperty,
    value: string,
    element?: HTMLElement,
): void {
    const target = element || document.documentElement;
    target.style.setProperty(property, value);
}

// Theme management utilities
export class CSSPropertyManager {
    private element: HTMLElement | null;

    constructor(
        element?: HTMLElement,
    ) {
        this.element =
            element ??
            (typeof document !== "undefined" ? document.documentElement : null);
    }

    setProperty(property: CSSCustomProperty, value: string): void {
        this.element?.style.setProperty(property, value);
    }

    getProperty(property: CSSCustomProperty): string {
        if (!this.element) return "";
        return getComputedStyle(this.element).getPropertyValue(property).trim();
    }

    removeProperty(property: CSSCustomProperty): void {
        this.element?.style.removeProperty(property);
    }

    setProperties(properties: CSSPropertyMap): void {
        Object.entries(properties).forEach(([prop, value]) => {
            this.setProperty(prop as CSSCustomProperty, value);
        });
    }

    applyTheme(
        themeName: string,
        overrides: Partial<CSSPropertyMap> = {},
    ): void {
        this.element?.setAttribute("data-theme", themeName);

        if (Object.keys(overrides).length > 0) {
            const validOverrides: CSSPropertyMap = {};
            Object.entries(overrides).forEach(([key, value]) => {
                if (value !== undefined) {
                    validOverrides[key as CSSCustomProperty] = value;
                }
            });
            this.setProperties(validOverrides);
        }
    }
}

// Export the default instance
export const cssPropertyManager = new CSSPropertyManager();

// Export all utilities
export {
    getColorCSSProperties as colorProperties,
    getTypographyCSSProperties as typographyProperties,
    getSpacingCSSProperties as spacingProperties,
    getAnimationCSSProperties as animationProperties,
    getAllCSSProperties as allProperties,
};
