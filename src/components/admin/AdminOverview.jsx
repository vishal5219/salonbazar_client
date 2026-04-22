import { useSelector, useDispatch } from 'react-redux'
import { setActiveView } from '@/store/slices/adminSlice'
import {
  FiTrendingUp, FiHome, FiUsers, FiDollarSign,
  FiStar, FiActivity, FiArrowRight, FiClock,
} from 'react-icons/fi'
import styles from './AdminOverview.module.css'

function KpiCard({ icon: Icon, label, value, trend, trendPct, color, onClick }) {
  return (
    <div className={`${styles.kpiCard} ${onClick ? styles.kpiClickable : ''}`} onClick={onClick}>
      <div className={styles.kpiTop}>
        <div className={styles.kpiIcon} style={{ background: color + '22', color }}>
          <Icon size={18} />
        </div>
        {trendPct && (
          <span className={`${styles.kpiTrend} ${trendPct.startsWith('+') ? styles.up : styles.down}`}>
            <FiTrendingUp size={10} /> {trendPct}
          </span>
        )}
      </div>
      <div className={styles.kpiValue}>{value}</div>
      <div className={styles.kpiLabel}>{label}</div>
      {trend && <div className={styles.kpiSub}>{trend} this month</div>}
    </div>
  )
}

export default function AdminOverview() {
  const dispatch = useDispatch()
  const { platformStats, recentActivity, planBreakdown, cityBreakdown, salons } = useSelector(s => s.admin)

  if (!platformStats) return null

  const fmt = (n) => n >= 1000000
    ? `₹${(n/1000000).toFixed(2)}M`
    : n >= 1000
    ? `₹${(n/1000).toFixed(0)}K`
    : `₹${n}`

  const pendingSalons = salons.filter(s => s.status === 'pending')

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Platform Overview</h1>
          <p className={styles.pageSub}>
            {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </p>
        </div>
      </div>

      {/* Pending approvals banner */}
      {pendingSalons.length > 0 && (
        <div className={styles.pendingBanner}>
          <div className={styles.pendingLeft}>
            <span className={styles.pendingDot} />
            <strong>{pendingSalons.length} salon{pendingSalons.length > 1 ? 's' : ''} awaiting approval</strong>
            <span className={styles.pendingNames}>
              {pendingSalons.map(s => s.name).join(', ')}
            </span>
          </div>
          <button className={styles.pendingCta} onClick={() => dispatch(setActiveView('salons'))}>
            Review Now <FiArrowRight size={13} />
          </button>
        </div>
      )}

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        <KpiCard icon={FiHome}      label="Total Salons"      value={platformStats.totalSalons.value}      trend={platformStats.totalSalons.trend}       trendPct={platformStats.totalSalons.trendPct}       color="#C9A84C" onClick={() => dispatch(setActiveView('salons'))} />
        <KpiCard icon={FiUsers}     label="Registered Users"  value={platformStats.totalUsers.value.toLocaleString()} trend={platformStats.totalUsers.trend} trendPct={platformStats.totalUsers.trendPct}   color="#3B82F6" onClick={() => dispatch(setActiveView('users'))} />
        <KpiCard icon={FiActivity}  label="Total Bookings"    value={platformStats.totalBookings.value.toLocaleString()} trend={`+${platformStats.totalBookings.trend}`} trendPct={platformStats.totalBookings.trendPct} color="#10B981" />
        <KpiCard icon={FiDollarSign} label="Month Revenue"    value={fmt(platformStats.monthRevenue.value)} trend={fmt(platformStats.monthRevenue.trend)}  trendPct={platformStats.monthRevenue.trendPct}    color="#8B5CF6" />
        <KpiCard icon={FiDollarSign} label="Commission Earned"value={fmt(platformStats.platformCommission.value)} trend={fmt(platformStats.platformCommission.trend)} trendPct={platformStats.platformCommission.trendPct} color="#F59E0B" />
        <KpiCard icon={FiStar}      label="Avg Platform Rating" value={platformStats.avgRating.value}       trend={platformStats.avgRating.trend}         trendPct={platformStats.avgRating.trendPct}         color="#EF4444" />
        <KpiCard icon={FiHome}      label="Active Salons"     value={platformStats.activeSalons.value}     trend={platformStats.activeSalons.trend}       trendPct={platformStats.activeSalons.trendPct}      color="#06B6D4" />
        <KpiCard icon={FiClock}     label="Pending Approvals" value={platformStats.pendingApprovals.value} trend={null} trendPct={null}                    color="#F97316" onClick={() => dispatch(setActiveView('salons'))} />
      </div>

      {/* Bottom row: activity feed + plan breakdown + city breakdown */}
      <div className={styles.bottomRow}>
        {/* Activity feed */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Recent Activity</h3>
            <span className={styles.liveBadge}><span className={styles.liveDot} />Live</span>
          </div>
          <div className={styles.activityList}>
            {recentActivity.map(item => (
              <div key={item.id} className={styles.activityItem}>
                <div className={styles.activityIconWrap}>{item.icon}</div>
                <div className={styles.activityInfo}>
                  <p className={styles.activityMsg}>{item.message}</p>
                  <span className={styles.activityTime}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Plan breakdown */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Plan Breakdown</h3>
            </div>
            <div className={styles.planList}>
              {planBreakdown.map(p => (
                <div key={p.plan} className={styles.planRow}>
                  <div className={styles.planInfo}>
                    <span className={`${styles.planBadge} ${styles[`plan_${p.plan.toLowerCase()}`]}`}>
                      {p.plan}
                    </span>
                    <span className={styles.planSalons}>{p.salons} salons</span>
                  </div>
                  <div className={styles.planBar}>
                    <div className={styles.planBarFill} style={{ width: `${p.pct}%` }} />
                  </div>
                  <span className={styles.planRevenue}>₹{(p.monthlyRevenue/1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>

          {/* City breakdown */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>By City</h3>
            </div>
            <div className={styles.cityList}>
              {cityBreakdown.map((c, i) => (
                <div key={c.city} className={styles.cityRow}>
                  <span className={styles.cityRank}>#{i + 1}</span>
                  <span className={styles.cityName}>{c.city}</span>
                  <span className={styles.citySalons}>{c.salons} salons</span>
                  <span className={styles.cityRevenue}>₹{(c.revenue/1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}