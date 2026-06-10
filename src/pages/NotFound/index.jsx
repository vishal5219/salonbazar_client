import { Link } from 'react-router-dom'
import SEO from '@/components/seo/SEO'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import { PAGE_SEO, buildCanonical } from '@/constants/seo'
import { APP_TAGLINE } from '@/constants/config'
import styles from './NotFound.module.css'

const quickLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/salons', label: 'Explore Salons', icon: '✦' },
  { to: '/about', label: 'About Us', icon: 'ℹ️' },
]

export default function NotFound() {
  const seo = PAGE_SEO.notFound

  return (
    <div className={styles.page}>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={buildCanonical(seo.path)}
        noindex={seo.noindex}
      />
      <div className={styles.bgDecor} />
      <div className={styles.grain} />

      <div className={`container-custom ${styles.inner}`}>
        <Breadcrumbs
          className={styles.breadcrumb}
          items={[
            { label: 'Home', to: '/' },
            { label: 'Page Not Found' },
          ]}
        />

        <div className={styles.content}>
          <span className="overline">Error 404</span>

          <div className={styles.codeWrap}>
            <span className={styles.code}>4</span>
            <span className={styles.codeIcon}>✂</span>
            <span className={styles.code}>4</span>
          </div>

          <h1 className={styles.title}>
            This Page Has <em>Left the Chair</em>
          </h1>

          <p className={styles.subtitle}>
            The page you're looking for doesn't exist, was moved, or the link may be broken.
            Let's get you back to looking your best.
          </p>

          <p className={styles.tagline}>{APP_TAGLINE}</p>

          <div className={styles.actions}>
            <Link to="/" className={styles.btnPrimary}>Back to Home</Link>
            <Link to="/salons" className={styles.btnSecondary}>Browse Salons</Link>
          </div>
        </div>

        <div className={styles.quickLinks}>
          <span className={styles.quickLabel}>Quick Links</span>
          <div className={styles.linkGrid}>
            {quickLinks.map(link => (
              <Link key={link.to} to={link.to} className={styles.quickCard}>
                <span className={styles.quickIcon}>{link.icon}</span>
                <span className={styles.quickText}>{link.label}</span>
                <span className={styles.quickArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
