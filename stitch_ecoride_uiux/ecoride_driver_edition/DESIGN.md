---
name: EcoRide Driver Edition
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3e4946'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6e7976'
  outline-variant: '#bec9c5'
  surface-tint: '#046b5e'
  primary: '#004f45'
  on-primary: '#ffffff'
  primary-container: '#00695c'
  on-primary-container: '#94e5d5'
  inverse-primary: '#84d5c5'
  secondary: '#546067'
  on-secondary: '#ffffff'
  secondary-container: '#d7e4ec'
  on-secondary-container: '#5a666d'
  tertiary: '#004f46'
  on-tertiary: '#ffffff'
  tertiary-container: '#00695e'
  on-tertiary-container: '#81e8d7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a0f2e1'
  primary-fixed-dim: '#84d5c5'
  on-primary-fixed: '#00201b'
  on-primary-fixed-variant: '#005046'
  secondary-fixed: '#d7e4ec'
  secondary-fixed-dim: '#bbc8d0'
  on-secondary-fixed: '#111d23'
  on-secondary-fixed-variant: '#3c494f'
  tertiary-fixed: '#8df5e4'
  tertiary-fixed-dim: '#70d8c8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style
The brand personality for the driver-facing experience is rooted in **professionalism, reliability, and utility**. While the passenger app focuses on the delight of the journey, this design system is optimized for the "Professional Partner"—the driver who requires high-legibility, quick decision-making tools, and a sense of calm authority.

The aesthetic follows a **Corporate Modern** approach with **High-Contrast** accents. It prioritizes functional clarity over decorative elements, using generous whitespace and a sophisticated color palette to differentiate the workspace from the consumer-facing app. The interface should feel like a high-end tool: precise, trustworthy, and efficient.

## Colors
The color strategy pivots away from the passenger-side mint to a **Deep Teal (#00695C)**. This shift establishes a professional "uniform" for the digital interface, signaling a move from consumer service to professional utility. 

- **Primary:** Deep Teal is used for main actions, active states, and branding.
- **Surface:** A clean off-white (#F8F9FA) reduces glare during daylight hours while maintaining a premium feel.
- **Status:** Standard semantic colors are retained for safety and navigation, ensuring that "Go," "Warning," and "Stop" signals remain universally recognizable and psychologically consistent for the driver.

## Typography
This design system utilizes **Plus Jakarta Sans** across all levels to maintain brand continuity while leveraging its modern, open counters for legibility. 

Typography is scaled for glanceability. Headlines are slightly more condensed in tracking to allow for longer address strings or earning figures. Labels use a medium-to-semibold weight to ensure they are readable at a distance when the device is mounted on a dashboard. Body text is kept clean with generous line heights to prevent visual fatigue during long shifts.

## Layout & Spacing
The layout relies on a **Fluid Grid** system based on an 8px square rhythm. For mobile devices, a 4-column grid is used with 20px outside margins to prevent interaction fatigue near the screen edges.

The spacing philosophy emphasizes "tap-target safety." Elements are spaced to ensure that drivers can interact with the UI with high precision even while the vehicle is in motion (where permitted). High-priority information—such as fare prices or navigation prompts—receives dedicated "safe zones" with `lg` (24px) padding to separate them from secondary controls.

## Elevation & Depth
To convey hierarchy, this design system employs **Tonal Layers** supplemented by **Ambient Shadows**. 

The map acts as the base layer (Level 0). Overlays, such as trip cards and status bars, are elevated using Level 2 shadows (8px blur, 10% opacity, tinted with the primary Deep Teal) to create clear separation. This ensures that the UI "floats" above the map environment. Interactive elements like floating action buttons (FABs) use Level 3 shadows to indicate they are the highest point in the visual stack, inviting immediate touch.

## Shapes
In alignment with the core brand identity, the shape language is **Pill-shaped (3)**. This high level of roundedness (fully rounded corners for buttons and large radii for cards) softens the professional tone of the teal, making the app feel approachable rather than purely industrial. 

Cards and containers should use `rounded-xl` (1.5rem / 24px) to maintain a friendly, modern silhouette that fits comfortably within the mobile hardware's physical corner radii.

## Components
- **Buttons:** All primary actions utilize a pill-shaped, "Rounded-Full" style. The primary action button uses the Deep Teal background with white text. Secondary buttons use a Deep Teal outline with a transparent base.
- **Cards:** Active ride cards use a white surface with a subtle Deep Teal border (1px) when active to reinforce the "Driver" state. They include Level 2 elevation to separate from the navigation map.
- **Status Chips:** Used for "Online," "Offline," and "Busy" states. These utilize high-contrast backgrounds with white text and are fully rounded.
- **Input Fields:** Search and address inputs use an off-white background with a 1px border. On focus, the border thickens to 2px and changes to the primary Deep Teal.
- **Toggle Switches:** Used for "Accepting Rides." These are oversized for easy thumb interaction and utilize the primary color for the "On" state.
- **Earnings Tracker:** A specialized component featuring bolded `headline-lg` typography to provide the driver with immediate financial feedback at a glance.