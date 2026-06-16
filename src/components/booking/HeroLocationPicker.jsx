import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiCheck, FiMapPin } from 'react-icons/fi'
import {
  fetchStates,
  fetchCitiesByState,
  detectAndResolveLocation,
  setSelectedCity,
  setSelectedState,
} from '@/store/slices/locationSlice'
import { formatCityLabel, formatStateLabel, isSameCity } from '@/utils/locationUtils'
import heroStyles from './HeroLocationPicker.module.css'
import compactStyles from './LocationPickerCompact.module.css'

const DROPDOWN_WIDTH = 320
const DROPDOWN_EST_HEIGHT = 440

function sortStatesForPicker(states) {
  return [...states].sort((a, b) => {
    const aLive = (a.active_city_count || 0) > 0 ? 1 : 0
    const bLive = (b.active_city_count || 0) > 0 ? 1 : 0
    if (bLive !== aLive) return bLive - aLive
    return a.name.localeCompare(b.name)
  })
}

export default function HeroLocationPicker({ variant = 'hero', onCityChange }) {
  const dispatch = useDispatch()
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: DROPDOWN_WIDTH })
  const styles = variant === 'compact' ? compactStyles : heroStyles

  const {
    states,
    cities,
    citiesLoading,
    detecting,
    selectedState,
    selectedCity,
    autoDetected,
    status,
    locationManuallySet,
  } = useSelector(s => s.location)

  useEffect(() => {
    dispatch(fetchStates())
  }, [dispatch])

  useEffect(() => {
    if (!selectedState && !selectedCity && !locationManuallySet) {
      dispatch(detectAndResolveLocation())
    }
  }, [dispatch, selectedState, selectedCity, locationManuallySet])

  useEffect(() => {
    if (selectedState?.id) {
      dispatch(fetchCitiesByState(selectedState.id))
    }
  }, [selectedState?.id, dispatch])

  const updateMenuPosition = useCallback(() => {
    const el = triggerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const width = Math.min(DROPDOWN_WIDTH, window.innerWidth - 16)
    const gap = 8

    let top = rect.bottom + gap
    let left = rect.left

    if (top + DROPDOWN_EST_HEIGHT > window.innerHeight - 8) {
      top = Math.max(8, rect.top - DROPDOWN_EST_HEIGHT - gap)
    }

    if (left + width > window.innerWidth - 8) {
      left = window.innerWidth - width - 8
    }

    setMenuPos({ top, left, width })
  }, [])

  useEffect(() => {
    if (!open) return undefined

    updateMenuPosition()

    const handlePointerDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return
      if (menuRef.current?.contains(e.target)) return
      setOpen(false)
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    const handleReposition = () => updateMenuPosition()

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [open, updateMenuPosition])

  const cityLabel = formatCityLabel(selectedCity)
  const stateLabel = formatStateLabel(selectedState)
  const locationLabel = detecting ? 'Detecting…' : (cityLabel || 'Select city')

  const handleStateSelect = (state) => {
    dispatch(setSelectedState({ id: state.id, name: state.name, code: state.code }))
  }

  const sortedStates = sortStatesForPicker(states)

  const handleCitySelect = (city) => {
    dispatch(setSelectedCity(city))
    setOpen(false)
    onCityChange?.(city)
  }

  const handleDetectAgain = async () => {
    const result = await dispatch(detectAndResolveLocation({ force: true }))
    if (selectedState?.id) {
      dispatch(fetchCitiesByState(selectedState.id))
    }
    if (detectAndResolveLocation.fulfilled.match(result)) {
      onCityChange?.(result.payload.city)
    }
  }

  const toggleOpen = () => {
    setOpen(prev => {
      const next = !prev
      if (next) {
        requestAnimationFrame(updateMenuPosition)
      }
      return next
    })
  }

  const dropdown = open ? (
    <div
      ref={menuRef}
      className={styles.dropdownPortal}
      role="dialog"
      aria-label="Choose location"
      style={{
        top: menuPos.top,
        left: menuPos.left,
        width: menuPos.width,
      }}
    >
      <div className={styles.dropdownHeader}>
        <div className={styles.dropdownTitleRow}>
          <FiMapPin size={13} className={styles.dropdownTitleIcon} />
          <span className={styles.dropdownTitle}>Select state</span>
        </div>
        <div className={styles.stateList} role="listbox" aria-label="Select state">
          {sortedStates.length === 0 ? (
            <p className={styles.loadingText}>Loading states…</p>
          ) : (
            sortedStates.map(st => {
              const isSelected = selectedState?.id === st.id
              const liveCount = st.active_city_count || 0
              return (
                <button
                  key={st.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.stateOption} ${isSelected ? styles.stateOptionActive : ''}`}
                  onClick={() => handleStateSelect(st)}
                >
                  <span className={styles.stateName}>{st.name}</span>
                  <span className={styles.stateMeta}>
                    {liveCount > 0 && (
                      <span className={styles.stateLiveBadge}>{liveCount} live</span>
                    )}
                    {isSelected && <FiCheck size={14} className={styles.stateCheck} />}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className={styles.citiesSection}>
        <div className={styles.dropdownTitleRow}>
          <span className={styles.dropdownTitle}>Cities in {stateLabel || 'state'}</span>
        </div>

      {citiesLoading ? (
        <p className={styles.loadingText}>Loading cities…</p>
      ) : (
        <div className={styles.cityList} role="listbox" aria-label="Select city">
          {cities.map(city => {
            const isSelected = isSameCity(selectedCity, city)
            return (
              <button
                key={city.id || city.slug}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`${styles.cityOption} ${isSelected ? styles.cityOptionActive : ''}`}
                onClick={() => handleCitySelect(city)}
              >
                <span className={styles.cityOptionLabel}>
                  {formatCityLabel(city)}
                  {city.active && <span className={styles.liveBadge}>Live</span>}
                </span>
                {isSelected && <FiCheck size={14} />}
              </button>
            )
          })}
          {cities.length === 0 && (
            <p className={styles.loadingText}>No cities in this state yet.</p>
          )}
        </div>
      )}
      </div>

      <div className={styles.dropdownFooter}>
        <button
          type="button"
          className={styles.detectBtn}
          onClick={handleDetectAgain}
          disabled={detecting}
        >
          {detecting ? 'Detecting your location…' : 'Use my current location'}
        </button>
      </div>
    </div>
  ) : null

  return (
    <div className={styles.locationPicker}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.searchLocation} ${open ? styles.searchLocationOpen : ''}`}
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Location: ${locationLabel}${stateLabel ? `, ${stateLabel}` : ''}`}
      >
        {variant === 'compact' ? (
          <>
            <span className={styles.locationIcon} aria-hidden>📍</span>
            <span className={styles.locationText}>{locationLabel}</span>
            <span className={styles.locationCaret} aria-hidden>▾</span>
          </>
        ) : (
          <>
            <span aria-hidden>📍</span>
            <span>
              <span className={styles.locationText}>{locationLabel}</span>
              {!detecting && stateLabel && (
                <span className={styles.locationSub}>
                  {stateLabel}
                  {autoDetected && status === 'granted' ? ' · GPS' : ''}
                </span>
              )}
            </span>
            <span className={styles.locationCaret}>▾</span>
          </>
        )}
      </button>

      {dropdown && createPortal(dropdown, document.body)}
    </div>
  )
}
