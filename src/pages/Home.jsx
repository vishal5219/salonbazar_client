import HeroSection from '@/components/booking/HeroSection'
import CategorySection from '@/components/salon/CategorySection'
import FeaturedSalons from '@/components/salon/FeaturedSalons'
import HowItWorks from '@/components/common/HowItWorks'
import NearbySalons from '@/components/salon/NearbySalons'
import TestimonialsSection from '@/components/common/TestimonialsSection'
import PartnerCTA from '@/components/common/PartnerCTA'

export default function Home() {
  return (
    <>
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
