// Step 1: Service Selection
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiClock, FiCheck, FiChevronRight } from 'react-icons/fi'
import {
  setSelectedService, setSelectedStaff, goNextStep,
} from '@/store/slices/bookingSlice'
import styles from './Step1Service.module.css'

export default function Step1Service() {
  const dispatch = useDispatch()
  const { selectedService, selectedStaff } = useSelector(s => s.booking)
  const { selectedSalon } = useSelector(s => s.salons)

  const services = selectedSalon?.services || []
  const staffList = selectedSalon?.staff || []

  const [activeCat, setActiveCat] = useState(services[0]?.id || '')
  const [staffOpen, setStaffOpen] = useState(false)

  useEffect(() => {
    if (services[0]?.id) setActiveCat(services[0].id)
  }, [selectedSalon?.id, services])

  const currentCat = services.find(c => c.id === activeCat)

  const handleSelect = (service) => {
    dispatch(setSelectedService(
      selectedService?.id === service.id ? null : service
    ))
  }

  const handleStaff = (staff) => {
    dispatch(setSelectedStaff(
      selectedStaff?.id === staff.id ? null : staff
    ))
  }

  const handleContinue = () => {
    if (selectedService) dispatch(goNextStep())
  }

  if (!selectedSalon) {
    return <div className={styles.wrap}><p className={styles.sub}>Loading salon services...</p></div>
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.stepTag}>Step 1 of 3</span>
        <h2 className={styles.title}>Choose Your <em>Service</em></h2>
        <p className={styles.sub}>Select one service to continue. You can add more later.</p>
      </div>

      <div className={styles.catTabs}>
        {services.map(cat => (
          <button
            key={cat.id}
            className={`${styles.catTab} ${activeCat === cat.id ? styles.catActive : ''}`}
            onClick={() => setActiveCat(cat.id)}
          >
            <span className={styles.catIcon}>{cat.icon}</span>
            <span>{cat.category}</span>
          </button>
        ))}
      </div>

      <div className={styles.serviceList}>
        {currentCat?.items.map((service, i) => {
          const isSel = selectedService?.id === service.id
          return (
            <button
              key={service.id}
              className={`${styles.serviceCard} ${isSel ? styles.serviceSelected : ''}`}
              onClick={() => handleSelect(service)}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className={`${styles.selIndicator} ${isSel ? styles.selActive : ''}`}>
                {isSel && <FiCheck size={13} />}
              </div>

              <div className={styles.serviceInfo}>
                <div className={styles.serviceTopRow}>
                  <h4 className={styles.serviceName}>{service.name}</h4>
                  {service.popular && (
                    <span className={styles.popularBadge}>★ Popular</span>
                  )}
                </div>
                <p className={styles.serviceDesc}>{service.desc}</p>
                <div className={styles.serviceMeta}>
                  <span className={styles.duration}><FiClock size={11}/> {service.duration} min</span>
                </div>
              </div>

              <div className={styles.priceCol}>
                <div className={styles.price}>
                  <span className={styles.priceCurr}>₹</span>
                  <span className={styles.priceNum}>{service.price.toLocaleString()}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className={styles.staffSection}>
        <button
          className={styles.staffToggle}
          onClick={() => setStaffOpen(v => !v)}
        >
          <div className={styles.staffToggleLeft}>
            <span className={styles.staffIcon}>💁</span>
            <div>
              <div className={styles.staffToggleTitle}>Staff Preference</div>
              <div className={styles.staffToggleSub}>
                {selectedStaff ? selectedStaff.name : 'Any Available (Recommended)'}
              </div>
            </div>
          </div>
          <FiChevronRight
            size={16}
            className={`${styles.chevron} ${staffOpen ? styles.chevronOpen : ''}`}
          />
        </button>

        {staffOpen && (
          <div className={styles.staffGrid}>
            <button
              className={`${styles.staffCard} ${!selectedStaff ? styles.staffSelected : ''}`}
              onClick={() => dispatch(setSelectedStaff(null))}
            >
              <div className={styles.staffAvatarDefault}>Any</div>
              <div className={styles.staffName}>Any Available</div>
              <div className={styles.staffRole}>Best match</div>
            </button>

            {staffList
              .filter(s => s.available)
              .map(member => {
                const isSel = selectedStaff?.id === member.id
                return (
                  <button
                    key={member.id}
                    className={`${styles.staffCard} ${isSel ? styles.staffSelected : ''}`}
                    onClick={() => handleStaff(member)}
                  >
                    <div className={styles.staffAvatarWrap}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className={styles.staffAvatar}
                        onError={e => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className={styles.staffAvatarFallback}>{member.avatar}</div>
                      <div className={styles.availDot} />
                    </div>
                    <div className={styles.staffName}>{member.name.split(' ')[0]}</div>
                    <div className={styles.staffRole}>★ {member.rating}</div>
                  </button>
                )
              })
            }
          </div>
        )}
      </div>

      <div className={styles.ctaRow}>
        <div className={styles.ctaSummary}>
          {selectedService
            ? <><span className={styles.ctaService}>{selectedService.name}</span> · <span className={styles.ctaPrice}>₹{selectedService.price.toLocaleString()}</span></>
            : <span className={styles.ctaEmpty}>No service selected</span>
          }
        </div>
        <button
          className={`${styles.continueBtn} ${!selectedService ? styles.continueBtnDisabled : ''}`}
          onClick={handleContinue}
          disabled={!selectedService}
        >
          Continue to Date & Time →
        </button>
      </div>
    </div>
  )
}
