# EcoPunto IA

PWA para Bogotá: le tomas una foto a un electrónico, Gemini lo clasifica contra un catálogo, te dice qué hacer con él y te muestra puntos de posconsumo que **sí reciben ese tipo**.

Sitio: [ecopuntoai.vercel.app](https://ecopuntoai.vercel.app)

- `/` — landing. Si hay sesión en cookies, entra directo a la app. El logo de la app vuelve al sitio (`/?landing`). Cerrar sesión también deja en la landing.
- `/app` — Inicio (identificar + historial), Mapa, Aprende, Perfil. Admin en `/app/admin/*` (allowlist).

## Stack

Next.js (App Router) · Supabase (Auth Google, Postgres, Storage RLS) · Gemini · Vercel.

Paleta: 60% blanco `#FFFFFF` / 30% gris `#848890` (tinta `#3A3D42`) / 10% verde `#389040` en acciones.

## Local

```bash
npm install
cp .env.example .env.local   # rellena las keys
npm run dev
```

En el dashboard de Supabase, Redirect URLs: `http://localhost:3000/auth/callback` (o el puerto que use `next dev`).

```bash
npm test    # lib/**/*.test.ts
npm run build
```

Migraciones: `supabase/migrations/` (`0001`…`0006`). El proyecto cloud ya está linkeado; `npx supabase db push --linked` aplica las pendientes.

## Variables

| Variable | Para |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente SSR |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente SSR |
| `SUPABASE_SERVICE_ROLE_KEY` | Seed / admin server |
| `ADMIN_EMAILS` | Allowlist (`profiles.is_admin`) |
| `GEMINI_API_KEY` | Identificar por foto |

Google OAuth se configura en el proveedor de Auth de Supabase, no en el repo.

## Qué hace la app

1. Foto (cámara o galería) → Storage privado → Gemini → categoría del catálogo. El usuario puede corregir.
2. Preguntas opcionales (¿enciende?, ¿roto?, batería hinchada, agua). Las respuestas se guardan con la identificación y se ven en el historial.
3. Ficha del catálogo (usar / reusar / reparar / donar / reciclar, riesgos, guardar, datos).
4. Mapa: puntos activos que aceptan ese residuo, ordenados por distancia (GPS o localidad de Bogotá). Cómo llegar abre Google Maps.
5. Aprende (RAEE, caneca de la casa, baterías, dañados) y reportes de datos viejos.

Admin (email en `ADMIN_EMAILS`): CRUD/desactivar puntos y cola de reportes.

Fuera de alcance: otras ciudades, app nativa, impacto ambiental, scrape en vivo del visor SDA.

## Repo

| Ruta | Qué |
|---|---|
| `app/` | Landing, shell `/app`, APIs |
| `lib/catalog` | Tipos, fichas, ranking |
| `lib/vision` | Gemini → id de catálogo |
| `lib/geo` | Bounding box Bogotá |
| `supabase/migrations` | Schema + RLS + Storage |
| `openspec/changes/mvp-ecopunto-ia` | Spec del MVP |
