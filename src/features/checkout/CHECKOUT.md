# Feature: Checkout & Payment Selection Experience (`/checkout`)

## Overview
The Checkout experience features a streamlined 3-stage progression (Shipping Destination -> Logistics Speed -> Payment Gateway Selector) supporting UPI QR/VPA, Credit/Debit cards, NetBanking, EMI, and Cash on Delivery.

## Components Breakdown
- `CheckoutSteps.tsx`: Address inputs, shipping method selector (BlueDart Air Priority vs Standard), and active step navigation.
- `PaymentGatewaySelector.tsx`: Integrated multi-rail payment options with instant inline validation.
- `CheckoutOrderReview.tsx`: Item preview, coupon savings breakdown, security trust lockup, and authorization CTA.

## Consistency Metrics
- Strictly under 330 lines per file.
- Direct redirection to `/orders` confirmation and real-time order tracking upon completion.
