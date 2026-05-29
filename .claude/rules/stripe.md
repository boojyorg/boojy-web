---
paths:
  - "website/src/pages/cloud/**"
---

# Stripe (durable facts)

- Currently **test mode**. Product: **Boojy Cloud Orbit**.
- Checkout is **gated** — `CLOUD_LAUNCHED` is `false`, so `/cloud/` shows a disabled "Coming soon"
  button and **no checkout island is wired** this pass. The Customer Portal handles subscription
  management once live.
