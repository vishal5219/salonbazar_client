import { useState } from 'react'
import styles from './GallerySection.module.css'

export default function GallerySection({ images, name }) {
  const [lightboxImg, setLightboxImg] = useState(null)

  return (
    <div className={styles.wrap}>
      <div className={styles.sectionLabel}>
        <span className="overline">Gallery</span>
        <h2 className={styles.title}>Inside <em>{name}</em></h2>
      </div>

      {/* Scrollable strip */}
      <div className={styles.strip}>
        {images.map((img, i) => (
          <button
            key={img.id}
            className={styles.imgBtn}
            onClick={() => setLightboxImg(i)}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <img src={img.url} alt={img.caption} className={styles.img} loading="lazy" />
            <div className={styles.imgOverlay}>
              <span className={styles.caption}>{img.caption}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImg !== null && (
        <div className={styles.lightbox} onClick={() => setLightboxImg(null)}>
          <button className={styles.lbClose} onClick={() => setLightboxImg(null)}>✕</button>
          <button
            className={`${styles.lbNav} ${styles.lbPrev}`}
            onClick={e => { e.stopPropagation(); setLightboxImg(v => (v - 1 + images.length) % images.length) }}
          >‹</button>
          <div className={styles.lbContent} onClick={e => e.stopPropagation()}>
            <img src={images[lightboxImg].url} alt={images[lightboxImg].caption} className={styles.lbImg} />
            <div className={styles.lbMeta}>
              <span className={styles.lbCaption}>{images[lightboxImg].caption}</span>
              <span className={styles.lbCounter}>{lightboxImg + 1} / {images.length}</span>
            </div>
          </div>
          <button
            className={`${styles.lbNav} ${styles.lbNext}`}
            onClick={e => { e.stopPropagation(); setLightboxImg(v => (v + 1) % images.length) }}
          >›</button>
        </div>
      )}
    </div>
  )
}
