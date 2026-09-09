# Feature: Order Confirmation & Real-Time Logistics Tracking (`/orders`, `/orders/[id]`)

## Overview
The Order Tracking experience provides live GPS milestone verification from the Central Vault to the customer's doorstep, telemetry updates, courier agent contact simulation, and historical invoice downloads.

## Components Breakdown
- `OrderConfirmationCard.tsx`: Order confirmation banner, estimated arrival date, carrier telemetry (BlueDart Express Air Priority), and invoice download CTA.
- `OrderMilestonesTimeline.tsx`: Verified milestone steps with progress line, active ping indicator, GPS distance calculation, and direct dispatcher contact.
- `OrderHistoryList.tsx`: Complete overview of customer orders with quick-track triggers.

## Consistency Metrics
- Strictly under 330 lines per file.
- Clean responsive layout for both tracking details and history views.
