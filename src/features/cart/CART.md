# Feature: Shopping Cart Experience (`/cart`)

## Overview
The full-page Shopping Cart provides item quantity modification, instant discount code validation, a live free shipping unlocking meter, and clear cost breakdowns.

## Components Breakdown
- `CartItemList.tsx`: Cart item rows with thumbnail preview, size/color specs, counter increment/decrement controls, and removal triggers.
- `CartSummaryCard.tsx`: Sticky order summary, dynamic shipping calculation, coupon application engine, and high-contrast checkout CTA.

## Consistency Metrics
- Strictly under 330 lines per file.
- Synced bidirectionally with the slide-over `CartDrawer` via `CartContext`.
