import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

// The `feedback` Edge Function (boojy-cloud, P4) is NOT built yet — invoking it fails and
// the visitor's message is lost. Until it ships, Send hands the message to the visitor's
// own email app (mailto) instead. Flip this to true in the SAME release that deploys the
// Edge Function and swaps in the real Turnstile keys (see .claude/rules/feedback.md).
const FEEDBACK_BACKEND_LIVE: boolean = false;
const FEEDBACK_EMAIL = 'tyr@boojy.org';

// Cloudflare Turnstile TEST key — always passes and renders a visible widget, so the
// form is reviewable in dev. Swap for the real Boojy site key once the Turnstile widget
// is created in the Cloudflare dashboard (and set the matching secret on the Edge Function).
const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

export function Feedback() {
  const [type, setType] = useState('Bug');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [turnstileBlocked, setTurnstileBlocked] = useState(false);

  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Load the Turnstile script once and explicitly render the widget into our ref.
  // Skipped entirely on the mailto path — the visitor's own mail client is the spam gate.
  useEffect(() => {
    if (!FEEDBACK_BACKEND_LIVE) return;
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !window.turnstile || !widgetEl.current || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(widgetEl.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        callback: (t: string) => setToken(t),
        'expired-callback': () => setToken(null),
        'error-callback': () => setToken(null),
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    // Ad blockers / privacy extensions commonly block challenges.cloudflare.com — without
    // this, the widget area stays empty and the form is unsubmittable with no explanation.
    const onError = () => {
      if (!cancelled) setTurnstileBlocked(true);
    };
    script.addEventListener('load', renderWidget);
    script.addEventListener('error', onError);
    return () => {
      cancelled = true;
      script?.removeEventListener('load', renderWidget);
      script?.removeEventListener('error', onError);
    };
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!message.trim()) {
      setError('Add a short message first.');
      return;
    }

    if (!FEEDBACK_BACKEND_LIVE) {
      const subject = encodeURIComponent(`Boojy feedback — ${type}`);
      const replyTo = email.trim() ? `\n\nReply to: ${email.trim()}` : '';
      const body = encodeURIComponent(`${message.trim()}${replyTo}`);
      window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
      setStatus('mailto');
      return;
    }

    if (!token) {
      setError(
        turnstileBlocked
          ? `The anti-spam check was blocked (ad blocker?) — email ${FEEDBACK_EMAIL} instead.`
          : 'Please complete the anti-spam check.',
      );
      return;
    }

    setStatus('sending');
    const { error: fnError } = await supabase.functions.invoke('feedback', {
      body: {
        type,
        email: email.trim() || null,
        message: message.trim(),
        turnstileToken: token,
      },
    });

    if (fnError) {
      setStatus('error');
      setError(`Something went wrong — please try again, or email ${FEEDBACK_EMAIL}.`);
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      setToken(null);
      return;
    }
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <div className="feedback-success">
        <div className="feedback-success-icon">✦</div>
        <p>Thanks — your message landed. I read every one.</p>
      </div>
    );
  }

  if (status === 'mailto') {
    return (
      <div className="feedback-success">
        <div className="feedback-success-icon">✦</div>
        <p>
          Your email app should have opened with your message — just hit send. Nothing opened? Email{' '}
          <a href={`mailto:${FEEDBACK_EMAIL}`}>{FEEDBACK_EMAIL}</a> directly.
        </p>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={onSubmit}>
      <div className="feedback-row">
        <input
          className="feedback-input"
          type="email"
          placeholder="Email (optional, for a reply)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email (optional)"
        />
        <select
          className="feedback-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Type of feedback"
        >
          <option>Bug</option>
          <option>Idea</option>
          <option>Other</option>
        </select>
      </div>
      <textarea
        className="feedback-textarea"
        placeholder="What happened, or what's on your mind?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        aria-label="Your message"
        required
      />
      <div className="feedback-actions">
        {FEEDBACK_BACKEND_LIVE && !turnstileBlocked && (
          <div className="feedback-turnstile" ref={widgetEl} />
        )}
        {FEEDBACK_BACKEND_LIVE && turnstileBlocked && (
          <p className="feedback-error">
            Anti-spam check blocked? Email <a href={`mailto:${FEEDBACK_EMAIL}`}>{FEEDBACK_EMAIL}</a>{' '}
            instead.
          </p>
        )}
        <button className="feedback-submit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send →'}
        </button>
      </div>
      {error && <p className="feedback-error">{error}</p>}
    </form>
  );
}
