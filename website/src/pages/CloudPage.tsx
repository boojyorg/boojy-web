import '../../public/css/cloud.css';
import { FaqAccordion } from '../components/FaqAccordion';
import {
  CLOUD_ETHICS,
  CLOUD_FAQ,
  CLOUD_PRICING,
  CLOUD_ROLLOUT_BANNER,
} from '../content/cloud';

export function CloudPage() {
  return (
    <>
      <section className="cloud-hero">
        <div className="container">
          <p className="cloud-rollout-banner">{CLOUD_ROLLOUT_BANNER}</p>
          <h1 className="cloud-title">Boojy Cloud</h1>
          <p className="cloud-subtitle">Your creative work, synced and safe — coming soon.</p>
        </div>
      </section>

      <section className="pricing-section">
        <div className="container">
          <div className="pricing-cards">
            {CLOUD_PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`pricing-card${plan.highlight ? ' pricing-card-highlight' : ''}`}
              >
                <h2 className="pricing-name">{plan.name}</h2>
                <div className="pricing-price">
                  <span className="pricing-amount">{plan.amount}</span>
                  <span className="pricing-period">{plan.period}</span>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span className="check">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'} pricing-btn`}
                  disabled
                >
                  Coming soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ethics-section">
        <div className="container">
          <h2 className="section-title">We believe in fair software</h2>
          <div className="ethics-grid">
            {CLOUD_ETHICS.map((item) => (
              <div key={item.title} className="ethics-item">
                <span className="ethics-check">✓</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cloud-faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <FaqAccordion items={CLOUD_FAQ} />
        </div>
      </section>
    </>
  );
}
