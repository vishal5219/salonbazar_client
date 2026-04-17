import { useSelector } from 'react-redux'
import styles from './DashAnalytics.module.css'

function BarChart({ data, valueKey, labelKey, color = 'var(--gold)', maxVal }) {
  const max = maxVal || Math.max(...data.map(d => d[valueKey]))
  return (
    <div className={styles.barChart}>
      {data.map((item, i) => {
        const pct = max > 0 ? (item[valueKey] / max) * 100 : 0
        return (
          <div key={i} className={styles.barItem}>
            <div className={styles.barWrap}>
              <div className={styles.barFill} style={{ height: `${pct}%`, background: color }} />
              <div className={styles.barTooltip}>
                {typeof item[valueKey] === 'number' && item[valueKey] > 1000
                  ? `₹${(item[valueKey]/1000).toFixed(1)}K`
                  : item[valueKey]}
              </div>
            </div>
            <div className={styles.barLabel}>{item[labelKey]}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function DashAnalytics() {
  const { analytics, earnings } = useSelector(s => s.dashboard)
  if (!analytics) return null

  const maxRevenue = Math.max(...analytics.weeklyRevenue.map(d => d.revenue))
  const maxPeak    = Math.max(...analytics.peakHours.map(d => d.count))

  const topServiceTotal = analytics.topServices.reduce((acc, s) => acc + s.revenue, 0)

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Analytics</h1>
        <p className={styles.pageSub}>Performance overview · Last 7 days</p>
      </div>

      {/* Summary row */}
      <div className={styles.summaryGrid}>
        {[
          { label: 'This Week',  val: `₹${(earnings?.thisWeek/1000).toFixed(1)}K`, sub: '+8% vs last week' },
          { label: 'This Month', val: `₹${(earnings?.thisMonth/1000).toFixed(0)}K`, sub: '+18% vs last month' },
          { label: 'Avg / Day',  val: `₹${(earnings?.thisWeek/7/1000).toFixed(1)}K`, sub: 'daily average' },
          { label: 'Best Day',   val: 'Saturday', sub: `₹${analytics.weeklyRevenue.find(d=>d.day==='Sat')?.revenue.toLocaleString()}` },
        ].map(s => (
          <div key={s.label} className={styles.summaryCard}>
            <div className={styles.summaryVal}>{s.val}</div>
            <div className={styles.summaryLabel}>{s.label}</div>
            <div className={styles.summarySub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className={styles.chartsRow}>
        {/* Weekly revenue */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Weekly Revenue</h3>
            <span className={styles.chartTotal}>₹{(earnings?.thisWeek/1000).toFixed(1)}K total</span>
          </div>
          <BarChart
            data={analytics.weeklyRevenue}
            valueKey="revenue"
            labelKey="day"
            color="var(--gold)"
            maxVal={maxRevenue}
          />
        </div>

        {/* Peak hours */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Peak Hours</h3>
            <span className={styles.chartTotal}>Busiest: 3PM</span>
          </div>
          <BarChart
            data={analytics.peakHours}
            valueKey="count"
            labelKey="hour"
            color="var(--charcoal)"
            maxVal={maxPeak}
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className={styles.bottomRow}>
        {/* Top services */}
        <div className={styles.tableCard}>
          <h3 className={styles.cardTitle}>Top Services</h3>
          <div className={styles.serviceTable}>
            {analytics.topServices.map((s, i) => {
              const pct = topServiceTotal > 0 ? (s.revenue / topServiceTotal) * 100 : 0
              return (
                <div key={s.name} className={styles.serviceRow}>
                  <div className={styles.serviceRank}>#{i + 1}</div>
                  <div className={styles.serviceInfo}>
                    <div className={styles.serviceName}>{s.name}</div>
                    <div className={styles.serviceBar}>
                      <div className={styles.serviceBarFill} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className={styles.serviceStats}>
                    <div className={styles.serviceBookings}>{s.bookings} bookings</div>
                    <div className={styles.serviceRevenue}>₹{(s.revenue/1000).toFixed(1)}K</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Staff performance */}
        <div className={styles.tableCard}>
          <h3 className={styles.cardTitle}>Staff Performance</h3>
          <div className={styles.staffTable}>
            {analytics.staffPerformance.map((s, i) => (
              <div key={s.name} className={styles.staffRow}>
                <div className={styles.staffRank}>#{i + 1}</div>
                <div className={styles.staffAvatar}>{s.name.split(' ').map(w => w[0]).join('')}</div>
                <div className={styles.staffInfo}>
                  <div className={styles.staffName}>{s.name}</div>
                  <div className={styles.staffStats}>
                    <span>{s.bookings} clients</span>
                    <span>★ {s.rating}</span>
                  </div>
                </div>
                <div className={styles.staffRevenue}>₹{(s.revenue/1000).toFixed(1)}K</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}