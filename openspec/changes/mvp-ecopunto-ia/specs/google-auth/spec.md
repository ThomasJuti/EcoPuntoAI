# google-auth Specification

## Purpose

Google authentication via Supabase. Public browse vs protected identify, report, and admin.

## Requirements

### Requirement: Google sign-in

The system MUST authenticate citizens and admins with Google through Supabase Auth. The system MUST NOT require username/password registration.

#### Scenario: User signs in with Google

- GIVEN an unauthenticated user on a protected action
- WHEN they choose “Continuar con Google” and complete OAuth
- THEN a session is created
- AND they return to the action they started

### Requirement: Public vs protected routes

Inicio (`/app`), Aprende, and read-only map browsing MUST work without login. The marketing landing MUST be public. Identifying a device (camera/gallery), reporting a point, and admin MUST require a Google session.

#### Scenario: Identify blocked until login

- GIVEN an unauthenticated user
- WHEN they start “Identificar dispositivo”
- THEN they are asked to sign in with Google
- AND no photo is uploaded before the session exists

### Requirement: Admin is an allowlist, not RBAC

A user MUST be treated as admin only when their Google email is on the allowlist (`is_admin`). The MVP allowlist MUST include `thomasjuti1210@gmail.com`. The system MUST NOT implement multiple staff roles in MVP. Non-admins MUST NOT access admin routes or mutate collection points.

#### Scenario: Allowlisted email reaches admin

- GIVEN a signed-in user with email `thomasjuti1210@gmail.com`
- WHEN they open admin
- THEN they can manage points and reports

#### Scenario: Regular user cannot mutate points

- GIVEN a signed-in user who is not allowlisted
- WHEN they request an admin mutation
- THEN the system denies it
