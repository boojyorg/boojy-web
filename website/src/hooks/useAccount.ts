import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { CLOUD_LAUNCHED, supabase } from '../lib/supabase';

interface Profile {
  tier: string;
  display_name: string | null;
}

export function useAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadProfile = useCallback(async (currentUser: User) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('tier, display_name')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (data) setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) void loadProfile(session.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setProfile(null);
      if (session?.user) {
        void loadProfile(session.user);
      } else {
        setShowEmailForm(false);
        setIsSignUp(false);
        setAuthError('');
        setAuthSuccess('');
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const toggleEmailForm = () => {
    setShowEmailForm((open) => !open);
    setAuthError('');
    setAuthSuccess('');
  };

  const toggleSignUpMode = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsSignUp((signUp) => !signUp);
    setAuthError('');
    setAuthSuccess('');
  };

  const submitEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const name = String(formData.get('name') ?? '').trim();

    if (!email || !password) {
      setAuthError('Please fill in both fields.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name || undefined } },
        });

        if (error) {
          setAuthError(error.message);
        } else if (!data.session) {
          setAuthSuccess('Check your email for a confirmation link.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setAuthError(error.message);
      }
    } catch {
      setAuthError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/account/` },
      });
    } catch (err) {
      console.error('Google OAuth error:', err);
    }
  };

  const signInWithApple = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: `${window.location.origin}/account/` },
      });
    } catch (err) {
      console.error('Apple OAuth error:', err);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const displayName =
    profile?.display_name ?? user?.user_metadata?.display_name ?? '—';
  const tier = profile?.tier === 'orbit' ? 'Orbit' : 'Free';
  const tierClass = profile?.tier === 'orbit' ? 'dash-tier-orbit' : 'dash-tier-free';

  return {
    user,
    loading,
    showEmailForm,
    isSignUp,
    authError,
    authSuccess,
    submitting,
    displayName,
    tier,
    tierClass,
    showBillingUi: CLOUD_LAUNCHED,
    toggleEmailForm,
    toggleSignUpMode,
    submitEmailAuth,
    signInWithGoogle,
    signInWithApple,
    signOut,
  };
}
