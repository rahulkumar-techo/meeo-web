# Feature: Meeo Admin & Commerce Studio (`/admin`)

## Overview
The Admin & Commerce Studio provides real-time gross vault revenue telemetry, active dispatches status, catalog SKU stock management, and fulfillment status updates.

## Components Breakdown
- `AdminMetricsStrip.tsx`: Gross revenue, active dispatches, studio members, and low-return metrics.
- `AdminInventoryTable.tsx`: Inventory SKU catalog with live increment/decrement stock unit controls and threshold indicators.
- `AdminOrdersManager.tsx`: Order fulfillment pipeline with status modification dropdowns and direct link to real-time milestone telemetry.

## Consistency Metrics
- Strictly under 330 lines per file.
- Follows the exact Meeo design system tokens and visual identity.
