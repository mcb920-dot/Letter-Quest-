# Letter Quest

A mobile-first educational letter-learning game for preschoolers, built with Phaser 3 and Vite.

## Development

```bash
npm install
npm run dev
```

Vite prints the local development URL when it starts (normally `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

Production files are generated in `dist/` and can be deployed directly to Vercel.

## Project layout

- `src/scenes/` — boot, menu, and letter-learning scenes
- `src/systems/` — audio, persistence, and alphabet progression
- `src/game/` — procedural textures and celebration effects
- `src/config/` — Phaser configuration
- `public/assets/` — placeholder folders for future artwork
- `public/audio/` — placeholder folders for future recorded audio

The game currently generates its artwork at runtime, so empty asset and audio folders do not prevent it from loading.
