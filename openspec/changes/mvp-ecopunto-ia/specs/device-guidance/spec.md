# device-guidance Specification

## Purpose

Tell the user what the device is, what to do, and what not to do, using the catalog—not free-form model text.

## Requirements

### Requirement: Catalog-backed ficha

After a type is known, the system MUST show: waste category; whether it can still be used, reused, repaired, donated, recycled; when special handling is required; storage-time danger; main risks (damaged batteries, overheating, short circuits, internal substances, deterioration); what to do and what not to do (including not putting it in household trash when applicable); temporary safe storage; how to transport it. For phones, computers, and tablets the system MUST remind the user to wipe personal data and remove SIM/memory when applicable.

#### Scenario: Phone ficha includes wipe reminder

- GIVEN the selected type is a phone
- WHEN guidance is shown
- THEN the user sees reuse/repair/donate/recycle flags
- AND a reminder to erase data and remove SIM before drop-off

#### Scenario: Battery not in household trash

- GIVEN the type is a battery or cell
- WHEN guidance is shown
- THEN the user is told not to put it in conventional trash
- AND to use special handling / a battery-accepting point

### Requirement: Optional condition questions

The system MAY ask whether it powers on, is broken, has a swollen battery, or was water-exposed. Questions MUST be skippable. If answered, recommendations MUST adjust (e.g. swollen battery → do not store long, do not puncture, prefer special handling).

#### Scenario: User skips questions

- GIVEN guidance is visible
- WHEN the user skips condition questions
- THEN default catalog advice is shown

#### Scenario: Swollen battery changes advice

- GIVEN the user marks the battery as swollen
- WHEN recommendations update
- THEN storage/transport copy is stricter than the default
