import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi'
import styles from './FiltersSidebar.module.css'

const CATEGORIES = [
    { id: 'hair', label: 'Hair Styling', icon: '💇' },
    { id: 'bridal', label: 'Bridal Makeup', icon: '👰' },
    { id: 'spa', label: 'Spa & Massage', icon: '🧖' },
    { id: 'beard', label: 'Beard Grooming', icon: '🪒' },
    { id: 'nails', label: 'Nail Art', icon: '💅' },
    { id: 'skincare', label: 'Skin & Facial', icon: '✨' },
    { id: 'waxing', label: 'Waxing', icon: '🌸' },
    { id: 'kids', label: 'Kids Salon', icon: '🎈' },
]

const AMENITIES = [
    { id: 'parking', label: 'Free Parking' },
    { id: 'wifi', label: 'Wi-Fi' },
    { id: 'ac', label: 'Air Conditioned' },
    { id: 'card', label: 'Card Payment' },
    { id: 'homevisit', label: 'Home Visit' },
]

const SORT_TYPES = [
    { id: 'unisex', label: 'Unisex' },
    { id: 'ladies', label: 'Ladies' },
    { id: 'mens', label: "Men's" },
]

function Section({ title, defaultOpen = true, children }) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className={styles.section}>
            <button className={styles.sectionHeader} onClick={() => setOpen(v => !v)}>
                <span>{title}</span>
                {open ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
            </button>
            {open && <div className={styles.sectionBody}>{children}</div>}
        </div>
    )
}

export default function FiltersSidebar({ filters, onChange, onClearAll }) {
    const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 2000])
    const [selectedAmenities, setSelectedAmenities] = useState([])

    const hasAnyFilter = filters.category || filters.location ||
        filters.rating > 0 || priceRange[0] > 0 || priceRange[1] < 2000

    const handleCategory = (id) => {
        onChange({ category: filters.category === id ? '' : id })
    }

    const handleRating = (r) => {
        onChange({ rating: filters.rating === r ? 0 : r })
    }

    const handlePrice = (e, idx) => {
        const val = Number(e.target.value)
        const next = [...priceRange]
        next[idx] = val
        if (next[0] <= next[1]) {
            setPriceRange(next)
            onChange({ priceRange: next })
        }
    }

    const handleAmenity = (id) => {
        setSelectedAmenities(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }

    const handleType = (id) => {
        onChange({ salonType: filters.salonType === id ? '' : id })
    }

    const handleClear = () => {
        setPriceRange([0, 2000])
        setSelectedAmenities([])
        onClearAll()
    }

    return (
        <div className={styles.sidebar}>
            {/* Header */}
            <div className={styles.header}>
                <h3 className={styles.title}>Filters</h3>
                {hasAnyFilter && (
                    <button className={styles.clearAllBtn} onClick={handleClear}>
                        <FiX size={13} /> Clear All
                    </button>
                )}
            </div>

            {/* Availability */}
            <Section title="Availability">
                <label className={styles.toggle}>
                    <div className={styles.toggleTrack}>
                        <input
                            type="checkbox"
                            checked={!!filters.isOpen}
                            onChange={e => onChange({ isOpen: e.target.checked })}
                        />
                        <span className={styles.toggleThumb} />
                    </div>
                    <div className={styles.toggleLabel}>
                        <span className={styles.openDot} />
                        Open Now Only
                    </div>
                </label>
            </Section>

            {/* Salon Type */}
            <Section title="Salon Type">
                <div className={styles.typeGrid}>
                    {SORT_TYPES.map(t => (
                        <button
                            key={t.id}
                            className={`${styles.typeBtn} ${filters.salonType === t.id ? styles.typeActive : ''}`}
                            onClick={() => handleType(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </Section>

            {/* Categories */}
            <Section title="Services">
                <div className={styles.categoryList}>
                    {CATEGORIES.map(cat => (
                        <label key={cat.id} className={styles.checkRow}>
                            <input
                                type="checkbox"
                                checked={filters.category === cat.id}
                                onChange={() => handleCategory(cat.id)}
                                className={styles.checkbox}
                            />
                            <span className={styles.checkIcon}>{cat.icon}</span>
                            <span className={styles.checkLabel}>{cat.label}</span>
                        </label>
                    ))}
                </div>
            </Section>

            {/* Price Range */}
            <Section title="Price Range">
                <div className={styles.priceDisplay}>
                    <span className={styles.priceVal}>₹{priceRange[0]}</span>
                    <span className={styles.priceDash}>—</span>
                    <span className={styles.priceVal}>₹{priceRange[1]}</span>
                </div>
                <div className={styles.rangeWrap}>
                    <input
                        type="range" min={0} max={2000} step={50}
                        value={priceRange[0]}
                        onChange={e => handlePrice(e, 0)}
                        className={styles.rangeSlider}
                    />
                    <input
                        type="range" min={0} max={2000} step={50}
                        value={priceRange[1]}
                        onChange={e => handlePrice(e, 1)}
                        className={styles.rangeSlider}
                    />
                </div>
                <div className={styles.priceLabels}>
                    <span>₹0</span>
                    <span>₹2000+</span>
                </div>
            </Section>

            {/* Rating */}
            <Section title="Minimum Rating">
                <div className={styles.ratingOptions}>
                    {[4.5, 4.0, 3.5, 3.0].map(r => (
                        <button
                            key={r}
                            className={`${styles.ratingBtn} ${filters.rating === r ? styles.ratingActive : ''}`}
                            onClick={() => handleRating(r)}
                        >
                            <span className={styles.star}>★</span>
                            {r}+
                        </button>
                    ))}
                </div>
            </Section>

            {/* Distance */}
            <Section title="Distance" defaultOpen={false}>
                <div className={styles.distanceOptions}>
                    {['< 1 km', '< 2 km', '< 5 km', 'Any'].map(d => (
                        <label key={d} className={styles.radioRow}>
                            <input
                                type="radio"
                                name="distance"
                                value={d}
                                onChange={() => onChange({ distance: d })}
                                checked={filters.distance === d}
                                className={styles.radio}
                            />
                            <span>{d}</span>
                        </label>
                    ))}
                </div>
            </Section>

            {/* Amenities */}
            <Section title="Amenities" defaultOpen={false}>
                <div className={styles.categoryList}>
                    {AMENITIES.map(a => (
                        <label key={a.id} className={styles.checkRow}>
                            <input
                                type="checkbox"
                                checked={selectedAmenities.includes(a.id)}
                                onChange={() => handleAmenity(a.id)}
                                className={styles.checkbox}
                            />
                            <span className={styles.checkLabel}>{a.label}</span>
                        </label>
                    ))}
                </div>
            </Section>
        </div>
    )
}