import { useState } from 'react'
import { FiSearch, FiMapPin, FiGrid, FiList, FiMap, FiSliders } from 'react-icons/fi'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import styles from './SalonListHeader.module.css'

export default function SalonListHeader({
  onSearch, onOpenMobileFilters, viewMode, onViewModeChange, totalCount,
}) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const views = [
    { id: 'grid', icon: <FiGrid />,  label: 'Grid' },
    { id: 'list', icon: <FiList />,  label: 'List' },
    { id: 'map',  icon: <FiMap />,   label: 'Map'  },
  ]

  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.breadcrumbRow}>
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Explore Salons' },
            ]}
          />
          {totalCount > 0 && (
            <span className={styles.countBadge}>{totalCount} results</span>
          )}
        </div>

        <h1 className={styles.pageTitle}>Explore Salons in Ahmedabad</h1>

        {/* Search + controls row */}
        <div className={styles.controlsRow}>
          {/* Search form */}
          <form className={styles.searchForm} onSubmit={handleSubmit}>
            <div className={styles.locationPill}>
              <FiMapPin size={14} />
              <span>Ahmedabad</span>
              <span className={styles.caret}>▾</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.inputWrap}>
              <FiSearch size={15} className={styles.searchIcon} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Salons, services, areas..."
                className={styles.input}
              />
              {query && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => { setQuery(''); onSearch('') }}
                >✕</button>
              )}
            </div>
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>

          {/* Right controls */}
          <div className={styles.rightControls}>
            {/* View toggle — desktop */}
            <div className={styles.viewToggle}>
              {views.map(v => (
                <button
                  key={v.id}
                  className={`${styles.viewBtn} ${viewMode === v.id ? styles.viewActive : ''}`}
                  onClick={() => onViewModeChange(v.id)}
                  title={v.label}
                >
                  {v.icon}
                </button>
              ))}
            </div>

            {/* Mobile filter button */}
            <button
              className={styles.mobileFilterBtn}
              onClick={onOpenMobileFilters}
            >
              <FiSliders size={15} />
              Filters
            </button>
          </div>
        </div>

        {/* Quick category pills */}
        <div className={styles.quickPills}>
          {['All', 'Open Now', 'Hair', 'Bridal', 'Spa', "Men's", 'Nails', 'Skin'].map(tag => (
            <button
              key={tag}
              className={styles.pill}
              onClick={() => tag !== 'All' && onSearch(tag === 'Open Now' ? '' : tag)}
            >
              {tag === 'Open Now' && <span className={styles.openDot} />}
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}