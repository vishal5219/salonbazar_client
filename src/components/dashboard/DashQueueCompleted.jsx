import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiCheck, FiClock, FiPhone, FiRefreshCw } from 'react-icons/fi'
import queueService from '@/services/queueService'
import { DASHBOARD_PATHS } from '@/constants/dashboardRoutes'
import styles from './DashQueueCompleted.module.css'

const TYPE_COLORS = {
  online: { bg: 'rgba(59,130,246,.12)', color: '#1D4ED8' },
  qr:     { bg: 'rgba(16,185,129,.12)', color: '#059669' },
  manual: { bg: 'rgba(139,92,246,.12)', color: '#7C3AED' },
}

export default function DashQueueCompleted() {
  const { salonId: dashboardSalonId, queueStats } = useSelector(s => s.dashboard)
  const { user } = useSelector(s => s.auth)
  const salonId = dashboardSalonId || user?.salonId

  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [completedToday, setCompletedToday] = useState(queueStats?.completedToday ?? 0)

  const loadCompleted = async () => {
    const id = dashboardSalonId || salonId
    if (!id) return
    setLoading(true)
    try {
      const data = await queueService.getCompleted(id)
      setEntries(data.entries || [])
      setCompletedToday(data.completedToday ?? 0)
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompleted()
  }, [dashboardSalonId, salonId])

  const todayLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <div>
          <Link to={DASHBOARD_PATHS.queue} className={styles.backLink}>
            <FiArrowLeft size={14} /> Back to Live Queue
          </Link>
          <h1 className={styles.pageTitle}>Completed Today</h1>
          <p className={styles.pageSub}>{todayLabel}</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.countPill}>
            <FiCheck size={14} />
            {completedToday} served
          </div>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={loadCompleted}
            disabled={loading}
          >
            <FiRefreshCw size={14} className={loading ? styles.spinning : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className={styles.section}>
        {loading ? (
          <div className={styles.emptyState}>Loading completed customers...</div>
        ) : entries.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>✓</span>
            <p>No completed customers yet today.</p>
            <Link to={DASHBOARD_PATHS.queue} className={styles.emptyLink}>
              Go to Live Queue
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {entries.map((entry, i) => (
              <div key={entry.id} className={styles.card} style={{ animationDelay: `${i * 0.04}s` }}>
                <div className={styles.checkIcon}>
                  <FiCheck size={16} />
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardName}>{entry.customerName}</span>
                    <span
                      className={styles.typeBadge}
                      style={TYPE_COLORS[entry.bookingType]}
                    >
                      {entry.bookingType}
                    </span>
                  </div>
                  <div className={styles.cardService}>{entry.service}</div>
                  <div className={styles.cardMeta}>
                    <span><FiClock size={11} /> Joined {entry.joinedAt}</span>
                    <span>Done {entry.completedAt || '—'}</span>
                    <span>{entry.duration || '—'} min</span>
                    <span>{entry.staffName || 'Any Available'}</span>
                    {entry.phone && (
                      <span><FiPhone size={11} /> {entry.phone}</span>
                    )}
                  </div>
                </div>
                <span className={styles.doneBadge}>Completed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
