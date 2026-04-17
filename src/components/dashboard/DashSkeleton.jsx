import styles from './DashSkeleton.module.css'

function Bone({ w = '100%', h = 16, radius = 8 }) {
  return <div className={styles.bone} style={{ width: w, height: h, borderRadius: radius }} />
}

export default function DashSkeleton() {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Bone w="220px" h={36} radius={4} />
        <Bone w="120px" h={14} />
      </div>
      <div className={styles.kpiRow}>
        {[1,2,3,4].map(i => (
          <div key={i} className={styles.kpiSkel}>
            <Bone w="38px" h={38} radius={10} />
            <Bone w="80px" h={28} />
            <Bone w="60px" h={12} />
          </div>
        ))}
      </div>
      <div className={styles.sectionSkel}>
        <Bone w="140px" h={22} radius={4} />
        {[1,2,3].map(i => (
          <div key={i} className={styles.rowSkel}>
            <Bone w="32px" h={32} radius="50%" />
            <div style={{ flex:1 }}>
              <Bone w="140px" h={14} />
              <Bone w="90px" h={12} />
            </div>
            <Bone w="60px" h={14} />
          </div>
        ))}
      </div>
    </div>
  )
}