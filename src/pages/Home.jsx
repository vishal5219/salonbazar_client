import SEO from '@/components/seo/SEO'
import { PAGE_SEO, buildCanonical, organizationJsonLd, websiteJsonLd } from '@/constants/seo'
import HeroSection from '@/components/booking/HeroSection'
import CategorySection from '@/components/salon/CategorySection'
import FeaturedSalons from '@/components/salon/FeaturedSalons'
import HowItWorks from '@/components/common/HowItWorks'
import NearbySalons from '@/components/salon/NearbySalons'
import TestimonialsSection from '@/components/common/TestimonialsSection'
import PartnerCTA from '@/components/common/PartnerCTA'

export default function Home() {
  const seo = PAGE_SEO.home
  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={buildCanonical(seo.path)}
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />
      <HeroSection />
      <CategorySection />
      <FeaturedSalons />
      <HowItWorks />
      <NearbySalons />
      <TestimonialsSection />
      <PartnerCTA />
    </>
  )
}
