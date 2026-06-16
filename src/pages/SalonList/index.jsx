// pages/SalonList/index.jsx

// Main SalonList page — composed of:

//   SearchBar · FiltersSidebar · SalonGrid · MapView · ActiveFilters · SortBar

import { useState, useEffect, useCallback, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useSearchParams } from 'react-router-dom'

import { fetchAllSalons, setFilters, setSearchQuery, clearFilters } from '@/store/slices/salonSlice'

import { detectAndResolveLocation, syncLocationFromQuery } from '@/store/slices/locationSlice'

import { formatCityLabel, formatStateLabel } from '@/utils/locationUtils'

import LocationPromptBanner from '@/components/common/LocationPromptBanner'

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

  const initialLoadDone = useRef(false)



  // View mode: 'grid' | 'list' | 'map'

  const [viewMode,         setViewMode]         = useState('grid')

  const [sortBy,           setSortBy]           = useState('rating')

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const [mapHoveredId,     setMapHoveredId]     = useState(null)



  const { salons, loading, filters, searchQuery, pagination } = useSelector(s => s.salons)

  const { coords, status: locationStatus, selectedCity, selectedState, locationManuallySet } = useSelector(s => s.location)



  const locationCityName = formatCityLabel(selectedCity)

  const locationStateName = formatStateLabel(selectedState)



  const loadSalons = useCallback((params = {}) => {

    dispatch(fetchAllSalons({ ...filters, q: searchQuery, ...params }))

  }, [dispatch, filters, searchQuery])



  // ── Sync URL params → Redux on first load ─────────────────

  useEffect(() => {

    const q        = searchParams.get('q')        || ''

    const category = searchParams.get('category') || ''

    const cityParam = searchParams.get('city')

    const stateParam = searchParams.get('state')



    if (q) dispatch(setSearchQuery(q))

    if (category) dispatch(setFilters({ category }))



    const runInitialLoad = () => {

      dispatch(fetchAllSalons({ q, category }))

      initialLoadDone.current = true

    }



    if (cityParam && stateParam && !selectedCity) {

      dispatch(syncLocationFromQuery({ city: cityParam, state: stateParam }))

        .finally(runInitialLoad)

    } else {

      runInitialLoad()

    }

  }, []) // eslint-disable-line



  useEffect(() => {
    if (!selectedCity && !selectedState && !locationManuallySet && initialLoadDone.current) {
      dispatch(detectAndResolveLocation())
    }
  }, [selectedCity, selectedState, locationManuallySet, dispatch])



  useEffect(() => {

    if (!selectedCity?.id || !initialLoadDone.current) return

    loadSalons()

  }, [selectedCity?.id, selectedState?.id, loadSalons])



  // ── Keep URL in sync when user changes city ───────────────

  useEffect(() => {

    if (!selectedCity?.name || !initialLoadDone.current) return



    setSearchParams(prev => {

      const params = new URLSearchParams(prev)

      params.set('city', selectedCity.slug || selectedCity.name)

      if (selectedState?.name) params.set('state', selectedState.name)

      else params.delete('state')

      return params

    }, { replace: true })

  }, [selectedCity?.id, selectedCity?.slug, selectedState?.id, setSearchParams])



  const handleLocationReady = () => {

    loadSalons()

  }



  const handleLocationChange = useCallback(() => {

    loadSalons()

  }, [loadSalons])



  // ── Re-fetch when filters change ──────────────────────────

  const handleFilterChange = useCallback((newFilters) => {

    dispatch(setFilters(newFilters))

    const params = {}

    if (searchQuery)                params.q        = searchQuery

    if (newFilters.category)        params.category = newFilters.category

    if (selectedCity?.slug)         params.city     = selectedCity.slug

    if (selectedState?.name)        params.state    = selectedState.name

    setSearchParams(params)

    dispatch(fetchAllSalons({ ...filters, ...newFilters, q: searchQuery }))

  }, [dispatch, filters, searchQuery, selectedCity, selectedState, setSearchParams])



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

    const params = new URLSearchParams()

    if (selectedCity?.slug) params.set('city', selectedCity.slug)

    if (selectedState?.name) params.set('state', selectedState.name)

    setSearchParams(params)

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



  const hasActiveFilters = filters.category ||

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

        locationCity={locationCityName}

        locationState={locationStateName}

        onLocationChange={handleLocationChange}

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

          <LocationPromptBanner onLocated={handleLocationReady} />

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

              <>

                <strong>{sortedSalons.length}</strong> salons found

                {locationCityName ? ` in ${locationCityName}` : ''}

                {locationStatus === 'granted' && coords ? ' near you' : ''}

                {searchQuery ? ` for "${searchQuery}"` : ''}

              </>

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

