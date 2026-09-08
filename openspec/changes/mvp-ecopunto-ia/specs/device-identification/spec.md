# device-identification Specification

## Purpose

Identify an electronic device from a photo or manual category, and let the user correct mistakes.

## Requirements

### Requirement: Capture from camera or gallery

An authenticated user MUST be able to take a photo with the phone camera or upload one from the gallery. Photos MUST be stored in private Supabase Storage owned by that user.

#### Scenario: Gallery upload

- GIVEN a signed-in user on Escanear
- WHEN they pick a gallery image of a laptop
- THEN the system accepts the image and starts identification

### Requirement: Classify into catalog categories

The system MUST send the photo to Gemini and map the result to a catalog type (phones, computers, laptops, tablets, chargers, batteries, cells, headphones, TVs, printers, cables, peripherals, small appliances, or unknown). The UI MUST show the identified device name, a representative image or icon, and a short description.

#### Scenario: Successful identification

- GIVEN Gemini returns “smartphone” with a catalog match
- WHEN results render
- THEN the user sees a clear device name and can continue to guidance

#### Scenario: Unknown or low confidence

- GIVEN Gemini cannot match a catalog type
- WHEN results render
- THEN the system offers “No sé qué es” / manual category pick
- AND does not invent a device name

### Requirement: User correction

The user MUST be able to correct the identification before guidance and map matching use the type.

#### Scenario: User fixes a wrong class

- GIVEN the app identified “tablet”
- WHEN the user changes it to “phone”
- THEN later guidance and collection-point filters use phone
