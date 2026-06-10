import { useDispatch, useSelector } from 'react-redux'
import { openAuthModal } from '@/store/slices/uiSlice'
import { toggleWishlistItem } from '@/store/slices/wishlistSlice'

export function useWishlistToggle() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(s => s.auth)
  const wishlistItems = useSelector(s => s.wishlist.items)

  const isWishlisted = (salonId) => wishlistItems.includes(salonId)

  const toggle = async (salonId, e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()

    if (!isAuthenticated) {
      dispatch(openAuthModal('login'))
      return
    }

    return dispatch(toggleWishlistItem(salonId)).unwrap()
  }

  return { isWishlisted, toggle }
}

export default useWishlistToggle
