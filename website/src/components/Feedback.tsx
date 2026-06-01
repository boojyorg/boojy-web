import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

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

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Feedback() {
  const [type, setType] = useState('Bug');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Load the Turnstile script once and explicitly render the widget into our ref.
  useEffect(() => {
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
    script.addEventListener('load', renderWidget);
    return () => {
      cancelled = true;
      script?.removeEventListener('load', renderWidget);
    };
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!message.trim()) {
      setError('Add a short message first.');
      return;
    }
    if (!token) {
      setError('Please complete the anti-spam check.');
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
      setError('Something went wrong — please try again, or email tyr@boojy.org.');
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
        <div className="feedback-turnstile" ref={widgetEl} />
        <button className="feedback-submit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send →'}
        </button>
      </div>
      {error && <p className="feedback-error">{error}</p>}
    </form>
  );
}
