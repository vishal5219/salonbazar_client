import { useSelector, useDispatch } from 'react-redux'
import { FiSearch, FiX, FiCheck, FiFilter } from 'react-icons/fi'
import { updateUserStatus, setUserSearch, setUserFilter } from '@/store/slices/adminSlice'
import { showNotification } from '@/store/slices/uiSlice'
import styles from './AdminUsers.module.css'

const ROLE_COLORS   = {
  customer:     { bg: 'rgba(59,130,246,.12)',  color: '#60A5FA' },
  shop_owner:   { bg: 'rgba(201,168,76,.15)',  color: '#C9A84C' },
  shop_staff:   { bg: 'rgba(16,185,129,.12)',  color: '#34D399' },
  super_admin:  { bg: 'rgba(139,92,246,.12)',  color: '#A78BFA' },
  admin:        { bg: 'rgba(139,92,246,.12)',  color: '#A78BFA' },
}

const STATUS_COLORS = {
  active:    { bg: 'rgba(16,185,129,.12)',  color: '#6EE7B7' },
  suspended: { bg: 'rgba(239,68,68,.12)',   color: '#FCA5A5' },
}

const ROLE_FILTERS = ['all', 'customer', 'shop_owner', 'shop_staff']

export default function AdminUsers() {
  const dispatch = useDispatch()
  const { users, userSearch, userFilter } = useSelector(s => s.admin)

  const filtered = users.filter(u => {
    const matchRole = userFilter === 'all' || u.role === userFilter
    const q = userSearch.toLowerCase()
    const matchSearch = !q || u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)
    return matchRole && matchSearch
  })

  const handleStatus = (userId, status, name) => {
    dispatch(updateUserStatus({ userId, status }))
    dispatch(showNotification({ message: `${name} has been ${status}`, type: 'success' }))
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>User Management</h1>
          <p className={styles.pageSub}>
            {users.length} total users · {users.filter(u => u.status === 'suspended').length} suspended
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <FiSearch size={15} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, email or city..."
            value={userSearch}
            onChange={e => dispatch(setUserSearch(e.target.value))}
          />
        </div>

        <div className={styles.roleTabs}>
          <FiFilter size={13} className={styles.filterIcon} />
          {ROLE_FILTERS.map(r => (
            <button
              key={r}
              className={`${styles.roleTab} ${userFilter === r ? styles.roleTabActive : ''}`}
              onClick={() => dispatch(setUserFilter(r))}
            >
              {r === 'shop_owner' ? 'Shop Owners' : r === 'shop_staff' ? 'Staff' : r.charAt(0).toUpperCase() + r.slice(1)}
              <span className={styles.tabCount}>
                {r === 'all' ? users.length : users.filter(u => u.role === r).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={styles.table}>
        <div className={styles.tableHead}>
          <span>User</span>
          <span>City</span>
          <span>Role</span>
          <span>Bookings</span>
          <span>Total Spent</span>
          <span>Joined</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {filtered.map((user, i) => (
          <div key={user.id} className={styles.tableRow} style={{ animationDelay: `${i * 0.04}s` }}>
            {/* User cell */}
            <div className={styles.userCell}>
              <div className={styles.avatar}>
                {user.name.split(' ').map(w => w[0]).join('').slice(0,2)}
              </div>
              <div>
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>
            </div>

            <div className={styles.cell}>{user.city}</div>

            <div className={styles.cell}>
              <span className={styles.chip} style={ROLE_COLORS[user.role]}>
                {user.role === 'shop_owner' ? 'Owner' : user.role}
              </span>
            </div>

            <div className={styles.cell}>{user.totalBookings}</div>
            <div className={styles.cell}>
              {user.totalSpent > 0 ? `₹${(user.totalSpent/1000).toFixed(1)}K` : '—'}
            </div>

            <div className={styles.cell}>{user.joinedDate}</div>

            <div className={styles.cell}>
              <span className={styles.chip} style={STATUS_COLORS[user.status]}>
                {user.status}
              </span>
            </div>

            <div className={`${styles.cell} ${styles.actionCell}`}>
              {user.status === 'active' ? (
                <button
                  className={`${styles.actionBtn} ${styles.suspendBtn}`}
                  onClick={() => handleStatus(user.id, 'suspended', user.name)}
                  title="Suspend"
                >
                  <FiX size={13} /> Suspend
                </button>
              ) : (
                <button
                  className={`${styles.actionBtn} ${styles.reinstateBtn}`}
                  onClick={() => handleStatus(user.id, 'active', user.name)}
                  title="Reinstate"
                >
                  <FiCheck size={13} /> Reinstate
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={styles.emptyRow}>No users match your criteria.</div>
        )}
      </div>
    </div>
  )
}