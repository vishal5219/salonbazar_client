import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiX, FiCheck, FiCamera } from 'react-icons/fi'
import { openAuthModal, showNotification } from '@/store/slices/uiSlice'
import {
  fetchMyQueuePosition,
  joinSalonQueue,
  leaveSalonQueue,
  clearQueueState,
} from '@/store/slices/queueSlice'
import { setPendingWalkIn, clearPendingWalkIn } from '@/utils/pendingWalkIn'
import { flattenSalonServices } from '@/utils/salonServices'
import { parseSalonQueueQr, buildSalonQueuePath } from '@/utils/parseSalonQueueQr'
import QrScannerModal from './QrScannerModal'
import styles from './WalkInQueueModal.module.css'

export default function WalkInQueueModal({ open, onClose, salon }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(s => s.auth)
  const { myEntry, loading, joining, leaving } = useSelector(s => s.queue)

  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [scannerOpen, setScannerOpen] = useState(false)

  const services = useMemo(() => flattenSalonServices(salon), [salon])
  const selectedService = services.find(s => String(s.id) === String(selectedServiceId))
  const inQueue = Boolean(myEntry)
  const isServing = myEntry?.status === 'in_progress'

  useEffect(() => {
    if (!open || !salon?.id || !isAuthenticated) return undefined

    clearPendingWalkIn()
    dispatch(fetchMyQueuePosition(salon.id))

    const pollId = window.setInterval(() => {
      dispatch(fetchMyQueuePosition(salon.id))
    }, 20000)

    return () => window.clearInterval(pollId)
  }, [open, salon?.id, isAuthenticated, dispatch])

  useEffect(() => {
    if (!open) {
      setSelectedServiceId('')
      dispatch(clearQueueState())
    }
  }, [open, dispatch])

  if (!open || !salon) return null

  const handleClose = () => {
    dispatch(clearQueueState())
    onClose()
  }

  const handleJoin = async () => {
    if (!salon.isOpen) {
      dispatch(showNotification({ message: 'This salon is currently closed', type: 'warning' }))
      return
    }

    if (!isAuthenticated) {
      setPendingWalkIn(salon.id)
      dispatch(openAuthModal('login'))
      return
    }

    if (!selectedServiceId && services.length > 0) {
      dispatch(showNotification({ message: 'Please select a service', type: 'warning' }))
      return
    }

    try {
      await dispatch(joinSalonQueue({
        salonId: salon.id,
        serviceId: selectedService?.id,
        serviceName: selectedService?.name,
      })).unwrap()
      dispatch(showNotification({ message: 'You joined the walk-in queue!', type: 'success' }))
    } catch (err) {
      if (String(err).toLowerCase().includes('already in the queue')) {
        dispatch(fetchMyQueuePosition(salon.id))
        dispatch(showNotification({ message: 'You are already in the queue', type: 'info' }))
      } else {
        dispatch(showNotification({ message: err || 'Could not join queue', type: 'error' }))
      }
    }
  }

  const handleLeave = async () => {
    try {
      await dispatch(leaveSalonQueue(salon.id)).unwrap()
      dispatch(showNotification({ message: 'You left the queue', type: 'success' }))
      handleClose()
    } catch (err) {
      dispatch(showNotification({ message: err || 'Could not leave queue', type: 'error' }))
    }
  }

  const handleQrScan = (text) => {
    setScannerOpen(false)
    const parsed = parseSalonQueueQr(text)
    if (!parsed?.salonId) {
      dispatch(showNotification({ message: 'Not a valid SalonBazar queue QR code', type: 'error' }))
      return
    }
    if (String(parsed.salonId) !== String(salon.id)) {
      handleClose()
      navigate(buildSalonQueuePath(parsed.salonId))
      return
    }
    dispatch(showNotification({ message: 'QR matched this salon — select a service to join', type: 'success' }))
  }

  const handleOpenScanner = () => setScannerOpen(true)

  return (
    <>
      <QrScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleQrScan}
      />
      <div className={styles.backdrop} onClick={handleClose} aria-hidden="true" />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="walkin-queue-title"
      >
        <div className={styles.header}>
          <div>
            <h2 id="walkin-queue-title" className={styles.title}>Walk-In Queue</h2>
            <p className={styles.subtitle}>{salon.name}</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {!salon.isOpen && (
            <div className={styles.closedBanner}>
              This salon is closed right now. Walk-in queue is unavailable.
            </div>
          )}

          {loading && !myEntry ? (
            <p className={styles.hint}>Checking your queue status…</p>
          ) : inQueue ? (
            <div className={styles.ticket}>
              <div className={styles.positionNum}>
                {isServing ? '●' : `#${myEntry.position}`}
              </div>
              <div className={styles.positionLabel}>
                {isServing ? 'Your turn — please proceed to the counter' : 'Your position in queue'}
              </div>
              <div className={styles.ticketService}>{myEntry.service || 'Walk-in service'}</div>
              <div className={styles.ticketMeta}>
                {myEntry.duration ? `${myEntry.duration} min · ` : ''}
                Joined at {myEntry.joinedAt || 'just now'}
              </div>
              <span className={`${styles.statusPill} ${isServing ? styles.statusPillInProgress : ''}`}>
                {isServing ? 'In progress' : 'Waiting'}
              </span>
            </div>
          ) : (
            <>
              <button type="button" className={styles.scanBtn} onClick={handleOpenScanner}>
                <FiCamera size={16} />
                Scan Salon QR Code
              </button>
              <p className={styles.hint}>
                Scan the QR at reception (camera or upload image), or pick a service below to join the queue.
              </p>
              {services.length === 0 ? (
                <p className={styles.hint}>No services listed — you can still join and choose at the counter.</p>
              ) : (
                <>
                  <div className={styles.sectionLabel}>Select service</div>
                  <div className={styles.serviceList} role="listbox" aria-label="Select a service">
                    {services.map(svc => {
                      const isSelected = String(selectedServiceId) === String(svc.id)
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          className={`${styles.serviceOption} ${isSelected ? styles.serviceOptionActive : ''}`}
                          onClick={() => setSelectedServiceId(String(svc.id))}
                        >
                          <div>
                            <div className={styles.serviceName}>{svc.name}</div>
                            <div className={styles.serviceMeta}>
                              {svc.duration} min · ₹{svc.price?.toLocaleString?.() ?? svc.price}
                            </div>
                          </div>
                          {isSelected && <FiCheck size={18} color="var(--gold)" />}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className={styles.footer}>
          {inQueue ? (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleLeave}
              disabled={leaving}
            >
              {leaving ? 'Leaving…' : 'Leave Queue'}
            </button>
          ) : (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleJoin}
              disabled={!salon.isOpen || joining || (services.length > 0 && !selectedServiceId)}
            >
              {joining ? (
                <><span className={styles.spinner} /> Joining…</>
              ) : !isAuthenticated ? (
                'Sign in to Join Queue'
              ) : (
                'Join Walk-In Queue'
              )}
            </button>
          )}
          {!inQueue && (
            <p className={styles.hint}>
              You will receive your queue number instantly. Stay nearby — we will call you when it is your turn.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
