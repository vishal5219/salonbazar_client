import styles from './StaffSection.module.css'
import { FiStar } from 'react-icons/fi'

export default function StaffSection({ staff = [] }) {
  const team = staff || []

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className="overline">Meet the Team</span>
        <h2 className={styles.title}>Our <em>Experts</em></h2>
      </div>

      <div className={styles.grid}>
        {team.length === 0 && (
          <p className={styles.empty}>Team profiles will appear here soon.</p>
        )}
        {team.map((member, i) => (
          <div
            key={member.id}
            className={`${styles.card} ${!member.available ? styles.unavailable : ''}`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {/* Avatar */}
            <div className={styles.avatarWrap}>
              <img
                src={member.image}
                alt={member.name}
                className={styles.avatar}
                loading="lazy"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
              <div className={styles.avatarFallback}>{member.avatar}</div>

              {/* Availability dot */}
              <div className={`${styles.availDot} ${member.available ? styles.availOpen : styles.availBusy}`} />
            </div>

            {/* Info */}
            <div className={styles.info}>
              <h4 className={styles.name}>{member.name}</h4>
              <p className={styles.role}>{member.role}</p>
              <div className={styles.meta}>
                <span className={styles.exp}>{member.experience}</span>
                <span className={styles.metaDot}>·</span>
                <span className={styles.rating}>
                  <FiStar size={11} style={{ color: 'var(--gold)' }} />
                  {member.rating}
                </span>
                <span className={styles.metaDot}>·</span>
                <span className={styles.reviews}>{member.reviews} reviews</span>
              </div>

              {/* Specialties */}
              <div className={styles.specialties}>
                {(member.specialties || []).map(s => (
                  <span key={s} className={styles.specialty}>{s}</span>
                ))}
              </div>

              {/* Availability label */}
              <div className={`${styles.availLabel} ${member.available ? styles.availLabelOpen : styles.availLabelBusy}`}>
                {member.available ? '● Available now' : '● Busy / On leave'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
