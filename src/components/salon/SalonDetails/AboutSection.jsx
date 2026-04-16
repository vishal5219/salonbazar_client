import { useState } from 'react'
import styles from './AboutSection.module.css'

const TODAY = new Date().toLocaleString('en', { weekday: 'long' })

export default function AboutSection({ salon }) {
  const [expanded, setExpanded] = useState(false)
  const text  = salon.about
  const short = text.slice(0, 280)

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* About text */}
        <div className={styles.aboutCol}>
          <span className="overline">About</span>
          <h2 className={styles.title}>Our <em>Story</em></h2>
          <div className={styles.text}>
            <p>{expanded ? text : short + (text.length > 280 ? '...' : '')}</p>
          </div>
          {text.length > 280 && (
            <button className={styles.readMore} onClick={() => setExpanded(v => !v)}>
              {expanded ? 'Show less ↑' : 'Read more ↓'}
            </button>
          )}
        </div>

        {/* Working hours */}
        <div className={styles.hoursCol}>
          <div className={styles.hoursCard}>
            <div className={styles.hoursHeader}>
              <span className={styles.hoursTitle}>Working Hours</span>
              <span className={`${styles.todayBadge} ${salon.isOpen ? styles.open : styles.closed}`}>
                {salon.isOpen ? '● Open Now' : '● Closed'}
              </span>
            </div>
            <div className={styles.hoursList}>
              {salon.workingHours.map(h => (
                <div key={h.day} className={`${styles.hourRow} ${h.day === TODAY ? styles.todayRow : ''}`}>
                  <span className={styles.dayName}>{h.day}</span>
                  <span className={styles.dayHours}>
                    {h.closed ? 'Closed' : `${h.open} – ${h.close}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
