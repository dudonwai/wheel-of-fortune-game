# Wheel of Fortune — Design Specification

## 1. Aesthetic Direction: **Broadcast Glam**

A theatrical, high-production game show aesthetic inspired by 1980s–90s television set design. Think dramatic studio lighting, rich saturated surfaces, and the confidence of a prime-time broadcast. Everything should feel like it belongs on a TV stage — bold, legible from 30 feet away, and dripping with showbiz energy. Not retro-kitsch — genuinely glamorous.

## 2. Color Palette

- **Dominant — Deep Stage Navy:** `#0A1628` (near-black blue, the darkness of a TV studio)
- **Secondary — Emerald Felt:** `#1B6B4A` (rich green for the puzzle board, like a game table)
- **Accent — Broadcast Gold:** `#F5C518` (electric gold for highlights, scores, active states)

Mode: **Dark.** Always. This is a stage, not a webpage. White `#FFFFFF` is used only for letter tiles and key text. The gold does ALL the heavy lifting for energy and hierarchy.

## 3. Typography

- **Display:** `"Oswald"` (Google Fonts) — Bold weight (700), condensed, commanding. Used for scores, category labels, player names, and the wheel. Headings at `48–72px`. Scores at `56px`. Category label at `36px`.
- **Body:** `"Archivo"` (Google Fonts) — Medium weight (500), slightly mechanical, sturdy sans-serif. Used for host controls, labels, and smaller UI text at `18–24px`.

All text uses `letter-spacing: 0.04em` and `text-transform: uppercase` for display type. Player names and scores must be readable from across a room — nothing below `20px` on the game screen. Puzzle board letters render at `40px` bold inside their tiles.

## 4. Spatial Style

**Dense center, airy periphery.** The puzzle board commands the middle ~50% of screen width with tight letter spacing and minimal gaps between tiles (4px). Surrounding elements (scoreboard, wheel, controls) get generous padding (`32px`) so the eye always returns to the board.

Layout is **symmetric on the horizontal axis** — the board is perfectly centered, flanked by wheel (left, ~20% width) and host controls (right, ~20% width). The scoreboard stretches full-width at the bottom like a broadcast lower-third graphic with a subtle gold top border (`2px solid #F5C518`). Vertical rhythm uses a `24px` base unit. The setup screen centers its form vertically and horizontally with a max-width of `480px`.

Puzzle board tiles: `48px x 56px`, `4px` gap, white tile on revealed, emerald `#1B6B4A` when blank, with a `2px` inset border of `rgba(255,255,255,0.1)`.

## 5. Signature Detail: **Tile Flip with Gold Flash**

When a correct letter is revealed, each matching tile performs a **3D Y-axis flip** (`transform: rotateY(180deg)`). The tile back is emerald green; the front is crisp white with a black letter. The flip takes `600ms` with bounce easing (`cubic-bezier(0.68, -0.35, 0.27, 1.35)`). Multiple matching letters flip in rapid sequence with `150ms` stagger between them — a satisfying domino ripple across the board.

During each flip, a gold glow pulses behind the tile: `box-shadow: 0 0 24px #F5C518` that fades over `400ms`. The wheel spin uses a `3–5 second` ease-out rotation with a ticking sound cadence (CSS animation on segments). The active player's scoreboard cell gets a pulsing gold bottom border (`3px`) to clearly mark whose turn it is.
