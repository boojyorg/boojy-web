import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout';
import { HubPage } from './pages/HubPage';
import { NotesPage } from './pages/NotesPage';
import { AudioPage } from './pages/AudioPage';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
