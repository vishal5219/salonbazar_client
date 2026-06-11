import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { advanceQueue } from '@/store/slices/dashboardSlice'
import { DASHBOARD_PATHS } from '@/constants/dashboardRoutes'
import { FiTrendingUp, FiUsers, FiCalendar, FiDollarSign, FiArrowRight, FiClock } from 'react-icons/fi'
import styles from './DashOverview.module.css'

function KpiCard({ icon: Icon, label, value, sub, trend, color }) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiTop}>
        <div className={styles.kpiIcon} style={{ background: color + '18', color }}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className={`${styles.kpiTrend} ${trend.startsWith('+') ? styles.trendUp : styles.trendDown}`}>
            <FiTrendingUp size={11} /> {trend}
          </span>
        )}
      </div>
      <div className={styles.kpiValue}>{value}</div>
      <div className={styles.kpiLabel}>{label}</div>
      {sub && <div className={styles.kpiSub}>{sub}</div>}
    </div>
  )
}

export default function DashOverview() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { queue, bookings, earnings, queueLoading } = useSelector(s => s.dashboard)

  const todayBookings = bookings.filter(b => b.date === 'Today')
  const inProgress    = queue.find(q => q.status === 'in_progress')
  const waitingCount  = queue.filter(q => q.status === 'waiting').length

  return (
    <div className={styles.wrap}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Good Morning <em>✦</em></h1>
          <p className={styles.pageSub}>
            {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </p>
        </div>
        <button
          className={styles.walkInBtn}
          onClick={() => navigate(DASHBOARD_PATHS.walkIn)}
        >
          + Add Walk-In
        </button>
      </div>

      {/* KPI cards */}
      <div className={styles.kpiGrid}>
        <KpiCard icon={FiDollarSign} label="Today's Revenue"    value={`₹${earnings?.today?.toLocaleString()}`} sub="vs ₹21.2K yesterday" trend="+12%"   color="#C9A84C" />
        <KpiCard icon={FiCalendar}   label="Today's Bookings"   value={todayBookings.length}                      sub={`${todayBookings.filter(b=>b.status==='confirmed').length} confirmed`} trend="+3"    color="#3B82F6" />
        <KpiCard icon={FiUsers}      label="In Queue Now"        value={queue.length}                              sub={`${waitingCount} waiting`}            trend={null}   color="#10B981" />
        <KpiCard icon={FiTrendingUp} label="This Month"          value={`₹${(earnings?.thisMonth/1000).toFixed(0)}K`} sub="vs last month"  trend="+18%"   color="#8B5CF6" />
      </div>

      {/* Live queue snapshot */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrap}>
            <h2 className={styles.sectionTitle}>Live Queue</h2>
            <span className={styles.livePill}><span className={styles.liveDot} />LIVE</span>
          </div>
          <button className={styles.viewAllBtn} onClick={() => navigate(DASHBOARD_PATHS.queue)}>
            Manage Queue <FiArrowRight size={13} />
          </button>
        </div>

        {queue.length === 0 ? (
          <div className={styles.emptyQueue}>Queue is empty · Open for walk-ins 🎉</div>
        ) : (
          <div className={styles.queueList}>
            {queue.slice(0, 4).map((entry, i) => (
              <div
                key={entry.id}
                className={`${styles.queueRow} ${entry.status === 'in_progress' ? styles.queueRowActive : ''}`}
              >
                <div className={`${styles.queuePos} ${entry.status === 'in_progress' ? styles.queuePosActive : ''}`}>
                  {entry.status === 'in_progress' ? '●' : entry.position}
                </div>
                <div className={styles.queueInfo}>
                  <div className={styles.queueName}>{entry.customerName}</div>
                  <div className={styles.queueMeta}>
                    {entry.service}
                    <span className={styles.queueDot}>·</span>
                    {entry.duration} min
                    <span className={styles.queueDot}>·</span>
                    <span className={styles.bookingTypeBadge} data-type={entry.bookingType}>
                      {entry.bookingType}
                    </span>
                  </div>
                </div>
                <div className={styles.queueRight}>
                  <div className={styles.queueTime}>
                    <FiClock size={11} /> {entry.estimatedTime}
                  </div>
                  <div className={`${styles.queueStatus} ${styles[`status_${entry.status}`]}`}>
                    {entry.status === 'in_progress' ? 'In Progress' : `#${entry.position} Waiting`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {inProgress && (
          <button
            className={styles.advanceBtn}
            onClick={() => dispatch(advanceQueue())}
            disabled={queueLoading}
          >
            {queueLoading ? (
              <><span className={styles.spinner} /> Updating...</>
            ) : (
              <>✓ Mark Done & Call Next Customer</>
            )}
          </button>
        )}
      </div>

      {/* Today's appointments */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Today's Appointments</h2>
          <button className={styles.viewAllBtn} onClick={() => navigate(DASHBOARD_PATHS.appointments)}>
            All Appointments <FiArrowRight size={13} />
          </button>
        </div>

        <div className={styles.bookingList}>
          {todayBookings.slice(0, 5).map(b => (
            <div key={b.id} className={styles.bookingRow}>
              <div className={styles.bookingTime}>{b.time}</div>
              <div className={styles.bookingInfo}>
                <div className={styles.bookingName}>{b.customerName}</div>
                <div className={styles.bookingService}>{b.service}</div>
              </div>
              <div className={styles.bookingRight}>
                <div className={styles.bookingAmount}>₹{b.amount.toLocaleString()}</div>
                <span className={`${styles.bookingStatus} ${styles[`bStatus_${b.status}`]}`}>
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}