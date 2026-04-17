import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiLock,
  FiBell, FiShield, FiTrash2, FiCheck, FiAlertTriangle,
} from 'react-icons/fi'
import { updateProfile } from '@/store/slices/profileSlice'
import { showNotification } from '@/store/slices/uiSlice'
import styles from './SettingsTab.module.css'

function Section({ icon: Icon, title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}><Icon size={16} /></div>
        <h3 className={styles.sectionTitle}>{title}</h3>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <div>
        <div className={styles.toggleLabel}>{label}</div>
        {sub && <div className={styles.toggleSub}>{sub}</div>}
      </div>
      <label className={styles.toggleSwitch}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className={styles.toggleTrack}>
          <span className={styles.toggleThumb} />
        </span>
      </label>
    </div>
  )
}

export default function SettingsTab() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { saving } = useSelector(s => s.profile)

  const [profile, setProfile] = useState({
    name:     user?.name  || '',
    email:    user?.email || '',
    phone:    user?.phone || '',
    city:     'Ahmedabad',
    gender:   'prefer_not',
    dob:      '',
  })

  const [notifs, setNotifs] = useState({
    bookingConfirm:  true,
    reminderAlerts:  true,
    queueUpdates:    true,
    offersAndDeals:  false,
    smsAlerts:       true,
    whatsappUpdates: true,
    emailNewsletter: false,
  })

  const [pwForm,   setPwForm]   = useState({ current: '', newPass: '', confirm: '' })
  const [pwError,  setPwError]  = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const setField = (k, v) => setProfile(p => ({ ...p, [k]: v }))

  const handleSaveProfile = async () => {
    await dispatch(updateProfile(profile))
    dispatch(showNotification({ message: 'Profile updated successfully!', type: 'success' }))
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (pwForm.newPass !== pwForm.confirm) {
      setPwError('Passwords do not match')
      return
    }
    if (pwForm.newPass.length < 8) {
      setPwError('Password must be at least 8 characters')
      return
    }
    setPwError('')
    dispatch(showNotification({ message: 'Password changed successfully!', type: 'success' }))
    setPwForm({ current: '', newPass: '', confirm: '' })
  }

  const toggleNotif = (key) => setNotifs(n => ({ ...n, [key]: !n[key] }))

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Account Settings</h2>
        <p className={styles.sub}>Manage your profile, preferences, and security</p>
      </div>

      {/* Personal info */}
      <Section icon={FiUser} title="Personal Information">
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Full Name</label>
            <div className={styles.inputWrap}>
              <FiUser size={15} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                value={profile.name}
                onChange={e => setField('name', e.target.value)}
                placeholder="Your full name"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Email Address</label>
            <div className={styles.inputWrap}>
              <FiMail size={15} className={styles.inputIcon} />
              <input
                type="email"
                className={styles.input}
                value={profile.email}
                onChange={e => setField('email', e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Phone Number</label>
            <div className={styles.inputWrap}>
              <FiPhone size={15} className={styles.inputIcon} />
              <input
                type="tel"
                className={styles.input}
                value={profile.phone}
                onChange={e => setField('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>City</label>
            <div className={styles.inputWrap}>
              <FiMapPin size={15} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                value={profile.city}
                onChange={e => setField('city', e.target.value)}
                placeholder="Your city"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Gender</label>
            <select
              className={styles.select}
              value={profile.gender}
              onChange={e => setField('gender', e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Date of Birth</label>
            <input
              type="date"
              className={styles.input}
              value={profile.dob}
              onChange={e => setField('dob', e.target.value)}
            />
          </div>
        </div>

        <button
          className={styles.saveBtn}
          onClick={handleSaveProfile}
          disabled={saving}
        >
          {saving ? (
            <><span className={styles.spinner} /> Saving...</>
          ) : (
            <><FiCheck size={14} /> Save Changes</>
          )}
        </button>
      </Section>

      {/* Notifications */}
      <Section icon={FiBell} title="Notification Preferences">
        <div className={styles.toggleGroup}>
          <div className={styles.toggleGroupTitle}>Booking Alerts</div>
          <ToggleRow label="Booking Confirmations"    sub="Get notified when a booking is confirmed"     checked={notifs.bookingConfirm}  onChange={() => toggleNotif('bookingConfirm')} />
          <ToggleRow label="Appointment Reminders"    sub="1-hour reminder before your appointment"      checked={notifs.reminderAlerts}  onChange={() => toggleNotif('reminderAlerts')} />
          <ToggleRow label="Queue Position Updates"   sub="Real-time queue status while waiting"         checked={notifs.queueUpdates}    onChange={() => toggleNotif('queueUpdates')} />
        </div>

        <div className={styles.toggleGroup}>
          <div className={styles.toggleGroupTitle}>Promotions</div>
          <ToggleRow label="Offers & Deals"           sub="Exclusive discounts from nearby salons"       checked={notifs.offersAndDeals}  onChange={() => toggleNotif('offersAndDeals')} />
          <ToggleRow label="Email Newsletter"         sub="Weekly curated salon picks and tips"          checked={notifs.emailNewsletter} onChange={() => toggleNotif('emailNewsletter')} />
        </div>

        <div className={styles.toggleGroup}>
          <div className={styles.toggleGroupTitle}>Channels</div>
          <ToggleRow label="SMS Notifications"        sub="Text alerts to your registered phone"         checked={notifs.smsAlerts}       onChange={() => toggleNotif('smsAlerts')} />
          <ToggleRow label="WhatsApp Updates"         sub="Booking details sent via WhatsApp"            checked={notifs.whatsappUpdates} onChange={() => toggleNotif('whatsappUpdates')} />
        </div>
      </Section>

      {/* Security */}
      <Section icon={FiLock} title="Security">
        <form className={styles.pwForm} onSubmit={handleChangePassword}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Current Password</label>
            <div className={styles.inputWrap}>
              <FiLock size={15} className={styles.inputIcon} />
              <input
                type="password"
                className={styles.input}
                value={pwForm.current}
                onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>New Password</label>
              <div className={styles.inputWrap}>
                <FiShield size={15} className={styles.inputIcon} />
                <input
                  type="password"
                  className={styles.input}
                  value={pwForm.newPass}
                  onChange={e => setPwForm(f => ({ ...f, newPass: e.target.value }))}
                  placeholder="Min 8 characters"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Confirm New Password</label>
              <div className={styles.inputWrap}>
                <FiShield size={15} className={styles.inputIcon} />
                <input
                  type="password"
                  className={styles.input}
                  value={pwForm.confirm}
                  onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="Repeat new password"
                />
              </div>
            </div>
          </div>

          {pwError && (
            <div className={styles.pwError}>
              <FiAlertTriangle size={13} /> {pwError}
            </div>
          )}

          <button type="submit" className={styles.saveBtn}>
            <FiLock size={14} /> Update Password
          </button>
        </form>

        {/* 2FA placeholder */}
        <div className={styles.twoFaRow}>
          <div>
            <div className={styles.twoFaLabel}>Two-Factor Authentication</div>
            <div className={styles.twoFaSub}>Add an extra layer of security to your account</div>
          </div>
          <button className={styles.twoFaBtn}>Enable 2FA →</button>
        </div>
      </Section>

      {/* Danger zone */}
      <Section icon={FiTrash2} title="Danger Zone">
        <div className={styles.dangerCard}>
          <div className={styles.dangerInfo}>
            <div className={styles.dangerTitle}>Delete Account</div>
            <div className={styles.dangerDesc}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </div>
          </div>

          <div className={styles.deleteFlow}>
            <input
              type="text"
              className={styles.deleteInput}
              placeholder='Type "DELETE" to confirm'
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
            />
            <button
              className={styles.deleteBtn}
              disabled={deleteConfirm !== 'DELETE'}
              onClick={() => dispatch(showNotification({ message: 'Account deletion requested. Our team will contact you.', type: 'success' }))}
            >
              <FiTrash2 size={14} /> Delete My Account
            </button>
          </div>
        </div>
      </Section>
    </div>
  )
}