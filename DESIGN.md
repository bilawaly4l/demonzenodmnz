# Design System — DemonZeno DMNZ Professional Dark Crypto Token Hub

## Direction
Professional, premium dark crypto aesthetic with manifesto/military energy. Deep black foundations (#0a0a0a), sharp geometric layouts, glassmorphism cards (backdrop-filter blur 12px, rgba(17,17,17,0.8), 1px border rgba(255,255,255,0.08)), crimson CTAs (#dc143c), gold accents (#d4af37). Uppercase bold condensed headers with thin 2px crimson accent lines underneath. Cinematic fade-in animations only — no glow, no bounce, no particles. Sharp 2px corners. Authoritative, legitimate, zero childish vibes.

## Tone
Professional, credible, premium. Serious crypto project aesthetic. DMNZ token info hub with fair launch messaging. All DemonZeno quotes woven throughout. Clear, high-contrast readability. Confident visual language. Manifesto-like energy.

## Palette (Dark Mode Only)

| Token               | Value                      | Usage                              |
|---------------------|----------------------------|------------------------------------|
| background          | #0a0a0a                   | Primary surface                    |
| card                | #111111                   | Card base                         |
| card-glass          | rgba(17, 17, 17, 0.8)     | Glassmorphism cards               |
| foreground          | #ffffff                   | Primary text (AA+ contrast)       |
| primary (crimson)   | #dc143c                   | CTAs, buttons, accents            |
| primary-dark        | #8b0000                   | Hover states                      |
| gold                | #d4af37                   | Premium, verified, trust          |
| border              | rgba(255,255,255,0.08)    | Subtle dividers                   |
| muted-foreground    | #a0a0a0                   | Secondary text                    |
| shadow-glass        | 0 8px 32px rgba(0,0,0,0.3)| Glassmorphism hover depth         |

## Typography
- **Display**: Space Grotesk, 800 weight, UPPERCASE, letter-spacing -0.03em, line-height 1.05–1.15
- **Body**: Inter, 400–700 weights, regular case, AA+ dark-on-white contrast
- **Mono**: JetBrains Mono, 400–600 weights, fixed-width for data/IDs/code

## Structural Zones

| Zone              | Background      | Treatment                              |
|-------------------|-----------------|----------------------------------------|
| Header/Nav        | #111111 +glass  | Sticky, 1px border, crimson accent     |
| Hero              | #0a0a0a         | DemonZeno character, fade-in anim      |
| Content Sections  | #0a0a0a         | Card + glass depth, minimal overlap    |
| Cards             | glass+blur      | Hover blur 16px, shadow-glass effect   |
| Buttons (CTA)     | #dc143c         | UPPERCASE, 0.12em tracking, 2px corner |
| Countdown         | #111111 +glass  | Sticky top or pinned, prominent        |
| Footer            | #0d0d0d         | Border-top, professional links         |

## Components

**Cards (glassmorphism)**: Background rgba(17,17,17,0.8), backdrop-filter blur(12px), border 1px rgba(255,255,255,0.08), 2px corners, padding 1.5rem. Hover: blur 16px, box-shadow 0 8px 32px rgba(0,0,0,0.3). Transition 0.3s ease-out.

**Headings**: All UPPERCASE, bold 800, letter-spacing -0.03em, line-height 1.05–1.15. Each heading uses ::after pseudo-element: 2px crimson line, width 2–3rem, margin-top 0.4–0.5rem.

**Buttons**: UPPERCASE text, letter-spacing 0.12em, padding 0.75rem 1.75rem, 2px corners. CTA buttons: crimson fill (#dc143c), hover #c01234 + shadow-crimson. Ghost buttons: transparent, 1px border, hover adds rgba(220,20,60,0.05) background. All 0.3s ease-out transitions.

**Progress bar**: 2px fixed top, tracks scroll %. Background crimson.

**Animations**: All fade-in-up (opacity 0–1, translateY 20px–0) on scroll, 0.5s ease-out. No bounces, glow, or particles.

## Motion
- **Entrance**: Fade-in-up (0.5s ease-out) on scroll, translateY 20px drop
- **Hover**: Backdrop-filter blur increase + shadow, smooth 0.3s (no scale)
- **Transitions**: All 0.25–0.3s ease-out, no spring curves
- **Loading**: Skeleton pulse 1.8s infinite
- **Disabled**: opacity 0.5, cursor not-allowed

## Constraints
- Dark mode only — absolutely no light mode anywhere
- Token-only colors — no raw hex/rgb in components
- Glassmorphism on cards only (blur 12px, rgba(17,17,17,0.8))
- Sharp 2px border-radius everywhere
- Cinematic animations only — no glow, no bounce, no particles
- All buttons UPPERCASE with 0.12em letter-spacing
- All headings UPPERCASE with 2px crimson underline via ::after
- Mobile-first responsive design
- No scale/pop transforms on hover (smooth blur/shadow only)

## Signature Details (Professional Dark Crypto Manifesto)
1. **Glassmorphism cards** — backdrop-filter blur(12px), rgba(17,17,17,0.8), 1px rgba(255,255,255,0.08) border, hover blur 16px + shadow-glass
2. **Uppercase everything** — all h1–h6, buttons, labels; letter-spacing -0.03em headings, 0.12em buttons
3. **Crimson accent lines** — every section header has ::after pseudo-element: 2px solid #dc143c underneath
4. **Cinematic motion only** — fade-in-up 0.5s ease-out, zero glow/bounce/particles
5. **Professional CTA buttons** — crimson #dc143c, UPPERCASE, 0.12em tracking, 0.75rem 1.75rem padding, 2px corners
6. **Dark authority** — #0a0a0a base, #111111 cards, white #ffffff text, crimson + gold sparingly
7. **Real DemonZeno** — character image featured on hero, watermark cropped, authentic presence
8. **Zero childish vibes** — serious, legitimate, manifesto/military aesthetic throughout
9. **Scroll animations only** — all entrance animations tied to scroll visibility, 0.5s ease-out, no auto-play
10. **Professional spacing** — consistent 1.5rem padding in cards, tight typography, high information density

## Animations Explicitly NOT Used
- ❌ Glow effects (box-shadow: 0 0 20px rgba(220,20,60,1))
- ❌ Bounce keyframes (@keyframes bounce with overshoot)
- ❌ Particle systems or confetti bursts
- ❌ Scale/pop transforms on hover (transform: scale(1.05))
- ❌ Floating/levitating elements
- ❌ Multi-color gradient animations
- ❌ Skew or rotate effects
- ❌ Blur-in from color (#ff00ff type effects)

## Quality Bar
Benchmark: Linear, Stripe, Notion, Vercel (dark modes). Tight visual system: 1 display font (Space Grotesk) + 1 body font (Inter), 4 core colors (dark, card, crimson, gold), 3–4 typography tiers, unified interaction pattern. Every visual element serves the professional, authoritative manifesto aesthetic. Zero decoration for decoration's sake.

