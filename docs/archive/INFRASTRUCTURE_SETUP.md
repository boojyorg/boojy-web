# Boojy Infrastructure Setup Plan

Complete guide for setting up analytics, forms, crash reporting, and privacy policy.

---

## 1. Umami Analytics (Self-hosted on Railway)

### Why Umami?
- Privacy-focused, GDPR compliant
- No cookies required
- Self-hosted = free forever
- Clean dashboard

### Setup Steps

1. **Create Railway account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Umami**
   - Go to https://railway.app/template/umami
   - Click "Deploy Now"
   - Railway will create PostgreSQL database automatically
   - Wait for deployment (~2-3 minutes)

3. **Access Umami Dashboard**
   - Click on the deployed service
   - Find the public URL (e.g., `umami-xxx.up.railway.app`)
   - Default login: `admin` / `umami`
   - **Change password immediately**

4. **Add Your Website**
   - Go to Settings → Websites → Add Website
   - Name: `Boojy`
   - Domain: `boojy.org`
   - Click Save

5. **Get Tracking Script**
   - Click on your website → Get Tracking Code
   - Copy the script tag

6. **Add to Website**
   - Open `website/index.html`
   - Add before `</head>`:
   ```html
   <!-- Umami Analytics -->
   <script defer src="https://YOUR-UMAMI-URL.up.railway.app/script.js" data-website-id="YOUR-WEBSITE-ID"></script>
   ```

### Verify
- Visit your site
- Check Umami dashboard for pageview

---

## 2. Netlify Forms

### Why Netlify Forms?
- Already using Netlify for hosting
- No backend needed
- Free tier: 100 submissions/month
- Spam filtering included

### Setup Steps

1. **Update Email Signup Form**

   In `website/index.html`, find the signup form and update:

   ```html
   <form name="email-signup" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="signup-form-inline">
       <input type="hidden" name="form-name" value="email-signup">
       <p class="hidden" style="display:none;">
           <label>Don't fill this out: <input name="bot-field"></label>
       </p>
       <input type="email" name="email" placeholder="Your email" required class="signup-input">
       <button type="submit" class="btn-signup">Subscribe</button>
   </form>
   ```

2. **Update Bug Report Form**

   Find the bug report form and update:

   ```html
   <form name="bug-report" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="bug-report-form">
       <input type="hidden" name="form-name" value="bug-report">
       <p class="hidden" style="display:none;">
           <label>Don't fill this out: <input name="bot-field"></label>
       </p>
       <!-- rest of form fields... -->
   </form>
   ```

3. **Deploy to Netlify**
   - Push changes to git
   - Netlify auto-detects forms on deploy

4. **View Submissions**
   - Netlify Dashboard → Forms
   - You'll see "email-signup" and "bug-report" forms

### Optional: Email Notifications
- Netlify Dashboard → Forms → Form notifications
- Add your email to receive submissions

---

## 3. Sentry Crash Reporting (Flutter App)

### Why Sentry?
- Industry standard for crash reporting
- Free tier: 5,000 errors/month
- Great Flutter support
- Detailed stack traces

### Setup Steps

1. **Create Sentry Account**
   - Go to https://sentry.io
   - Sign up (free tier)
   - Create new project → Flutter

2. **Get DSN**
   - After creating project, copy the DSN
   - Looks like: `https://xxx@xxx.ingest.sentry.io/xxx`

3. **Add to Flutter Project**

   In `pubspec.yaml`:
   ```yaml
   dependencies:
     sentry_flutter: ^7.14.0
   ```

4. **Initialize Sentry**

   In `lib/main.dart`:
   ```dart
   import 'package:sentry_flutter/sentry_flutter.dart';

   Future<void> main() async {
     await SentryFlutter.init(
       (options) {
         options.dsn = 'YOUR_DSN_HERE';
         options.tracesSampleRate = 1.0;
         options.environment = 'production';
       },
       appRunner: () => runApp(const BoojyAudioApp()),
     );
   }
   ```

5. **Add Opt-in Toggle**

   Create a settings option:
   ```dart
   // In your settings/preferences
   bool crashReportingEnabled = false; // Default off

   // Only initialize Sentry if enabled
   if (crashReportingEnabled) {
     await SentryFlutter.init(...);
   }
   ```

6. **First Launch Dialog**
   ```
   "Help improve Boojy Audio"

   Would you like to send anonymous crash reports?
   This helps me fix bugs faster.

   [No thanks]  [Yes, send reports]
   ```

### Test It
- Throw a test exception
- Check Sentry dashboard

---

## 4. Privacy Policy Page

### Create `website/privacy.html`

Use the same styling as other pages. Content should include:

**Sections to include:**
1. Introduction (who you are, what this covers)
2. Website Data Collection
   - Umami analytics (cookieless, anonymous)
   - Form submissions (email, bug reports)
3. App Data Collection
   - Optional crash reports (opt-in)
   - Update checker (version check only)
   - Local storage only (no cloud sync)
4. Data Sharing (none - you don't sell/share)
5. Your Rights (GDPR)
   - Access your data
   - Delete your data
   - Contact: tyr@boojy.org
6. Updates to Policy
7. Contact Information

**Key GDPR requirements:**
- Clear language (no legal jargon)
- Explain what data, why, how long stored
- How to request deletion
- Contact information

### Link from Footer
Add privacy link back to footer if needed.

---

## 5. Quick Reference

### Services & Logins

| Service | URL | Purpose |
|---------|-----|---------|
| Railway | railway.app | Umami hosting |
| Umami | your-url.up.railway.app | Analytics dashboard |
| Netlify | netlify.com | Hosting + Forms |
| Sentry | sentry.io | Crash reports |

### Free Tier Limits

| Service | Free Limit |
|---------|-----------|
| Railway | $5/month credit |
| Netlify Forms | 100 submissions/month |
| Sentry | 5,000 errors/month |

### If You Need More Form Submissions
- Netlify Pro: $19/month (unlimited)
- Or: Build custom backend with Supabase (free, unlimited)

---

## Checklist

- [ ] Railway account created
- [ ] Umami deployed and configured
- [ ] Umami script added to website
- [ ] Email signup form updated for Netlify
- [ ] Bug report form updated for Netlify
- [ ] Forms verified in Netlify dashboard
- [ ] Sentry account created
- [ ] Sentry added to Flutter app
- [ ] Opt-in dialog implemented
- [ ] Privacy policy page created
- [ ] Privacy link in footer
- [ ] Test all forms
- [ ] Test crash reporting
- [ ] Verify analytics tracking

---

## Timeline Estimate

| Task | Time |
|------|------|
| Umami setup | 30 min |
| Netlify forms | 15 min |
| Privacy page | 20 min |
| Sentry setup | 45 min |
| Testing | 15 min |
| **Total** | ~2 hours |

---

*Last updated: January 7, 2026*
