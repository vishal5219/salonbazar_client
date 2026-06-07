import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiUser, FiPhone, FiScissors, FiUserCheck, FiCheck, FiArrowRight } from 'react-icons/fi'
import { addManualCustomer, setActiveView } from '@/store/slices/dashboardSlice'
import styles from './DashWalkIn.module.css'

export default function DashWalkIn() {
  const dispatch = useDispatch()
  const { selectedSalon } = useSelector(s => s.salons)
  const { salonId } = useSelector(s => s.dashboard)

  const [form, setForm]         = useState({ name: '', phone: '', serviceId: '', staffId: '' })
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [addedName, setAddedName] = useState('')

  const services  = selectedSalon?.services?.flatMap(cat => cat.items) || []
  const staff     = selectedSalon?.staff?.filter(s => s.available) || []

  const selectedService = services.find(s => s.id === form.serviceId)
  const selectedStaff   = staff.find(s => String(s.id) === form.staffId)

  const isValid = form.name.trim() && form.serviceId

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    await dispatch(addManualCustomer({
      salonId: salonId || selectedSalon?.id || 1,
      name:     form.name.trim(),
      phone:    form.phone.trim(),
      service:  selectedService?.name || '',
      serviceId: selectedService?.id || '',
      duration: selectedService?.duration || 45,
      staff:    selectedStaff?.name || 'Any Available',
    }))
    setAddedName(form.name.trim())
    setSuccess(true)
    setLoading(false)
    setForm({ name: '', phone: '', serviceId: '', staffId: '' })
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Walk-In Entry</h1>
          <p className={styles.pageSub}>Add a customer manually to the live queue</p>
        </div>
        <button className={styles.viewQueueBtn} onClick={() => dispatch(setActiveView('queue'))}>
          View Live Queue <FiArrowRight size={14} />
        </button>
      </div>

      <div className={styles.layout}>
        {/* Form */}
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div className={styles.formIcon}>🏪</div>
            <div>
              <div className={styles.formTitle}>POS Entry Mode</div>
              <div className={styles.formSub}>Customer at counter — no phone needed</div>
            </div>
          </div>

          {success && (
            <div className={styles.successBanner}>
              <FiCheck size={16} />
              <span><strong>{addedName}</strong> has been added to the queue!</span>
              <button className={styles.successClose} onClick={() => setSuccess(false)}>✕</button>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Name */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <FiUser size={13} /> Customer Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Rohan Mehta"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            {/* Phone (optional) */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <FiPhone size={13} /> Phone Number <span className={styles.optional}>(optional)</span>
              </label>
              <input
                type="tel"
                className={styles.input}
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>

            {/* Service selection */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <FiScissors size={13} /> Service <span className={styles.required}>*</span>
              </label>
              <div className={styles.serviceGrid}>
                {(selectedSalon?.services || []).map(cat => (
                  <div key={cat.id}>
                    <div className={styles.catLabel}>{cat.icon} {cat.category}</div>
                    {cat.items.slice(0, 3).map(svc => (
                      <button
                        key={svc.id}
                        type="button"
                        className={`${styles.serviceChip} ${form.serviceId === svc.id ? styles.serviceChipActive : ''}`}
                        onClick={() => setForm(f => ({ ...f, serviceId: svc.id }))}
                      >
                        <span className={styles.chipName}>{svc.name}</span>
                        <span className={styles.chipMeta}>{svc.duration}m · ₹{svc.price}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Staff */}
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

        {/* Preview card */}
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

          {/* Tips */}
          <div className={styles.tipsCard}>
            <div className={styles.tipsTitle}>Quick Tips</div>
            <div className={styles.tips}>
              <div className={styles.tip}><span>📲</span> Show QR code at counter for self-service</div>
              <div className={styles.tip}><span>☎</span> Phone is optional — great for quick walk-ins</div>
              <div className={styles.tip}><span>⚡</span> Customer is added instantly to the live queue</div>
              <div className={styles.tip}><span>🔔</span> If phone given, they'll receive a wait-time SMS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}