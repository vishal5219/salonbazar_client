import { Link } from 'react-router-dom'
import styles from './PartnerCTA.module.css'

const perks = [
  { icon: '📊', title: 'Smart Dashboard', desc: 'Track bookings, revenue, and peak hours in real time.' },
  { icon: '📲', title: 'QR Walk-In System', desc: 'Let customers scan and join your queue instantly.' },
  { icon: '⚡', title: 'Live Queue Manager', desc: 'Manage walk-ins and appointments from one screen.' },
  { icon: '💬', title: 'Auto Notifications', desc: 'Reminders and updates sent to customers automatically.' },
]

export default function PartnerCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <span className="overline" style={{ color: 'var(--gold)' }}>For Salon Owners</span>
          <h2 className={styles.title}>
            Grow Your Salon<br />
            <em>With SalonBazar</em>
          </h2>
          <p className={styles.desc}>
            Join 250+ salon owners who trust SalonBazar to manage bookings, reduce no-shows, 
            and delight their customers every day.
          </p>

          <div className={styles.perks}>
            {perks.map(p => (
              <div key={p.title} className={styles.perk}>
                <span className={styles.perkIcon}>{p.icon}</span>
                <div>
                  <div className={styles.perkTitle}>{p.title}</div>
                  <div className={styles.perkDesc}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <Link to="/register-salon" className={styles.btnPrimary}>
              List Your Salon — Free
            </Link>
            <Link to="/pricing" className={styles.btnSecondary}>
              View Plans
            </Link>
          </div>
        </div>

        {/* Right visual */}
        <div className={styles.visual}>
          <div className={styles.mockCard}>
            <div className={styles.mockHeader}>
              <span className={styles.mockTitle}>Today's Overview</span>
              <span className={styles.mockDate}>Live</span>
            </div>
            <div className={styles.mockStats}>
              <div className={styles.mockStat}>
                <span className={styles.mockNum}>24</span>
                <span className={styles.mockLabel}>Bookings</span>
              </div>
              <div className={styles.mockStat}>
                <span className={styles.mockNum}>₹18,400</span>
                <span className={styles.mockLabel}>Revenue</span>
              </div>
              <div className={styles.mockStat}>
                <span className={styles.mockNum}>6</span>
                <span className={styles.mockLabel}>In Queue</span>
              </div>
            </div>
            <div className={styles.mockQueue}>
              <div className={styles.mockQueueTitle}>Live Queue</div>
              {['Rohan M. — Haircut', 'Priya S. — Facial', 'Ananya P. — Color'].map((item, i) => (
                <div key={i} className={styles.mockQueueItem}>
                  <div className={styles.queueDot} style={{ background: i === 0 ? '#6EE7B7' : 'var(--smoke-light)' }} />
                  <span>{item}</span>
                  <span className={styles.queueStatus}>{i === 0 ? 'In Progress' : `#${i + 1}`}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative badge */}
          <div className={styles.badge}>
            <span className={styles.badgeNum}>Free</span>
            <span className={styles.badgeLabel}>to get started</span>
          </div>
        </div>
      </div>
    </section>
  )
}
