import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiSave, FiSettings, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import salonService from '@/services/salonService'
import { fetchSalonById } from '@/store/slices/salonSlice'
import { showNotification } from '@/store/slices/uiSlice'
import styles from './DashSettings.module.css'

const CATEGORIES = [
  'Premium Unisex Salon',
  "Men's Grooming Lounge",
  'Ladies Boutique Salon',
  'Spa & Salon',
  "Luxury Men's Barbershop",
]

const emptyForm = {
  name: '',
  category: CATEGORIES[0],
  location: '',
  city: 'Ahmedabad',
  phone: '',
  email: '',
  about: '',
  waitTime: '',
  isOpen: true,
}

export default function DashSettings() {
  const dispatch = useDispatch()
  const salonId = useSelector(s => s.auth.user?.salonId)
  const { selectedSalon } = useSelector(s => s.salons)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('active')

  useEffect(() => {
    if (!salonId) return
    const load = async () => {
      setLoading(true)
      try {
        const salon = await salonService.getById(salonId)
        setForm({
          name: salon.name || '',
          category: salon.category || CATEGORIES[0],
          location: salon.location || '',
          city: salon.city || 'Ahmedabad',
          phone: salon.phone || '',
          email: salon.email || '',
          about: salon.about || '',
          waitTime: salon.waitTime || '',
          isOpen: salon.isOpen !== false,
        })
        setStatus(salon.status || 'active')
      } catch (err) {
        dispatch(showNotification({
          message: err?.message || 'Could not load salon settings',
          type: 'error',
        }))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [salonId, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!salonId) return
    setSaving(true)
    try {
      await salonService.update(salonId, {
        name: form.name,
        category: form.category,
        location: form.location,
        city: form.city,
        phone: form.phone || null,
        email: form.email || null,
        about: form.about || null,
        wait_time: form.waitTime || null,
        is_open: form.isOpen,
      })
      dispatch(fetchSalonById(salonId))
      dispatch(showNotification({ message: 'Salon settings saved', type: 'success' }))
    } catch (err) {
      dispatch(showNotification({
        message: err?.message || 'Could not save settings',
        type: 'error',
      }))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className={styles.loading}>Loading salon settings…</p>
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className="overline">Settings</span>
        <h2 className={styles.title}>Salon <em>Settings</em></h2>
        <p className={styles.sub}>
          Update your salon profile, contact details, and availability shown to customers.
        </p>
      </div>

      <div className={styles.statusRow}>
        <span className={styles.statusLabel}>Listing status</span>
        <span className={`${styles.statusBadge} ${styles[`status_${status}`]}`}>
          {status}
        </span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h3 className={styles.sectionTitle}><FiSettings size={16} /> Business profile</h3>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>Salon name</span>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </label>
          <label className={styles.field}>
            <span>Category</span>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className={`${styles.field} ${styles.fieldFull}`}>
            <span><FiMapPin size={12} /> Address / location</span>
            <input
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              required
            />
          </label>
          <label className={styles.field}>
            <span>City</span>
            <input
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              required
            />
          </label>
          <label className={styles.field}>
            <span>Estimated wait time</span>
            <input
              placeholder="e.g. 15–20 min"
              value={form.waitTime}
              onChange={e => setForm(f => ({ ...f, waitTime: e.target.value }))}
            />
          </label>
        </div>

        <h3 className={styles.sectionTitle}><FiPhone size={16} /> Contact</h3>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span><FiPhone size={12} /> Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span><FiMail size={12} /> Email</span>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </label>
        </div>

        <h3 className={styles.sectionTitle}>About your salon</h3>
        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span>Description</span>
          <textarea
            rows={5}
            value={form.about}
            onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
            placeholder="Tell customers what makes your salon special…"
          />
        </label>

        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={form.isOpen}
            onChange={e => setForm(f => ({ ...f, isOpen: e.target.checked }))}
          />
          <span>Open for bookings & walk-ins today</span>
        </label>

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          <FiSave size={15} />
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>

      {selectedSalon?.id === salonId && (
        <p className={styles.hint}>
          Changes apply to your public listing once saved. Gallery and services are managed separately.
        </p>
      )}
    </div>
  )
}
