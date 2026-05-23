import termsBody from '../content/legal/terms-body.html?raw';
import { LegalLayout } from '../components/LegalLayout';
import { usePageTitle } from '../hooks/usePageTitle';

export function TermsPage() {
  usePageTitle('Terms of Service – Boojy');

  return (
    <LegalLayout title="Terms of Service" updated="Last updated: January 2026">
      <div dangerouslySetInnerHTML={{ __html: termsBody }} />
    </LegalLayout>
  );
}
