---
version: "beta"
name: "Meridian Geo — Cartographic Terrain"
description: "A dark editorial geospatial design system inspired directly by the supplied Meridian Geo reference. The interface combines near-black terrain fields, muted botanical greens, warm geological neutrals, ultra-light typography, topographic contour visualization, restrained navigation, and large negative space. The visual language should feel scientific, premium, atmospheric, and quietly technical rather than dashboard-like."

# ============================================================
# DESIGN PRINCIPLES
# ============================================================

principles:
  - "Darkness is the primary surface; color is used sparingly."
  - "Typography carries the hierarchy rather than cards or containers."
  - "Terrain visualization remains visible behind content without competing with it."
  - "Use large negative space and editorial composition."
  - "Prefer thin strokes and low-opacity borders over filled UI chrome."
  - "Keep interactions understated and premium."
  - "Avoid conventional SaaS dashboard styling."
  - "Avoid excessive glassmorphism, pills, shadows, and rounded cards."
  - "The map/terrain field should feel alive but slow and meditative."

# ============================================================
# COLOR SYSTEM
# ============================================================

colors:

  background:
    base: "#080C08"
    primary: "#0A0E09"
    elevated: "#0D120C"
    deepest: "#060906"

  terrain:
    primary: "#6F9164"
    bright: "#86A978"
    glow: "#7A9A6E"
    muted: "#43563E"
    dark: "#1D2A1B"
    contour: "rgba(122,154,110,0.24)"
    contour-bright: "rgba(142,174,128,0.62)"
    contour-soft: "rgba(122,154,110,0.10)"

  text:
    primary: "#E4E9DF"
    secondary: "#B0B5A8"
    muted: "#777C70"
    faint: "#565C51"
    inverse: "#080C08"

  accent:
    primary: "#7A9A6E"
    light: "#93B087"
    dark: "#536D4B"

  warm:
    primary: "#C1B99D"
    muted: "#8F8A76"
    faint: "#625F51"

  borders:
    subtle: "rgba(228,233,223,0.07)"
    visible: "rgba(228,233,223,0.12)"
    terrain: "rgba(122,154,110,0.20)"

  overlays:
    hero: "rgba(6,9,6,0.38)"
    hero-deep: "rgba(6,9,6,0.72)"
    navigation: "rgba(8,12,8,0.94)"
    vignette: "rgba(0,0,0,0.55)"

# ============================================================
# COLOR USAGE
# ============================================================

color_usage:
  page_background: "#080C08"

  primary_text:
    value: "#E4E9DF"
    usage: "Hero headings, important numerical values, primary navigation when active."

  secondary_text:
    value: "#B0B5A8"
    usage: "Descriptions, supporting navigation, secondary information."

  muted_text:
    value: "#777C70"
    usage: "Metadata, labels, supporting UI."

  primary_accent:
    value: "#7A9A6E"
    usage: "Terrain highlights, active states, small emphasis, key interaction states."

  warm_accent:
    value: "#C1B99D"
    usage: "Secondary navigation, auxiliary labels, editorial details."

  terrain_green:
    value: "#6F9164"
    usage: "Topographic contour field and atmospheric terrain visualization."

# ============================================================
# TYPOGRAPHY
# ============================================================

typography:

  font_stack:
    primary: "Inter, Helvetica Neue, Arial, sans-serif"
    fallback: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"

  display-xl:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "88px"
    fontWeight: 200
    lineHeight: "0.98"
    letterSpacing: "-0.045em"

  display-lg:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "72px"
    fontWeight: 200
    lineHeight: "0.99"
    letterSpacing: "-0.04em"

  display-md:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "56px"
    fontWeight: 200
    lineHeight: "1.02"
    letterSpacing: "-0.035em"

  heading-lg:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "40px"
    fontWeight: 300
    lineHeight: "1.08"
    letterSpacing: "-0.025em"

  heading-md:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 300
    lineHeight: "1.15"
    letterSpacing: "-0.02em"

  body-lg:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 300
    lineHeight: "1.5"
    letterSpacing: "-0.01em"

  body-md:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: "1.5"
    letterSpacing: "0em"

  body-sm:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: "1.5"
    letterSpacing: "0em"

  navigation:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: "1"
    letterSpacing: "-0.01em"

  eyebrow:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1"
    letterSpacing: "0.13em"
    textTransform: "uppercase"

  label:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 300
    lineHeight: "1.3"
    letterSpacing: "0.16em"
    textTransform: "uppercase"

  metric:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "36px"
    fontWeight: 300
    lineHeight: "1"
    letterSpacing: "-0.035em"

# ============================================================
# TYPOGRAPHIC BEHAVIOR
# ============================================================

typography_rules:
  - "Display typography must remain extremely light."
  - "Never use heavy/bold hero headings."
  - "Hero heading should occupy substantial horizontal space."
  - "Use line breaks intentionally rather than wrapping naturally."
  - "Primary heading should visually overlap or sit directly over terrain."
  - "Labels should use generous letter spacing."
  - "Body copy should remain subdued."
  - "Navigation should never visually compete with the hero."

# ============================================================
# SPACING
# ============================================================

spacing:

  base: "8px"

  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  4xl: "96px"
  5xl: "128px"

  page-horizontal:
    desktop: "60px"
    tablet: "40px"
    mobile: "24px"

  hero-top:
    desktop: "124px"
    tablet: "110px"
    mobile: "96px"

  hero-content-gap: "28px"
  navigation-height: "118px"

# ============================================================
# LAYOUT
# ============================================================

layout:

  composition: "Editorial full-bleed"

  contentWidth:
    type: "full-bleed"
    maxWidth: "none"

  contentColumn:
    desktop:
      width: "620px"
      left: "60px"
    tablet:
      width: "70%"
      left: "40px"
    mobile:
      width: "calc(100% - 48px)"
      left: "24px"

  grid:
    columns: "12"
    gutter: "24px"

  hero:
    minHeight: "705px"
    position: "relative"
    overflow: "hidden"

  navigation:
    position: "relative"
    height: "118px"

  statistics:
    position: "absolute"
    bottom: "32px"
    left: "60px"

# ============================================================
# HEADER / NAVIGATION
# ============================================================

navigation:

  height: "118px"

  background:
    color: "#080C08"
    opacity: 0.96

  border:
    bottom: "1px solid rgba(228,233,223,0.055)"

  layout:
    type: "horizontal"
    align: "center"
    justify: "space-between"

  logo:
    text: "Meridian Geo"
    fontSize: "24px"
    fontWeight: 300
    letterSpacing: "-0.025em"
    color: "#DDE3D8"

  links:
    gap: "62px"
    fontSize: "16px"
    fontWeight: 300
    color: "#777C70"

  link_hover:
    color: "#C1C8BB"
    transition: "color 300ms ease"

  active_link:
    color: "#C1C8BB"

  access_button:
    text: "Request Access"
    width: "181px"
    height: "48px"
    background: "#6F9164"
    color: "#0A0E09"
    border: "none"
    borderRadius: "9999px"
    fontSize: "16px"
    fontWeight: 400

  access_button_hover:
    background: "#86A978"
    transform: "translateY(-1px)"

# ============================================================
# HERO
# ============================================================

hero:

  position: "relative"

  background:
    base: "#080C08"

  terrain_layer:
    position: "absolute"
    inset: "0"
    zIndex: 0

  overlay:
    type: "radial + linear"
    background:
      - "radial-gradient(circle at 45% 48%, rgba(45,65,40,0.16), transparent 48%)"
      - "linear-gradient(180deg, rgba(8,12,8,0.22), rgba(8,12,8,0.72))"

  vignette:
    enabled: true
    background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.42) 100%)"

  content:
    position: "relative"
    zIndex: 2
    paddingTop: "4px"

  eyebrow:
    marginBottom: "48px"
    color: "#7A9A6E"

    decorative_line:
      width: "36px"
      height: "1px"
      color: "#7A9A6E"
      marginRight: "18px"

  heading:
    maxWidth: "590px"
    fontSize: "88px"
    fontWeight: 200
    lineHeight: "0.99"
    color: "#E4E9DF"

  heading_accent:
    color: "#86A978"

  description:
    marginTop: "36px"
    maxWidth: "700px"
    fontSize: "20px"
    lineHeight: "1.8"
    fontWeight: 300
    color: "#777C70"

  actions:
    marginTop: "58px"
    display: "flex"
    alignItems: "center"
    gap: "36px"

# ============================================================
# PRIMARY ACTION
# ============================================================

button_primary:

  width: "255px"
  height: "64px"

  background: "rgba(8,12,8,0.82)"
  color: "#E4E9DF"

  border:
    width: "1px"
    color: "rgba(122,154,110,0.10)"

  borderRadius: "17px"

  fontSize: "16px"
  fontWeight: 400

  shadow:
    "0 12px 40px rgba(0,0,0,0.28)"

  hover:
    background: "rgba(18,25,16,0.92)"
    borderColor: "rgba(122,154,110,0.25)"
    transform: "translateY(-1px)"

  transition:
    "background 300ms ease, border-color 300ms ease, transform 300ms ease"

# ============================================================
# SECONDARY ACTION
# ============================================================

button_secondary:

  background: "transparent"
  border: "none"
  color: "#777C70"

  fontSize: "16px"
  fontWeight: 300

  icon:
    type: "arrow-right"
    size: "22px"
    strokeWidth: "1"
    color: "#8B927F"

  hover:
    color: "#B4BBAE"

# ============================================================
# TERRAIN / TOPOGRAPHIC VISUALIZATION
# ============================================================

terrain:

  type: "topographic contour field"

  visual_language:
    - "irregular elevation contours"
    - "organic geological shapes"
    - "thin contour lines"
    - "selectively blurred contours"
    - "soft green atmospheric glow"
    - "large areas of darkness"
    - "no photographic satellite imagery"

  contour_lines:
    color: "rgba(105,139,94,0.22)"
    width: "1px"
    spacing: "12px"
    opacity: 0.75

  highlighted_contours:
    color: "rgba(134,169,120,0.55)"
    width: "2px"
    blur: "3px"

  atmospheric_glow:
    color: "rgba(122,154,110,0.18)"
    blur: "18px"

  density:
    desktop: "moderate"
    mobile: "low"

  placement:
    top: "0"
    right: "0"
    bottom: "0"
    left: "0"

  opacity:
    base: 0.72
    behind_heading: 0.48
    behind_body: 0.58

# ============================================================
# WEBGL / CANVAS TERRAIN
# ============================================================

webgl:

  enabled: true

  canvas:
    position: "absolute"
    inset: "0"
    width: "100%"
    height: "100%"
    zIndex: 0

  rendering:
    alpha: true
    antialias: true
    dpr:
      min: 1
      max: 1.75

  visual:
    type: "procedural topographic contour field"

  generation:
    method: "noise-driven elevation field"

  primitives:
    - "contour lines"
    - "soft glow bands"
    - "low-opacity terrain gradients"

  shader:
    custom: true
    noise:
      type: "simplex / fbm"
      scale: 0.012
      octaves: 4

    contour:
      threshold: "repeating elevation bands"
      thickness: 0.018

    glow:
      enabled: true
      radius: 0.04

  animation:
    type: "slow terrain breathing"
    duration: "4000ms"
    amplitude: 0.012
    easing: "ease-in-out"

  pointer:
    enabled: true
    strength: 0.018
    smoothing: 0.08

  fallback:
    type: "SVG contour map"
    preserveAspectRatio: "xMidYMid slice"

# ============================================================
# SCROLL INDICATOR
# ============================================================

scroll_indicator:

  position:
    bottom: "28px"
    center: true

  label:
    text: "SCROLL"
    fontSize: "11px"
    fontWeight: 300
    letterSpacing: "0.18em"
    color: "#686E62"

  line:
    width: "1px"
    height: "42px"
    color: "rgba(196,201,190,0.18)"

  animation:
    type: "subtle vertical pulse"
    duration: "2000ms"
    easing: "ease-in-out"

# ============================================================
# STATISTICS STRIP
# ============================================================

statistics:

  position: "relative"

  borderTop:
    width: "1px"
    color: "rgba(228,233,223,0.08)"

  paddingTop: "26px"

  layout:
    type: "horizontal"
    gap: "92px"

  metric:

    value:
      fontSize: "36px"
      fontWeight: 300
      color: "#DDE3D8"
      letterSpacing: "-0.04em"

    label:
      marginTop: "16px"
      fontSize: "12px"
      fontWeight: 300
      letterSpacing: "0.16em"
      textTransform: "uppercase"
      color: "#676D61"

# ============================================================
# FLOATING NAVIGATION CONTROL
# ============================================================

floating_control:

  type: "circular navigation control"

  size: "60px"

  position:
    left: "0"
    centerY: true

  background: "rgba(4,7,4,0.92)"

  border:
    width: "1px"
    color: "rgba(228,233,223,0.025)"

  borderRadius: "9999px"

  icon:
    type: "arrow-left"
    size: "28px"
    strokeWidth: "1"
    color: "#E4E9DF"

  shadow:
    "0 8px 28px rgba(0,0,0,0.35)"

# ============================================================
# SURFACES
# ============================================================

surfaces:

  default:
    background: "transparent"
    border: "none"
    borderRadius: "0px"
    shadow: "none"

  subtle:
    background: "rgba(13,18,12,0.55)"
    border: "1px solid rgba(228,233,223,0.06)"
    borderRadius: "12px"

  interactive:
    background: "rgba(13,18,12,0.78)"
    border: "1px solid rgba(122,154,110,0.12)"
    borderRadius: "17px"

  important:
    background: "rgba(13,18,12,0.88)"
    border: "1px solid rgba(122,154,110,0.16)"
    borderRadius: "17px"

# ============================================================
# IMPORTANT SURFACE RULE
# ============================================================

surface_rules:

  - "Do not make every section a card."
  - "Prefer open layouts over boxed layouts."
  - "Use surfaces only when content needs separation."
  - "Hero content should remain directly on the terrain field."
  - "Avoid excessive backdrop-filter blur."
  - "Avoid white glass effects."
  - "Avoid bright borders."

# ============================================================
# BORDERS
# ============================================================

borders:

  hairline:
    width: "1px"
    color: "rgba(228,233,223,0.055)"

  subtle:
    width: "1px"
    color: "rgba(228,233,223,0.08)"

  terrain:
    width: "1px"
    color: "rgba(122,154,110,0.18)"

  strong:
    width: "1px"
    color: "rgba(228,233,223,0.14)"

  rule:
    "Borders should feel almost invisible at first glance."

# ============================================================
# CORNER RADIUS
# ============================================================

rounded:

  none: "0px"
  sm: "8px"
  md: "12px"
  lg: "17px"
  xl: "18px"
  pill: "9999px"

  usage:
    navigation_button: "9999px"
    primary_action: "17px"
    cards: "17px"
    floating_control: "9999px"
    editorial_sections: "0px"

# ============================================================
# SHADOWS
# ============================================================

shadows:

  none:
    value: "none"

  subtle:
    value: "0 8px 28px rgba(0,0,0,0.20)"

  elevated:
    value: "0 20px 60px rgba(0,0,0,0.38)"

  terrain_glow:
    value: "0 0 30px rgba(122,154,110,0.08)"

  rule:
    "Shadows should support darkness rather than create visible floating cards."

# ============================================================
# ICONOGRAPHY
# ============================================================

icons:

  family: "Solar Linear"

  stroke:
    default: "1px"

  color:
    default: "#8E9588"
    active: "#DCE2D8"
    accent: "#7A9A6E"

  style:
    - "linear"
    - "minimal"
    - "geometric"

  avoid:
    - "filled icons"
    - "thick strokes"
    - "oversized decorative icons"

# ============================================================
# BUTTONS
# ============================================================

buttons:

  primary:
    height: "64px"
    horizontalPadding: "40px"
    borderRadius: "17px"
    background: "rgba(8,12,8,0.82)"
    color: "#E4E9DF"
    border: "1px solid rgba(122,154,110,0.10)"

  secondary:
    height: "48px"
    horizontalPadding: "0px"
    borderRadius: "0px"
    background: "transparent"
    color: "#777C70"
    border: "none"

  access:
    height: "48px"
    horizontalPadding: "30px"
    borderRadius: "9999px"
    background: "#6F9164"
    color: "#0A0E09"

# ============================================================
# MOTION
# ============================================================

motion:

  level: "subtle"

  durations:
    instant: "100ms"
    fast: "150ms"
    standard: "300ms"
    slow: "500ms"
    terrain: "4000ms"

  easings:
    standard: "ease"
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)"
    entrance: "cubic-bezier(0.22, 1, 0.36, 1)"

  hover:
    - "color transition"
    - "small opacity change"
    - "1px vertical translation"
    - "subtle glow"

  page:
    - "slow terrain movement"
    - "gentle hero text reveal"
    - "subtle scroll indicator motion"

  avoid:
    - "large scale animations"
    - "bouncy transitions"
    - "fast particle movement"
    - "excessive parallax"
    - "dramatic card transformations"

# ============================================================
# RESPONSIVE DESIGN
# ============================================================

responsive:

  desktop:
    breakpoint: ">= 1200px"
    heroHeading: "88px"
    pagePadding: "60px"
    navigationLinks: "visible"
    terrainDensity: "moderate"

  laptop:
    breakpoint: "900px - 1199px"
    heroHeading: "72px"
    pagePadding: "48px"
    navigationLinks: "visible"
    terrainDensity: "moderate"

  tablet:
    breakpoint: "600px - 899px"
    heroHeading: "58px"
    pagePadding: "40px"
    navigationLinks: "reduced"
    terrainDensity: "low"

  mobile:
    breakpoint: "< 600px"
    heroHeading: "46px"
    heroLineHeight: "1.0"
    pagePadding: "24px"
    navigationLinks: "hidden"
    terrainDensity: "low"
    navigationHeight: "88px"
    descriptionSize: "17px"

# ============================================================
# HERO RESPONSIVE RULES
# ============================================================

mobile_hero:

  heading:
    maxWidth: "100%"
    fontWeight: 200

  description:
    maxWidth: "92%"
    lineHeight: "1.6"

  actions:
    direction: "column"
    alignItems: "flex-start"
    gap: "22px"

  statistics:
    direction: "grid"
    columns: "2"

# ============================================================
# ACCESSIBILITY
# ============================================================

accessibility:

  minimum_text_contrast: "WCAG AA where practical"

  focus:
    outline: "1px solid #7A9A6E"
    outlineOffset: "4px"

  reduced_motion:
    terrain_animation: "disabled"
    scroll_animation: "disabled"
    transitions: "minimal"

  interactive_targets:
    minimumSize: "44px"

# ============================================================
# BACKGROUND COMPOSITION
# ============================================================

background_composition:

  layer_01:
    name: "base"
    value: "#080C08"

  layer_02:
    name: "terrain contours"
    opacity: 0.72

  layer_03:
    name: "terrain glow"
    opacity: 0.18

  layer_04:
    name: "hero readability overlay"
    opacity: 0.38

  layer_05:
    name: "vignette"
    opacity: 0.42

  visual_priority:
    1: "hero typography"
    2: "terrain field"
    3: "navigation"
    4: "actions"
    5: "statistics"

# ============================================================
# VISUAL HIERARCHY
# ============================================================

hierarchy:

  level_01:
    element: "Hero heading"
    treatment: "88px ultra-light warm white"

  level_02:
    element: "Accent heading line"
    treatment: "same scale, muted terrain green"

  level_03:
    element: "Hero description"
    treatment: "20px muted gray-green"

  level_04:
    element: "Primary action"
    treatment: "dark rounded rectangle"

  level_05:
    element: "Navigation"
    treatment: "small muted text"

  level_06:
    element: "Metadata"
    treatment: "small uppercase labels"

# ============================================================
# DO'S
# ============================================================

do:
  - "Use near-black green as the dominant visual field."
  - "Use muted olive green rather than saturated green."
  - "Use very thin typography."
  - "Make the hero heading extremely large."
  - "Use terrain contours as a visual texture."
  - "Allow contours to pass behind text."
  - "Use soft blur selectively on major terrain ridges."
  - "Maintain generous negative space."
  - "Use thin horizontal rules."
  - "Keep buttons understated."
  - "Use warm beige only for secondary emphasis."
  - "Keep navigation sparse."
  - "Use subtle motion."
  - "Make the terrain feel atmospheric rather than like a conventional map."

# ============================================================
# DON'TS
# ============================================================

dont:
  - "Do not use bright neon green."
  - "Do not use pure white backgrounds."
  - "Do not use heavy font weights."
  - "Do not turn every section into a card."
  - "Do not use excessive glassmorphism."
  - "Do not use large shadows everywhere."
  - "Do not use colorful gradients."
  - "Do not use purple, blue, orange, or red as decorative colors."
  - "Do not use oversized rounded pills except for the access button."
  - "Do not use dense dashboard grids in the hero."
  - "Do not make the terrain overly bright."
  - "Do not use fast-moving particles."
  - "Do not use generic SaaS illustrations."
  - "Do not introduce unrelated UI patterns."

# ============================================================
# REFERENCE COMPOSITION
# ============================================================

reference_composition:

  viewport:
    referenceWidth: "1236px"
    referenceHeight: "836px"

  header:
    height: "118px"

  hero:
    beginsAt: "118px"
    visibleHeight: "587px"

  logo:
    x: "60px"
    y: "59px"

  navigation:
    centeredVertically: true

  accessButton:
    rightOffset: "66px"
    width: "181px"
    height: "48px"

  heroContent:
    leftOffset: "60px"

  eyebrow:
    topOffset: "124px"

  heading:
    topOffset: "190px"
    approximateWidth: "570px"

  description:
    topOffset: "405px"
    approximateWidth: "700px"

  primaryAction:
    topOffset: "565px"

  secondaryAction:
    positionedBesidePrimary: true

  scroll:
    centeredHorizontally: true
    bottomOffset: "126px"

  metrics:
    leftOffset: "60px"
    bottomOffset: "30px"

# ============================================================
# COMPONENT PHILOSOPHY
# ============================================================

component_philosophy:

  navigation:
    "Minimal editorial navigation with one strong access action."

  hero:
    "Typography-first composition over a living terrain field."

  cards:
    "Use only when information requires containment."

  metrics:
    "Present as open statistical typography rather than dashboard cards."

  controls:
    "Small, linear, quiet, and functional."

  backgrounds:
    "Backgrounds should provide atmosphere, not decoration."

# ============================================================
# IMPLEMENTATION NOTES
# ============================================================

implementation:

  recommendedStack:
    frontend: "React / Next.js"
    styling: "Tailwind CSS or CSS Modules"
    visualization: "WebGL / Three.js / custom Canvas"
    icons: "Solar Linear"

  css:
    preferred:
      - "CSS gradients"
      - "mix-blend-mode"
      - "filter: blur()"
      - "backdrop-filter only where necessary"
      - "CSS variables for all design tokens"

  terrain:
    preferred:
      - "WebGL shader"
      - "SVG fallback"
      - "Canvas fallback"

  performance:
    - "Clamp device pixel ratio."
    - "Pause animation when hero is not visible."
    - "Reduce contour density on mobile."
    - "Use reduced-motion media queries."
    - "Avoid unnecessary DOM-based contour lines."

# ============================================================
# DESIGN TOKENS
# ============================================================

tokens:

  "--mg-bg": "#080C08"
  "--mg-bg-deep": "#060906"
  "--mg-surface": "#0D120C"

  "--mg-green": "#7A9A6E"
  "--mg-green-light": "#86A978"
  "--mg-green-dark": "#536D4B"

  "--mg-warm": "#C1B99D"

  "--mg-text": "#E4E9DF"
  "--mg-text-secondary": "#B0B5A8"
  "--mg-text-muted": "#777C70"
  "--mg-text-faint": "#565C51"

  "--mg-border": "rgba(228,233,223,0.08)"
  "--mg-border-green": "rgba(122,154,110,0.18)"

  "--mg-radius-control": "9999px"
  "--mg-radius-card": "17px"

  "--mg-page-padding": "60px"
  "--mg-grid-gap": "24px"

  "--mg-transition": "300ms ease"
  "--mg-terrain-transition": "4000ms ease-in-out"

---