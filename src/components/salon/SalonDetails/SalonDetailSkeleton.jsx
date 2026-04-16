import styles from './SalonDetailSkeleton.module.css'

function Bone({ w = '100%', h = 16, radius = 8, mb = 0 }) {
  return (
    <div
      className={styles.bone}
      style={{ width: w, height: h, borderRadius: radius, marginBottom: mb }}
    />
  )
}

export default function SalonDetailSkeleton() {
  return (
    <div className={styles.wrap}>
      {/* Mosaic skeleton */}
      <div className={styles.mosaicSkel}>
        <div className={styles.mainSkel} />
        <div className={styles.thumbsSkel}>
          {[0,1,2,3].map(i => <div key={i} className={styles.thumbSkel} />)}
        </div>
      </div>

      {/* Info bar skeleton */}
      <div className={styles.infoBar}>
        <Bone w="120px" h={12} mb={10} />
        <Bone w="300px" h={40} radius={4} mb={8} />
        <Bone w="200px" h={16} mb={16} />
        <div className={styles.statsRowSkel}>
          {[1,2,3].map(i => <Bone key={i} w="100px" h={14} />)}
        </div>
      </div>

      {/* Sticky nav placeholder */}
      <div className={styles.navSkel} />

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.content}>
          {/* Gallery strip */}
          <div className={styles.stripSkel}>
            {[0,1,2,3,4].map(i => <div key={i} className={styles.stripItemSkel} />)}
          </div>

          {/* About */}
          <div style={{ marginBottom: 32 }}>
            <Bone w="80px" h={11} mb={10} />
            <Bone w="200px" h={32} radius={4} mb={16} />
            <Bone h={14} mb={8} />
            <Bone w="90%" h={14} mb={8} />
            <Bone w="75%" h={14} mb={8} />
          </div>

          {/* Services */}
          <div style={{ marginBottom: 32 }}>
            <Bone w="80px" h={11} mb={10} />
            <Bone w="200px" h={32} radius={4} mb={16} />
            {[0,1,2,3].map(i => (
              <div key={i} className={styles.serviceRowSkel}>
                <div><Bone w="180px" h={16} mb={8} /><Bone w="240px" h={12} /></div>
                <Bone w="60px" h={28} radius={6} />
              </div>
            ))}
          </div>
        </div>

        {/* Booking panel */}
        <div className={styles.panelSkel}>
          <div className={styles.panelHeaderSkel} />
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Bone h={44} radius={10} />
            <Bone h={180} radius={12} />
            <Bone h={44} radius={12} />
          </div>
        </div>
      </div>
    </div>
  )
}
