# admin-points Specification

## Purpose

Team maintenance of Bogotá collection points. One admin flag, not a role matrix.

## Requirements

### Requirement: CRUD and deactivate

Allowlisted admins MUST be able to add a point, edit its fields (name, address, coordinates, hours, contact, accepted types, availability), and delete or deactivate points that are no longer available. Deactivated points MUST NOT appear in citizen map results.

#### Scenario: Deactivate closed site

- GIVEN an admin and an active point
- WHEN the admin marks it unavailable/deactivated
- THEN citizen discovery no longer lists it

#### Scenario: Add a new point

- GIVEN an admin
- WHEN they create a point with name, address, Bogotá coordinates, hours, and accepted types
- THEN it appears in matching citizen results

### Requirement: Act on citizen reports

Admins MUST be able to list open reports and resolve them by editing the point, deactivating it, or dismissing the report.

#### Scenario: Resolve a report by editing hours

- GIVEN an open “horario incorrecto” report
- WHEN the admin updates hours and marks the report resolved
- THEN the report is no longer open
- AND citizens see the new hours
