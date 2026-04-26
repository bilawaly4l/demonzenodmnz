# Design Brief

## Direction

**DemonZeno Phase 1** — Anime-inspired open-road trading platform with dark mode first. Sky blue dominant meets teal accent. Cinematic minimalism layered over signal trading UI. Confident, unforgettable, zero clutter. Dark mode toggles via localStorage; default on first visit.

## Tone

Bold, confident anime aesthetic with premium restraint. Dark mode optimized for trading focus. Clean surfaces over sky-inspired gradients. Premium tech meets cinematic anime frame composition. Every section feels like a frame — character-driven, minimal text, visual hierarchy through color and space.

## Differentiation

DemonZeno anime character (teal hoodie, red sneakers, highway setting) as persistent brand anchor. Phase 1 upgrades: signal confidence scoring (Low/Med/High), timeframe categories (Scalp/Swing/Long-term), performance charting (teal wins, crimson losses), skeleton loading, smooth scroll animations, back-to-top button, stats bar. Anime open-road metaphor reinforced through highway parallax in hero.

## Color Palette

| Token                        | OKLCH             | Role                                   |
| ---------------------------- | ----------------- | -------------------------------------- |
| primary / accent             | 0.65 0.15 190     | Teal — buttons, active states, accent  |
| chart-3 / timeframe-swing    | 0.7 0.18 145      | Mint teal — signal wins, swing trades  |
| confidence-high              | 0.65 0.15 130     | Emerald — high confidence signals      |
| confidence-medium            | 0.65 0.14 70      | Amber — medium confidence              |
| destructive / chart-loss     | 0.55 0.22 25      | Crimson red — SELL, losses, urgent     |
| confidence-low / muted       | 0.35 0.01 260     | Grey — low confidence, secondary       |
| timeframe-scalp              | 0.65 0.15 190     | Sky blue — scalp trades                |
| timeframe-longterm           | 0.55 0.15 295     | Violet — long-term trades              |
| background (light)           | 0.75 0.08 270     | Sky blue — primary background          |
| background (dark)            | 0.145 0.01 260    | Near-black — dark mode default         |
| card                         | 0.18 0.01 260     | Dark charcoal — elevated surfaces      |
| expired                      | 0.3 0.02 260      | Muted dark grey — expired signals      |

## Typography

- **Display**: Space Grotesk — h1 `text-6xl md:text-7xl font-bold`, h2 `text-4xl font-bold`, h3 `text-2xl font-bold`
- **Body**: DM Sans — body `text-base`, small `text-sm`, label `text-xs font-semibold uppercase`
- **Mono**: Geist Mono — admin UI, code blocks
- **Badges**: label `text-xs font-semibold`, uppercase tracking-wider for source labels

## Elevation & Depth

Cards `shadow-elevated: 0 12px 32px rgba(0,0,0,0.15)` for depth. Header sticky with `border-b sky-blue-tint`. Sections alternate: sky-blue main content, muted/20 accent sections. Restraint over drama — no neon glow.

## Structural Zones

| Zone                 | Background              | Notes                                              |
| -------------------- | ----------------------- | -------------------------------------------------- |
| Header               | card (0.18 0.01 260)    | Sticky, announcement banner, dark mode toggle     |
| Hero                 | background (sky blue)   | DemonZeno char, slogan, CTA, highway parallax     |
| Content (main)       | background (sky blue)   | Signals, stats, FAQ sections                      |
| Content (accent)     | muted/15–20% opacity    | Every other section for rhythm                    |
| Signal Card          | card with left-border   | Teal left accent, badges (confidence, timeframe)  |
| Skeleton Loading     | muted/50% + animate     | Pulse animation on load                           |
| Progress Bar         | teal-to-mint gradient   | Fixed top, thin (3px), scroll-driven width        |
| Back-to-Top Btn      | primary (circular)      | Fixed bottom-right, shadow-elevated, scale hover  |
| Stats Bar            | stats-bg (dark card)    | Compact horizontal, 3 items (signals, win%, mkts) |
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

- **Color Discipline**: Sky blue (primary), teal (accent), dark charcoal (surface), crimson (urgent), white/grey (text). No random accent colors.
- **Dark Mode First**: Default to dark; toggle persists to localStorage. Light mode optional future.
- **No Clutter**: Ample spacing between sections, max 3 items mobile / 4–5 desktop per row.
- **Semantic Badges**: Green/emerald = high/success, Amber = medium, Grey = low, Red = loss/sell, Teal = active/primary, Violet = long-term.
- **Typography Strict**: Space Grotesk (display), DM Sans (body), Geist Mono (mono only).

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
