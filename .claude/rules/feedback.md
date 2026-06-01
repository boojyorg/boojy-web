---
paths:
  - "website/src/components/Feedback.tsx"
  - "website/src/pages/index.astro"
---

# Feedback form (durable facts)

- **`Feedback.tsx`** is a React island (`client:visible`) in the homepage `#feedback` section. Fields:
  type (Bug/Idea/Other), optional email, message, + a **Cloudflare Turnstile** widget. On submit it
  calls `supabase.functions.invoke('feedback', { body: { type, email, message, turnstileToken } })`.
- **Anti-spam by design.** A naive public Supabase insert is spammable, so submissions go through an
  Edge Function that **verifies the Turnstile token server-side** before inserting. Don't "simplify"
  this to a direct client insert.
- **Turnstile keys.** The site key in `Feedback.tsx` is the Cloudflare **TEST** key
  `1x00000000000000000000AA` (always passes, renders a visible widget for dev). Before prod: create a
  Turnstile widget for boojy.org → swap the real **site key** here + set the matching **secret key**
  on the Edge Function. The script is loaded explicitly (`render=explicit`) and rendered into a ref.
- **`feedback` Edge Function** lives in the **`boojy-cloud`** repo (like the others — see
  `.claude/rules/supabase.md`): verify Turnstile token → insert into a `feedback` table (+ migration).
  **Status: not built yet** as of 2026-06-01 — the UI ships ahead of the backend.
- **Reuse target:** the planned **Cloud paid-tier email waitlist** should reuse this exact pattern
  (Turnstile-verified Edge Function insert), not invent a second anti-spam path.
