---
paths:
  - "website/src/pages/cloud/**"
---

# Stripe (durable facts)

- **Cloud is free-only (decision 2026-06-11): the paid "Orbit" tier is dropped.** The live `/cloud/`
  page is the free-only rebuild (no pricing, no checkout, "Get Boojy Notes →" CTA).
- Dormant remnants still parked behind `CLOUD_LAUNCHED = false`: the Stripe test-mode product,
  boojy-cloud's create-checkout/stripe-webhook functions, `useAccount`'s Orbit tier mapping, and the
  gated billing UI in `Account.tsx` (its "Manage Subscription" button has **no handler and no
  backing edge function** — never flip the flag without removing or finishing them). Plan of record:
  **remove, don't launch**, when this area is next touched.
