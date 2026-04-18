
<planning>
This is a Wheel of Fortune game app - a classic game show aesthetic projected onto a screen for in-person players. I need to create a bold, distinctive design that captures the game show energy while being highly readable on a projector.

The user specifically mentions "Classic game show aesthetic — dark blue/purple background, bright colored wheel, white letter tiles on a green board" but I should interpret this through a bold design lens rather than being generic.

Let me think about this:
- It's a game show, projected on screen, needs to be dramatic and readable
- Classic Wheel of Fortune vibes but elevated
- Needs to feel like a TV production, not a web app

I'll go with a **Broadcast Television / Game Show Glam** aesthetic - think the drama of a TV set with theatrical lighting, bold contrasts, and that unmistakable game show energy. Dark, dramatic backgrounds with electric highlights.

Color palette: Deep navy/almost-black for the background (not generic blue), gold for accents (game show luxury), and a rich emerald green for the puzzle board. This avoids generic purple gradients while staying true to the game show feel.

Typography: Something bold and display-heavy for the game show titles, readable for the board.

Let me commit to this direction fully.
</planning>

---

```md
# Wheel of Fortune — Design Specification

## 1. Aesthetic Direction: **Broadcast Glam**

A theatrical, high-production game show aesthetic inspired by 1980s–90s television set design. Think dramatic studio lighting, rich saturated surfaces, and the confidence of a prime-time broadcast. Everything should feel like it belongs on a TV stage — bold, legible from 30 feet away, and dripping with showbiz energy. Not retro-kitsch — genuinely glamorous.

## 2. Color Palette

- **Dominant — Deep Stage Navy:** `#0A1628` (near-black blue, the darkness of a TV studio)
- **Secondary — Emerald Felt:** `#1B6B4A` (rich green for the puzzle board, like a game table)
- **Accent — Broadcast Gold:** `#F5C518` (electric gold for highlights, scores, active states)

Mode: **Dark.** Always. This is a stage, not a webpage. White is used only for letter tiles and key text. The gold does ALL the heavy lifting for energy and hierarchy.

## 3. Typography

- **Display:** `"Oswald"` (Google Fonts) — Bold, condensed, commanding. Used for scores, category labels, and player names. Headings at `48–72px`. Scores at `56px`.
- **Body:** `"Archivo"` (Google Fonts) — Slightly mechanical, sturdy sans-serif. Used for controls, labels, and smaller UI text at `18–24px`.

All text should use `letter-spacing: 0.02em` minimum. Player names and scores must be readable from across a room — nothing below `20px` on the game screen.

## 4. Spatial Style

**Dense center, airy periphery.** The puzzle board commands the middle with tight letter spacing and minimal gaps between tiles. Surrounding elements (scoreboard, wheel, controls) get generous padding and breathing room so the eye always returns to the board. Layout is **symmetric on the horizontal axis** — the board is perfectly centered, flanked by wheel (left) and controls (right). Vertical rhythm uses `24px` base unit. The scoreboard stretches full-width at the bottom like a broadcast lower-third graphic.

## 5. Signature Detail: **Tile Flip Animation**

When a correct letter is revealed, each tile performs a **3D Y-axis flip** (like a physical game board tile rotating from blank to letter). The tile back is the emerald green, the front is crisp white with a black letter. The flip takes `600ms` with a slight bounce easing (`cubic-bezier(0.68, -0.35, 0.27, 1.35)`). Multiple occurrences flip in rapid sequence with a `150ms` stagger delay between them, creating a satisfying domino effect. The gold accent glows briefly behind each tile during the flip (a `box-shadow: 0 0 20px #F5C518` that fades over `400ms`). This single animation IS the game — it's the moment everyone watches for.
```