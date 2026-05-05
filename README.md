# shader-garden

Interactive WebGL shader gallery with a live GLSL editor.

**Live demo: [shader-garden-bice.vercel.app](https://shader-garden-bice.vercel.app)**

> A growing collection of shader scenes you can fork, tweak, and share. Mini-Shadertoy, simpler and friendlier.

## Tech stack

- **Next.js 14** (App Router)
- **React Three Fiber** + **drei**
- **GLSL** shaders (loaded as raw text via `raw-loader`)
- **Monaco Editor** with a custom GLSL Monarch grammar
- **Tailwind CSS**

## Getting started

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm start` — run production build
- `pnpm lint` — Next.js ESLint
- `pnpm typecheck` — `tsc --noEmit`

> All Next.js scripts go through `scripts/run-safe.mjs`, which transparently
> falls back to a temp workspace when the project path contains characters
> Next.js cannot handle (notably `#`). On clean paths it runs Next directly.

## Built-in scenes

| slug | summary |
| --- | --- |
| `plasma` | Classic sin-based plasma. Drag horizontally to warp. |
| `clouds` | fBm noise drifting across a twilight sky. |
| `fire` | Procedural flames climbing through a fire palette. |
| `galaxy` | Spiral fBm with a hot core, a halo, and sparse stars. |
| `voronoi` | Animated cell-noise. Move horizontally to zoom in. |
| `raymarch` | Sphere / box / torus blended via SDF smooth-union. Drag to orbit. |
| `hologram` | Concentric rings, grid, chromatic aberration, scanlines and flicker. |
| `glitch` | Chromatic-aberrated scanlines with random tearing. |

Each scene lives under `src/shaders/<slug>/` as `vertex.glsl`, `fragment.glsl`,
and a `meta.ts` that can declare custom `uniforms` (sliders, color pickers).
Add a new entry to `src/shaders/registry.ts` to make it appear in the gallery.

## Authoring shaders

The `meta.ts` file may export a `uniforms` array with these shapes:

- `{ name, type: 'float', default, min?, max?, step?, label? }`
- `{ name, type: 'vec2', default: [x, y], min?, max?, step?, label? }`
- `{ name, type: 'color', default: [r, g, b], label? }` (each channel `0..1`)

Declared uniforms are wired into the `<shaderMaterial>` and rendered as
sliders / color pickers underneath the live playground. Built-in uniforms
`u_time`, `u_resolution`, `u_mouse` are always provided.

## Roadmap

- [x] Basic R3F canvas
- [x] Load fragment shader from `.glsl` file
- [x] Monaco editor with GLSL syntax
- [x] Live recompile on edit
- [x] Gallery page with scene cards
- [x] Share via URL
- [x] Declarative uniform controls (float / vec2 / color)
- [x] Edit vertex shader alongside fragment

### Stretch goals

- [ ] User accounts (Firebase Auth)
- [ ] Likes and featured scenes
- [ ] Tutorial mode that walks through a shader line-by-line
- [ ] Export as `<canvas>` snippet or animated GIF

## Deploy on Vercel

The project ships with the standard Next.js layout and a `pnpm-lock.yaml`,
so Vercel detects everything automatically.

**Dashboard flow** (recommended):

1. Visit [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Leave **Framework**, **Build command**, and **Install command** at the
   auto-detected values (`Next.js`, `pnpm run build`, `pnpm install`).
3. Hit **Deploy**.

**CLI flow**:

```bash
pnpm dlx vercel        # one-off preview deploy
pnpm dlx vercel --prod # production
```

The `scripts/run-safe.mjs` wrapper is a no-op on Vercel because the build
path there is clean of `#`, so the project builds with vanilla `next build`.

## License

MIT
