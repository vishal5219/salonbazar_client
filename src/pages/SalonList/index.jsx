// pages/SalonList/index.jsx
// Main SalonList page — composed of:
//   SearchBar · FiltersSidebar · SalonGrid · MapView · ActiveFilters · SortBar
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchAllSalons, setFilters, setSearchQuery, clearFilters } from '@/store/slices/salonSlice'
import SalonListHeader   from '@/components/salon/SalonList/SalonListHeader'
import FiltersSidebar    from '@/components/salon/SalonList/FiltersSidebar'
import SalonGrid         from '@/components/salon/SalonList/SalonGrid'
import MapView           from '@/components/salon/SalonList/MapView'
import SortBar           from '@/components/salon/SalonList/SortBar'
import ActiveFilters     from '@/components/salon/SalonList/ActiveFilters'
import MobileFilterSheet from '@/components/salon/SalonList/MobileFilterSheet'
import SEO from '@/components/seo/SEO'
import { buildCanonical, buildSalonListSeo } from '@/constants/seo'
import styles from './SalonList.module.css'

export default function SalonList() {
  const dispatch      = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  // View mode: 'grid' | 'list' | 'map'
  const [viewMode,         setViewMode]         = useState('grid')
  const [sortBy,           setSortBy]           = useState('rating')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mapHoveredId,     setMapHoveredId]     = useState(null)

  const { salons, loading, filters, searchQuery, pagination } = useSelector(s => s.salons)

  // ── Sync URL params → Redux on mount ─────────────────────
  useEffect(() => {
    const q        = searchParams.get('q')        || ''
    const category = searchParams.get('category') || ''
    const city     = searchParams.get('city')     || ''

    if (q)        dispatch(setSearchQuery(q))
    if (category) dispatch(setFilters({ category }))
    if (city)     dispatch(setFilters({ location: city }))

    dispatch(fetchAllSalons({ q, category, city }))
  }, []) // eslint-disable-line

  // ── Re-fetch when filters change ──────────────────────────
  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters))
    const params = {}
    if (searchQuery)                params.q        = searchQuery
    if (newFilters.category)        params.category = newFilters.category
    if (newFilters.location)        params.city     = newFilters.location
    setSearchParams(params)
    dispatch(fetchAllSalons({ ...filters, ...newFilters, q: searchQuery }))
  }, [dispatch, filters, searchQuery, setSearchParams])

  const handleSearch = useCallback((query) => {
    dispatch(setSearchQuery(query))
    setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('q', query); return p })
    dispatch(fetchAllSalons({ ...filters, q: query }))
  }, [dispatch, filters, setSearchParams])

  const handleSort = (sort) => {
    setSortBy(sort)
    dispatch(fetchAllSalons({ ...filters, q: searchQuery, sort }))
  }

  const handleClearAll = () => {
    dispatch(clearFilters())
    setSearchParams({})
    dispatch(fetchAllSalons({}))
  }

  // Client-side sort for mock data (replace with API sort param when backend is live)
  const sortedSalons = [...salons].sort((a, b) => {
    if (sortBy === 'rating')   return b.rating - a.rating
    if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance)
    if (sortBy === 'price')    return parseInt(a.price.replace('₹','')) - parseInt(b.price.replace('₹',''))
    if (sortBy === 'reviews')  return b.reviews - a.reviews
    return 0
  })

  const hasActiveFilters = filters.category || filters.location ||
    filters.rating > 0 || searchQuery ||
    filters.priceRange[0] > 0 || filters.priceRange[1] < 5000

  const listSeo = buildSalonListSeo(searchQuery, filters.category)

  return (
    <div className={styles.page}>
      <SEO
        title={listSeo.title}
        description={listSeo.description}
        canonical={buildCanonical(listSeo.path)}
      />
      <SalonListHeader
        onSearch={handleSearch}
        onOpenMobileFilters={() => setMobileSidebarOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={sortedSalons.length}
      />

      <div className={styles.body}>
        {/* Left: Filters sidebar (desktop) */}
        <aside className={styles.sidebar}>
          <FiltersSidebar
            filters={filters}
            onChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </aside>

        {/* Right: Results area */}
        <main className={styles.results}>
          {/* Sort + active filters row */}
          <div className={styles.controlsRow}>
            <ActiveFilters
              filters={filters}
              searchQuery={searchQuery}
              onChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
            <SortBar sortBy={sortBy} onSort={handleSort} />
          </div>

          {/* Results count */}
          <p className={styles.resultsCount}>
            {loading ? 'Searching...' : (
              <><strong>{sortedSalons.length}</strong> salons found{searchQuery ? ` for "${searchQuery}"` : ''}</>
            )}
          </p>

          {/* Main view — Grid / List / Map */}
          {viewMode === 'map' ? (
            <MapView
              salons={sortedSalons}
              hoveredId={mapHoveredId}
              onHover={setMapHoveredId}
              loading={loading}
            />
          ) : (
            <SalonGrid
              salons={sortedSalons}
              viewMode={viewMode}
              loading={loading}
              onHover={setMapHoveredId}
            />
          )}
        </main>
      </div>

      {/* Mobile filter sheet */}
      <MobileFilterSheet
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    </div>
  )
}