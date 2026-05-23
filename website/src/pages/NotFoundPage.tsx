import { Link } from 'react-router-dom';
import '../../public/css/legal.css';

export function NotFoundPage() {
  return (
    <section className="not-found-page">
      <div className="container not-found-inner">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-text">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
        <p className="not-found-meta">
          If you think this is an error, please{' '}
          <a href="mailto:tyr@boojy.org">let us know</a>.
        </p>
      </div>
    </section>
  );
}
