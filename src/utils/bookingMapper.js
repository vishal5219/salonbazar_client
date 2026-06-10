export function mapProfileBooking(b) {
  const scheduled = b.scheduledDate ? new Date(b.scheduledDate) : null
  const isFuture = scheduled && scheduled >= new Date(new Date().toDateString())
  let status = b.status
  if (status === 'confirmed' && isFuture) status = 'upcoming'
  if (status === 'pending' && isFuture) status = 'upcoming'

  return {
    id: b.id,
    salonName: b.salonName,
    salonImage: b.salonImage,
    salonId: b.salonId,
    serviceName: b.serviceName,
    date: b.date || b.displayDate,
    time: b.time,
    staffName: b.staffName,
    amount: b.amount || b.total,
    status,
    paymentMethod: b.paymentMethod,
    bookingType: b.bookingType,
    canReview: b.canReview ?? status === 'completed',
    reviewed: b.reviewed ?? false,
  }
}
