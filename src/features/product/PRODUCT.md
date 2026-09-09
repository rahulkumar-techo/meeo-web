# Feature: Product Details Experience (`/product/[id]`)

## Overview
The Product Details Page (PDP) provides high-spatial fidelity presentation for Meeo's hardware, sneakers, and living objects. It features multi-angle photography zoom, tactical specifications matrix, verified reviews, colorway swatches, size selectors, and dual-viewport mobile buy docks.

## Components Breakdown
- `ProductGallery.tsx`: Multi-angle high-resolution imagery with active thumbnail selector and status badge overlays.
- `ProductInfo.tsx`: Product name, coral punctuation mark, rating stats, pricing breakdown, colorway selectors, size selectors, quantity modifier, and primary CTAs.
- `ProductSpecs.tsx`: Tactile specs table (tolerances, weights, acoustic drivers, origin) and verified material certifications.
- `ProductReviewsSection.tsx`: Discerning owner reviews, helpful upvote toggles, rating distributions, and interactive review modal.
- `MobileStickyBuy.tsx`: Sticky purchase dock tailored specifically for mobile touch viewports.

## Consistency Metrics
- Strictly under 330 lines per file.
- Unbroken color palette and typography across desktop and mobile.
