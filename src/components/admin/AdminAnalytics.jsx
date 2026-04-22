import { useSelector } from 'react-redux'
import styles from './AdminAnalytics.module.css'

function RevenueBar({ data }) {
  const maxRev = Math.max(...data.map(d => d.revenue))
  return (
    <div className={styles.revChart}>
      {data.map((d, i) => (
        <div key={d.month} className={styles.revBar} style={{ animationDelay: `${i * 0.07}s` }}>
          <div className={styles.revBarWrap}>
            <div className={styles.revBarTooltip}>
              <div>Revenue: ₹{(d.revenue/1000000).toFixed(2)}M</div>
              <div>Commission: ₹{(d.commission/1000).toFixed(0)}K</div>
            </div>
            <div
              className={styles.revBarFillComm}
              style={{ height: `${(d.commission / maxRev) * 100}%` }}
            />
            <div
              className={styles.revBarFillRev}
              style={{ height: `${(d.revenue / maxRev) * 100}%` }}
            />
          </div>
          <div className={styles.revLabel}>{d.month}</div>
        </div>
      ))}
    </div>
  )
}

export default function AdminAnalytics() {
  const { revenueTrend, cityBreakdown, planBreakdown, salons, platformStats } = useSelector(s => s.admin)

  if (!platformStats) return null

  const topSalons = [...salons]
    .filter(s => s.status === 'active')
    .sort((a, b) => b.monthRevenue - a.monthRevenue)
    .slice(0, 5)

  const totalRevenue = revenueTrend.reduce((acc, d) => acc + d.revenue, 0)
  const totalCommission = revenueTrend.reduce((acc, d) => acc + d.commission, 0)
  const maxCityRev = Math.max(...cityBreakdown.map(c => c.revenue))

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Platform Analytics</h1>
        <p className={styles.pageSub}>Last 6 months · All figures in INR</p>
      </div>

      {/* Summary strip */}
      <div className={styles.summaryStrip}>
        {[
          { label: '6-Month Revenue',    val: `₹${(totalRevenue/1000000).toFixed(2)}M`,    sub: 'across all salons' },
          { label: 'Platform Commission', val: `₹${(totalCommission/1000).toFixed(0)}K`,  sub: '5% per booking' },
          { label: 'Avg Monthly Growth',  val: '+15.3%', sub: 'month-over-month' },
          { label: 'Best Month',          val: 'January', sub: `₹${(4820000/1000000).toFixed(2)}M GMV` },
        ].map(s => (
          <div key={s.label} className={styles.sumCard}>
            <div className={styles.sumVal}>{s.val}</div>
            <div className={styles.sumLabel}>{s.label}</div>
            <div className={styles.sumSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue trend chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Revenue & Commission Trend</h3>
          <div className={styles.chartLegend}>
            <span className={styles.legendItem}><span className={styles.legendDotRev} />GMV</span>
            <span className={styles.legendItem}><span className={styles.legendDotComm} />Commission</span>
          </div>
        </div>
        <RevenueBar data={revenueTrend} />
      </div>

      {/* Bottom 3-col grid */}
      <div className={styles.bottomGrid}>
        {/* Top performing salons */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Top Performing Salons</h3>
          <div className={styles.topList}>
            {topSalons.map((salon, i) => (
              <div key={salon.id} className={styles.topRow}>
                <div className={styles.topRank}>#{i + 1}</div>
                <img src={salon.image} alt={salon.name} className={styles.topImg} />
                <div className={styles.topInfo}>
                  <div className={styles.topName}>{salon.name}</div>
                  <div className={styles.topMeta}>{salon.city} · {salon.category}</div>
                </div>
                <div className={styles.topRevenue}>
                  <div className={styles.topRevVal}>₹{(salon.monthRevenue/1000).toFixed(0)}K</div>
                  <div className={styles.topRevLbl}>this month</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* City revenue */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Revenue by City</h3>
          <div className={styles.cityList}>
            {cityBreakdown.map((c, i) => (
              <div key={c.city} className={styles.cityRow}>
                <div className={styles.cityInfo}>
                  <span className={styles.cityRank}>#{i+1}</span>
                  <span className={styles.cityName}>{c.city}</span>
                </div>
                <div className={styles.cityBarWrap}>
                  <div
                    className={styles.cityBarFill}
                    style={{ width: `${(c.revenue / maxCityRev) * 100}%` }}
                  />
                </div>
                <span className={styles.cityRev}>₹{(c.revenue/1000000).toFixed(2)}M</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan revenue split */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Revenue by Plan</h3>
          <div className={styles.planDonut}>
            {/* Simple visual representation */}
            <div className={styles.donutVisual}>
              {planBreakdown.map((p, i) => (
                <div
                  key={p.plan}
                  className={styles.donutSegment}
                  style={{
                    height: `${p.pct}%`,
                    background: p.plan === 'Premium' ? '#C9A84C' : p.plan === 'Pro' ? '#3B82F6' : '#4B5563',
                  }}
                >
                  <span className={styles.donutPct}>{p.pct}%</span>
                </div>
              ))}
            </div>
            <div className={styles.planLegend}>
              {planBreakdown.map(p => (
                <div key={p.plan} className={styles.planLegRow}>
                  <div className={styles.planLegDot} style={{
                    background: p.plan === 'Premium' ? '#C9A84C' : p.plan === 'Pro' ? '#3B82F6' : '#4B5563',
                  }} />
                  <span className={styles.planLegName}>{p.plan}</span>
                  <span className={styles.planLegSalons}>{p.salons} salons</span>
                  <span className={styles.planLegRev}>₹{(p.monthlyRevenue/1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}