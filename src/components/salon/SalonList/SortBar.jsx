import styles from './SortBar.module.css'

const SORT_OPTIONS = [
  { id: 'rating',   label: 'Top Rated'  },
  { id: 'distance', label: 'Nearest'    },
  { id: 'price',    label: 'Price: Low' },
  { id: 'reviews',  label: 'Most Reviewed' },
]

export default function SortBar({ sortBy, onSort }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Sort by:</span>
      <div className={styles.options}>
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.id}
            className={`${styles.btn} ${sortBy === opt.id ? styles.active : ''}`}
            onClick={() => onSort(opt.id)}
          >
            {opt.label}
            {sortBy === opt.id && <span className={styles.dot} />}
          </button>
        ))}
      </div>
    </div>
  )
}