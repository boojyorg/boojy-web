import { Link } from 'react-router-dom';
import { GLOBE_ICON_PATHS, LAPTOP_ICON_PATH } from '../content/site';

interface ProductCloudCardProps {
  description: string;
  cardClassName?: string;
  ctaClassName?: string;
  cta?: { kind: 'link'; href: string; label: string } | { kind: 'text'; label: string };
}

export function ProductCloudCard({
  description,
  cardClassName = '',
  ctaClassName = '',
  cta = { kind: 'link', href: '/cloud/', label: 'Learn more →' },
}: ProductCloudCardProps) {
  return (
    <section className="product-cloud-section">
      <div className="container">
        <div className={`product-cloud-card ${cardClassName}`.trim()}>
          <div className="product-cloud-heading">
            <img
              src="/images/boojy-logo.svg"
              alt="Boojy"
              className="product-cloud-heading-boojy"
              loading="lazy"
            />
            <img
              src="/images/cloud-text-logo.png"
              alt="Cloud"
              className="product-cloud-heading-cloud"
              loading="lazy"
            />
          </div>
          <div className="product-cloud-devices">
            <svg
              className="device-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={LAPTOP_ICON_PATH} />
            </svg>
            <span className="sync-arrow">⇄</span>
            <svg
              className="device-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d={GLOBE_ICON_PATHS[0]} />
              <path d={GLOBE_ICON_PATHS[1]} />
            </svg>
          </div>
          <p className="product-cloud-description">{description}</p>
          {cta.kind === 'link' ? (
            <Link to={cta.href} className={`product-cloud-cta ${ctaClassName}`.trim()}>
              {cta.label}
            </Link>
          ) : (
            <span className={`product-cloud-cta ${ctaClassName}`.trim()}>{cta.label}</span>
          )}
        </div>
      </div>
    </section>
  );
}
