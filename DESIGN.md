# Design System — DemonZeno Trading Academy & DMNZ Token

## Direction
Premium, dark-only trading education platform with anime-inspired character design. Dark charcoal (0.145 0.01 260) foundation for focus. Teal (0.65 0.15 190) drives primary actions. Gold (0.7 0.18 70) celebrates achievement. Minimal animations: smooth expand/collapse, gentle hover scales, fade-in-up entrance effects only.

## Tone
Educational excellence + anime character authenticity. Master trading zero→expert across 5 locked tiers. Certificates are **hard-earned awards** (30/30 required, 9-char unique ID). Full Fair Launch messaging. Clear, readable, professional. All DemonZeno slogans woven throughout.

## Palette (OKLCH, Dark Mode)

| Token               | OKLCH           | Usage                         |
|---------------------|-----------------|-------------------------------|
| primary/teal        | 0.65 0.15 190   | CTAs, progress, active states |
| certificate-gold    | 0.7 0.18 70     | Certificates, awards, badges  |
| chart-3/mint        | 0.7 0.18 145    | Success indicators            |
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

| Zone                | Background      | Notes                              |
|---------------------|-----------------|-------------------------------------|
| Header              | card            | Sticky nav to Academy/Certs/Token  |
| Hero                | bg + sky-blue   | DemonZeno character, intro         |
| Academy             | background      | 5 tier cards, expandable lessons   |
| Lesson Cards        | card + teal     | Smooth expand/collapse, readable   |
| Quiz Interface      | card            | 30 MCQ, 45s countdown, mobile opt. |
| Difficulty Badges   | semantic colors | Beginner/Intermediate/Advanced/etc |
| Certificate         | card + gold     | Premium, 9-char ID, QR, watermark |
| Glossary            | background      | Searchable terms, linked from text |
| Zeno AI Widget      | primary         | Bottom-right chat, minimal design  |
| Progress Tracking   | card            | Tier bar, stats, completion %      |
| Certificate Wall    | background      | Grid, searchable by ID             |
| Admin Dashboard     | card            | Session-local unlock, globals      |
| Footer              | card            | Links, admin hint                  |

## Components

**Lesson Card**: Dark card, teal left-border-4, smooth expand/collapse (0.4s), glassmorphism on hover, shadow-elevated.

**Quiz Interface**: 30 randomized questions, one per screen, 45s countdown timer (urgent red if <10s), large tap targets (py-4 md:py-5), progress bar top.

**Difficulty Badges**: Semantic colors per tier — mint for Beginner, gold for Intermediate, teal for Advanced, red for Expert, gold+glow for Master.

**Glossary**: Search input, grid of term cards, clickable modal. Term name in teal, definition in muted, example in teal/10%.

**Certificate**: Gold border, gold glow shadow, 9-char ID in mono, QR code, info rows, download + share buttons.

**Progress Bar**: Teal-to-mint gradient, tracks scroll position (fixed top) and tier completion (inline).

**Zeno AI Widget**: Fixed bottom-right, teal circle button, slide-up panel, user messages in teal, AI responses in muted.

## Motion
- **Entrance**: Fade-in-up (0.6s ease-out) on scroll, staggered
- **Hover**: Scale 1.02, shadow-elevated, smooth (0.3s)
- **Lesson expand**: Max-height (0.4s cubic-bezier)
- **Quiz slide**: Fade-out → fade-in (0.6s)
- **Certificate unlock**: Confetti burst (0.8s)
- **Loading**: Skeleton pulse (2s infinite)

## Constraints
- Dark mode only — no light mode in this phase
- Token-only colors — no raw hex/rgb
- Mobile-first responsive: sm/md/lg breakpoints
- Single-page smooth scroll, no page reloads
- Minimal animations: only smooth transitions, no auto-play
- Education first: clarity over decoration

## Signature Details
1. **Open Academy**: No gatekeeping. 5 tiers fully readable.
2. **Hard-Earned Certs**: 30/30 pass. 9-char unique ID. Gold + watermark.
3. **Global Backend**: Stored globally. Searchable public wall.
4. **Glassmorphism**: Soft cards, blur/saturate on hover.
5. **Admin Unlock**: DemonZeno image 5+ clicks + passcode → session-local access.
6. **Progress Indicator**: Fixed top teal-to-mint bar tracks scroll %.
7. **Zeno AI**: Lightweight chat widget, bottom-right corner.

## Roadmap Tokens (DMNZ)
| Milestone      | OKLCH/Role                    |
|----------------|-------------------------------|
| 2026 Community | Teal badge, community focus  |
| 2 Apr 2027     | Gold badge, DMNZ launch Blum |
| 1 Jan 2028     | Red accent, burn + curve      |
