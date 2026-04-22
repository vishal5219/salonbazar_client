import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiHeart, FiShare2, FiMapPin, FiPhone, FiClock, FiStar, FiGrid } from 'react-icons/fi'
import { toggleWishlist } from '@/store/slices/wishlistSlice'
import { showNotification } from '@/store/slices/uiSlice'
import styles from './SalonDetailHero.module.css'

export default function SalonDetailHero({ salon }) {
console.log(`2salon::::::`, salon)
  const dispatch   = useDispatch()
  const wishlist   = useSelector(s => s.wishlist.items)
  const isWished   = wishlist.includes(salon.id)
  const [showAll,  setShowAll] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: salon.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      dispatch(showNotification({ message: 'Link copied to clipboard!', type: 'success' }))
    }
  }

  // Show 5 images in mosaic; full gallery opened separately
  const mosaicImages = salon.gallery.slice(0, 5)

  return (
    <div className={styles.hero}>
      {/* Image mosaic */}
      <div className={styles.mosaic} onClick={() => setShowAll(true)}>
        <div className={styles.mainImg}>
          <img src={mosaicImages[0]?.url} alt={salon.name} />
          <div className={styles.mainOverlay} />
        </div>
        <div className={styles.thumbGrid}>
          {mosaicImages.slice(1, 5).map((img, i) => (
            <div key={img.id} className={styles.thumb}>
              <img src={img.url} alt={img.caption} />
              {i === 3 && salon.gallery.length > 5 && (
                <div className={styles.moreOverlay}>
                  <FiGrid size={20} />
                  <span>+{salon.gallery.length - 5} more</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className={styles.viewAllBtn} onClick={e => { e.stopPropagation(); setShowAll(true) }}>
          <FiGrid size={14} /> View All Photos
        </button>
      </div>

      {/* Info bar below mosaic */}
      <div className={styles.infoBar}>
        <div className={styles.infoLeft}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <a href="/">Home</a> › <a href="/salons">Salons</a> › {salon.name}
          </div>

          <div className={styles.titleRow}>
            <div>
              <div className={styles.categoryBadge}>{salon.category}</div>
              <h1 className={styles.name}>{salon.name}</h1>
              <p className={styles.tagline}><em>"{salon.tagline}"</em></p>
            </div>
            <div className={styles.actionBtns}>
              <button
                className={`${styles.iconBtn} ${isWished ? styles.wished : ''}`}
                onClick={() => dispatch(toggleWishlist(salon.id))}
                aria-label="Wishlist"
              >
                <FiHeart size={17} fill={isWished ? 'currentColor' : 'none'} />
              </button>
              <button className={styles.iconBtn} onClick={handleShare} aria-label="Share">
                <FiShare2 size={17} />
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            <div className={styles.ratingBlock}>
              <span className={styles.ratingNum}>{salon.rating}</span>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={salon.rating >= s ? styles.starFull : styles.starEmpty}>★</span>
                ))}
              </div>
              <span className={styles.reviewCount}>
                {/* ({salon.reviews} reviews) */}
              </span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <FiMapPin size={14} className={styles.statIcon} />
              <span>{salon.distance} away</span>
            </div>
            <div className={styles.statDivider} />
            <div className={`${styles.statItem} ${styles.statusItem}`}>
              <span className={`${styles.statusDot} ${salon.isOpen ? styles.dotOpen : styles.dotClosed}`} />
              <span className={salon.isOpen ? styles.openText : styles.closedText}>
                {salon.isOpen ? `Open · ${salon.waitTime} wait` : 'Closed Now'}
              </span>
            </div>
            {salon.isOpen && (
              <>
                <div className={styles.statDivider} />
                <div className={styles.queueBlock}>
                  <span className={styles.queueNum}>{salon.queueCount}</span>
                  <span className={styles.queueLabel}>in queue</span>
                </div>
              </>
            )}
          </div>

          {/* Quick info pills */}
          <div className={styles.infoPills}>
            <span className={styles.infoPill}>
              <FiPhone size={12} /> {salon.phone}
            </span>
            <span className={styles.infoPill}>
              <FiClock size={12} />
              {salon.workingHours.find(h => h.day === new Date().toLocaleString('en', { weekday: 'long' }))?.open || '10:00 AM'}
              {' – '}
              {salon.workingHours.find(h => h.day === new Date().toLocaleString('en', { weekday: 'long' }))?.close || '8:00 PM'}
            </span>
            <span className={styles.infoPill}>Est. {salon.established}</span>
          </div>

          {/* Amenity tags */}
          <div className={styles.amenities}>
            {salon.amenities.map(a => (
              <span key={a} className={styles.amenityTag}>✓ {a}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Full gallery lightbox */}
      {showAll && (
        <div className={styles.lightbox} onClick={() => setShowAll(false)}>
          <button className={styles.lightboxClose} onClick={() => setShowAll(false)}>✕</button>
          <div className={styles.lightboxGrid} onClick={e => e.stopPropagation()}>
            <h3 className={styles.lightboxTitle}>All Photos · {salon.gallery.length}</h3>
            <div className={styles.lightboxImgs}>
              {salon.gallery.map(img => (
                <div key={img.id} className={styles.lightboxImg}>
                  <img src={img.url} alt={img.caption} />
                  <span className={styles.lightboxCaption}>{img.caption}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
