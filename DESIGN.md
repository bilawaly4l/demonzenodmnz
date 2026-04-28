# Design Brief

## Direction

**DemonZeno Phase 6** — Cinematic anime open-road single-page trading platform. Dark charcoal foundation (near-black surfaces) anchors premium restraint. Sky blue breathes atmosphere into hero and key accents. Teal/mint cuts through as action color. Crimson signals urgency and loss. Zero clutter. Dark mode always active. Every interaction feels like a frame from an anime movie.

## Tone

Bold anime cinematography meets trading-focused UX. Dark mode optimized for focus and premium presence. DemonZeno character as persistent anchor — anime boy, teal hoodie, white shirt, red sneakers on highway. Sky blue + teal create depth; crimson interrupts with urgency. Silent, confident, unforgettable.

## Differentiation

DemonZeno anime character (teal hoodie, red sneakers, highway) as visual anchor. Unified AI unlock via passcode. Strict anime open-road aesthetic: sky blue for atmospheric hero/depth, teal for action/active states, dark charcoal for premium surfaces, crimson for urgency/losses. Parallax highway in hero, smooth signal cards with confidence/timeframe badges, skeleton loading, scroll progress bar, cinematic transitions. Every section feels designed, nothing generic.

## Color Palette (OKLCH)

| Token                        | OKLCH             | Role                                   |
| ---------------------------- | ----------------- | -------------------------------------- |
| sky-blue (dark mode)         | 0.58 0.16 258     | Atmospheric hero, accent depth         |
| sky-blue-light (light mode)  | 0.75 0.12 265     | Hero background, transitions           |
| primary / accent / teal      | 0.65 0.15 190     | CTA, active states, signal entry point |
| chart-3 / mint-teal          | 0.7 0.18 145      | Signal wins, swing trades (positive)   |
| confidence-high              | 0.65 0.15 130     | Emerald — high confidence              |
| confidence-medium            | 0.65 0.14 70      | Amber — medium confidence              |
| destructive / crimson        | 0.55 0.22 25      | SELL signals, losses, urgency          |
| confidence-low               | 0.35 0.01 260     | Grey — low confidence, muted           |
| timeframe-scalp              | 0.65 0.15 190     | Sky-teal — scalp/quick trades          |
| timeframe-longterm           | 0.55 0.15 295     | Violet — long-term positions           |
| background (dark)            | 0.145 0.01 260    | Near-black charcoal — dark mode only   |
| card                         | 0.18 0.01 260     | Dark charcoal — elevated card surfaces |
| expired                      | 0.3 0.02 260      | Muted grey — expired/inactive          |

## Typography

- **Display**: Space Grotesk — h1 `text-6xl md:text-7xl font-bold`, h2 `text-4xl font-bold`, h3 `text-2xl font-bold`. Anime confidence in letterforms.
- **Body**: DM Sans — `text-base` body, `text-sm` small, `text-xs font-semibold uppercase` labels. Clean, readable, premium restraint.
- **Mono**: JetBrains Mono — admin UI, code blocks, signal entry/exit values. Technical precision.
- **Signal Cards**: Labels `text-xs font-semibold`, uppercase tracking-wider (source/timeframe badges)

## Elevation & Depth

Dark charcoal layers create depth. Cards use `shadow-elevated: 0 12px 32px rgba(0,0,0,0.15)` for premium separation. Hero breathes with sky-blue atmospheric tint. Sticky header on dark-charcoal with `border-b sky-blue` for navigation anchor. Sections alternate: main content (dark-charcoal), accent sections (`muted/20` darker grey). No neon glow — refined shadows only.

## Structural Zones

| Zone                 | Background              | Notes                                              |
| -------------------- | ----------------------- | -------------------------------------------------- |
| Header               | card (0.18 0.01 260)    | Sticky, dark charcoal, sky-blue border accent     |
| Hero                 | sky-blue gradient        | DemonZeno char, slogan, highway parallax          |
| Content (main)       | background (0.145)      | Dark charcoal, signals, FAQ, sections             |
| Content (accent)     | card (0.18)             | Slightly elevated alternate sections for rhythm   |
| Signal Card          | card with left-border   | Teal left accent, confidence/timeframe badges     |
| Chat Interface       | card + input footer     | User bubbles teal, AI bubbles dark charcoal       |
| Skeleton Loading     | muted/50% + pulse       | Pulse animation on all loading states             |
| Progress Bar         | teal-to-mint gradient   | Fixed top, thin (3px), scroll-driven width        |
| Back-to-Top Btn      | primary teal            | Fixed bottom-right, shadow-elevated, scale hover  |
| Footer               | card (0.18 0.01 260)    | Dark base, sky-blue top border                    |

## Component Patterns

- **Confidence Badge**: Low=grey/muted, Medium=amber, High=emerald; text opacity 0.2 bg, full opacity text
- **Timeframe Badge**: Scalp=sky-blue, Swing=teal, Long-term=violet; consistent opacity and sizing
- **Signal Card**: Dark card, teal left-border, result badge (WIN=teal, LOSS=red), confidence + timeframe pills, source label (subtle grey, uppercase, tracking-wide)
- **Expired Signal**: Muted dark bg, line-through text, crossed-out opacity look
- **Stats Item**: Value (teal accent, bold 2xl/3xl), Label (uppercase grey, xs/sm)
- **Skeleton**: muted/50% bg, rounded corners, pulse animation on every placeholder line

## Motion & Animation

- **Entrance**: Section fade-in-up (0.6s ease-out) on viewport entry, staggered per element
- **Scroll**: Progress bar tracks scroll position via fixed gradient bar
- **Loading**: Skeleton pulse (2s ease-in-out infinite) on all loading states
- **Hover**: Button scale 110%, shadow elevation, color shift
- **Decorative**: Highway parallax in hero (subtle, subtle road centerline beneath character)

## Constraints

- **Anime Aesthetic**: Sky blue for atmosphere, teal for action, dark charcoal for surfaces, crimson for urgency. No random accent colors.
- **Dark Mode Only**: Premium dark-charcoal foundation throughout. No light mode in this phase.
- **Zero Clutter**: Ample spacing between sections, max 3 items mobile / 4–5 desktop per row.
- **Semantic Color**: Emerald=high/success, Amber=medium, Grey=low, Crimson=loss/urgency, Teal=active/primary.
- **Font Discipline**: Space Grotesk (display bold), DM Sans (body), JetBrains Mono (admin/code).
- **Single-Page App**: No multi-page routing. Smooth section scrolling with progress indicator.
- **Token Compliance**: All colors via CSS variables. No raw hex, rgb(), or arbitrary Tailwind classes.

## Signature Details

**Highway parallax in hero**: Animated road centerline beneath DemonZeno character. Subtle, cinematic, reinforces open-road brand metaphor. **Scroll progress bar**: Thin teal-to-mint gradient fixed at top, driven by scroll position. **Back-to-top button**: Floating circular sky-blue button, shadow-elevated, scales on hover, smooth scroll behavior. **Skeleton pulse**: All loading states use consistent muted-grey animated skeleton with pulse keyframe.

## AI Chat Interface

**Page Structure**: Full-height chat layout with sticky header (DemonZeno avatar, mode badge, provider dropdown, clear/logout buttons), scrollable message area (user messages right-aligned teal bubbles, AI messages left-aligned dark cards with teal left-border), fixed input footer.

**Chat Tokens**: User bubbles use primary teal (0.65 0.15 190), AI bubbles dark charcoal (0.22 0.01 260) with teal left-border accent. Mode badges: Normal = teal/subtle, Insane = crimson/pulsing-glow animation. Typing indicator = three-dot bounce animation (0–10px travel, 1.4s cycle).

**Password Entry**: Centered dark card, DemonZeno character visible, input focuses to teal ring, error state crimson text. Session-based SHA-256 validation on backend.

**Mobile Optimization**: Collapsible header on mobile (<768px), full-screen chat, larger input hit targets (48px minimum), responsive message bubbles (max-w-xs), touch-friendly button spacing.

## Premium Sections (Phase 4)

| Section                | Component Structure                                                | Key Tokens                                          |
|------------------------|----------------------------------------------------------------|-----------------------------------------------------|
| Roadmap (2026–2028)    | 3 milestone cards, teal connector line, year badges, icons     | primary (0.65 0.15 190), milestone-indicator        |
| Token Burn Tracker     | Circular progress ring, animated counter, particle effects     | burn-progress-start/end (teal→crimson), animation   |
| Community Counter      | Dual stat blocks (Binance + Twitter), upward arrows, growth    | primary, chart-3 (mint for growth)                  |
| BLUM Mini App Preview  | Animated phone mockup, Telegram header, sample UI inside       | card (0.18 0.01 260), phone-float animation        |
| 2027 DMNZ Countdown    | Hero-scale timer (d/h/m/s), large bold numerals, urgency bar   | countdown-accent/urgency tokens                     |
| Binance Square Feed    | Card grid (3 max), title/snippet/link/timestamp, teal borders  | card, primary accent left-border                    |
| Signal Archive         | Search bar, multi-filter (confidence/result/date/market)       | filter-active, archive-card-win/loss               |

## Animation Suite (Premium Sections)

- **Burn Particle**: 0.8s ease-out particles float upward + fade (celebration effect)
- **Counter Grow**: 0.6s ease-out scale + fade-in for number updates
- **Countdown Pulse**: 1.5s ease-in-out urgency pulse on background
- **Milestone Line**: Gradient connector (teal→transparent) spanning milestone cards

## Phase 5 Cinematic Enhancements

| Animation                      | Timing            | Role                                            |
|--------------------------------|-------------------|-------------------------------------------------|
| Loading Screen                 | 1.2s fade-in-char + progress bar | Cinematic entry, character reveal with progress |
| Parallax Scroll                | 8s linear loop    | Highway road centerline under hero              |
| Page Wipe Transition           | 0.6s teal overlay | Scene-to-scene cinematic transition            |
| Confetti Burst                 | 0.8s ease-out    | Celebration on signal export/achievement       |
| Skeleton Shimmer               | 2s ease-in-out   | Enhanced pulse for loading placeholders         |
| Section Fade-In                | 0.8s ease-out    | Staggered entrance for new sections             |
| Testimonial Slide-Up           | 0.8s staggered   | Cascade animation for community wall           |
| Button Micro-Press             | 0.15s cubic-bezier | Press-release scale feedback (0.95x / 1.02x)  |
| Price Card Number Transition   | 0.6s cubic-bezier | Smooth animated number updates in Sentiment    |
| Custom Anime Cursor            | Instant           | Purple arrow-style cursor hint for interactivity |

## New Sections (Phase 5)

- **Philosophy Page**: DemonZeno manifesto cinematic quote with parallax hero
- **Psychology Section**: Trading mindset tips with card-based layout
- **Token Utility Deep-Dive**: DMNZ tokenomics, burn mechanics, bonding curve animation
- **Community Testimonials**: Admin-curated wins wall with staggered slide-up entrance

## Structural Zones Updated

| Zone                 | Background              | Animation                      | Notes                                           |
| -------------------- | ----------------------- | ------------------------------ | ----------------------------------------------- |
| Loading Screen       | primary→background grad | fadeInCharacter + progress bar | Cinematic entry overlay, exits after build prep |
| Hero (Parallax)      | background (sky blue)   | parallaxScroll 8s loop         | Road centerline moves beneath character         |
| Page Transitions     | overlay (primary teal)  | pageWipeRight 0.6s            | Wipe effect between route changes               |
| New Sections         | alternating muted/bg    | sectionFadeIn 0.8s staggered  | Philosophy, Psychology, Token, Community       |
| Testimonial Cards    | card (0.18 0.01 260)    | testimonialSlideUp staggered   | Each card delays 0.1s (cascade effect)          |
| Button States        | primary / hover         | btn-micro scale 0.95/1.02     | Touch-responsive press feedback                 |
| Price Cards          | card + border           | price-card-number 0.6s        | Number updates smooth-transition in Sentiment   |
