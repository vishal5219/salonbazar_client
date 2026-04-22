import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleWishlist } from '@/store/slices/wishlistSlice'
import styles from './SalonCard.module.css'

export default function SalonCard({ salon, variant = 'default' }) {
console.log(`1salon::::::`, salon)
  const dispatch = useDispatch()
  const wishlist = useSelector(s => s.wishlist.items)
  const isWishlisted = wishlist.includes(salon.id)

  const handleWishlist = (e) => {
    e.preventDefault()
    dispatch(toggleWishlist(salon.id))
  }

  return (
    <Link to={`/salons/${salon.id}`} className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.imageWrap}>
        <img src={salon.image} alt={salon.name} className={styles.image} loading="lazy" />
        <div className={styles.overlay} />

        {/* Status badge */}
        <div className={`${styles.statusBadge} ${salon.isOpen ? styles.open : styles.closed}`}>
          <span className={styles.statusDot} />
          {salon.isOpen ? 'Open Now' : 'Closed'}
        </div>

        {/* Wishlist button */}
        <button
          className={`${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`}
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          {isWishlisted ? '♥' : '♡'}
        </button>

        {/* Wait time */}
        {salon.isOpen && salon.waitTime && (
          <div className={styles.waitBadge}>
            ⏱ {salon.waitTime} wait
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.name}>{salon.name}</h3>
            <p className={styles.category}>{salon.category}</p>
          </div>
          <div className={styles.rating}>
            <span className={styles.star}>★</span>
            <span className={styles.ratingNum}>{salon.rating}</span>
            <span className={styles.reviews}>
              ({salon.reviews})
            </span>
          </div>
        </div>

        <div className={styles.meta}>
          <span className={styles.location}>📍 {salon.location}</span>
          <span className={styles.distance}>{salon.distance}</span>
        </div>

        <div className={styles.tags}>
          {salon.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceLabel}>From</span>
            <span className={styles.priceValue}>{salon.price}</span>
          </div>
          <button className={styles.bookBtn} onClick={e => { e.preventDefault(); }}>
            Book Now
          </button>
        </div>
      </div>
    </Link>
  )
}
