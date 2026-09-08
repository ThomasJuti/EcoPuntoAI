# Exploration: EcoPunto IA MVP

### Current State

Empty greenfield repo. No app code, tests, or collection-point data yet. Product brief requires: identify a device from a photo, explain what to do, and show Bogotá drop-off points that accept that waste type.

### Affected Areas

- New Next.js web app (PWA) — entire product
- Supabase Postgres + Auth + Storage — persistence and Google login
- Gemini vision — device classification only
- Seed dataset of Bogotá posconsumo points — map accuracy

### Dataset findings (Bogotá RAEE)

| Source | What it gives | Gap |
|--------|---------------|-----|
| [Visor Geográfico Ambiental — Puntos Posconsumo](https://visorgeo.ambientebogota.gov.co/) | 1500+ posconsumo sites; filter by Ecolecta, pilas, computadores, línea blanca; name, address, phone, hours, waste type | Download needs SDA login; no public live API |
| Ecolecta (SDA) | ~59 fixed household RAEE points, free, no disposal certificate | Need coordinates + hours from visor |
| EcoCómputo | Computers and peripherals | Separate waste type; visor layer “Computadores y periféricos” |
| Pilas con el Ambiente | Batteries and cells | Must not mix with general RAEE in matching |
| Red Verde | White-line appliances | Distinct from phones/laptops |
| datos.gov.co SRS / gestores GDP | National collection points and authorized managers | Must filter Bogotá + RAEE; fields often incomplete |

**Do not** live-scrape the visor. Seed a curated table, map each site to `accepted_waste_types`, then keep it fresh with reports + admin edits.

### Approaches

1. **Next.js PWA + Supabase + Gemini** — one web app, Google auth, private photo bucket, catalog-driven guidance.
   - Pros: matches user choices; camera/GPS in browser; Bogotá-only is simple
   - Cons: needs Google Cloud OAuth + Gemini key + a first curated seed
   - Effort: Medium

2. **Native app** — rejected. MVP is web-only.

3. **LLM generates all advice and point lists** — rejected. Unsafe for battery/hazard guidance; points would drift.

### Recommendation

Web PWA. Gemini classifies; a versioned **device catalog** owns reuse/repair/donate/recycle, risks, and do/don’t. Collection points are a curated Bogotá table seeded from the visor/Ecolecta/program layers.

**Admin:** one `is_admin` flag via email allowlist. Not RBAC, not operator portals. Needed so the team can fix stale points and act on citizen reports. Supabase Studio alone is a fallback, but a thin `/admin` UI is in MVP because reports need a workflow.

### Risks

- Official GeoJSON download requires SDA account; first seed may be manual
- Open-data rows often miss hours or waste-type granularity
- Gemini mislabels look-alike devices (power bank vs phone)
- Storing photos is PII; bucket must be private + RLS

### Ready for Proposal

Yes — MVP geography, web-only, Supabase+Google, Gemini, and lightweight admin are decided.
