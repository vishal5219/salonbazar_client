import { Link } from 'react-router-dom'
import { buildCanonical } from '@/constants/seo'
import styles from './Breadcrumbs.module.css'

function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.to ? { item: buildCanonical(item.to) } : {}),
    })),
  }
}

export default function Breadcrumbs({ items = [], className = '' }) {
  if (!items.length) return null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(items)) }}
      />
      <nav aria-label="Breadcrumb" className={`${styles.breadcrumb} ${className}`}>
        <ol className={styles.list}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={`${item.label}-${index}`} className={styles.item}>
                {index > 0 && <span className={styles.sep} aria-hidden="true">›</span>}
                {item.to && !isLast ? (
                  <Link to={item.to} className={styles.link}>{item.label}</Link>
                ) : (
                  <span className={isLast ? styles.current : styles.text} aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
