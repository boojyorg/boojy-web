import '../../public/css/hub.css';
import { HubHero } from '../components/HubHero';
import { ProductCards } from '../components/ProductCards';
import { ProductCloudCard } from '../components/ProductCloudCard';
import { CLOUD_DESCRIPTION } from '../content/site';

export function HubPage() {
  return (
    <>
      <HubHero />
      <ProductCards />
      <ProductCloudCard
        cardClassName="cloud-card"
        ctaClassName="cloud-cta"
        description={CLOUD_DESCRIPTION}
      />
    </>
  );
}
