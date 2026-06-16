import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { showNotification } from '@/store/slices/uiSlice'
import { parseSalonQueueQr, buildSalonQueuePath } from '@/utils/parseSalonQueueQr'

export function useSalonQueueScan() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleScan = (text) => {
    const parsed = parseSalonQueueQr(text)
    if (!parsed?.salonId) {
      dispatch(showNotification({
        message: 'Not a valid SalonBazar walk-in QR code',
        type: 'error',
      }))
      return false
    }
    navigate(buildSalonQueuePath(parsed.salonId))
    return true
  }

  return { handleScan }
}
