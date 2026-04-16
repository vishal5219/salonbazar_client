import styles from './HowItWorks.module.css'

const steps = [
  {
    num: '01',
    icon: '🔍',
    title: 'Discover Salons',
    desc: 'Browse hundreds of verified salons by location, service, rating, or price range. Real photos, real reviews.',
  },
  {
    num: '02',
    icon: '📅',
    title: 'Book Instantly',
    desc: 'Pick your service and time slot. Book from home or scan the QR in the salon for a walk-in spot.',
  },
  {
    num: '03',
    icon: '⏱',
    title: 'Skip the Queue',
    desc: 'Track your live queue position. Get notified when your turn is near — no waiting in line.',
  },
  {
    num: '04',
    icon: '✨',
    title: 'Look Amazing',
    desc: 'Enjoy your service, then rate and review. Earn loyalty points for your next visit.',
  },
]

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className="container-custom">
        <div className={styles.header}>
          <span className="overline">Simple Process</span>
          <h2 className={styles.title}>
            How <em>SalonBazar</em> Works
          </h2>
          <p className={styles.subtitle}>
            From discovery to looking your best — we make every step effortless.
          </p>
        </div>

        <div className={styles.stepsWrap}>
          {/* Connector line */}
          <div className={styles.connectorLine} />

          <div className={styles.steps}>
            {steps.map((step, i) => (
              <div key={step.num} className={styles.step} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.stepTop}>
                  <div className={styles.numBadge}>{step.num}</div>
                  <div className={styles.iconCircle}>
                    <span className={styles.stepIcon}>{step.icon}</span>
                  </div>
                </div>
                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className={styles.ctaStrip}>
          <p>Ready to experience the difference?</p>
          <a href="/salons" className={styles.stripBtn}>
            Find Your Salon Now →
          </a>
        </div>
      </div>
    </section>
  )
}
