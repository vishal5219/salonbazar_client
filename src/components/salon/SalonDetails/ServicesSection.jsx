import { useState } from 'react'
import { FiClock, FiPlus, FiCheck } from 'react-icons/fi'
import styles from './ServicesSection.module.css'

export default function ServicesSection({ categories, selectedService, onSelect }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id)

  const currentCat = categories.find(c => c.id === activeCategory) || categories[0]

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className="overline">What We Offer</span>
        <h2 className={styles.title}>Our <em>Services</em></h2>
      </div>

      {/* Category tabs */}
      <div className={styles.catTabs}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.catTab} ${activeCategory === cat.id ? styles.catActive : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className={styles.catIcon}>{cat.icon}</span>
            {cat.category}
          </button>
        ))}
      </div>

      {/* Services list */}
      <div className={styles.servicesList}>
        {currentCat?.items.map((service, i) => {
          const isSelected = selectedService?.id === service.id
          return (
            <div
              key={service.id}
              className={`${styles.serviceCard} ${isSelected ? styles.selected : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={styles.serviceInfo}>
                <div className={styles.serviceTopRow}>
                  <h4 className={styles.serviceName}>{service.name}</h4>
                  {service.popular && (
                    <span className={styles.popularBadge}>★ Popular</span>
                  )}
                </div>
                <p className={styles.serviceDesc}>{service.desc}</p>
                <div className={styles.serviceMeta}>
                  <span className={styles.duration}>
                    <FiClock size={12} /> {service.duration} min
                  </span>
                </div>
              </div>

              <div className={styles.serviceRight}>
                <div className={styles.servicePrice}>
                  <span className={styles.priceCurr}>₹</span>
                  <span className={styles.priceNum}>{service.price.toLocaleString()}</span>
                </div>
                <button
                  className={`${styles.selectBtn} ${isSelected ? styles.selectActive : ''}`}
                  onClick={() => onSelect(isSelected ? null : service)}
                >
                  {isSelected
                    ? <><FiCheck size={14} /> Selected</>
                    : <><FiPlus size={14} /> Add</>
                  }
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
