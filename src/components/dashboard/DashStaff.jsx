import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FiUserPlus, FiTrash2, FiMail, FiPhone, FiEdit2, FiX, FiCheck } from 'react-icons/fi'
import userService from '@/services/userService'
import { showNotification } from '@/store/slices/uiSlice'
import styles from './DashStaff.module.css'

const emptyForm = { name: '', email: '', phone: '', password: '' }

export default function DashStaff() {
  const dispatch = useDispatch()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [addForm, setAddForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)

  const loadStaff = async () => {
    setLoading(true)
    try {
      const rows = await userService.getStaff()
      setStaff(rows || [])
    } catch (err) {
      dispatch(showNotification({ message: err?.message || 'Failed to load staff', type: 'error' }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStaff() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userService.createStaff(addForm)
      setAddForm(emptyForm)
      dispatch(showNotification({ message: 'Staff account created', type: 'success' }))
      loadStaff()
    } catch (err) {
      dispatch(showNotification({ message: err?.message || 'Could not add staff', type: 'error' }))
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (member) => {
    setEditingId(member.id)
    setEditForm({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      password: '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(emptyForm)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingId) return
    setSaving(true)
    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
      }
      if (editForm.password) payload.password = editForm.password

      await userService.updateStaff(editingId, payload)
      dispatch(showNotification({ message: 'Staff updated', type: 'success' }))
      cancelEdit()
      loadStaff()
    } catch (err) {
      dispatch(showNotification({ message: err?.message || 'Could not update staff', type: 'error' }))
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (member) => {
    if (!window.confirm(`Remove ${member.name} from your salon team?`)) return
    try {
      await userService.removeStaff(member.id)
      if (editingId === member.id) cancelEdit()
      dispatch(showNotification({ message: 'Staff removed', type: 'success' }))
      loadStaff()
    } catch (err) {
      dispatch(showNotification({ message: err?.message || 'Could not remove staff', type: 'error' }))
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className="overline">Team</span>
        <h2 className={styles.title}>Salon <em>Staff</em></h2>
        <p className={styles.sub}>
          Create and manage login accounts for your team. Staff can manage queue and appointments from the dashboard.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleAdd}>
        <h3 className={styles.formTitle}><FiUserPlus size={16} /> Add staff member</h3>
        <div className={styles.formGrid}>
          <input
            placeholder="Full name"
            value={addForm.name}
            onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={addForm.email}
            onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={addForm.phone}
            onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))}
          />
          <input
            type="password"
            placeholder="Temporary password"
            value={addForm.password}
            onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
            required
            minLength={8}
          />
        </div>
        <button type="submit" className={styles.addBtn} disabled={saving}>
          {saving && !editingId ? 'Creating…' : 'Create staff account'}
        </button>
      </form>

      <div className={styles.list}>
        {loading ? (
          <p className={styles.empty}>Loading staff…</p>
        ) : staff.length === 0 ? (
          <p className={styles.empty}>No staff accounts yet. Add your first team member above.</p>
        ) : (
          staff.map(member => (
            <div key={member.id} className={styles.card}>
              {editingId === member.id ? (
                <form className={styles.editForm} onSubmit={handleUpdate}>
                  <div className={styles.formGrid}>
                    <input
                      placeholder="Full name"
                      value={editForm.name}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={editForm.email}
                      onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={editForm.phone}
                      onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                    />
                    <input
                      type="password"
                      placeholder="New password (optional)"
                      value={editForm.password}
                      onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                      minLength={8}
                    />
                  </div>
                  <div className={styles.editActions}>
                    <button type="button" className={styles.cancelBtn} onClick={cancelEdit}>
                      <FiX size={14} /> Cancel
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={saving}>
                      <FiCheck size={14} /> {saving ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className={styles.avatar}>{member.name?.[0]?.toUpperCase()}</div>
                  <div className={styles.info}>
                    <div className={styles.name}>{member.name}</div>
                    <div className={styles.meta}>
                      <span><FiMail size={12} /> {member.email}</span>
                      {member.phone && <span><FiPhone size={12} /> {member.phone}</span>}
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => startEdit(member)}
                      aria-label={`Edit ${member.name}`}
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => handleRemove(member)}
                      aria-label={`Remove ${member.name}`}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
