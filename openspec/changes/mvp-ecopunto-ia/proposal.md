# Proposal: EcoPunto IA MVP

## Intent

People in Bogotá should not need e-waste expertise. EcoPunto IA identifies a device from a photo, says what it is and what to do (including risks), and shows nearby collection points that actually accept that waste.

## Scope

### In Scope
- Public marketing landing at `/` before the product shell
- Bogotá-only responsive web app named EcoPunto IA
- Google sign-in via Supabase; photos in private Storage
- Gemini vision → catalog device type; user can correct
- Guidance: waste type, reuse/repair/donate/recycle, special handling, storage/transport, data wipe/SIM when relevant, optional condition questions
- Map: GPS or typed Bogotá locality; several nearby matching points; recommended point; “Cómo llegar” opens Google Maps
- Manual category search including “I don’t know”
- Education (RAEE, household trash, batteries, damaged devices)
- Citizen reports of stale point data
- Thin admin (email allowlist): CRUD/deactivate points, review reports

### Out of Scope
- Native apps, cities outside Bogotá
- Multi-role RBAC or operator self-service
- My devices / delivered / environmental impact
- Live scraping of the SDA visor

## Capabilities

### New Capabilities
- `marketing-landing`: public landing before the app; CTA into `/app`
- `brand-and-navigation`: visual identity, 5-tab app nav, scan as primary CTA
- `home-onboarding`: in-app Inicio after landing; short purpose + identify CTA
- `google-auth`: Google via Supabase; public browse vs authenticated identify/report/admin
- `device-identification`: camera/gallery, Gemini classify, correct, manual/unknown
- `device-guidance`: catalog-backed advice and optional condition questions
- `collection-points-discovery`: Bogotá map, type matching, ranking, directions
- `education`: short RAEE learning pages
- `point-reporting`: closed / wrong address / hours / no longer accepts X
- `admin-points`: allowlist admin CRUD + deactivate + report handling

### Modified Capabilities
- None

## Approach

PWA (Next.js). `/` is a marketing landing; `/app` is the product. Gemini returns a category; the **device catalog** is the source of truth for advice. Collection points live in Supabase, seeded from official posconsumo sources, then curated. Rank by (accepts type, available, distance). Auth: Google. Admin: `is_admin` for `thomasjuti1210@gmail.com`. Delivery: one feature PR at a time into `main`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/` | New | Landing `/`, product `/app`, identify, map, learn, admin |
| `supabase/` | New | Schema, RLS, Storage bucket, Google provider |
| `lib/catalog` | New | Device types and guidance copy |
| `lib/vision` | New | Gemini identify mapping |
| `data/seed` | New | Bogotá collection points |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Stale or incomplete official data | High | Seed + reports + admin; show last-verified |
| Gemini misclassification | Med | User correction + catalog fallback “unknown” |
| Photo PII | Med | Private bucket, RLS, no public URLs |
| SDA download needs login | Med | Manual first seed; document source |

## Rollback Plan

Feature-flag identify and map. If Gemini or seed fails, keep Learn + manual category + unfiltered Bogotá list. Drop schema with migration reverse; empty Storage bucket.

## Dependencies

- Supabase project (Auth Google, Storage, Postgres)
- Gemini API key
- Google Cloud OAuth client
- First posconsumo seed (small curated CSV is enough; visor download optional)

## Success Criteria

- [ ] First visit sees a marketing landing, then enters the app
- [ ] User can identify or pick a device and see what to do without recycling knowledge
- [ ] Map shows several Bogotá points that accept that waste type, not only the nearest
- [ ] Recommended point balances acceptance + distance
- [ ] Team can add, edit, and deactivate points; citizens can report errors
- [ ] Works on phone, tablet, and desktop
