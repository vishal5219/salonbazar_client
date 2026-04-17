import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiHeart, FiMapPin, FiStar, FiClock, FiArrowRight } from 'react-icons/fi'
import { toggleWishlist } from '@/store/slices/wishlistSlice'
import { showNotification } from '@/store/slices/uiSlice'
import styles from './WishlistTab.module.css'

export default function WishlistTab() {
  const dispatch       = useDispatch()
  const { wishlistSalons } = useSelector(s => s.profile)
  const wishlist           = useSelector(s => s.wishlist.items)

  // Filter to only currently wishlisted salons
  const saved = wishlistSalons.filter(s => wishlist.includes(s.id))

  const handleRemove = (salonId, salonName) => {
    dispatch(toggleWishlist(salonId))
    dispatch(showNotification({ message: `${salonName} removed from wishlist.`, type: 'success' }))
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Wishlist</h2>
        <p className={styles.sub}>{saved.length} saved salon{saved.length !== 1 ? 's' : ''}</p>
      </div>

      {saved.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyHeart}>♡</div>
          <h3 className={styles.emptyTitle}>Your wishlist is empty</h3>
          <p className={styles.emptySub}>
            Tap the heart icon on any salon card to save it here for quick access.
          </p>
          <Link to="/salons" className={styles.exploreCta}>
            Explore Salons <FiArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {saved.map((salon, i) => (
            <div
              key={salon.id}
              className={styles.card}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Image */}
              <div className={styles.imgWrap}>
                <Link to={`/salons/${salon.id}`}>
                  <img src={salon.image} alt={salon.name} className={styles.img} />
                  <div className={styles.imgOverlay} />
                </Link>

                {/* Status */}
                <div className={`${styles.statusBadge} ${salon.isOpen ? styles.open : styles.closed}`}>
                  <span className={styles.statusDot} />
                  {salon.isOpen ? 'Open' : 'Closed'}
                </div>

                {/* Remove from wishlist */}
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove(salon.id, salon.name)}
                  title="Remove from wishlist"
                >
                  <FiHeart size={15} fill="currentColor" />
                </button>

                {/* Wait time */}
                {salon.isOpen && salon.waitTime && (
                  <div className={styles.waitBadge}>
                    <FiClock size={10} /> {salon.waitTime}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <div>
                    <Link to={`/salons/${salon.id}`} className={styles.salonName}>
                      {salon.name}
                    </Link>
                    <div className={styles.category}>{salon.category}</div>
                  </div>
                  <div className={styles.rating}>
                    <FiStar size={12} style={{ color:'var(--gold)' }} />
                    <span>{salon.rating}</span>
                  </div>
                </div>

                <div className={styles.meta}>
                  <span><FiMapPin size={11} /> {salon.location}</span>
                  <span className={styles.dist}>{salon.distance}</span>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.priceBlock}>
                    <span className={styles.priceFrom}>From</span>
                    <span className={styles.priceVal}>{salon.price}</span>
                  </div>
                  <Link to={`/booking/${salon.id}`} className={styles.bookBtn}>
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}