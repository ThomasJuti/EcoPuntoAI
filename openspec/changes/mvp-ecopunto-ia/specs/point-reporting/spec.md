# point-reporting Specification

## Purpose

Let citizens flag incorrect collection-point data so the team can update it.

## Requirements

### Requirement: Report stale point data

A signed-in user MUST be able to report a point as closed, wrong address, wrong hours, or no longer accepting a given device type. The report MUST be stored for admin review. The point MUST remain visible until an admin acts, unless it is already deactivated.

#### Scenario: Report wrong hours

- GIVEN a signed-in user viewing a point
- WHEN they submit “horario incorrecto” with optional comment
- THEN the report is saved
- AND the user sees a confirmation
- AND the map still shows the point until an admin deactivates or edits it
