import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBar}>
        <div className={styles.brand}>
          <span className={styles.logo}>✦ Salon<em>Bazar</em></span>
          <p>India's most trusted salon booking marketplace. Discover, book, and experience premium grooming.</p>
        </div>
        <div className={styles.linksGrid}>
          <div>
            <h6>Discover</h6>
            <Link to="/salons">All Salons</Link>
            <Link to="/salons?category=unisex">Unisex Salons</Link>
            <Link to="/salons?category=mens">Men's Grooming</Link>
            <Link to="/salons?category=ladies">Ladies Salon</Link>
          </div>
          <div>
            <h6>Company</h6>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h6>For Business</h6>
            <Link to="/register-salon">List Your Salon</Link>
            <Link to="/partners">Partnership</Link>
            <Link to="/pricing">Pricing Plans</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <span>© 2025 SalonBazar. All rights reserved.</span>
        <div className={styles.legal}>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
