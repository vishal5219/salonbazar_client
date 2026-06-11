import { Link } from 'react-router-dom'
import LogoMark from './LogoMark'
import styles from './Logo.module.css'

export default function Logo({ to = '/', variant = 'default', className = '', linked = true }) {
  const content = (
    <>
      <LogoMark />
      <span className={styles.wordmark} aria-hidden="true">
        <span className={styles.brandLine}>
          <span className={styles.salon}>Salon</span>
          <span className={styles.bazar}>Bazar</span>
        </span>
        <span className={styles.crest}>Luxe Beauty</span>
      </span>
    </>
  )

  const rootClass = [
    styles.logo,
    styles[`variant_${variant}`],
    className,
  ].filter(Boolean).join(' ')

  if (linked) {
    return (
      <Link to={to} className={rootClass} aria-label="SalonBazar home">
        {content}
      </Link>
    )
  }

  return <span className={rootClass} aria-label="SalonBazar">{content}</span>
}
