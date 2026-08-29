import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiCamera } from 'react-icons/fi'
import { setSearchQuery } from '@/store/slices/salonSlice'
import HeroLocationPicker from './HeroLocationPicker'
import QrScannerModal from '@/components/salon/WalkInQueue/QrScannerModal'
import { useSalonQueueScan } from '@/hooks/useSalonQueueScan'
import { POPULAR_SEARCHES, ACTIVE_CITIES, DEFAULT_CITY } from '@/constants/locationData'
import styles from './HeroSection.module.css'

const popularSearches = POPULAR_SEARCHES.slice(0, 5).map(item => item.label)

export default function HeroSection() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { handleScan } = useSalonQueueScan()
  const [query, setQuery] = useState('')
  const [scannerOpen, setScannerOpen] = useState(false)
  const { selectedCity, selectedState, detecting } = useSelector(s => s.location)

  const buildSalonsUrl = (searchQuery = '') => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCity?.slug) params.set('city', selectedCity.slug)
    else if (selectedCity?.name) params.set('city', selectedCity.name)
    if (selectedState?.name) params.set('state', selectedState.name)
    const qs = params.toString()
    return qs ? `/salons?${qs}` : '/salons'
  }

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setSearchQuery(query))
    navigate(buildSalonsUrl(query))
  }

  const handleQuickSearch = (term) => {
    const match = POPULAR_SEARCHES.find(item => item.label === term)
    dispatch(setSearchQuery(match?.query || term))
    navigate(buildSalonsUrl(match?.query || term))
  }

  const handleQrScan = (text) => {
    if (handleScan(text)) {
      setScannerOpen(false)
    }
  }

  const cityLabel = detecting
    ? 'your area'
    : selectedCity?.name || DEFAULT_CITY?.name || 'Ahmedabad'

  const liveCityCount = ACTIVE_CITIES.length

  return (
    <section className={styles.hero}>
      <div className={styles.bgGrid} aria-hidden="true">
        <div className={styles.bgGradient} />
        <div className={styles.bgBlob1} />
        <div className={styles.bgBlob2} />
        <div className={styles.bgBlob3} />
        <div className={styles.bgOverlay} />
      </div>

      <div className={styles.grain} />

      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          <span>
            {selectedCity?.active
              ? `Live in ${cityLabel}`
              : `Verified salons near ${cityLabel}`}
            {!detecting && liveCityCount > 0 && ` · ${liveCityCount} live cities`}
          </span>
        </div>

        <h1 className={styles.headline}>
          Your Best Look,<br />
          <em>Perfectly Booked.</em>
        </h1>

        <p className={styles.subtitle}>
          Discover premium salons, skip the wait, book in seconds.<br className={styles.brDesktop} />
          Walk in or schedule — your choice, always.
        </p>

        <form className={styles.searchBar} onSubmit={handleSearch}>
          <HeroLocationPicker />
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

        <button
          type="button"
          className={styles.scanQrBtn}
          onClick={() => setScannerOpen(true)}
        >
          <FiCamera size={18} aria-hidden="true" />
          Scan Salon QR
        </button>

        <div className={styles.popularRow}>
          <span className={styles.popularLabel}>Popular:</span>
          {popularSearches.map(term => (
            <button
              key={term}
              type="button"
              className={styles.popularChip}
              onClick={() => handleQuickSearch(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

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

      <QrScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleQrScan}
      />
    </section>
  )
}
