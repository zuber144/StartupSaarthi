---
name: The Design System
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#414753'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#727784'
  outline-variant: '#c1c6d5'
  surface-tint: '#005cba'
  primary: '#004e9f'
  on-primary: '#ffffff'
  primary-container: '#0066cc'
  on-primary-container: '#dfe8ff'
  inverse-primary: '#aac7ff'
  secondary: '#5d5e60'
  on-secondary: '#ffffff'
  secondary-container: '#dfdfe1'
  on-secondary-container: '#616365'
  tertiary: '#4e5054'
  on-tertiary: '#ffffff'
  tertiary-container: '#67686c'
  on-tertiary-container: '#e8e8ed'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458e'
  secondary-fixed: '#e2e2e4'
  secondary-fixed-dim: '#c6c6c8'
  on-secondary-fixed: '#1a1c1d'
  on-secondary-fixed-variant: '#454749'
  tertiary-fixed: '#e2e2e7'
  tertiary-fixed-dim: '#c6c6cb'
  on-tertiary-fixed: '#1a1c1f'
  on-tertiary-fixed-variant: '#45474b'
  background: '#fcf8fb'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  subhead-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: 0.1em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-page: 48px
  section-padding: 80px
---

## Brand & Style

This design system is built upon the principles of clarity, precision, and high-fidelity craftsmanship. It draws heavy inspiration from modern desktop operating systems and premium hardware marketing, prioritizing content through a disciplined use of whitespace and a reduction of visual noise.

The aesthetic profile combines **Minimalism** with **Glassmorphism**. It utilizes a light-flooded environment where depth is communicated through subtle translucency and soft shadows rather than heavy borders. The emotional response is one of calm authority and professional sophistication—a "digital gallery" feel where every pixel serves a functional purpose.

## Colors

The palette is strictly curated to ensure maximum contrast and a clean, clinical high-end feel.

- **Backgrounds:** Pure white (#FFFFFF) is the standard for primary canvases to ensure an airy, infinite feel.
- **Surfaces:** A subtle light gray (#F5F5F7) is used for secondary containers, sidebars, and background offsets to create soft hierarchy without harsh lines.
- **Typography:** Jet black (#1D1D1F) is used for all primary text, providing elite legibility and a sharp, ink-on-paper aesthetic.
- **Accents:** The primary action color is a precise system blue (#0066CC), reserved for interactive triggers, focus states, and key indications of progress or selection.

## Typography

This design system utilizes **Geist** for its technical precision and neutral, modern stance. The typographic hierarchy is defined by extreme contrast in weight and tracking.

Headlines should use heavy weights (Bold to Black) with tight tracking to feel architectural and impactful. Subheads and labels utilize wider tracking (letter-spacing) to improve "scannability" and impart a premium, editorial feel. Body text remains balanced with generous line heights to ensure a comfortable reading experience during long-form interaction.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. Content is typically housed within a 1200px centered container for desktop views, while margins and gutters expand to fill the viewport on larger displays.

A strict 8px grid governs all spatial relationships. Navigation and headers utilize generous vertical padding to maintain the "airy" brand promise. Content groups should be separated by significant whitespace (Section Padding) to prevent visual clutter and allow the high-fidelity typography room to breathe.

## Elevation & Depth

Depth is conveyed through a combination of **Glassmorphism** and **Ambient Shadows**.

1.  **Navigation Bars:** Must use a `backdrop-filter: blur(20px)` with a semi-transparent white background (#FFFFFFCC). This allows content to scroll underneath while maintaining context.
2.  **Floating Elements:** Cards and menus use an extremely diffused shadow: `0 10px 40px rgba(0,0,0,0.04)`.
3.  **Tonal Stacking:** For subtle depth, elements are placed on #F5F5F7 surfaces with 1px solid #E8E8ED borders, avoiding shadows entirely to maintain a flat, modern architectural look.

## Shapes

The shape language is characterized by **large, friendly radiuses** that soften the high-contrast color palette. 

Standard components (buttons, input fields) use a 12px corner radius. Larger containers, such as modal windows and primary cards, utilize a 16px to 20px radius. This "squircle-adjacent" approach ensures that even the most information-dense interfaces feel approachable and modern. Avoid sharp 0px corners entirely unless used for hairline separators.

## Components

- **Buttons:** Primary buttons are solid #0066CC with white text. Secondary buttons are #F5F5F7 with #1D1D1F text. All buttons feature a subtle 1px inset border and 12px corner radius.
- **Input Fields:** Use a subtle gray background (#F5F5F7) and a 12px radius. On focus, the border transitions to a 2px blue stroke (#0066CC).
- **Cards:** White background with a 1px #E8E8ED border or a very soft ambient shadow. Radii should be 16px.
- **Glassmorphic Nav:** Fixed to the top of the viewport with a blur effect and a bottom hairline stroke (#E8E8ED).
- **Segmented Controls:** Use a pill-shaped container (#F5F5F7) with a white "sliding" element for the active state, mimicking desktop OS selectors.
- **Progress Indicators:** Use the primary blue for the fill, with a #E8E8ED track, maintaining a thin 4px height for a sophisticated look.