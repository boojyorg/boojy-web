import privacyBody from '../content/legal/privacy-body.html?raw';
import { LegalLayout } from '../components/LegalLayout';

export function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="Last updated: January 8, 2026"
      contentClassName="legal-content legal-content--dark"
      bodyClassName="legal-body legal-body--narrow"
    >
      <div dangerouslySetInnerHTML={{ __html: privacyBody }} />
    </LegalLayout>
  );
}
