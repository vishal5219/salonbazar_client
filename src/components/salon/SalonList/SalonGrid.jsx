import { Link } from 'react-router-dom'
import useWishlistToggle from '@/hooks/useWishlistToggle'
import { FiHeart, FiMapPin, FiClock, FiStar, FiArrowRight } from 'react-icons/fi'
import styles from './SalonGrid.module.css'
import { useNavigate } from 'react-router-dom'

// ── Skeleton card ─────────────────────────────────────────────
function SkeletonCard({ viewMode }) {
  return (
    <div className={`${styles.skeleton} ${viewMode === 'list' ? styles.skeletonList : ''}`}>
      <div className={styles.skelImg} />
      <div className={styles.skelBody}>
        <div className={styles.skelLine} style={{ width: '65%', height: 18 }} />
        <div className={styles.skelLine} style={{ width: '40%', height: 13 }} />
        <div className={styles.skelLine} style={{ width: '80%', height: 13 }} />
        <div className={styles.skelLine} style={{ width: '50%', height: 13 }} />
      </div>
    </div>
  )
}

// ── List-view salon row ───────────────────────────────────────
function SalonListRow({ salon, onHover }) {
  const { isWishlisted, toggle } = useWishlistToggle()
  const isWished = isWishlisted(salon.id)
  return (
    <Link
      to={`/salons/${salon.id}`}
      className={styles.listRow}
      onMouseEnter={() => onHover?.(salon.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image */}
      <div className={styles.listImgWrap}>
        <img src={salon.image} alt={salon.name} className={styles.listImg} loading="lazy" />
        <div className={`${styles.statusDot} ${salon.isOpen ? styles.dotOpen : styles.dotClosed}`} />
      </div>

      {/* Info */}
      <div className={styles.listInfo}>
        <div className={styles.listTop}>
          <div>
            <h3 className={styles.listName}>{salon.name}</h3>
            <p className={styles.listCat}>{salon.category}</p>
          </div>
          <div className={styles.listRating}>
            <FiStar size={13} className={styles.starIcon} />
            <span className={styles.ratingNum}>{salon.rating}</span>
            <span className={styles.ratingCount}>
              ({salon.reviews})
            </span>
          </div>
        </div>

        <div className={styles.listMeta}>
          <span><FiMapPin size={12} /> {salon.location}</span>
          <span>{salon.distance}</span>
          {salon.isOpen && salon.waitTime && (
            <span className={styles.waitSpan}><FiClock size={12} /> {salon.waitTime}</span>
          )}
        </div>

        <div className={styles.listTags}>
          {salon.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
      </div>

      {/* Price + actions */}
      <div className={styles.listRight}>
        <div className={styles.listPrice}>
          <span className={styles.priceLbl}>From</span>
          <span className={styles.priceVal}>{salon.price}</span>
        </div>
        <button
          className={`${styles.wishBtn} ${isWished ? styles.wished : ''}`}
          onClick={e => toggle(salon.id, e)}
        >
          <FiHeart size={14} fill={isWished ? 'currentColor' : 'none'} />
        </button>
        <div className={styles.listBookBtn}>
          Book <FiArrowRight size={13} />
        </div>
      </div>
    </Link>
  )
}

// ── Grid card ─────────────────────────────────────────────────
function SalonGridCard({ salon, onHover }) {
  const navigate = useNavigate()
  const { isWishlisted, toggle } = useWishlistToggle()
  const isWished = isWishlisted(salon.id)

  const handleBookNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/salons/${salon.id}`)
  }

  return (
    <Link
      to={`/salons/${salon.id}`}
      className={styles.card}
      onMouseEnter={() => onHover?.(salon.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image */}
      <div className={styles.imgWrap}>
        <img src={salon.image} alt={salon.name} className={styles.img} loading="lazy" />
        <div className={styles.imgOverlay} />

        <div className={`${styles.statusBadge} ${salon.isOpen ? styles.open : styles.closed}`}>
          <span className={styles.statusDot} />
          {salon.isOpen ? 'Open' : 'Closed'}
        </div>

        <button
          className={`${styles.heartBtn} ${isWished ? styles.hearted : ''}`}
          onClick={e => toggle(salon.id, e)}
          aria-label="Wishlist"
        >
          <FiHeart size={15} fill={isWished ? 'currentColor' : 'none'} />
        </button>

        {salon.isOpen && salon.waitTime && (
          <div className={styles.waitBadge}>
            <FiClock size={11} /> {salon.waitTime}
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <div>
            <h3 className={styles.cardName}>{salon.name}</h3>
            <p className={styles.cardCat}>{salon.category}</p>
          </div>
          <div className={styles.cardRating}>
            <FiStar size={12} className={styles.starIcon} />
            <span>{salon.rating}</span>
            <span className={styles.reviewCount}>
              ({salon.reviews})
            </span>
          </div>
        </div>

        <div className={styles.cardMeta}>
          <span className={styles.loc}><FiMapPin size={12} /> {salon.location}</span>
          <span className={styles.dist}>{salon.distance}</span>
        </div>

        <div className={styles.tags}>
          {salon.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>

        <div className={styles.cardFooter}>
          <div>
            <div className={styles.priceLbl}>From</div>
            <div className={styles.priceVal}>{salon.price}</div>
          </div>
          <button className={styles.bookBtn} onClick={handleBookNow}>Book Now</button>
        </div>
      </div>
    </Link>
  )
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>🔍</div>
      <h3 className={styles.emptyTitle}>No salons found</h3>
      <p className={styles.emptyDesc}>Try adjusting your filters or search a different area.</p>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────
export default function SalonGrid({ salons, viewMode, loading, onHover }) {
  if (loading) {
    return (
      <div className={viewMode === 'list' ? styles.listContainer : styles.gridContainer}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} viewMode={viewMode} />
        ))}
      </div>
    )
  }

  if (!salons.length) return <EmptyState />

  if (viewMode === 'list') {
    return (
      <div className={styles.listContainer}>
        {salons.map((salon, i) => (
          <div key={salon.id} className={styles.listItem} style={{ animationDelay: `${i * 0.04}s` }}>
            <SalonListRow salon={salon} onHover={onHover} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.gridContainer}>
      {salons.map((salon, i) => (
        <div key={salon.id} className={styles.gridItem} style={{ animationDelay: `${i * 0.05}s` }}>
          <SalonGridCard salon={salon} onHover={onHover} />
        </div>
      ))}
    </div>
  )
}