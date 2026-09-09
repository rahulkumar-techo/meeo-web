# Feature: Meeo Homepage & Editorial Discovery (`/`)

## Overview
The Homepage establishes Meeo's independent visual identity, editorial tone, and mindful tech-commerce curation. It avoids generic supermarket grid designs in favor of rich typographic hierarchy, asymmetrical bento showcases, and quick tactile discovery filters.

## Components Breakdown
- `HeroSection.tsx`: Editorial headline with coral accent punctuation (`Find something you'll love.`), drop pill badge, primary CTAs, metric strip, and flagship hardware showcase.
- `DiscoveryDock.tsx`: Sticky horizontal category filter pill dock with smooth active states.
- `BentoCollections.tsx`: Editorial asymmetrical layout showcasing limited drops and category flagships.
- `CuratorSpotlight.tsx`: Brand craftsmanship standards (Monolithic CNC, Zero-Plastic, Acoustic Calibration, Discerning Warranty).
- `DropsTeaser.tsx`: Live-updating countdown banner for limited serialized drops.

## Design & Consistency Matrix
- **Typography:** `Plus Jakarta Sans` across all headings (`text-4xl` to `text-6xl`) and body text.
- **Color Identity:** Digital Ultramarine (`#412ce7`), Warm Coral (`#fd6a49`), Airy Canvas (`#faf8ff`), Midnight Slate (`#131b2e`).
- **File Length Rule:** All components are strictly under 330 lines.
- **Responsiveness:** Full multi-device support (Desktop, Tablet, Mobile) with mobile quick-add triggers.
