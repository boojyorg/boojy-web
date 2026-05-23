import { PRODUCT_CARDS } from '../content/site';

export function ProductCards() {
  return (
    <section className="products-section">
      <div className="container">
        <div className="product-cards reveal reveal-d3">
          {PRODUCT_CARDS.map((product) => (
            <a
              key={product.id}
              href={product.href}
              className="product-card"
              data-product={product.id}
            >
              <div className="product-card-img">
                <img src={product.screenshot} alt={product.screenshotAlt} loading="lazy" />
              </div>
              <div className="product-card-body">
                <img src={product.logo} alt={product.logoAlt} className="product-card-logo" loading="lazy" />
                <p className="product-card-description">{product.description}</p>
                <span className="product-card-cta">Learn more →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
