# Forest & Cream Design System - Design Tokens

A comprehensive design token system providing colors, typography, spacing, and animation tokens for the BalPOS restaurant operating system.

## Overview

The design system implements the Forest Enterprise aesthetic with:

- **Forest Green** (#1A3A32) as the primary brand color
- **Warm Cream** (#FAF9F5) as the surface color
- **Geist** font family for typography
- **8px border radius** (Round Eight) for interactive elements
- **4px base unit** spacing system
- **Performance-optimized animations** with accessibility support

## Usage

### TypeScript/JavaScript Import

```typescript
import {
    colors,
    typography,
    spacing,
    animation,
    designTokens,
    cssProperties,
} from "@restaurant-pos/ui";

// Access specific tokens
const forestGreen = colors.brand.forest; // "#1A3A32"
const bodyFont = typography.scale.body.fontSize; // "16px"
const mediumSpacing = spacing.md; // 12
const fastDuration = animation.duration.fast; // "150ms"
```

### CSS Custom Properties

```css
/* Use CSS custom properties in your styles */
.my-component {
    background-color: var(--color-brand-forest);
    color: var(--color-text-inverse);
    font-size: var(--font-size-body);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-medium);
    transition: transform var(--animation-duration-fast)
        var(--animation-easing-out);
}

.my-component:hover {
    transform: scale(1.02);
}
```

### Utility Classes

```html
<!-- Typography utilities -->
<h1 class="text-display">Display Heading</h1>
<h2 class="text-heading">Section Heading</h2>
<p class="text-body">Body text content</p>
<span class="text-caption">Caption text</span>

<!-- Animation utilities -->
<button class="animate-hover">Hover me</button>
<div class="animate-fade-in">Fade in content</div>
<div class="animate-pulse-loading">Loading...</div>
```

## Token Categories

### Colors

#### Brand Colors

- `colors.brand.forest`: #1A3A32 (Primary brand color)
- `colors.brand.cream`: #FAF9F5 (Surface color)
- `colors.brand.accent`: #2D5A4F (Generated accent)

#### Semantic Colors

- `colors.semantic.success`: #059669
- `colors.semantic.warning`: #D97706
- `colors.semantic.error`: #DC2626
- `colors.semantic.info`: #2563EB

#### Text Colors

- `colors.text.primary`: rgba(17, 24, 39, 0.87)
- `colors.text.secondary`: rgba(17, 24, 39, 0.60)
- `colors.text.disabled`: rgba(17, 24, 39, 0.38)
- `colors.text.inverse`: #FFFFFF

### Typography

The typography system uses Geist font with a 6-level scale:

- `typography.scale.display`: 32px, weight 600
- `typography.scale.heading`: 24px, weight 600
- `typography.scale.subheading`: 20px, weight 500
- `typography.scale.body`: 16px, weight 400
- `typography.scale.caption`: 14px, weight 400
- `typography.scale.small`: 12px, weight 400

### Spacing

4px base unit system with consistent scale:

- `spacing.xs`: 4px
- `spacing.sm`: 8px
- `spacing.md`: 12px
- `spacing.lg`: 16px
- `spacing.xl`: 24px
- `spacing.2xl`: 32px
- `spacing.3xl`: 48px
- `spacing.4xl`: 64px

### Animation

Performance-optimized timing with easing curves:

#### Duration

- `animation.duration.fast`: 150ms (hover states)
- `animation.duration.medium`: 200ms (page transitions)
- `animation.duration.slow`: 250ms (modals/drawers)
- `animation.duration.loading`: 1500ms (loading animations)

#### Easing

- `animation.easing.easeOut`: cubic-bezier(0.0, 0.0, 0.2, 1)
- `animation.easing.easeIn`: cubic-bezier(0.4, 0.0, 1, 1)
- `animation.easing.easeInOut`: cubic-bezier(0.4, 0.0, 0.2, 1)
- `animation.easing.bounce`: cubic-bezier(0.68, -0.55, 0.265, 1.55)

## Accessibility

The design system includes comprehensive accessibility features:

- **WCAG AA Compliance**: All color combinations meet contrast requirements (4.5:1 ratio)
- **Reduced Motion Support**: Respects `prefers-reduced-motion` system setting
- **High Contrast**: Automatic text color calculation based on background luminance
- **Touch Targets**: Minimum 44px touch targets on mobile devices

## Dynamic Theming

```typescript
import { cssPropertyManager, generateThemeCSS } from "@restaurant-pos/ui";

// Apply a custom theme
cssPropertyManager.setProperty("--color-brand-forest", "#2A4A42");

// Generate theme CSS
const customTheme = generateThemeCSS("restaurant-brand", {
    "--color-brand-forest": "#2A4A42",
    "--color-brand-cream": "#F5F5F0",
});
```

## Performance Considerations

- All animations use hardware-accelerated properties (`transform`, `opacity`)
- CSS custom properties allow dynamic theming without recompilation
- Reduced motion preferences are automatically respected
- Animation complexity scales based on device performance

## Examples

### Complete Component Example

```typescript
import { colors, spacing, animation } from "@restaurant-pos/ui";

const StyledButton = styled.button`
    background-color: ${colors.brand.forest};
    color: ${colors.text.inverse};
    padding: ${spacing.md}px ${spacing.lg}px;
    border-radius: var(--border-radius-medium);
    font-family: ${typography.fontFamily};
    font-size: ${typography.scale.body.fontSize};
    font-weight: ${typography.scale.body.fontWeight};
    transition: transform ${animation.duration.fast} ${animation.easing.easeOut};

    &:hover {
        transform: scale(1.02);
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover {
            transform: none;
        }
    }
`;
```

### CSS-only Example

```css
.forest-button {
    background-color: var(--color-brand-forest);
    color: var(--color-text-inverse);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius-medium);
    font-family: var(--font-family);
    font-size: var(--font-size-body);
    font-weight: var(--font-weight-body);
    transition: transform var(--animation-duration-fast)
        var(--animation-easing-out);
}

.forest-button:hover {
    transform: scale(1.02);
}

@media (prefers-reduced-motion: reduce) {
    .forest-button {
        transition: none;
    }

    .forest-button:hover {
        transform: none;
    }
}
```

## Browser Support

- Modern browsers with CSS custom property support
- Graceful fallback for older browsers
- Hardware acceleration where available
- Automatic reduced motion detection
