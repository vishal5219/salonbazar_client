import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SEO from '@/components/seo/SEO'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import { PAGE_SEO, buildCanonical } from '@/constants/seo'
import { ROLES } from '@/constants/roles'
import salonService from '@/services/salonService'
import { showNotification } from '@/store/slices/uiSlice'
import { setSession } from '@/store/slices/authSlice'
import authService from '@/services/authService'
import styles from './RegisterSalon.module.css'

const CATEGORIES = [
  'Premium Unisex Salon',
  "Men's Grooming Lounge",
  'Ladies Boutique Salon',
  'Spa & Salon',
  "Luxury Men's Barbershop",
]

export default function RegisterSalon() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, role } = useSelector(s => s.auth)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    location: '',
    city: 'Ahmedabad',
    phone: user?.phone || '',
    email: user?.email || '',
  })

  const seo = PAGE_SEO.registerSalon

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await salonService.register(form)
      if (data.token) authService.saveTokens(data.token)
      dispatch(setSession({
        user: data.user,
        role: data.role,
        token: data.token,
      }))
      dispatch(showNotification({
        message: 'Salon submitted! We will review and activate it shortly.',
        type: 'success',
      }))
      navigate('/dashboard')
    } catch (err) {
      dispatch(showNotification({
        message: err?.message || 'Could not register salon',
        type: 'error',
      }))
    } finally {
      setLoading(false)
    }
  }

  if (role === ROLES.CUSTOMER) {
    return (
      <div className={styles.page}>
        <div className={`container-custom ${styles.notice}`}>
          <h1 className={styles.noticeTitle}>Salon owner account required</h1>
          <p className={styles.noticeDesc}>
            Sign up as a <strong>Salon Owner</strong> to list your business, or contact support if you need to upgrade your account.
          </p>
          <Link to="/?auth=register" className={styles.primaryBtn}>Create owner account</Link>
        </div>
      </div>
    )
  }

  if (user?.salonId) {
    return (
      <div className={styles.page}>
        <div className={`container-custom ${styles.notice}`}>
          <h1 className={styles.noticeTitle}>Salon already registered</h1>
          <p className={styles.noticeDesc}>Your salon is linked to this account.</p>
          <Link to="/dashboard" className={styles.primaryBtn}>Open dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={buildCanonical(seo.path)}
        noindex
      />
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container-custom ${styles.heroInner}`}>
          <Breadcrumbs
            className={styles.breadcrumb}
            items={[
              { label: 'Home', to: '/' },
              { label: 'List Your Salon' },
            ]}
          />
          <span className="overline">For Salon Owners</span>
          <h1 className={styles.heroTitle}>Register your <em>Salon</em></h1>
          <p className={styles.heroSubtitle}>
            Submit your salon details. Once approved, you can manage bookings, queue, and staff from your dashboard.
          </p>
        </div>
      </section>

      <section className={`container-custom ${styles.formSection}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Salon Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Aura & Co."
              required
            />
          </div>

          <div className={styles.field}>
            <label>Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>City</label>
              <input
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Full Address</label>
            <textarea
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="Shop no., building, area, city — pin code"
              rows={3}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Business Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Submitting…' : 'Submit for Review'}
          </button>
        </form>
      </section>
    </div>
  )
}
