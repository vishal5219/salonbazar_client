import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { fetchWishlist } from '@/store/slices/wishlistSlice'
import WishlistTab from '@/components/Profile/WishlistTab'
import styles from './Wishlist.module.css'

function WishlistSkeleton() {
  return (
    <div className={styles.skeletonGrid}>
      {[1, 2, 3].map(i => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  )
}

export default function Wishlist() {
  const dispatch = useDispatch()
  const { loading, salons } = useSelector(s => s.wishlist)

  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container-custom ${styles.heroInner}`}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <span className={styles.sep}>›</span>
            <span>Wishlist</span>
          </nav>

          <span className="overline">Saved Salons</span>
          <h1 className={styles.heroTitle}>My <em>Wishlist</em></h1>
          <p className={styles.heroSubtitle}>
            Your favourite salons in one place — book quickly whenever you're ready.
          </p>

          <div className={styles.heroBadge}>
            <FiHeart size={14} />
            <span>{salons.length} saved salon{salons.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          {loading ? <WishlistSkeleton /> : <WishlistTab />}
        </div>
      </div>
    </div>
  )
}
