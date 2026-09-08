# Design: EcoPunto IA MVP

## Technical Approach

Next.js App Router PWA. Gemini classifies photos; a versioned device catalog owns all safety copy. Supabase holds users, points, reports, and private images. Map ranking is deterministic: accepts type ∧ active, then distance.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Client | Next.js web PWA | Native / split API | MVP is Bogotá web-only; camera + GPS in browser |
| Backend | Supabase Postgres + RLS | Prisma+Neon, custom API | User asked Supabase for auth and storage |
| Auth | Google OAuth via Supabase | Anonymous + later login | Photos and reports need a user; no password auth |
| IA | `/` landing + `/app` shell | Single mixed home | User asked for a landing before the app |
| Admin | `profiles.is_admin` email allowlist (`thomasjuti1210@gmail.com`) | Full RBAC / Studio-only | Need mutations + report workflow; not operator roles |
| Vision | Gemini API (Flash) | Custom classifier | User has Gemini key; map output onto catalog IDs |
| Advice | Catalog tables, not LLM prose | Free-form generation | Battery/hazard text must be reviewed |
| Points | Curated seed + admin | Live visor scrape | Visor has no public API; download needs SDA login |
| Directions | Google Maps URL | In-app routing | Spec allows opening Maps |
| Geography | Bounding box + locality geocode for Bogotá | National search | MVP Bogotá only |

## Data Flow

```
Photo (private Storage)
    → Gemini classify → catalog device_type
    → optional condition answers adjust flags
    → origin (GPS | Bogotá geocode)
    → points where accepts(type) AND active
    → sort distance, mark recommended
    → “Cómo llegar” → maps.google.com
```

Reports do not hide a point until an admin edits or deactivates it.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/page.tsx` | Create | Marketing landing |
| `app/app/page.tsx` | Create | In-app Inicio |
| `app/(public)/aprender/page.tsx` | Create | Education |
| `app/(public)/mapa/page.tsx` | Create | Public map browse |
| `app/(identif)/escanear/page.tsx` | Create | Camera/gallery |
| `app/(identif)/resultado/page.tsx` | Create | Ficha + conditions |
| `app/(identif)/puntos/page.tsx` | Create | Matching points |
| `app/admin/puntos/page.tsx` | Create | Admin CRUD |
| `app/admin/reportes/page.tsx` | Create | Report queue |
| `lib/supabase/*` | Create | SSR client, RLS helpers |
| `lib/vision/identify.ts` | Create | Gemini → catalog id |
| `lib/catalog/*` | Create | Types, guidance, ranking |
| `lib/geo/bogota.ts` | Create | Bounds, locality geocode |
| `supabase/migrations/*` | Create | Schema + RLS + storage |
| `data/seed/collection-points.csv` | Create | First Bogotá seed |
| `data/seed/device-types.json` | Create | Catalog copy |

## Interfaces / Contracts

```ts
type WasteKind =
  | "phones" | "computers" | "laptops" | "tablets"
  | "chargers" | "batteries" | "cells" | "headphones"
  | "tvs" | "printers" | "cables" | "peripherals"
  | "small_appliances" | "unknown";

type DeviceType = {
  id: WasteKind;
  label: string;
  wasteLabel: string;
  canUse: boolean; canReuse: boolean; canRepair: boolean;
  canDonate: boolean; canRecycle: boolean;
  specialHandling: boolean;
  wipeData: boolean; removeSim: boolean;
  risks: string[]; dos: string[]; donts: string[];
  storage: string; transport: string;
};

type CollectionPoint = {
  id: string; name: string; address: string;
  lat: number; lng: number; locality: string;
  hours: string; contact: string | null;
  accepted: WasteKind[]; isActive: boolean;
  lastVerifiedAt: string;
};
```

Gemini returns `{ wasteKind, label, confidence }`. If `confidence` is low or `unknown`, UI forces manual pick.

Recommended point = first of `active ∧ accepted.includes(kind)` sorted by Haversine distance (tie-break: more specific accepted set).

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Unit | Catalog mapping, ranking, Bogotá bounds | Vitest once scaffolded |
| Integration | RLS: citizen cannot mutate points; admin can | Supabase tests or SQL fixtures |
| E2E | Identify (fixture image) → ficha → map list | Playwright later |

## Threat Matrix

| Boundary | Applicable | Expected | RED test |
|----------|------------|----------|----------|
| Image upload | Yes | Type/size limits; authenticated upload only; private bucket | Unauth upload 401; oversized rejected |
| Admin routes | Yes | Non-admin 403 on mutations | Regular Google user cannot PATCH points |
| Geolocation | Yes | Permission prompt; manual fallback; no tracking store required | Deny GPS still allows locality search |
| Shell/VCS/process | N/A | — | — |

Photos: private bucket, signed URLs, path `{user_id}/{id}`. Do not log image bytes.

## Migration / Rollout

No user migration. Cloud project `EcoPunto-IA` (`svbpehcyxztytuswqrnb`, `sa-east-1`) already exists. Copy anon/service keys from the dashboard into `.env.local` (see `.env.example`). Seed points in first map PR. Feature-flag Gemini if the key is missing (manual category still works).

## Open Questions

- [ ] Team Google emails for extra admins beyond `thomasjuti1210@gmail.com`
- [ ] Gemini API key (project exists; Google OAuth still needs a Cloud client)
- [ ] Optional: visor GeoJSON later; MVP can start with a small curated seed
