/**
 * Boojy Account — Auth + Dashboard
 */

const SUPABASE_URL = 'https://wupmcvhzstgsdrvcigtm.supabase.co';
// This is the Supabase anon (public) key — safe to expose in client-side code.
// Access is restricted by Row Level Security (RLS) policies.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cG1jdmh6c3Rnc2RydmNpZ3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODkzNDMsImV4cCI6MjA4NzM2NTM0M30.D8Zbzblj0oyP28ACJystGWSmqmwdBIyp7mMQmwqtPjM';

// Init Supabase client safely
let sb = null;
try {
    const createClient = (window.supabase && window.supabase.createClient)
        || (window.Supabase && window.Supabase.createClient);
    if (createClient) {
        sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error('Supabase client library not loaded');
    }
} catch (err) {
    console.error('Failed to create Supabase client:', err);
}

// DOM elements
const signinView = document.getElementById('signin-view');
const dashboardView = document.getElementById('dashboard-view');
const emailForm = document.getElementById('email-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const emailSubmit = document.getElementById('email-submit');
const emailToggle = document.getElementById('email-toggle');
const authError = document.getElementById('auth-error');
const btnGoogle = document.getElementById('btn-google');
const btnApple = document.getElementById('btn-apple');
const btnEmail = document.getElementById('btn-email');
const nameInput = document.getElementById('name-input');
const btnSignOut = document.getElementById('btn-signout');

// Dashboard elements
const dashName = document.getElementById('dash-name');
const dashEmail = document.getElementById('dash-email');
const dashTier = document.getElementById('dash-tier');
const dashStorageBar = document.getElementById('dash-storage-bar');
const dashStorageText = document.getElementById('dash-storage-text');
const dashManage = document.getElementById('dash-manage');
const dashUpgrade = document.getElementById('dash-upgrade');

let isSignUp = false;

// ===================================
// Views
// ===================================
function showSignIn() {
    if (signinView) signinView.style.display = 'block';
    if (dashboardView) dashboardView.style.display = 'none';
    if (emailForm) emailForm.style.display = 'none';
    if (authError) authError.textContent = '';
}

async function showDashboard(user) {
    if (signinView) signinView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    if (dashEmail) dashEmail.textContent = user.email || 'No email';
    if (dashName) dashName.textContent = user.user_metadata?.display_name || '—';

    try {
        const { data: profile } = await sb
            .from('profiles')
            .select('tier, storage_limit_bytes, stripe_customer_id, display_name')
            .eq('id', user.id)
            .maybeSingle();

        const { data: usage } = await sb
            .from('storage_usage')
            .select('bytes_used, file_count')
            .eq('user_id', user.id)
            .maybeSingle();

        if (profile) {
            if (dashName && profile.display_name) dashName.textContent = profile.display_name;
            dashTier.textContent = profile.tier === 'orbit' ? 'Orbit' : 'Free';
            dashTier.className = 'dash-tier-badge dash-tier-' + profile.tier;

            if (profile.tier === 'orbit' && profile.stripe_customer_id) {
                dashManage.style.display = 'inline-block';
                dashUpgrade.style.display = 'none';
            } else {
                dashManage.style.display = 'none';
                dashUpgrade.style.display = 'inline-block';
            }

            if (usage) {
                const used = usage.bytes_used;
                const limit = profile.storage_limit_bytes;
                const pct = Math.min(100, (used / limit) * 100);
                dashStorageBar.style.width = pct + '%';
                dashStorageText.textContent = formatBytes(used) + ' / ' + formatBytes(limit);
            }
        }
    } catch (err) {
        console.error('Failed to load profile:', err);
    }
}

// ===================================
// Email Auth UI (works even without Supabase)
// ===================================
if (btnEmail) {
    btnEmail.addEventListener('click', () => {
        if (emailForm) {
            emailForm.style.display = emailForm.style.display === 'none' ? 'flex' : 'none';
        }
        if (authError) authError.textContent = '';
    });
}

function handleToggle(e) {
    e.preventDefault();
    isSignUp = !isSignUp;
    if (emailSubmit) {
        emailSubmit.textContent = isSignUp ? 'Create Account' : 'Sign In';
        emailSubmit.disabled = false;
    }
    if (nameInput) nameInput.style.display = isSignUp ? 'block' : 'none';
    if (emailToggle) {
        emailToggle.innerHTML = isSignUp
            ? 'Already have an account? <a href="#" id="email-toggle-link">Sign in</a>'
            : 'Don\'t have an account? <a href="#" id="email-toggle-link">Create one</a>';
        var link = document.getElementById('email-toggle-link');
        if (link) link.addEventListener('click', handleToggle);
    }
    if (authError) authError.textContent = '';
}

var toggleLink = document.getElementById('email-toggle-link');
if (toggleLink) toggleLink.addEventListener('click', handleToggle);

// ===================================
// Email Submit
// ===================================
if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!sb) {
            if (authError) authError.textContent = 'Auth service unavailable. Please refresh.';
            return;
        }
        if (authError) authError.textContent = '';
        if (emailSubmit) {
            emailSubmit.disabled = true;
            emailSubmit.textContent = 'Loading...';
        }

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        if (!email || !password) {
            if (authError) authError.textContent = 'Please fill in both fields.';
            if (emailSubmit) {
                emailSubmit.disabled = false;
                emailSubmit.textContent = isSignUp ? 'Create Account' : 'Sign In';
            }
            return;
        }

        if (password.length < 6) {
            if (authError) authError.textContent = 'Password must be at least 6 characters.';
            if (emailSubmit) {
                emailSubmit.disabled = false;
                emailSubmit.textContent = isSignUp ? 'Create Account' : 'Sign In';
            }
            return;
        }

        try {
            let result;
            if (isSignUp) {
                const name = nameInput ? nameInput.value.trim() : '';
                result = await sb.auth.signUp({
                    email,
                    password,
                    options: { data: { display_name: name || undefined } }
                });
            } else {
                result = await sb.auth.signInWithPassword({ email, password });
            }

            if (result.error) {
                if (authError) authError.textContent = result.error.message;
            } else if (isSignUp && !result.data?.session) {
                // Email confirmation required
                if (authError) {
                    authError.style.color = 'var(--color-accent, #A4CACE)';
                    authError.textContent = 'Check your email for a confirmation link.';
                }
                if (emailSubmit) {
                    emailSubmit.disabled = true;
                    emailSubmit.textContent = 'Email sent';
                }
                return;
            }
        } catch (err) {
            console.error('Auth error:', err);
            if (authError) authError.textContent = 'Something went wrong. Please try again.';
        }

        if (emailSubmit) {
            emailSubmit.disabled = false;
            emailSubmit.textContent = isSignUp ? 'Create Account' : 'Sign In';
        }
    });
}

// ===================================
// OAuth
// ===================================
if (btnGoogle) {
    btnGoogle.addEventListener('click', async () => {
        if (!sb) return;
        try {
            await sb.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin + '/account/' }
            });
        } catch (err) {
            console.error('Google OAuth error:', err);
        }
    });
}

if (btnApple) {
    btnApple.addEventListener('click', async () => {
        if (!sb) return;
        try {
            await sb.auth.signInWithOAuth({
                provider: 'apple',
                options: { redirectTo: window.location.origin + '/account/' }
            });
        } catch (err) {
            console.error('Apple OAuth error:', err);
        }
    });
}

// ===================================
// Sign Out
// ===================================
if (btnSignOut) {
    btnSignOut.addEventListener('click', async () => {
        if (!sb) return;
        try {
            await sb.auth.signOut();
        } catch (err) {
            console.error('Sign out error:', err);
        }
    });
}

// ===================================
// Manage Subscription (Stripe Portal)
// ===================================
if (dashManage) {
    dashManage.addEventListener('click', async () => {
        if (!sb) return;
        try {
            const { data: { session } } = await sb.auth.getSession();
            if (!session) return;
            window.location.href = 'https://billing.stripe.com/p/login/4gMbJ31tz6cB0IbaOvbZe00';
        } catch (err) {
            console.error('Manage subscription error:', err);
        }
    });
}

// ===================================
// Helpers
// ===================================
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(i > 1 ? 1 : 0) + ' ' + units[i];
}

// ===================================
// Init
// ===================================
if (sb) {
    sb.auth.onAuthStateChange((event, session) => {
        if (session) {
            showDashboard(session.user);
        } else {
            showSignIn();
        }
    });

    // Check for existing session
    (async () => {
        try {
            const { data: { session } } = await sb.auth.getSession();
            if (session) {
                showDashboard(session.user);
            }
        } catch (err) {
            console.error('Session check failed:', err);
        }
    })();
}
