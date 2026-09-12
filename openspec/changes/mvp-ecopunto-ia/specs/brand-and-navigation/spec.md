# brand-and-navigation Specification

## Purpose

Visual identity and primary navigation for EcoPunto IA.

## Requirements

### Requirement: Product name and identity

The system MUST display the name "EcoPunto IA". The palette MUST follow 60 / 30 / 10: white for surfaces, neutral greys for text and secondary UI, and green only for primary actions (search, filter, details, Identificar). Yellow, orange, and red MUST be reserved for warnings, precautions, or important alerts. Petroleum teal MUST NOT be used.

#### Scenario: Warning color used only for hazards

- GIVEN a device with a damaged-battery risk
- WHEN the user views guidance
- THEN hazard copy uses warning/alert color
- AND primary navigation and CTAs do not use yellow, orange, or red

### Requirement: Simple five-destination navigation

After the landing, the product shell (`/app`) MUST provide navigation: Inicio, Escanear, Mapa, Aprende, Perfil. Identify/scan MUST be the most visible primary action inside the app. Buttons SHOULD be large; copy SHOULD be short. A single screen MUST NOT dump the full identify → risks → map journey.

#### Scenario: Scan is the primary action on in-app Inicio

- GIVEN the user is inside `/app`
- WHEN Inicio renders
- THEN a large “Identificar dispositivo” action is visible without scrolling on a typical phone viewport
- AND the five-tab navigation is visible
