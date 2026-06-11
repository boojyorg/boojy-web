# Backlog — boojy.org

Unscheduled "someday" items. The **ordered sequence** is `docs/ROADMAP.md`; the **current target**
is `dreams.md`. Pull from here into a milestone when it's time.

## Styling / cleanup (no schedule)

- **Tailwind/shadcn restyle.** The Astro migration was framework-only; a visual restyle is a
  separate future task.
- **Semantic `a→button`** for the 7 `useValidAnchor` sites (the rule is currently off in
  `biome.json`).
- **Single config-driven download island** — replace the two parallel `AudioDownload` /
  `NotesDownload` components with one.
- **404 self-canonical** without trailing slash.

## Deferred features

- **Cloud paid-tier email waitlist** — needs its backend (Supabase table + Edge Function +
  Turnstile, same pattern as Feedback); `/cloud` just states "paid coming" for now. (Tied to P4.)
- **FaqAccordion** — component kept but unmounted (was only on `/cloud`, whose FAQ is deferred);
  remount when a FAQ returns.
