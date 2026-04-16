import { useEffect } from 'react'
import FiltersSidebar from './FiltersSidebar'
import styles from './MobileFilterSheet.module.css'

export default function MobileFilterSheet({ open, onClose, filters, onChange, onClearAll }) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={`${styles.sheet} ${open ? styles.sheetOpen : ''}`}>
        <div className={styles.handle} />
        <div className={styles.sheetHeader}>
          <h3 className={styles.sheetTitle}>Filters</h3>
          <button className={styles.doneBtn} onClick={onClose}>Done</button>
        </div>
        <div className={styles.sheetBody}>
          <FiltersSidebar
            filters={filters}
            onChange={(f) => { onChange(f) }}
            onClearAll={() => { onClearAll(); onClose() }}
          />
        </div>
      </div>
    </>
  )
}