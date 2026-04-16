import { useState } from 'react'
import { FiThumbsUp, FiCheck } from 'react-icons/fi'
import styles from './ReviewsSection.module.css'

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{star}★</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.barCount}>{count}</span>
    </div>
  )
}

export default function ReviewsSection({ reviews, rating, totalReviews, breakdown }) {
  const [sortBy,  setSortBy]  = useState('recent')
  const [showAll, setShowAll] = useState(false)

  const totalCount = Object.values(breakdown).reduce((a, b) => a + b, 0)

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating
    if (sortBy === 'lowest')  return a.rating - b.rating
    return 0  // 'recent' — already in order
  })

  const visible = showAll ? sorted : sorted.slice(0, 4)

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className="overline">What Customers Say</span>
        <h2 className={styles.title}>Reviews <em>& Ratings</em></h2>
      </div>

      {/* Summary block */}
      <div className={styles.summary}>
        {/* Big rating */}
        <div className={styles.bigRating}>
          <span className={styles.ratingNum}>{rating}</span>
          <div className={styles.stars}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ color: rating >= s ? 'var(--gold)' : 'var(--cream-2)', fontSize: 22 }}>★</span>
            ))}
          </div>
          <span className={styles.ratingTotal}>Based on {totalCount} reviews</span>
        </div>

        {/* Bars */}
        <div className={styles.bars}>
          {[5,4,3,2,1].map(s => (
            <RatingBar key={s} star={s} count={breakdown[s] || 0} total={totalCount} />
          ))}
        </div>

        {/* Summary stats */}
        <div className={styles.summaryStats}>
          <div className={styles.sumStat}>
            <span className={styles.sumNum}>98%</span>
            <span className={styles.sumLabel}>Would Recommend</span>
          </div>
          <div className={styles.sumStat}>
            <span className={styles.sumNum}>4.9</span>
            <span className={styles.sumLabel}>Cleanliness</span>
          </div>
          <div className={styles.sumStat}>
            <span className={styles.sumNum}>4.8</span>
            <span className={styles.sumLabel}>Value for Money</span>
          </div>
          <div className={styles.sumStat}>
            <span className={styles.sumNum}>4.9</span>
            <span className={styles.sumLabel}>Staff Behaviour</span>
          </div>
        </div>
      </div>

      {/* Sort row */}
      <div className={styles.sortRow}>
        <span className={styles.sortLabel}>{reviews.length} Reviews</span>
        <div className={styles.sortBtns}>
          {['recent', 'highest', 'lowest'].map(s => (
            <button
              key={s}
              className={`${styles.sortBtn} ${sortBy === s ? styles.sortActive : ''}`}
              onClick={() => setSortBy(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className={styles.reviewsList}>
        {visible.map((review, i) => (
          <div key={review.id} className={styles.reviewCard} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={styles.reviewTop}>
              <div className={styles.reviewAuthor}>
                <div className={styles.reviewAvatar}>{review.avatar}</div>
                <div>
                  <div className={styles.reviewName}>
                    {review.name}
                    {review.verified && (
                      <span className={styles.verified}>
                        <FiCheck size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <div className={styles.reviewMeta}>
                    <span className={styles.reviewService}>{review.service}</span>
                    <span className={styles.reviewDot}>·</span>
                    <span className={styles.reviewDate}>{review.date}</span>
                  </div>
                </div>
              </div>
              <div className={styles.reviewStars}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
            </div>

            <p className={styles.reviewText}>{review.text}</p>

            <button className={styles.helpfulBtn}>
              <FiThumbsUp size={12} /> Helpful
            </button>
          </div>
        ))}
      </div>

      {reviews.length > 4 && (
        <button className={styles.showMoreBtn} onClick={() => setShowAll(v => !v)}>
          {showAll ? 'Show Fewer Reviews ↑' : `Show All ${reviews.length} Reviews ↓`}
        </button>
      )}
    </div>
  )
}
