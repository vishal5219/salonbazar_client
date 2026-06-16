import SalonQueueQrDisplay from '@/components/salon/WalkInQueue/SalonQueueQrDisplay'

export default function SalonQrCard({ salonId, salonName, salon }) {
  return (
    <SalonQueueQrDisplay
      salonId={salonId}
      salon={salon || { name: salonName, status: 'active' }}
      variant="owner"
    />
  )
}
