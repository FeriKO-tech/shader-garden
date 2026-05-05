# shader-garden

Interactive WebGL shader gallery with a live GLSL editor.

> A growing collection of shader scenes you can fork, tweak, and share. Mini-Shadertoy, simpler and friendlier.

## Tech stack

- **Next.js 14** (App Router)
- **React Three Fiber** + **drei**
- **GLSL** shaders (loaded as raw text)
- **Monaco Editor** with GLSL syntax (planned)
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

## Roadmap

- [x] Basic R3F canvas
- [x] Load fragment shader from `.glsl` file
- [x] Monaco editor with GLSL syntax
- [x] Live recompile on edit
- [ ] Gallery page with scene cards
- [ ] Share via URL

## License

MIT
