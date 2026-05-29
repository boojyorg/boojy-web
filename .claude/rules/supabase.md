---
paths:
  - "website/src/lib/supabase.ts"
  - "website/src/components/Account.tsx"
  - "website/src/pages/account/**"
  - "website/src/pages/cloud/**"
---

# Supabase (durable facts)

- **Project ref:** `wupmcvhzstgsdrvcigtm`
- **Key tables:** `profiles`, `storage_usage`, `notes_metadata`
- **Auth providers:** Email, Google, Apple
- **Edge Functions** (live in the `boojy-cloud` repo): create-checkout, stripe-webhook, sync-push,
  sync-pull, sync-delete, storage-check, auth-webhook.
- Edge Function calls need **both** `apikey` and `Authorization` headers; functions deploy with
  `--no-verify-jwt`. Use `.maybeSingle()` not `.single()` for queries that may return no rows.
