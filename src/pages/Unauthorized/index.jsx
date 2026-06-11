import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SEO from '@/components/seo/SEO'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import { buildCanonical } from '@/constants/seo'
import { getDefaultPathForRole } from '@/utils/roleAccess'
import { roleLabel } from '@/constants/roles'
import styles from './Unauthorized.module.css'

export default function Unauthorized() {
  const { role } = useSelector(s => s.auth)
  const homePath = getDefaultPathForRole(role)

  return (
    <div className={styles.page}>
      <SEO
        title="Access Denied | SalonBazar"
        description="You do not have permission to view this page."
        canonical={buildCanonical('/unauthorized')}
        noindex
      />
      <div className={`container-custom ${styles.inner}`}>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Access Denied' },
          ]}
        />
        <span className="overline">403</span>
        <h1 className={styles.title}>Access <em>Denied</em></h1>
        <p className={styles.desc}>
          Your account ({roleLabel(role)}) does not have permission to open this page.
        </p>
        <div className={styles.actions}>
          <Link to={homePath} className={styles.primaryBtn}>Go to your dashboard</Link>
          <Link to="/" className={styles.secondaryBtn}>Back to home</Link>
        </div>
      </div>
    </div>
  )
}
