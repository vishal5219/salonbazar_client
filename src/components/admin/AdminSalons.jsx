import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FiSearch, FiCheck, FiX, FiEye, FiEdit2, FiFilter } from 'react-icons/fi'
import {
  updateSalonStatus, updateSalonPlan,
  setSalonSearch, setSalonFilter,
  setSelectedSalon, clearSelectedSalon,
} from '@/store/slices/adminSlice'
import { showNotification } from '@/store/slices/uiSlice'
import styles from './AdminSalons.module.css'

const STATUS_TABS   = ['all', 'active', 'pending', 'suspended']
const PLANS         = ['basic', 'pro', 'premium']
const STATUS_COLORS = {
  active:    { bg: 'rgba(16,185,129,.12)',  color: '#6EE7B7' },
  pending:   { bg: 'rgba(234,179,8,.12)',   color: '#FCD34D' },
  suspended: { bg: 'rgba(239,68,68,.12)',   color: '#FCA5A5' },
}
const PLAN_COLORS = {
  basic:   { bg: 'rgba(156,163,175,.12)', color: '#9CA3AF' },
  pro:     { bg: 'rgba(59,130,246,.15)',  color: '#60A5FA' },
  premium: { bg: 'rgba(201,168,76,.2)',   color: '#C9A84C' },
}

// ── Detail drawer ─────────────────────────────────────────────
function SalonDrawer({ salon, onClose }) {
  const dispatch = useDispatch()
  const [planVal, setPlanVal] = useState(salon.plan)

  const handleStatus = (status) => {
    dispatch(updateSalonStatus({ salonId: salon.id, status }))
    dispatch(showNotification({ message: `${salon.name} marked as ${status}`, type: 'success' }))
  }

  const handlePlan = () => {
    dispatch(updateSalonPlan({ salonId: salon.id, plan: planVal }))
    dispatch(showNotification({ message: `Plan updated to ${planVal}`, type: 'success' }))
  }

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerSalonInfo}>
            <img src={salon.image} alt={salon.name} className={styles.drawerImg} />
            <div>
              <h3 className={styles.drawerName}>{salon.name}</h3>
              <p className={styles.drawerSub}>{salon.category} · {salon.city}</p>
            </div>
          </div>
          <button className={styles.drawerClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.drawerBody}>
          {/* Status */}
          <div className={styles.drawerSection}>
            <div className={styles.drawerSectionTitle}>Current Status</div>
            <span
              className={styles.statusChip}
              style={STATUS_COLORS[salon.status]}
            >
              {salon.status}
            </span>
          </div>

          {/* Owner info */}
          <div className={styles.drawerSection}>
            <div className={styles.drawerSectionTitle}>Owner Details</div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}><span>Owner</span><strong>{salon.owner}</strong></div>
              <div className={styles.infoItem}><span>Email</span><strong>{salon.email}</strong></div>
              <div className={styles.infoItem}><span>Phone</span><strong>{salon.phone}</strong></div>
              <div className={styles.infoItem}><span>Joined</span><strong>{salon.joinedDate}</strong></div>
            </div>
          </div>

          {/* Performance */}
          <div className={styles.drawerSection}>
            <div className={styles.drawerSectionTitle}>Performance</div>
            <div className={styles.perfGrid}>
              <div className={styles.perfStat}>
                <span className={styles.perfNum}>{salon.totalBookings}</span>
                <span className={styles.perfLbl}>Total Bookings</span>
              </div>
              <div className={styles.perfStat}>
                <span className={styles.perfNum}>₹{(salon.monthRevenue/1000).toFixed(1)}K</span>
                <span className={styles.perfLbl}>Month Revenue</span>
              </div>
              <div className={styles.perfStat}>
                <span className={styles.perfNum}>{salon.rating || '—'}</span>
                <span className={styles.perfLbl}>Avg Rating</span>
              </div>
            </div>
          </div>

          {/* Plan management */}
          <div className={styles.drawerSection}>
            <div className={styles.drawerSectionTitle}>Subscription Plan</div>
            <div className={styles.planSelector}>
              {PLANS.map(p => (
                <button
                  key={p}
                  className={`${styles.planBtn} ${planVal === p ? styles.planBtnActive : ''}`}
                  style={planVal === p ? PLAN_COLORS[p] : {}}
                  onClick={() => setPlanVal(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <button className={styles.savePlanBtn} onClick={handlePlan}>
              Update Plan
            </button>
          </div>

          {/* Status actions */}
          <div className={styles.drawerSection}>
            <div className={styles.drawerSectionTitle}>Actions</div>
            <div className={styles.actionBtns}>
              {salon.status === 'pending' && (
                <button
                  className={styles.approveBtn}
                  onClick={() => { handleStatus('active'); onClose() }}
                >
                  <FiCheck size={14} /> Approve Salon
                </button>
              )}
              {salon.status === 'active' && (
                <button
                  className={styles.suspendBtn}
                  onClick={() => { handleStatus('suspended'); onClose() }}
                >
                  <FiX size={14} /> Suspend Salon
                </button>
              )}
              {salon.status === 'suspended' && (
                <button
                  className={styles.approveBtn}
                  onClick={() => { handleStatus('active'); onClose() }}
                >
                  <FiCheck size={14} /> Reinstate Salon
                </button>
              )}
              <a
                href={`/salons/${salon.id}`}
                target="_blank"
                rel="noreferrer"
                className={styles.viewPubBtn}
              >
                <FiEye size={14} /> View Public Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function AdminSalons() {
  const dispatch = useDispatch()
  const { salons, salonSearch, salonFilter, selectedSalon } = useSelector(s => s.admin)

  const filtered = salons.filter(s => {
    const matchStatus = salonFilter === 'all' || s.status === salonFilter
    const q = salonSearch.toLowerCase()
    const matchSearch = !q || s.name.toLowerCase().includes(q) ||
      s.owner.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const handleStatus = (salonId, status, salonName) => {
    dispatch(updateSalonStatus({ salonId, status }))
    dispatch(showNotification({ message: `${salonName} marked as ${status}`, type: 'success' }))
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Salon Management</h1>
          <p className={styles.pageSub}>{salons.length} salons registered · {salons.filter(s=>s.status==='pending').length} pending</p>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <FiSearch size={15} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, owner or city..."
            value={salonSearch}
            onChange={e => dispatch(setSalonSearch(e.target.value))}
          />
        </div>

        <div className={styles.statusTabs}>
          <FiFilter size={13} className={styles.filterIcon} />
          {STATUS_TABS.map(s => (
            <button
              key={s}
              className={`${styles.statusTab} ${salonFilter === s ? styles.statusTabActive : ''}`}
              onClick={() => dispatch(setSalonFilter(s))}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== 'all' && (
                <span className={styles.tabCount}>
                  {salons.filter(sl => sl.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={styles.table}>
        <div className={styles.tableHead}>
          <span>Salon</span>
          <span>Owner</span>
          <span>City</span>
          <span>Bookings</span>
          <span>Revenue</span>
          <span>Plan</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filtered.map((salon, i) => (
          <div key={salon.id} className={styles.tableRow} style={{ animationDelay: `${i * 0.03}s` }}>
            {/* Salon */}
            <div className={styles.salonCell}>
              <img src={salon.image} alt={salon.name} className={styles.salonThumb} />
              <div>
                <div className={styles.salonName}>{salon.name}</div>
                <div className={styles.salonCat}>{salon.category}</div>
              </div>
            </div>

            <div className={styles.cell}>{salon.owner}</div>
            <div className={styles.cell}>{salon.city}</div>
            <div className={styles.cell}>{salon.totalBookings.toLocaleString()}</div>
            <div className={styles.cell}>₹{(salon.monthRevenue/1000).toFixed(0)}K</div>

            {/* Plan */}
            <div className={styles.cell}>
              <span className={styles.planChip} style={PLAN_COLORS[salon.plan]}>
                {salon.plan}
              </span>
            </div>

            {/* Status */}
            <div className={styles.cell}>
              <span className={styles.statusChip} style={STATUS_COLORS[salon.status]}>
                {salon.status}
              </span>
            </div>

            {/* Actions */}
            <div className={`${styles.cell} ${styles.actionsCell}`}>
              <button
                className={styles.iconBtn}
                title="View Details"
                onClick={() => dispatch(setSelectedSalon(salon))}
              >
                <FiEye size={14} />
              </button>
              {salon.status === 'pending' && (
                <button
                  className={`${styles.iconBtn} ${styles.approveIconBtn}`}
                  title="Approve"
                  onClick={() => handleStatus(salon.id, 'active', salon.name)}
                >
                  <FiCheck size={14} />
                </button>
              )}
              {salon.status === 'active' && (
                <button
                  className={`${styles.iconBtn} ${styles.suspendIconBtn}`}
                  title="Suspend"
                  onClick={() => handleStatus(salon.id, 'suspended', salon.name)}
                >
                  <FiX size={14} />
                </button>
              )}
              {salon.status === 'suspended' && (
                <button
                  className={`${styles.iconBtn} ${styles.approveIconBtn}`}
                  title="Reinstate"
                  onClick={() => handleStatus(salon.id, 'active', salon.name)}
                >
                  <FiCheck size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={styles.emptyRow}>No salons match your search or filter.</div>
        )}
      </div>

      {/* Detail drawer */}
      {selectedSalon && (
        <SalonDrawer
          salon={selectedSalon}
          onClose={() => dispatch(clearSelectedSalon())}
        />
      )}
    </div>
  )
}