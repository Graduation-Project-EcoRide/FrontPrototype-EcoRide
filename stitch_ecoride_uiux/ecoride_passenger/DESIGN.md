---
name: EcoRide
colors:
  surface: '#f7faf7'
  surface-dim: '#d8dbd8'
  surface-bright: '#f7faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f1'
  surface-container: '#ecefec'
  surface-container-high: '#e6e9e6'
  surface-container-highest: '#e0e3e0'
  on-surface: '#181c1b'
  on-surface-variant: '#3f4a3d'
  inverse-surface: '#2d3130'
  inverse-on-surface: '#eef1ee'
  outline: '#6f7a6c'
  outline-variant: '#becab9'
  surface-tint: '#006e21'
  primary: '#006e21'
  on-primary: '#ffffff'
  primary-container: '#98fb98'
  on-primary-container: '#067625'
  inverse-primary: '#7adc7d'
  secondary: '#396756'
  on-secondary: '#ffffff'
  secondary-container: '#b9ead4'
  on-secondary-container: '#3e6b5a'
  tertiary: '#4e6450'
  on-tertiary: '#ffffff'
  tertiary-container: '#d2ebd2'
  on-tertiary-container: '#556b57'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#96f996'
  primary-fixed-dim: '#7adc7d'
  on-primary-fixed: '#002105'
  on-primary-fixed-variant: '#005316'
  secondary-fixed: '#bcedd7'
  secondary-fixed-dim: '#a0d1bc'
  on-secondary-fixed: '#002116'
  on-secondary-fixed-variant: '#214f3f'
  tertiary-fixed: '#d0e9d1'
  tertiary-fixed-dim: '#b5cdb5'
  on-tertiary-fixed: '#0b2011'
  on-tertiary-fixed-variant: '#374c3a'
  background: '#f7faf7'
  on-background: '#181c1b'
  surface-variant: '#e0e3e0'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  stack-gap-sm: 12px
  stack-gap-md: 24px
  stack-gap-lg: 40px
  gutter: 16px
---

## Brand & Style

The design system is anchored in environmental stewardship and modern mobility. It evokes a sense of freshness, optimism, and clarity, aiming to make sustainable choices feel effortless and premium. 

The aesthetic identity is **Organic Minimalism**. It combines the clean, functional structure of modern SaaS platforms with the soft, tactile elements of nature. The interface should feel "breathable," utilizing significant negative space to reduce cognitive load. The visual language favors large, soft shapes and a high-contrast relationship between lush greens and airy whites to maintain a professional yet approachable tone.

## Colors

The palette is designed to reflect a "modern garden" aesthetic. 

- **Primary:** A vibrant Mint Green (#98FB98) serves as the signature action color. It is used for primary call-to-actions and key brand moments.
- **Secondary:** A deep Forest Green (#0B3D2E) provides the necessary weight for legibility. This color is used for all primary text, iconography, and high-contrast UI borders.
- **Surface & Backgrounds:** The system relies on a mix of pure white and a very pale mint-tinted neutral (#F4F7F4). This creates a layered, airy effect without the harshness of pure grey scales.
- **Semantic Colors:** Success states utilize the Forest Green; warnings and errors should use a soft terracotta to remain within the organic color family without breaking the eco-conscious harmony.

## Typography

This design system uses a dual-font approach to balance personality with utility. 

**Plus Jakarta Sans** is used for headlines to provide a friendly, contemporary, and slightly rounded character that complements the organic shapes of the UI. **Inter** is utilized for body copy and labels to ensure maximum readability and a professional, systematic feel.

Hierarchy is established through significant weight shifts rather than color alone. Headlines should always be in the secondary Forest Green. Body text follows a 1.5x to 1.6x line-height ratio to maintain the airy, accessible tone of the brand.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for mobile-first interactions. 

- **Grid:** A 4-column grid for mobile with a 24px outer margin and 16px gutters.
- **Rhythm:** An 8px baseline grid dictates all vertical spacing. 
- **Breathing Room:** Components should favor generous internal padding (min 20px) to reinforce the "airy" brand pillar. Avoid crowding elements; if in doubt, increase the `stack-gap`.
- **Reflow:** On larger screens (tablets), the 4-column mobile grid expands to an 8-column layout with a maximum container width of 720px to maintain readability.

## Elevation & Depth

The design system uses a "Soft Layering" approach to depth rather than traditional heavy shadows.

- **Ambient Shadows:** Shadows are extremely diffused with a low opacity (4-8%). Use a subtle Forest Green tint in the shadow color (#0B3D2E at 5% opacity) to make the elevation feel integrated into the environment.
- **Tonal Elevation:** Instead of raising every card with a shadow, use background color shifts. A secondary surface might use the Tertiary Mint (#E0F9E0) to indicate a different functional area.
- **Interactive Depth:** Buttons and cards should feel "pressable." Upon interaction, shadows should slightly contract (lower Y-offset and blur) to simulate physical movement toward the surface.

## Shapes

The shape language is the most distinctive feature of this design system. 

- **Corner Radii:** Use a minimum of 32px for all primary cards and containers. This extreme roundness conveys friendliness and safety.
- **Pill Geometry:** Small components like buttons, tags, and input fields should utilize fully rounded (pill-shaped) ends.
- **Consistency:** If a card contains an image, the image must inherit the same 32px radius to maintain the cohesive, organic silhouette.

## Components

### Buttons
Primary buttons are pill-shaped, filled with the Mint Green (#98FB98), and use the Forest Green (#0B3D2E) for text. Secondary buttons use a Forest Green outline (1.5px) with no fill.

### Cards
Cards are the primary content vessel. They must have a 32px corner radius and a subtle 1px border using a 10% opacity version of the Forest Green. Use soft ambient shadows to separate them from the light mint backgrounds.

### Inputs
Input fields are pill-shaped with a height of 56px. Borders should be subtle (#0B3D2E at 15% opacity), turning to a solid 2px Mint Green on focus. Labels should sit above the field in `label-md` style.

### Chips & Tags
Used for filtering or status. These are small pill-shaped elements. Active states use the Mint Green fill; inactive states use the Tertiary Mint fill with 50% opacity.

### Progress Indicators
For eco-tracking, use thick, rounded stroke lines. The "filled" portion of a progress bar should always be the vibrant Mint Green, while the track is the light Neutral.