import { useParams } from 'react-router-dom'
import SEO from '@/components/seo/SEO'
import { buildCanonical, buildSalonSeo, localBusinessJsonLd } from '@/constants/seo'
import { useSelector } from 'react-redux'
import SalonDetailView from '@/components/salon/SalonDetails/SalonDetailView'

export default function SalonDetails() {
  const { id } = useParams()
  const { selectedSalon: salon } = useSelector(s => s.salons)

  const salonSeo = salon && String(salon.id) === String(id) ? buildSalonSeo(salon) : null

  return (
    <>
      {salonSeo && (
        <SEO
          title={salonSeo.title}
          description={salonSeo.description}
          canonical={buildCanonical(salonSeo.path)}
          image={salonSeo.image}
          jsonLd={localBusinessJsonLd(salon)}
        />
      )}
      <SalonDetailView salonId={id} />
    </>
  )
}
