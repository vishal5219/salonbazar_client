import styles from './AdminSkeleton.module.css'

function Bone({ w = '100%', h = 14, radius = 6 }) {
  return <div className={styles.bone} style={{ width: w, height: h, borderRadius: radius }} />
}

export default function AdminSkeleton() {
  return (
    <div className={styles.wrap}>
      <Bone w="200px" h={36} radius={4} />
      <Bone w="140px" h={13} />
      <div className={styles.kpiRow}>
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className={styles.kpiSkel}>
            <Bone w="36px" h={36} radius={10} />
            <Bone w="80px" h={26} />
            <Bone w="60px" h={11} />
          </div>
        ))}
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.panelSkel}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={styles.rowSkel}>
              <Bone w="32px" h={32} radius="50%" />
              <div style={{ flex:1 }}>
                <Bone w="200px" h={13} />
                <Bone w="130px" h={11} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.rightSkel}>
          <div className={styles.panelSkel}>
            {[1,2,3].map(i => <div key={i} className={styles.rowSkel}><Bone h={40} /></div>)}
          </div>
          <div className={styles.panelSkel}>
            {[1,2,3,4,5].map(i => <div key={i} className={styles.rowSkel}><Bone w="80px" h={13}/><Bone w="40px" h={13}/></div>)}
          </div>
        </div>
      </div>
    </div>
  )
}