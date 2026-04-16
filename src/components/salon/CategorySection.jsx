import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setFilters } from '@/store/slices/salonSlice'
import styles from './CategorySection.module.css'

const categories = [
  { id: 'hair', label: "Hair Styling", icon: "💇", count: "82 salons", color: "#F3EFE7" },
  { id: 'bridal', label: "Bridal Makeup", icon: "👰", count: "34 salons", color: "#FAF0F5" },
  { id: 'spa', label: "Spa & Massage", icon: "🧖", count: "47 salons", color: "#F0F5EF" },
  { id: 'beard', label: "Beard Grooming", icon: "🪒", count: "56 salons", color: "#EFF3FA" },
  { id: 'nails', label: "Nail Art", icon: "💅", count: "29 salons", color: "#FFF0F0" },
  { id: 'skincare', label: "Skin & Facial", icon: "✨", count: "63 salons", color: "#FFFBF0" },
  { id: 'waxing', label: "Waxing", icon: "🌸", count: "71 salons", color: "#F5F0FF" },
  { id: 'kids', label: "Kids Salon", icon: "🎈", count: "18 salons", color: "#F0FAFF" },
]

export default function CategorySection() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleCategory = (id) => {
    dispatch(setFilters({ category: id }))
    navigate(`/salons?category=${id}`)
  }

  return (
    <section className={styles.section}>
      <div className="container-custom">
        <div className={styles.header}>
          <div>
            <span className="overline">Browse by Service</span>
            <h2 className={styles.title}>What Are You<br /><em>Looking For Today?</em></h2>
          </div>
          <a href="/salons" className={styles.viewAll}>View All Services →</a>
        </div>

        <div className={styles.grid}>
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              className={styles.card}
              style={{ '--card-bg': cat.color, animationDelay: `${i * 0.06}s` }}
              onClick={() => handleCategory(cat.id)}
            >
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{cat.icon}</span>
              </div>
              <span className={styles.label}>{cat.label}</span>
              <span className={styles.count}>{cat.count}</span>
              <div className={styles.arrow}>→</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
