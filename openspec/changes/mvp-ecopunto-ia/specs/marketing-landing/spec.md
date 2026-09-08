# marketing-landing Specification

## Purpose

Public marketing landing shown before the product shell.

## Requirements

### Requirement: Landing precedes the app

The site root `/` MUST be a marketing landing that explains what EcoPunto IA is, who it is for (people in Bogotá with unused electronics), and that it identifies a device and shows where to take it. The landing MUST NOT show the five-tab app navigation. A primary CTA MUST enter the product (`/app`) or start identification.

#### Scenario: First visit sees landing, not the scanner

- GIVEN an unauthenticated visitor opens `/`
- WHEN the page renders
- THEN they see product name, a short pitch, and a CTA to enter the app
- AND they do not see the Inicio/Escanear/Mapa/Aprende/Perfil tab bar

#### Scenario: CTA opens the product

- GIVEN the visitor on `/`
- WHEN they activate the primary CTA
- THEN they land in the app shell at `/app`
