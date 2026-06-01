export const CLOUD_INTRO =
  'Boojy Cloud is already live: Boojy Notes syncs free across your devices, up to 500 MB. A paid tier with more storage is on the way.';

export const CLOUD_AUDIO_NOTE = 'Coming to Boojy Audio next.';

export const CLOUD_PRICING = [
  {
    name: 'Free',
    amount: '$0',
    period: '/ forever',
    highlight: false,
    status: 'live',
    // Free sync lives inside the Notes app, so point people there.
    cta: { label: 'Get Boojy Notes →', href: '/notes/' },
    features: ['500 MB storage', 'Sync across devices', 'All app features'],
  },
  {
    name: 'Orbit',
    amount: '$5',
    period: '/ month',
    highlight: true,
    status: 'coming',
    // Waitlist deferred until the capture backend exists — no CTA yet.
    cta: null,
    features: ['10 GB storage', 'Everything in Free', 'Priority support'],
  },
] as const;

export const CLOUD_ETHICS = [
  {
    title: 'One-click cancel',
    body: 'No hoops, no retention flows. Cancel anytime from your account.',
  },
  {
    title: 'Keep your data',
    body: 'If you cancel, your notes stay on your device. Nothing gets deleted.',
  },
  {
    title: 'Open export',
    body: 'Your notes are plain markdown files. Export everything anytime.',
  },
  {
    title: 'Graceful downgrade',
    body: 'Cancel Orbit and you keep Free. No data loss, no lockout.',
  },
  {
    title: '7-day refund',
    body: 'Changed your mind? Get a full refund within 7 days. No questions asked.',
  },
] as const;

// Deferred: the Cloud FAQ section is hidden for now (pre-launch, no real questions yet).
// Kept here so it can be restored once the paid tier ships. See dreams.md / roadmap memory.
export const CLOUD_FAQ = [
  {
    question: 'What happens if I cancel?',
    answer:
      "When Cloud launches, your notes stay on your device — nothing gets deleted. You'll keep the Free plan with 500 MB of cloud storage. If you're over the Free limit, syncing pauses until you're under 500 MB, but your local notes are always accessible.",
  },
  {
    question: 'What if I go over my storage limit?',
    answer:
      "When Cloud launches, you'll get a heads-up when you're close to your limit. Once you hit the limit, syncing pauses for new notes — but everything already synced stays available. You can free up space or upgrade to continue syncing.",
  },
  {
    question: 'Is my data encrypted?',
    answer:
      'Yes. All data is encrypted in transit (TLS) and at rest. Your notes are stored securely and only accessible to you.',
  },
  {
    question: 'Can I export my notes?',
    answer:
      'Absolutely. Your notes are standard markdown files. You can export them at any time — no lock-in, no proprietary format.',
  },
] as const;
