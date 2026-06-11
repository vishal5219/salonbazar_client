import { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import QueueStatusSelect from './QueueStatusSelect'
import styles from './QueueEditModal.module.css'

const emptyForm = {
  customerName: '',
  phone: '',
  service: '',
  duration: '',
  staffName: '',
  status: 'waiting',
}

export default function QueueEditModal({ entry, open, onClose, onSave, saving }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!entry) return
    setForm({
      customerName: entry.customerName || '',
      phone: entry.phone || '',
      service: entry.service || '',
      duration: entry.duration != null ? String(entry.duration) : '',
      staffName: entry.staffName || '',
      status: entry.status || 'waiting',
    })
  }, [entry])

  if (!open || !entry) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      service: form.service.trim(),
      duration: form.duration ? parseInt(form.duration, 10) : null,
      staffName: form.staffName.trim(),
      status: form.status,
    })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h3 className={styles.title}>Edit Queue Entry</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Customer name</span>
            <input
              value={form.customerName}
              onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
              required
            />
          </label>

          <label className={styles.field}>
            <span>Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="Optional"
            />
          </label>

          <label className={styles.field}>
            <span>Service</span>
            <input
              value={form.service}
              onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
              required
            />
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span>Duration (min)</span>
              <input
                type="number"
                min="1"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              />
            </label>

            <label className={styles.field}>
              <span>Stylist</span>
              <input
                value={form.staffName}
                onChange={e => setForm(f => ({ ...f, staffName: e.target.value }))}
                placeholder="Any Available"
              />
            </label>
          </div>

          <div className={styles.field}>
            <span>Status</span>
            <QueueStatusSelect
              fullWidth
              value={form.status}
              onChange={status => setForm(f => ({ ...f, status }))}
              disabled={saving}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
