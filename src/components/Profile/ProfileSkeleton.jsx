import styles from './ProfileSkeleton.module.css'

function Bone({ w = '100%', h = 16, radius = 8, style = {} }) {
  return <div className={styles.bone} style={{ width: w, height: h, borderRadius: radius, ...style }} />
}

export default function ProfileSkeleton() {
  return (
    <div className={styles.wrap}>
      {/* Hero skeleton */}
      <div className={styles.heroSkel}>
        <div className={styles.heroInner}>
          <div className={styles.avatarSkel} />
          <div className={styles.nameSkel}>
            <Bone w="80px" h={12} />
            <Bone w="220px" h={36} radius={4} />
            <Bone w="150px" h={14} />
          </div>
          <div className={styles.statsSkel}>
            {[1,2,3,4].map(i => (
              <div key={i} className={styles.statSkel}>
                <Bone w="24px"  h={24} radius="50%" />
                <Bone w="60px"  h={22} />
                <Bone w="48px"  h={11} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar skeleton */}
      <div className={styles.tabSkel}>
        {[1,2,3].map(i => <Bone key={i} w="120px" h={14} />)}
      </div>

      {/* Content skeleton */}
      <div className={styles.content}>
        <Bone w="180px" h={30} radius={4} />
        <Bone w="120px" h={14} />
        <div className={styles.filtersSkel}>
          {[1,2,3,4].map(i => <Bone key={i} w="80px" h={34} radius={100} />)}
        </div>
        {[1,2,3].map(i => (
          <div key={i} className={styles.cardSkel}>
            <div className={styles.cardImgSkel} />
            <div className={styles.cardBodySkel}>
              <Bone w="200px" h={18} />
              <Bone w="140px" h={13} />
              <Bone w="240px" h={13} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}