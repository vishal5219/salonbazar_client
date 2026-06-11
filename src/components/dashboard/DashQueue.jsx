import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiPhone, FiTrash2, FiClock, FiUserPlus, FiEdit2, FiMenu, FiCheckCircle } from 'react-icons/fi'
import {
  advanceQueue,
  updateQueueEntry,
  removeQueueEntry,
  reorderQueue,
} from '@/store/slices/dashboardSlice'
import { showNotification } from '@/store/slices/uiSlice'
import { DASHBOARD_PATHS } from '@/constants/dashboardRoutes'
import QueueEditModal from './QueueEditModal'
import QueueStatusSelect from './QueueStatusSelect'
import styles from './DashQueue.module.css'

const TYPE_COLORS = {
  online: { bg: 'rgba(59,130,246,.12)', color: '#1D4ED8' },
  qr:     { bg: 'rgba(16,185,129,.12)', color: '#059669' },
  manual: { bg: 'rgba(139,92,246,.12)', color: '#7C3AED' },
}

export default function DashQueue() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { queue, queueLoading, queueStats } = useSelector(s => s.dashboard)
  const completedToday = queueStats?.completedToday ?? 0

  const [editingEntry, setEditingEntry] = useState(null)
  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  const inProgress = queue.find(q => q.status === 'in_progress')
  const waiting = queue.filter(q => q.status === 'waiting')

  const handleStatusChange = async (entry, status) => {
    if (status === entry.status) return
    try {
      await dispatch(updateQueueEntry({ entryId: entry.id, status })).unwrap()
      dispatch(showNotification({ message: 'Queue status updated', type: 'success' }))
    } catch (err) {
      dispatch(showNotification({ message: err || 'Could not update status', type: 'error' }))
    }
  }

  const handleRemove = async (entry) => {
    if (!window.confirm(`Remove ${entry.customerName} from the queue?`)) return
    try {
      await dispatch(removeQueueEntry(entry.id)).unwrap()
      dispatch(showNotification({ message: 'Customer removed from queue', type: 'success' }))
    } catch (err) {
      dispatch(showNotification({ message: err || 'Could not remove customer', type: 'error' }))
    }
  }

  const handleSaveEdit = async (fields) => {
    if (!editingEntry) return
    try {
      await dispatch(updateQueueEntry({ entryId: editingEntry.id, ...fields })).unwrap()
      dispatch(showNotification({ message: 'Queue entry updated', type: 'success' }))
      setEditingEntry(null)
    } catch (err) {
      dispatch(showNotification({ message: err || 'Could not update entry', type: 'error' }))
    }
  }

  const handleDrop = async (targetId) => {
    if (!dragId || dragId === targetId) {
      setDragId(null)
      setDragOverId(null)
      return
    }

    const ids = waiting.map(w => w.id)
    const fromIdx = ids.indexOf(dragId)
    const toIdx = ids.indexOf(targetId)
    if (fromIdx < 0 || toIdx < 0) {
      setDragId(null)
      setDragOverId(null)
      return
    }

    const newIds = [...ids]
    newIds.splice(fromIdx, 1)
    newIds.splice(toIdx, 0, dragId)

    setDragId(null)
    setDragOverId(null)

    try {
      await dispatch(reorderQueue(newIds)).unwrap()
    } catch (err) {
      dispatch(showNotification({ message: err || 'Could not reorder queue', type: 'error' }))
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Live Queue</h1>
          <p className={styles.pageSub}>{queue.length} customer{queue.length !== 1 ? 's' : ''} in queue</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.completedBtn}
            onClick={() => navigate(DASHBOARD_PATHS.queueCompleted)}
          >
            <FiCheckCircle size={15} /> Completed ({completedToday})
          </button>
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

      {inProgress && (
        <div className={styles.currentCard}>
          <div className={styles.currentBadge}>
            <span className={styles.currentDot} /> Currently Serving
          </div>
          <div className={styles.currentBody}>
            <div className={styles.currentAvatar}>{inProgress.customerName[0]}</div>
            <div className={styles.currentInfo}>
              <h3 className={styles.currentName}>{inProgress.customerName}</h3>
              <p className={styles.currentService}>
                {inProgress.service} · {inProgress.duration || '—'} min
              </p>
              <div className={styles.currentMeta}>
                <span><FiPhone size={12} /> {inProgress.phone || '—'}</span>
                <span><FiClock size={12} /> Since {inProgress.joinedAt}</span>
                <span>Stylist: {inProgress.staffName || 'Any Available'}</span>
              </div>
              <QueueStatusSelect
                className={styles.statusSelect}
                variant="dark"
                value={inProgress.status}
                onChange={status => handleStatusChange(inProgress, status)}
                disabled={queueLoading}
              />
            </div>
            <div className={styles.currentActions}>
              <button
                type="button"
                className={styles.editBtnDark}
                onClick={() => setEditingEntry(inProgress)}
                title="Edit entry"
              >
                <FiEdit2 size={14} /> Edit
              </button>
              {inProgress.phone && (
                <a href={`tel:${inProgress.phone}`} className={styles.callBtn}>
                  <FiPhone size={14} /> Call
                </a>
              )}
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

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          Waiting ({waiting.length})
          {waiting.length > 1 && (
            <span className={styles.dragHint}>Drag cards to reorder</span>
          )}
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
                className={`${styles.queueCard} ${dragOverId === entry.id ? styles.queueCardDragOver : ''} ${dragId === entry.id ? styles.queueCardDragging : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
                draggable={!queueLoading}
                onDragStart={() => setDragId(entry.id)}
                onDragEnd={() => { setDragId(null); setDragOverId(null) }}
                onDragOver={e => { e.preventDefault(); setDragOverId(entry.id) }}
                onDragLeave={() => setDragOverId(prev => (prev === entry.id ? null : prev))}
                onDrop={e => { e.preventDefault(); handleDrop(entry.id) }}
              >
                <button
                  type="button"
                  className={styles.dragHandle}
                  title="Drag to reorder"
                  onMouseDown={e => e.stopPropagation()}
                >
                  <FiMenu size={14} />
                </button>

                <div className={styles.posNum}>#{entry.position}</div>

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
                    <span><FiClock size={11} /> {entry.duration || '—'} min</span>
                    <span>Est: {entry.estimatedTime || '—'}</span>
                    <span>{entry.staffName || 'Any Available'}</span>
                    {entry.phone && <span><FiPhone size={11} /> {entry.phone}</span>}
                  </div>
                  <QueueStatusSelect
                    className={styles.statusSelect}
                    value={entry.status}
                    onChange={status => handleStatusChange(entry, status)}
                    disabled={queueLoading}
                  />
                </div>

                <div className={styles.cardActions}>
                  <span className={styles.joinedTime}>Joined {entry.joinedAt}</span>
                  <div className={styles.actionBtns}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => setEditingEntry(entry)}
                      title="Edit entry"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    {entry.phone && (
                      <a href={`tel:${entry.phone}`} className={styles.iconBtn} title="Call customer">
                        <FiPhone size={14} />
                      </a>
                    )}
                    <button
                      className={`${styles.iconBtn} ${styles.removeBtn}`}
                      onClick={() => handleRemove(entry)}
                      disabled={queueLoading}
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

      <div className={styles.legend}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <span key={type} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: color.color }} />
            {type === 'qr' ? 'QR Scan' : type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>

      <QueueEditModal
        entry={editingEntry}
        open={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
        onSave={handleSaveEdit}
        saving={queueLoading}
      />
    </div>
  )
}
