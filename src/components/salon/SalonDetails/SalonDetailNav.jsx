import styles from './SalonDetailNav.module.css'

export default function SalonDetailNav({ sections, active, onNav, salon }) {
  return (
    <div className={styles.navBar}>
      <div className={styles.inner}>
        <div className={styles.tabs}>
          {sections.map(s => (
            <button
              key={s}
              className={`${styles.tab} ${active === s ? styles.tabActive : ''}`}
              onClick={() => onNav(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className={styles.quickActions}>
          <a href={`tel:${salon.phone}`} className={styles.callBtn}>
            📞 Call
          </a>
          <button className={styles.bookQuickBtn} onClick={() => onNav('Services')}>
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  )
}
