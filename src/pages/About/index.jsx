import { Link } from 'react-router-dom'
import { APP_NAME, APP_TAGLINE, CONTACT_EMAIL } from '@/constants/config'
import TestimonialsSection from '@/components/common/TestimonialsSection'
import HowItWorks from '@/components/common/HowItWorks'
import styles from './About.module.css'

const stats = [
  { value: '250+', label: 'Partner Salons' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '1.2M+', label: 'Bookings Made' },
  { value: '4.8★', label: 'Average Rating' },
]

const values = [
  {
    icon: '✦',
    title: 'Trust & Transparency',
    desc: 'Every salon on SalonBazar is verified. Real photos, honest reviews, and clear pricing — no surprises.',
  },
  {
    icon: '⚡',
    title: 'Speed & Convenience',
    desc: 'Book in seconds, skip the queue, and track your turn live. Your time matters as much as your look.',
  },
  {
    icon: '🤝',
    title: 'Community First',
    desc: 'We connect customers with local salons and help small businesses grow with smart, affordable tools.',
  },
  {
    icon: '✨',
    title: 'Premium Experience',
    desc: 'From discovery to checkout, every touchpoint is designed to feel polished, personal, and effortless.',
  },
]

const milestones = [
  { year: '2022', title: 'The Idea', desc: 'Founded in Ahmedabad with a mission to end salon waiting lines.' },
  { year: '2023', title: 'First 50 Salons', desc: 'Launched QR walk-in and live queue tracking across the city.' },
  { year: '2024', title: 'National Growth', desc: 'Expanded to 250+ salons and introduced the owner dashboard.' },
  { year: '2025', title: 'What\'s Next', desc: 'Building loyalty rewards, smarter analytics, and new cities.' },
]

export default function About() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrain} />
        <div className={`container-custom ${styles.heroInner}`}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <span className={styles.sep}>›</span>
            <span>About Us</span>
          </nav>

          <span className="overline">Our Story</span>
          <h1 className={styles.heroTitle}>
            Redefining How India<br />
            <em>Books Beauty</em>
          </h1>
          <p className={styles.heroSubtitle}>
            {APP_NAME} is India's most trusted salon booking marketplace — helping you discover
            premium salons, book instantly, and skip the wait.
          </p>
          <p className={styles.heroTagline}>{APP_TAGLINE}</p>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.mission}>
        <div className="container-custom">
          <div className={styles.missionGrid}>
            <div className={styles.missionContent}>
              <span className="overline">Who We Are</span>
              <h2 className={styles.sectionTitle}>
                Built for <em>Customers</em> &amp; <em>Salon Owners</em>
              </h2>
              <p className={styles.bodyText}>
                We started SalonBazar because booking a salon appointment shouldn't mean
                calling five places, waiting in line, or guessing if a slot is available.
                Today, we power seamless bookings, live queue management, and walk-in QR
                check-ins for salons across Ahmedabad — and we're just getting started.
              </p>
              <p className={styles.bodyText}>
                For salon owners, we provide a smart dashboard to manage bookings, track
                revenue, and delight customers — all from one screen.
              </p>
              <div className={styles.missionActions}>
                <Link to="/salons" className={styles.btnPrimary}>Explore Salons</Link>
                <Link to="/register-salon" className={styles.btnSecondary}>List Your Salon</Link>
              </div>
            </div>

            <div className={styles.missionVisual}>
              <div className={styles.visualCard}>
                <div className={styles.visualImg} />
                <div className={styles.visualBadge}>
                  <span className={styles.badgeNum}>Since</span>
                  <span className={styles.badgeLabel}>2022</span>
                </div>
              </div>
              <div className={styles.visualQuote}>
                <p>"Every person deserves to feel extraordinary — and every salon deserves the tools to deliver it."</p>
                <span>— SalonBazar Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className="container-custom">
          <div className={styles.statsGrid}>
            {stats.map(s => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.values}>
        <div className="container-custom">
          <div className={styles.valuesHeader}>
            <span className="overline">What We Stand For</span>
            <h2 className={styles.sectionTitle}>
              Our <em>Core Values</em>
            </h2>
            <p className={styles.sectionSubtitle}>
              The principles that guide every feature we build and every partnership we form.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {values.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.timeline}>
        <div className="container-custom">
          <div className={styles.timelineHeader}>
            <span className="overline">Our Journey</span>
            <h2 className={styles.sectionTitleDark}>
              Milestones <em>So Far</em>
            </h2>
          </div>

          <div className={styles.timelineGrid}>
            {milestones.map((m, i) => (
              <div key={m.year} className={styles.timelineCard}>
                <span className={styles.timelineYear}>{m.year}</span>
                <div className={styles.timelineDot} />
                <h3 className={styles.timelineTitle}>{m.title}</h3>
                <p className={styles.timelineDesc}>{m.desc}</p>
                {i < milestones.length - 1 && <div className={styles.timelineLine} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className={styles.contact}>
        <div className="container-custom">
          <div className={styles.contactCard}>
            <div>
              <span className="overline">Get in Touch</span>
              <h2 className={styles.contactTitle}>We'd Love to Hear From You</h2>
              <p className={styles.contactDesc}>
                Questions, partnerships, or feedback — our team is always happy to help.
              </p>
            </div>
            <div className={styles.contactActions}>
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.btnPrimary}>
                {CONTACT_EMAIL}
              </a>
              <Link to="/salons" className={styles.btnGhost}>Browse Salons →</Link>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <HowItWorks />
    </div>
  )
}
