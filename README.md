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

- `pnpm dev` - start dev server
- `pnpm build` - production build
- `pnpm start` - run production build
- `pnpm lint` - Next.js ESLint
- `pnpm typecheck` - `tsc --noEmit`

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

- [x] Export as standalone `.html` snippet
- [x] Tutorial mode that walks through a shader line-by-line
- [x] Record the live canvas as an animated GIF
- [x] User accounts (Firebase Auth) + saved forks
- [x] Likes and featured scenes (Firestore)

## Firebase (optional - sign-in, saved forks, likes, featured)

If the `NEXT_PUBLIC_FIREBASE_*` env vars are missing, the site still works;
the auth widget shows `auth: off`, the save-fork button and the like buttons
disappear, and the gallery falls back to a static featured list. To turn it on:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/).
2. Enable **Authentication → Google** as a sign-in provider.
3. Enable **Cloud Firestore** (pick *production mode*, we supply rules below).
4. In **Project settings → Your apps**, register a Web app and copy the config.
5. Copy `.env.example` to `.env.local` and fill in the six `NEXT_PUBLIC_FIREBASE_*`
   values.
6. Add your deploy domain to **Authentication → Settings → Authorized domains**.

### Firestore layout

- `forks/{autoId}` - `{ uid, slug, title, vertex, fragment, uniformValues, createdAt }`
- `likes/{slug}_{uid}` - `{ uid, slug, createdAt }` (one doc per user × scene)
- `featured/scenes` - `{ slugs: string[] }`; curators edit this doc in the console
  to pin scenes to the top of the gallery.

### Required composite index

The `/my` page queries `forks` by `uid` ordered by `createdAt`, which needs a
composite index. On the first visit you'll see an error with a one-click link
to create it. Alternatively, see `firestore.indexes.json` in the repo root -
you can deploy it via the Firebase CLI:

```bash
firebase firestore:indexes --project shader-garden ./firestore.indexes.json
firebase deploy --only firestore:indexes
```

### Security rules

Paste into **Firestore → Rules**:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Saved forks: owner CRUD, public read.
    match /forks/{fork} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      allow update, delete: if request.auth != null
                            && resource.data.uid == request.auth.uid;
    }

    // Likes: public read/count, owner write. Doc id must be `${slug}_${uid}`.
    match /likes/{likeId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid
                    && likeId == request.resource.data.slug + '_' + request.auth.uid;
      allow delete: if request.auth != null
                    && resource.data.uid == request.auth.uid;
    }

    // Featured config: public read, admin-only write (edit via console).
    match /featured/{docId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

For deployment, add the same `NEXT_PUBLIC_FIREBASE_*` entries in the Vercel
project's **Environment variables** (Production + Preview).

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
