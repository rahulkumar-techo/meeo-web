# Feature: Wishlist & Desired Drops (`/wishlist`)

## Overview
The Wishlist experience allows collectors to save pieces for future acquisition, monitor live price changes, and fast-track items into their shopping bag.

## Components Breakdown
- `WishlistHero.tsx`: Title, subtitle, and dynamic item counter.
- `WishlistGrid.tsx`: Saved products grid with immediate "Move to Bag" actions and single-tap dismissal.

## Consistency Metrics
- Strictly under 330 lines per file.
- Synced globally across all views via `WishlistContext`.
