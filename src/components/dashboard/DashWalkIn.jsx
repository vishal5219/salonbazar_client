import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiPhone, FiScissors, FiUserCheck, FiCheck, FiArrowRight } from 'react-icons/fi'
import { addManualCustomer } from '@/store/slices/dashboardSlice'
import { fetchSalonById } from '@/store/slices/salonSlice'
import { showNotification } from '@/store/slices/uiSlice'
import { DASHBOARD_PATHS } from '@/constants/dashboardRoutes'
import { FALLBACK_WALK_IN_SERVICES } from '@/constants/walkInServices'
import styles from './DashWalkIn.module.css'

function flattenSalonServices(salon) {
  return (salon?.services || []).flatMap(cat =>
    (cat.items || []).map(item => ({
      id: item.id,
      name: item.name,
      duration: item.duration,
      price: item.price,
      category: cat.category,
      categoryIcon: cat.icon,
    }))
  )
}

export default function DashWalkIn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const { selectedSalon } = useSelector(s => s.salons)
  const { salonId: dashboardSalonId } = useSelector(s => s.dashboard)

  const salonId = dashboardSalonId || user?.salonId

  const [form, setForm] = useState({ name: '', phone: '', serviceId: '', staffId: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [addedName, setAddedName] = useState('')

  useEffect(() => {
    if (!salonId) return
    if (!selectedSalon || String(selectedSalon.id) !== String(salonId)) {
      dispatch(fetchSalonById(salonId))
    }
  }, [salonId, selectedSalon, dispatch])

  const catalogServices = useMemo(
    () => flattenSalonServices(selectedSalon),
    [selectedSalon]
  )

  const usingFallback = catalogServices.length === 0
  const services = usingFallback ? FALLBACK_WALK_IN_SERVICES : catalogServices

  const staff = (selectedSalon?.staff || []).filter(s => s.available)

  const selectedService = services.find(s => String(s.id) === String(form.serviceId))
  const selectedStaff = staff.find(s => String(s.id) === String(form.staffId))

  const isValid = Boolean(form.name.trim() && form.serviceId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid || !salonId) return
    setLoading(true)
    try {
      await dispatch(addManualCustomer({
        salonId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        service: selectedService?.name || '',
        serviceId: usingFallback ? null : (selectedService?.id || null),
        duration: selectedService?.duration || 45,
        staff: selectedStaff?.name || 'Any Available',
      })).unwrap()
      setAddedName(form.name.trim())
      setSuccess(true)
      setForm({ name: '', phone: '', serviceId: '', staffId: '' })
      dispatch(showNotification({ message: 'Customer added to queue', type: 'success' }))
    } catch (err) {
      dispatch(showNotification({
        message: err?.message || err || 'Could not add to queue',
        type: 'error',
      }))
    } finally {
      setLoading(false)
    }
  }

  const servicesByCategory = useMemo(() => {
    const groups = {}
    for (const svc of services) {
      const key = svc.category || 'Services'
      if (!groups[key]) groups[key] = []
      groups[key].push(svc)
    }
    return groups
  }, [services])

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Walk-In Entry</h1>
          <p className={styles.pageSub}>Add a customer manually to the live queue</p>
        </div>
        <button type="button" className={styles.viewQueueBtn} onClick={() => navigate(DASHBOARD_PATHS.queue)}>
          View Live Queue <FiArrowRight size={14} />
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div className={styles.formIcon}>🏪</div>
            <div>
              <div className={styles.formTitle}>POS Entry Mode</div>
              <div className={styles.formSub}>Select a service, then add the customer to the queue</div>
            </div>
          </div>

          {success && (
            <div className={styles.successBanner}>
              <FiCheck size={16} />
              <span><strong>{addedName}</strong> has been added to the queue!</span>
              <button type="button" className={styles.successClose} onClick={() => setSuccess(false)}>✕</button>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="walkin-name">
                <FiUser size={13} /> Customer Name <span className={styles.required}>*</span>
              </label>
              <input
                id="walkin-name"
                type="text"
                className={styles.input}
                placeholder="e.g. Rohan Mehta"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="walkin-phone">
                <FiPhone size={13} /> Phone Number <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="walkin-phone"
                type="tel"
                className={styles.input}
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} id="walkin-service-label">
                <FiScissors size={13} /> Service <span className={styles.required}>*</span>
              </label>

              <div className={styles.servicePicker} role="listbox" aria-label="Select a service">
                <div className={styles.servicePickerHeader}>
                  <span>Tap a service below</span>
                  <span>{services.length} options</span>
                </div>
                <div className={styles.servicePickerScroll}>
                  {Object.entries(servicesByCategory).map(([category, items]) => (
                    <div key={category} className={styles.serviceGroup}>
                      <div className={styles.catLabel}>
                        {items[0]?.categoryIcon || '✦'} {category}
                      </div>
                      {items.map(svc => {
                        const isSelected = String(form.serviceId) === String(svc.id)
                        return (
                          <button
                            key={svc.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            className={`${styles.serviceOption} ${isSelected ? styles.serviceOptionActive : ''}`}
                            onClick={() => setForm(f => ({ ...f, serviceId: String(svc.id) }))}
                          >
                            <span className={styles.serviceOptionMain}>
                              <span className={styles.chipName}>{svc.name}</span>
                              <span className={styles.chipMeta}>{svc.duration} min · ₹{svc.price}</span>
                            </span>
                            {isSelected && <FiCheck size={16} className={styles.serviceCheck} />}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {usingFallback && (
                <p className={styles.serviceHint}>
                  Using quick services until your salon catalog is set up. Add services in Salon Settings later.
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <FiUserCheck size={13} /> Assign Staff <span className={styles.optional}>(optional)</span>
              </label>
              <div className={styles.staffRow}>
                <button
                  type="button"
                  className={`${styles.staffChip} ${!form.staffId ? styles.staffActive : ''}`}
                  onClick={() => setForm(f => ({ ...f, staffId: '' }))}
                >
                  Any Available
                </button>
                {staff.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`${styles.staffChip} ${form.staffId === String(s.id) ? styles.staffActive : ''}`}
                    onClick={() => setForm(f => ({ ...f, staffId: String(s.id) }))}
                  >
                    {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <p className={styles.submitHint}>
              {!form.name.trim() && 'Enter customer name. '}
              {form.name.trim() && !form.serviceId && 'Select a service to enable the button.'}
              {isValid && 'Ready to add this walk-in to the live queue.'}
            </p>

            <button
              type="submit"
              className={`${styles.submitBtn} ${(!isValid || loading) ? styles.submitDisabled : ''}`}
              disabled={!isValid || loading}
            >
              {loading ? (
                <><span className={styles.spinner} /> Adding to Queue...</>
              ) : (
                <>+ Add to Queue</>
              )}
            </button>
          </form>
        </div>

        <div className={styles.previewCol}>
          <div className={styles.previewCard}>
            <div className={styles.previewTitle}>Queue Ticket Preview</div>
            <div className={styles.ticket}>
              <div className={styles.ticketTop}>
                <div className={styles.ticketAvatar}>
                  {form.name ? form.name[0].toUpperCase() : '?'}
                </div>
                <div>
                  <div className={styles.ticketName}>{form.name || 'Customer Name'}</div>
                  <div className={styles.ticketPhone}>{form.phone || 'No phone'}</div>
                </div>
              </div>
              <div className={styles.ticketService}>
                {selectedService ? (
                  <>
                    <span className={styles.ticketServiceName}>{selectedService.name}</span>
                    <span className={styles.ticketServiceMeta}>{selectedService.duration} min · ₹{selectedService.price}</span>
                  </>
                ) : (
                  <span className={styles.ticketPlaceholder}>No service selected</span>
                )}
              </div>
              <div className={styles.ticketStaff}>
                👤 {selectedStaff?.name || 'Any Available'}
              </div>
              <div className={styles.ticketBadge}>MANUAL ENTRY</div>
            </div>
          </div>

          <div className={styles.tipsCard}>
            <div className={styles.tipsTitle}>Quick Tips</div>
            <div className={styles.tips}>
              <div className={styles.tip}><span>✂️</span> Scroll the list and tap a service to select</div>
              <div className={styles.tip}><span>☎</span> Phone is optional for quick walk-ins</div>
              <div className={styles.tip}><span>⚡</span> Customer is added instantly to the live queue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
