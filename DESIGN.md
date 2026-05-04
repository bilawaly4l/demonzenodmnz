# Design System — DemonZeno Trading Academy & DMNZ Token

## Direction
Premium, dark-only trading education platform with anime-inspired character design. Dark charcoal (0.145 0.01 260) foundation for focus. Teal (0.65 0.15 190) drives primary actions. Gold (0.7 0.18 70) celebrates achievement. Mint (0.7 0.18 145) indicates success. Minimal animations: smooth expand/collapse, gentle hover scales, fade-in-up entrance effects only. Real DemonZeno character image (green jacket) used throughout with ImagineArt watermark cropped.

## Tone
Educational excellence + anime character authenticity. Master trading zero→expert across 5 locked tiers. Certificates are **hard-earned awards** (30/30 required, 9-char unique ID). Full Fair Launch messaging. Clear, readable, professional. All DemonZeno slogans woven throughout. New premium pages: Hall of Champions, Top 5 Traders Wall, Referral Wall.

## Palette (OKLCH, Dark Mode)

| Token               | OKLCH           | Usage                         |
|---------------------|-----------------|-------------------------------|
| primary/teal        | 0.65 0.15 190   | CTAs, progress, active states |
| certificate-gold    | 0.7 0.18 70     | Certificates, awards, badges  |
| chart-3/mint        | 0.7 0.18 145    | Success, achievement badges   |
| sky-blue            | 0.58 0.16 258   | Atmospheric accents           |
| destructive/red     | 0.55 0.22 25    | Warnings, failures            |
| background          | 0.145 0.01 260  | Primary surface               |
| card                | 0.18 0.01 260   | Elevated cards                |
| foreground          | 0.95 0.005 260  | Text (AA+ contrast)           |
| muted               | 0.25 0.02 260   | Secondary text                |
| border              | 0.28 0.01 260   | Dividers, borders             |

## Typography
- **Display**: Space Grotesk, h1 `text-6xl md:text-7xl font-bold`, h2 `text-4xl font-bold`
- **Body**: DM Sans, `text-base` body, `text-sm` annotations, `text-xs` labels
- **Mono**: JetBrains Mono, IDs, counters, code snippets

## Structural Zones

| Zone                | Background      | Notes                                      |
|---------------------|-----------------|--------------------------------------------|
| Header              | card            | Sticky nav to Academy/Certs/Token/Traders  |
| Hero                | bg + sky-blue   | DemonZeno character (cropped watermark)    |
| Academy             | background      | 5 tier cards, expandable lessons            |
| Lesson Cards        | card + teal     | Smooth expand/collapse, readable           |
| Quick Review        | card + mint     | 5-min recap with existing card structure   |
| Ask the Chart       | card + primary  | Pattern drill with existing difficulty     |
| Quiz Interface      | card            | 30 MCQ, 45s countdown, mobile opt.         |
| Difficulty Badges   | semantic colors | Beginner/Intermediate/Advanced/Expert/Master |
| Certificate         | card + gold     | Premium, 9-char ID, QR, watermark          |
| Glossary Quiz       | background      | Glossary + quiz hybrid, searchable         |
| Zeno AI Widget      | primary         | Bottom-right chat, minimal design          |
| Progress Tracking   | card            | Tier bar, stats, completion %              |
| Certificate Wall    | background      | Grid, searchable by ID, leaderboard        |
| Hall of Champions   | card + mint     | 5-tier holders, gold badges                |
| Top 5 Traders       | card + primary  | Profile cards with achievement badges      |
| Referral Wall       | card + teal     | Community referrer display                 |
| DMNZ Infographic    | gradient        | Fair launch animation, mint-to-teal        |
| Why DMNZ            | background      | Punchy CTA section                         |
| Price Tracker       | card            | Launch Pending placeholder                 |
| Admin Dashboard     | card            | Session-local unlock, globals              |
| Footer              | card            | Links, admin hint                          |
| Language Toggle     | primary         | Urdu + English in Academy only             |

## Components

**Lesson Card**: Dark card, teal left-border-4, smooth expand/collapse (0.4s), glassmorphism on hover, shadow-elevated.

**Quick Review**: Mint accent, compact summary, existing lesson card structure, readable in 5 minutes.

**Ask the Chart**: Primary accent, SVG chart display, pattern recognition drill, existing difficulty badges.

**Glossary Quiz**: Search input grid, term cards linked from lessons, quiz mode with MCQ pairs.

**Hall of Champions**: Luxury tier showcase, mint badge border-glow, 5-tier certificate filters, achievement dates.

**Top 5 Traders**: Profile cards (Waqar Zaka, Jesse Livermore, Paul Tudor Jones, George Soros, Stanley Druckenmiller), teal hover, gold badges for wins.

**Referral Wall**: Referrer cards, teal accents, count indicators, shareable links.

**DMNZ Infographic**: Animated fair-launch visual, mint-to-teal gradient background, 2027 milestones, smooth transitions.

**Price Tracker**: "Launch Pending" placeholder, primary teal button for Blum app link, countdown timer.

**Quiz Interface**: 30 randomized questions, one per screen, 45s countdown timer (urgent red if <10s), large tap targets (py-4 md:py-5), progress bar top.

**Progress Bar**: Teal-to-mint gradient, tracks scroll position (fixed top) and tier completion (inline).

**Zeno AI Widget**: Fixed bottom-right, teal circle button, slide-up panel, user messages in teal, AI responses in muted.

## Motion
- **Entrance**: Fade-in-up (0.6s ease-out) on scroll, staggered
- **Hover**: Scale 1.02, shadow-elevated, smooth (0.3s)
- **Lesson expand**: Max-height (0.4s cubic-bezier)
- **Quiz slide**: Fade-out → fade-in (0.6s)
- **Certificate unlock**: Confetti burst (0.8s)
- **Infographic animate**: Gentle scale-up + opacity (1.2s)
- **Loading**: Skeleton pulse (2s infinite)

## Constraints
- Dark mode only — no light mode
- Token-only colors — no raw hex/rgb
- Mobile-first responsive: sm/md/lg breakpoints
- Single-page smooth scroll, no page reloads
- Minimal animations: only smooth transitions, no auto-play
- Education first: clarity over decoration
- Real DemonZeno image used throughout (green jacket, watermark cropped)

## Signature Details
1. **Open Academy**: No gatekeeping. 5 tiers fully readable. Urdu language toggle.
2. **Hard-Earned Certs**: 30/30 pass. 9-char unique ID. Gold + watermark.
3. **Global Backend**: Stored globally. Searchable public wall + Hall of Champions.
4. **Top 5 Traders**: Waqar Zaka + 4 global legends with detailed profiles.
5. **Referral System**: Shareable links, community engagement tracker.
6. **Glassmorphism**: Soft cards, blur/saturate on hover.
7. **Admin Unlock**: DemonZeno image 5+ clicks + passcode → session-local access.
8. **Progress Indicator**: Fixed top teal-to-mint bar tracks scroll %.
9. **Zeno AI**: Lightweight chat widget, bottom-right corner, trading Q&A only.
10. **DMNZ Fair Launch**: Clear "Full Fair Launch" messaging, animated infographic, price tracker placeholder.

## Roadmap Tokens (DMNZ)
| Milestone      | OKLCH/Role                    |
|----------------|-------------------------------|
| 2026 Community | Teal badge, community focus  |
| 2 Apr 2027     | Gold badge, DMNZ launch Blum |
| 1 Jan 2028     | Red accent, burn + curve      |

## New Features (30+)
- Hall of Champions page (5-tier showcase)
- Top 5 Traders Wall (Waqar Zaka + 4 legends)
- Referral Wall (community tracking)
- Animated DMNZ infographic (fair launch)
- Why DMNZ section (CTA)
- Price tracker placeholder (Launch Pending)
- Urdu language toggle (Academy only)
- Quick Review mode (5-min recap)
- Ask the Chart drill (pattern recognition)
- Glossary quiz mode (term tests)
- Trader Mindset module (dedicated lessons)
- And 19+ other premium enhancements
