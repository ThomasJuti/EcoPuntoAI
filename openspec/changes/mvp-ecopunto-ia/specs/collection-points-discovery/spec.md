# collection-points-discovery Specification

## Purpose

Show Bogotá collection points that accept the user’s waste type, not only the nearest site.

## Requirements

### Requirement: Location input

“¿Dónde lo puedo llevar?” MUST request geolocation permission. If denied or skipped, the user MUST be able to type a Bogotá address, locality, or zone. The system MUST NOT show points outside Bogotá D.C.

#### Scenario: Manual locality

- GIVEN the user denies geolocation
- WHEN they type “Kennedy”
- THEN the map centers on that Bogotá locality
- AND listed distances use that origin

### Requirement: Filter by accepted waste type

The system MUST show points that accept the current device/waste type (e.g. batteries → battery-accepting sites first). Users MUST be able to search or filter by category without using the camera, including “I don’t know.” The list MUST include multiple nearby points, not only the closest. The system MUST recommend one point using acceptance + availability + distance.

#### Scenario: Battery matching

- GIVEN the device is a battery
- WHEN results load near the user
- THEN points that do not accept batteries are not primary results
- AND at least two accepting points are shown when they exist
- AND one recommended point is marked

#### Scenario: Point card fields

- GIVEN a collection point in the list
- WHEN the card renders
- THEN it shows name, address, distance, hours, contact, accepted waste types, and available/unavailable

### Requirement: Directions

Each point MUST offer “Cómo llegar”, which MUST open Google Maps with that destination (or an equivalent maps URL).

#### Scenario: Open Google Maps

- GIVEN a selected point
- WHEN the user taps “Cómo llegar”
- THEN Google Maps opens with that address or coordinates
