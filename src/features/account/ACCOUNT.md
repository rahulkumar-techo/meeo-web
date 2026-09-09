# Feature: Customer Account & Studio Dashboard (`/account`, `/account/settings`)

## Overview
The Customer Account Dashboard manages the user's Studio Tier membership, reward points, active product hardware warranties, saved dispatch destinations, tokenized payment methods, and user settings & preferences (Dark Mode, Push notifications, telemetry, and packaging preferences).

## Components Breakdown
- `AccountProfileHeader.tsx`: Member avatar, Studio Tier status badge, points wallet, warranty summary, and fast Settings link.
- `SavedAddressesCard.tsx`: Saved multi-destination address book with default selection indicators.
- `SavedPaymentsCard.tsx`: Tokenized payment cards and UPI VPAs.
- `AccountSettings.tsx`:
  - **Visual Theme & Dark Mode:** Light Canvas, Dark Obsidian, and System Automatic modes with instant DOM switching.
  - **Telemetry & Notifications:** Push notifications, SMS/WhatsApp courier GPS alerts, archival drop invites, and price drop notifications.
  - **Shopping Preferences:** Currency selector (INR, USD, EUR, GBP), packaging mode (Zero-Plastic Eco-Cushion vs Studio Velvet Gift Box), auto-open bag drawer toggle, and 2FA authentication.

## Consistency Metrics
- Strictly under 330 lines per file.
- Synced globally across client sessions via `ThemeContext` and `localStorage`.
