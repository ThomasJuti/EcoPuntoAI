# Tasks: EcoPunto IA MVP

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 2500–4000 across full MVP |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1 landing only → PR2 app shell → PR3 auth/storage → PR4 catalog/identify → PR5 guidance → PR6 map/seed → PR7 education/reports/admin |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Marketing landing only | PR 1 | `npm run build` | `/` landing, CTA to `/app`, no tab bar | Remove landing page |
| 2 | App shell, identity, nav | PR 2 | `npm run build` | `/app` with 5-tab nav | Remove app shell |
| 3 | Supabase Google auth + private Storage | PR 3 | auth unit + unauth upload 401 | Google login, denied upload | Drop auth routes + bucket |
| 4 | Catalog + Gemini identify + correction | PR 4 | mapping unit tests | Fixture photo → type or unknown | Remove identify routes |
| 5 | Guidance + optional conditions | PR 5 | catalog snapshot tests | Phone ficha + skip/swollen paths | Guidance components only |
| 6 | Bogotá map matching + directions | PR 6 | ranking unit tests | Battery filter, several points, Maps URL | Map pages + seed |
| 7 | Aprende + reports + thin admin | PR 7 | RLS deny non-admin | Report hours; admin deactivate | Admin + reports tables |

## Phase 1: Landing only (PR 1)

- [x] 1.1 Scaffold Next.js App Router + Tailwind in the existing repo (keep `openspec/`, `supabase/`, `.env.example`)
- [x] 1.2 Ship marketing landing at `/` with EcoPunto IA pitch, Bogotá audience, identify + drop-off value, no app tab bar
- [x] 1.3 Primary CTA goes to `/app`. Add the smallest possible `/app` placeholder so the link does not 404. Do not build the 5-tab shell.

## Phase 2: App shell (PR 2)

- [x] 2.1 Add design tokens (green, petroleum blue, white, greys; warning colors only for alerts)
- [x] 2.2 Create app shell nav Inicio / Escanear / Mapa / Aprende / Perfil in `app/components/app-nav.tsx` with Identificar as the largest CTA
- [x] 2.3 Replace `/app` placeholder with in-app Inicio

## Phase 3: Auth and Storage (PR 3)

- [x] 3.1 RED: unauthenticated upload to Storage is denied (401)
- [x] 3.2 Add Supabase SSR clients in `lib/supabase/client.ts` and `lib/supabase/server.ts`
- [x] 3.3 Enable Google provider and session callback in `app/auth/callback/route.ts`
- [x] 3.4 Create `profiles` with `is_admin` allowlist including `thomasjuti1210@gmail.com` in `supabase/migrations/0001_profiles.sql`
- [x] 3.5 Private bucket `{user_id}/*` in `supabase/migrations/0002_storage.sql`
- [x] 3.6 Gate Escanear behind Google; keep landing, in-app Inicio, Aprende, and map read public

## Phase 4: Identify (PR 4)

- [ ] 4.1 Add catalog IDs and labels in `data/seed/device-types.json`
- [ ] 4.2 RED: low-confidence Gemini result maps to `unknown` (no invented name)
- [ ] 4.3 Implement `lib/vision/identify.ts` mapping Gemini → `WasteKind`
- [ ] 4.4 Camera + gallery capture in `app/(identif)/escanear/page.tsx` uploading to private Storage
- [ ] 4.5 Result + correction UI in `app/(identif)/resultado/page.tsx`

## Phase 5: Guidance (PR 5)

- [ ] 4.1 Encode reuse/repair/donate/recycle, risks, dos/donts, wipe/SIM flags in `lib/catalog/device-types.ts`
- [ ] 4.2 Render ficha one section at a time in `app/(identif)/resultado/guidance.tsx`
- [ ] 4.3 Optional skippable questions (on, broken, swollen battery, water) adjusting copy in `lib/catalog/conditions.ts`

## Phase 6: Map (PR 6)

- [ ] 5.1 RED: ranking never returns a point that does not accept the waste kind as primary
- [ ] 5.2 Bogotá bounds + locality geocode in `lib/geo/bogota.ts`
- [ ] 5.3 Schema `collection_points` + `accepted` types in `supabase/migrations/0003_points.sql`
- [ ] 5.4 Seed curated Bogotá rows in `data/seed/collection-points.csv` (visor/Ecolecta/EcoCómputo/Pilas/Red Verde)
- [ ] 5.5 List multiple nearby matching points + recommended in `app/(identif)/puntos/page.tsx`
- [ ] 5.6 Point card fields + “Cómo llegar” Google Maps URL in `app/components/point-card.tsx`
- [ ] 5.7 Public category filter including “No sé qué es” on `app/(public)/mapa/page.tsx`

## Phase 7: Education, reports, admin (PR 7)

- [ ] 6.1 Aprende sections in `app/(public)/aprender/page.tsx`
- [ ] 6.2 RED: non-admin Google user cannot PATCH/delete points (403)
- [ ] 6.3 Reports table + citizen form in `supabase/migrations/0004_reports.sql` and `app/components/report-point.tsx`
- [ ] 6.4 Admin CRUD/deactivate in `app/admin/puntos/page.tsx`
- [ ] 6.5 Admin report queue resolve/dismiss in `app/admin/reportes/page.tsx`

## Phase 7: Verify

- [ ] 7.1 Unit tests for catalog mapping, ranking, Bogotá bounds
- [ ] 7.2 Confirm warning colors only appear on hazard copy
- [ ] 7.3 Manual pass of identify → ficha → location → several points → Maps on phone and desktop
