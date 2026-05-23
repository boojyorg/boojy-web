import { Link } from 'react-router-dom';
import '../../public/css/audio.css';
import { usePageTitle } from '../hooks/usePageTitle';

export function SubscribedPage() {
  usePageTitle('Subscribed – Boojy');

  return (
    <section className="subscribed-hero">
      <div className="container">
        <div className="subscribed-box">
          <img
            src="/images/Boojy_Image_Logo.png"
            alt="Boojy"
            className="subscribed-logo"
            loading="lazy"
          />
          <h1>You&apos;re subscribed!</h1>
          <p>Expect updates on what&apos;s new with Boojy.</p>
          <Link to="/" className="btn btn-primary">
            Return to Boojy
          </Link>
        </div>
      </div>
    </section>
  );
}
