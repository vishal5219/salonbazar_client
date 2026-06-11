import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { openAuthModal } from '@/store/slices/uiSlice'
import { logout } from '@/store/slices/authSlice'
import { ROLES } from '@/constants/roles'
import { isSuperAdmin, isSalonTeam } from '@/utils/roleAccess'
import Logo from '@/components/brand/Logo'
import styles from './Navbar.module.css'

export default function Navbar() {
  const dispatch = useDispatch()
  const { isAuthenticated, user, role } = useSelector(s => s.auth)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const showOwnerRegister = isAuthenticated && role === ROLES.SHOP_OWNER && !user?.salonId
  const solidNav = scrolled || location.pathname !== '/'

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.linkActive}` : styles.link

  const mobileLinkClass = ({ isActive }) =>
    isActive ? `${styles.mobileLink} ${styles.mobileLinkActive}` : styles.mobileLink

  return (
    <nav className={`${styles.nav} ${solidNav ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Logo to="/" variant={solidNav ? 'default' : 'inverse'} />

        <ul className={styles.links}>
          <li>
            <NavLink to="/salons" className={linkClass}>Explore</NavLink>
          </li>
          <li>
            <NavLink to="/offers" className={linkClass}>Offers</NavLink>
          </li>
          <li>
            <NavLink to="/about" className={linkClass}>About</NavLink>
          </li>
          {!isAuthenticated && (
            <li>
              <Link to="/?auth=register" className={styles.linkPartner}>
                List Your Salon
              </Link>
            </li>
          )}
        </ul>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.avatarBtn}>
                <span className={styles.avatar}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </button>
              <div className={styles.dropdown}>
                {isSuperAdmin(role) && (
                  <Link to="/admin" className={styles.dropItem}>Platform Admin</Link>
                )}
                {isSalonTeam(role) && user?.salonId && (
                  <Link to="/dashboard" className={styles.dropItem}>Salon Dashboard</Link>
                )}
                {showOwnerRegister && (
                  <Link to="/register-salon" className={styles.dropItem}>Register Salon</Link>
                )}
                {role === ROLES.CUSTOMER && (
                  <>
                    <Link to="/bookings" className={styles.dropItem}>My Bookings</Link>
                    <Link to="/wishlist" className={styles.dropItem}>Wishlist</Link>
                  </>
                )}
                <Link to="/profile" className={styles.dropItem}>My Profile</Link>
                <div className={styles.dropDivider} />
                <button className={styles.dropItem} onClick={() => dispatch(logout())}>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                className={styles.btnLogin}
                onClick={() => dispatch(openAuthModal('login'))}
              >
                Sign In
              </button>
              <button
                className={styles.btnRegister}
                onClick={() => dispatch(openAuthModal('register'))}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : styles.mobileClose}`}>
        <NavLink to="/salons" className={mobileLinkClass}>Explore Salons</NavLink>
        <NavLink to="/offers" className={mobileLinkClass}>Offers</NavLink>
        <NavLink to="/about" className={mobileLinkClass}>About</NavLink>
        {!isAuthenticated && (
          <Link to="/?auth=register" className={styles.mobileLink}>List Your Salon</Link>
        )}
        <div className={styles.mobileDivider} />
        {isAuthenticated ? (
          <>
            {isSuperAdmin(role) && (
              <Link to="/admin" className={styles.mobileLink}>Platform Admin</Link>
            )}
            {isSalonTeam(role) && user?.salonId && (
              <Link to="/dashboard" className={styles.mobileLink}>Salon Dashboard</Link>
            )}
            {showOwnerRegister && (
              <Link to="/register-salon" className={styles.mobileLink}>Register Salon</Link>
            )}
            {role === ROLES.CUSTOMER && (
              <>
                <Link to="/bookings" className={styles.mobileLink}>My Bookings</Link>
                <Link to="/wishlist" className={styles.mobileLink}>Wishlist</Link>
              </>
            )}
            <Link to="/profile" className={styles.mobileLink}>My Profile</Link>
            <button className={styles.mobileLink} onClick={() => dispatch(logout())}>Sign Out</button>
          </>
        ) : (
          <div className={styles.mobileAuth}>
            <button className={styles.btnLogin} onClick={() => { dispatch(openAuthModal('login')); setMenuOpen(false) }}>
              Sign In
            </button>
            <button className={styles.btnRegister} onClick={() => { dispatch(openAuthModal('register')); setMenuOpen(false) }}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
