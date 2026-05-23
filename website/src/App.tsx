import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout';
import { HubPage } from './pages/HubPage';
import { NotesPage } from './pages/NotesPage';
import { AudioPage } from './pages/AudioPage';
import { CloudPage } from './pages/CloudPage';
import { AccountPage } from './pages/AccountPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SubscribedPage } from './pages/SubscribedPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HubPage />} />
          <Route path="/audio" element={<Navigate to="/audio/" replace />} />
          <Route path="/audio/" element={<AudioPage />} />
          <Route path="/notes" element={<Navigate to="/notes/" replace />} />
          <Route path="/notes/" element={<NotesPage />} />
          <Route path="/cloud" element={<Navigate to="/cloud/" replace />} />
          <Route path="/cloud/" element={<CloudPage />} />
          <Route path="/account" element={<Navigate to="/account/" replace />} />
          <Route path="/account/" element={<AccountPage />} />
          <Route path="/privacy.html" element={<PrivacyPage />} />
          <Route path="/terms.html" element={<TermsPage />} />
          <Route path="/subscribed.html" element={<SubscribedPage />} />
          <Route path="/404.html" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
