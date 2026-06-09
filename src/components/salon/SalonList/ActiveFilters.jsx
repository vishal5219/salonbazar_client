import { FiX } from 'react-icons/fi'
import styles from './ActiveFilters.module.css'

export default function ActiveFilters({ filters, searchQuery, onChange, onClearAll }) {
  const chips = []

  if (searchQuery)
    chips.push({ key: 'q',        label: `"${searchQuery}"`,     onRemove: () => onChange({ searchQuery: '' }) })
  if (filters.category)
    chips.push({ key: 'category', label: filters.category,       onRemove: () => onChange({ category: '' }) })
  if (filters.location)
    chips.push({ key: 'location', label: filters.location,       onRemove: () => onChange({ location: '' }) })
  if (filters.rating > 0)
    chips.push({ key: 'rating',   label: `★ ${filters.rating}+`, onRemove: () => onChange({ rating: 0 }) })
  if (filters.isOpen)
    chips.push({ key: 'open',     label: 'Open Now',             onRemove: () => onChange({ isOpen: false }) })
  if (filters.salonType)
    chips.push({ key: 'type',     label: filters.salonType,      onRemove: () => onChange({ salonType: '' }) })
  if (filters.distance && filters.distance !== 'Any')
    chips.push({ key: 'dist',     label: filters.distance,       onRemove: () => onChange({ distance: '' }) })
  if (filters.priceRange?.[0] > 0 || filters.priceRange?.[1] < 5000)
    chips.push({ key: 'price',    label: `₹${filters.priceRange[0]}–₹${filters.priceRange[1]}`, onRemove: () => onChange({ priceRange: [0, 5000] }) })

  if (chips.length === 0) return null

  return (
    <div className={styles.row}>
      {chips.map(chip => (
        <span key={chip.key} className={styles.chip}>
          {chip.label}
          <button className={styles.remove} onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter`}>
            <FiX size={11} />
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button className={styles.clearAll} onClick={onClearAll}>
          Clear all
        </button>
      )}
    </div>
  )
}