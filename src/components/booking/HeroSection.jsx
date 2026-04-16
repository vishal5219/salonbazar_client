import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchQuery } from '@/store/slices/salonSlice'
import styles from './HeroSection.module.css'

const heroImages = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=85',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&q=85',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=85',
]

const popularSearches = ['Hair Color', 'Bridal Makeup', 'Men\'s Haircut', 'Manicure', 'Facial']

export default function HeroSection() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeImg] = useState(0)

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setSearchQuery(query))
    navigate(`/salons?q=${encodeURIComponent(query)}`)
  }

  const handleQuickSearch = (term) => {
    dispatch(setSearchQuery(term))
    navigate(`/salons?q=${encodeURIComponent(term)}`)
  }

  return (
    <section className={styles.hero}>
      {/* Background images */}
      <div className={styles.bgGrid}>
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`${styles.bgImg} ${i === activeImg ? styles.bgActive : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className={styles.bgOverlay} />
      </div>

      {/* Decorative grain */}
      <div className={styles.grain} />

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          <span>250+ Salons Across Ahmedabad</span>
        </div>

        <h1 className={styles.headline}>
          Your Best Look,<br />
          <em>Perfectly Booked.</em>
        </h1>

        <p className={styles.subtitle}>
          Discover premium salons, skip the wait, book in seconds.<br className={styles.brDesktop} />
          Walk in or schedule — your choice, always.
        </p>

        {/* Search bar */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <div className={styles.searchLocation}>
            <span className={styles.searchIcon}>📍</span>
            <span className={styles.locationText}>Ahmedabad</span>
            <span className={styles.locationCaret}>▾</span>
          </div>
          <div className={styles.searchDivider} />
          <div className={styles.searchInput}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search salons, services, areas..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.searchBtn}>
            Find Salons
          </button>
        </form>

        {/* Popular searches */}
        <div className={styles.popularRow}>
          <span className={styles.popularLabel}>Popular:</span>
          {popularSearches.map(term => (
            <button
              key={term}
              className={styles.popularChip}
              onClick={() => handleQuickSearch(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Floating stats */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statNum}>250+</span>
          <span className={styles.statLabel}>Verified Salons</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>50K+</span>
          <span className={styles.statLabel}>Happy Customers</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>4.8★</span>
          <span className={styles.statLabel}>Average Rating</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>Zero</span>
          <span className={styles.statLabel}>Queue Hassle</span>
        </div>
      </div>
    </section>
  )
}
