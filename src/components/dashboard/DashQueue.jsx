import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiPhone, FiTrash2, FiClock, FiUserPlus } from 'react-icons/fi'
import { advanceQueue, removeFromQueue } from '@/store/slices/dashboardSlice'
import { DASHBOARD_PATHS } from '@/constants/dashboardRoutes'
import styles from './DashQueue.module.css'

const TYPE_COLORS = {
  online: { bg: 'rgba(59,130,246,.12)', color: '#1D4ED8' },
  qr:     { bg: 'rgba(16,185,129,.12)', color: '#059669' },
  manual: { bg: 'rgba(139,92,246,.12)', color: '#7C3AED' },
}

export default function DashQueue() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { queue, queueLoading } = useSelector(s => s.dashboard)

  const inProgress = queue.find(q => q.status === 'in_progress')
  const waiting    = queue.filter(q => q.status === 'waiting')

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Live Queue</h1>
          <p className={styles.pageSub}>{queue.length} customer{queue.length !== 1 ? 's' : ''} in queue</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.addBtn} onClick={() => navigate(DASHBOARD_PATHS.walkIn)}>
            <FiUserPlus size={15} /> Add Walk-In
          </button>
          <button
            className={styles.advanceBtn}
            onClick={() => dispatch(advanceQueue())}
            disabled={!inProgress || queueLoading}
          >
            {queueLoading
              ? <><span className={styles.spinner} /> Updating...</>
              : '✓ Mark Done & Call Next'
            }
          </button>
        </div>
      </div>

      {/* Current serving */}
      {inProgress && (
        <div className={styles.currentCard}>
          <div className={styles.currentBadge}>
            <span className={styles.currentDot} /> Currently Serving
          </div>
          <div className={styles.currentBody}>
            <div className={styles.currentAvatar}>{inProgress.customerName[0]}</div>
            <div className={styles.currentInfo}>
              <h3 className={styles.currentName}>{inProgress.customerName}</h3>
              <p className={styles.currentService}>{inProgress.service} · {inProgress.duration} min</p>
              <div className={styles.currentMeta}>
                <span><FiPhone size={12} /> {inProgress.phone}</span>
                <span><FiClock size={12} /> Since {inProgress.joinedAt}</span>
                <span>Stylist: {inProgress.staffName}</span>
              </div>
            </div>
            <div className={styles.currentActions}>
              <a href={`tel:${inProgress.phone}`} className={styles.callBtn}>
                <FiPhone size={14} /> Call
              </a>
              <button
                className={styles.doneBtn}
                onClick={() => dispatch(advanceQueue())}
                disabled={queueLoading}
              >
                {queueLoading ? '...' : '✓ Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waiting list */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          Waiting ({waiting.length})
        </div>

        {waiting.length === 0 ? (
          <div className={styles.emptyState}>
            <span>🎉</span>
            <p>No one waiting — queue is clear!</p>
          </div>
        ) : (
          <div className={styles.queueList}>
            {waiting.map((entry, i) => (
              <div
                key={entry.id}
                className={styles.queueCard}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Position */}
                <div className={styles.posNum}>#{entry.position}</div>

                {/* Customer info */}
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
                    <span><FiClock size={11} /> {entry.duration} min</span>
                    <span>Est: {entry.estimatedTime}</span>
                    <span>{entry.staffName}</span>
                    {entry.phone && <span><FiPhone size={11} /> {entry.phone}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.cardActions}>
                  <span className={styles.joinedTime}>Joined {entry.joinedAt}</span>
                  <div className={styles.actionBtns}>
                    {entry.phone && (
                      <a href={`tel:${entry.phone}`} className={styles.iconBtn} title="Call customer">
                        <FiPhone size={14} />
                      </a>
                    )}
                    <button
                      className={`${styles.iconBtn} ${styles.removeBtn}`}
                      onClick={() => dispatch(removeFromQueue(entry.id))}
                      title="Remove from queue"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <span key={type} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: color.color }} />
            {type === 'qr' ? 'QR Scan' : type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>
    </div>
  )
}