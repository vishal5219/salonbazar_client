import { useState } from 'react'
import styles from './TestimonialsSection.module.css'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Regular Customer',
    avatar: 'PS',
    text: 'SalonBazar completely changed how I book my appointments. The live queue feature is absolutely brilliant — I can track my position from home and arrive right on time.',
    salon: 'Aura & Co.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rohan Mehta',
    role: 'Loyal Member',
    avatar: 'RM',
    text: 'As someone who gets a haircut every two weeks, this app saves me so much time. Booking takes 30 seconds and the QR walk-in at The Blade Studio is genius.',
    salon: 'The Blade Studio',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ananya Patel',
    role: 'Bridal Customer',
    avatar: 'AP',
    text: 'Booked my bridal package through SalonBazar for my wedding. The experience was flawless — from browsing portfolios to the payment. Highly recommend Lumière Beauty!',
    salon: 'Lumière Beauty',
    rating: 5,
  },
  {
    id: 4,
    name: 'Devraj Singh',
    role: 'Daily Commuter',
    avatar: 'DS',
    text: 'The QR code system is a game changer. Walk into the shop, scan, join the queue without even speaking to anyone. Perfect for my busy schedule.',
    salon: 'Velvet Grooming',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)

  return (
    <section className={styles.section}>
      <div className="container-custom">
        <div className={styles.layout}>
          {/* Left */}
          <div className={styles.left}>
            <span className="overline">What People Say</span>
            <h2 className={styles.title}>
              Trusted by<br /><em>50,000+</em><br />Happy Customers
            </h2>
            <p className={styles.sub}>Real experiences from real people across Ahmedabad.</p>

            {/* Navigation dots */}
            <div className={styles.dots}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Nav arrows */}
            <div className={styles.navBtns}>
              <button
                className={styles.navBtn}
                onClick={() => setActive(v => (v - 1 + testimonials.length) % testimonials.length)}
              >
                ←
              </button>
              <button
                className={styles.navBtn}
                onClick={() => setActive(v => (v + 1) % testimonials.length)}
              >
                →
              </button>
            </div>
          </div>

          {/* Right — testimonial cards */}
          <div className={styles.right}>
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className={`${styles.card} ${i === active ? styles.cardActive : ''} ${i === (active + 1) % testimonials.length ? styles.cardNext : ''}`}
              >
                <div className={styles.stars}>
                  {'★'.repeat(t.rating)}
                </div>
                <blockquote className={styles.quote}>"{t.text}"</blockquote>
                <div className={styles.author}>
                  <div className={styles.avatar}>{t.avatar}</div>
                  <div>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorMeta}>{t.role} · Booked at {t.salon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
