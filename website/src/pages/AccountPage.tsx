import '../../public/css/account.css';
import { Link } from 'react-router-dom';
import { useAccount } from '../hooks/useAccount';

export function AccountPage() {
  const {
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
    showBillingUi,
    toggleEmailForm,
    toggleSignUpMode,
    submitEmailAuth,
    signInWithGoogle,
    signInWithApple,
    signOut,
  } = useAccount();

  if (loading) {
    return (
      <main className="account-page">
        <div className="account-container" />
      </main>
    );
  }

  return (
    <main className="account-page">
      <div className="account-container">
        {!user ? (
          <div id="signin-view">
            <div className="account-section-header">
              <span>PROFILE</span>
              <hr />
            </div>

            <div className="account-signin-prompt">
              <div className="account-cloud-icon">☁</div>
              <p>
                Create your Boojy account. Cloud storage is rolling out soon — we&rsquo;ll let you
                know when sync is ready.
              </p>

              <div className="auth-buttons">
                <button type="button" className="auth-btn auth-btn-email" onClick={toggleEmailForm}>
                  <EmailIcon />
                  Continue with Email
                </button>

                {showEmailForm ? (
                  <form id="email-form" className="email-form" onSubmit={submitEmailAuth}>
                    {isSignUp ? (
                      <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Name"
                      />
                    ) : null}
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="Email"
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      className="form-input"
                      placeholder="Password"
                      minLength={6}
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      disabled={submitting || Boolean(authSuccess)}
                    >
                      {submitting ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                    <p className="email-toggle">
                      {isSignUp ? (
                        <>
                          Already have an account?{' '}
                          <a href="#" onClick={toggleSignUpMode}>
                            Sign in
                          </a>
                        </>
                      ) : (
                        <>
                          Don&apos;t have an account?{' '}
                          <a href="#" onClick={toggleSignUpMode}>
                            Create one
                          </a>
                        </>
                      )}
                    </p>
                    {authError ? <p className="auth-error">{authError}</p> : null}
                    {authSuccess ? (
                      <p className="auth-error" style={{ color: 'var(--color-accent, #A4CACE)' }}>
                        {authSuccess}
                      </p>
                    ) : null}
                  </form>
                ) : null}

                <button type="button" className="auth-btn auth-btn-google" onClick={signInWithGoogle}>
                  <GoogleIcon />
                  Continue with Google
                </button>
                <button type="button" className="auth-btn auth-btn-apple" onClick={signInWithApple}>
                  <AppleIcon />
                  Continue with Apple
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div id="dashboard-view">
            <div className="account-section-header">
              <span>PROFILE</span>
              <hr />
            </div>

            <div className="dash-profile">
              <div className="dash-row">
                <span className="dash-label">Name</span>
                <span className="dash-value">{displayName}</span>
              </div>
              <div className="dash-row">
                <span className="dash-label">Email</span>
                <span className="dash-value">{user.email ?? 'No email'}</span>
              </div>
              <div className="dash-row">
                <span className="dash-label">Plan</span>
                <span className={`dash-tier-badge ${tierClass}`}>{tier}</span>
              </div>
            </div>

            {showBillingUi ? (
              <>
                <div
                  className="account-section-header"
                  style={{ marginTop: 'var(--spacing-2xl)' }}
                >
                  <span>STORAGE</span>
                  <hr />
                </div>
                <div className="dash-storage">
                  <div className="dash-storage-track">
                    <div className="dash-storage-fill" style={{ width: '0%' }} />
                  </div>
                  <p className="dash-storage-text">0 B / 500 MB</p>
                </div>
              </>
            ) : null}

            <div className="dash-actions">
              {showBillingUi ? (
                <>
                  <Link to="/cloud/" className="btn btn-primary">
                    Upgrade to Orbit
                  </Link>
                  <button type="button" className="btn btn-secondary">
                    Manage Subscription
                  </button>
                </>
              ) : null}
              <button type="button" className="btn-signout" onClick={signOut}>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13 2 4" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
