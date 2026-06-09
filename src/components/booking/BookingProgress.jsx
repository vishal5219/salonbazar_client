import styles from './BookingProgress.module.css'

export default function BookingProgress({ steps, currentStep }) {
  return (
    <div className={styles.wrap}>
      {steps.map((step, i) => {
        const isDone   = step.num < currentStep
        const isActive = step.num === currentStep
        const isFuture = step.num > currentStep

        return (
          <div key={step.num} className={styles.stepItem}>
            {/* Connector line before */}
            {i > 0 && (
              <div className={`${styles.connector} ${isDone ? styles.connDone : ''}`} />
            )}

            {/* Circle */}
            <div className={`
              ${styles.circle}
              ${isDone   ? styles.circleDone   : ''}
              ${isActive ? styles.circleActive : ''}
              ${isFuture ? styles.circleFuture : ''}
            `}>
              {isDone ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span className={styles.circleNum}>{step.num}</span>
              )}
            </div>

            {/* Label */}
            <span className={`
              ${styles.label}
              ${isDone   ? styles.labelDone   : ''}
              ${isActive ? styles.labelActive : ''}
              ${isFuture ? styles.labelFuture : ''}
            `}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}