import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiMapPin, FiStar, FiClock } from 'react-icons/fi'
import { getSalonMapCoords } from '@/utils/salonMapCoords'
import styles from './MapView.module.css'

export default function MapView({ salons, hoveredId, onHover, loading }) {
  const mapRef       = useRef(null)
  const leafletRef   = useRef(null)
  const markersRef   = useRef({})
  const [selected,   setSelected]   = useState(null)
  const [mapLoaded,  setMapLoaded]  = useState(false)

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return

    const map = L.map(mapRef.current, {
      center: [23.0225, 72.5714],
      zoom: 13,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'topright' }).addTo(map)

    leafletRef.current = map
    setMapLoaded(true)

    return () => {
      map.remove()
      leafletRef.current = null
      markersRef.current = {}
    }
  }, [])

  const addMarkers = (map, salonList) => {
    if (!map) return

    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}

    salonList.forEach(salon => {
      const coords = getSalonMapCoords(salon)
      if (!coords) return

      const icon = L.divIcon({
        className: '',
        html: `
          <div class="map-pin ${salon.isOpen ? 'pin-open' : 'pin-closed'}" data-id="${salon.id}">
            <div class="pin-bubble">
              <span class="pin-price">${salon.price}</span>
            </div>
            <div class="pin-tail"></div>
          </div>
        `,
        iconSize: [72, 42],
        iconAnchor: [36, 42],
      })

      const marker = L.marker(coords, { icon })
        .addTo(map)
        .on('click', () => setSelected(salon))
        .on('mouseover', () => onHover?.(salon.id))
        .on('mouseout', () => onHover?.(null))

      markersRef.current[salon.id] = marker
    })
  }

  useEffect(() => {
    if (leafletRef.current && mapLoaded) {
      addMarkers(leafletRef.current, salons)
    }
  }, [salons, mapLoaded])

  useEffect(() => {
    if (!mapLoaded) return
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement()?.querySelector('.map-pin')
      if (!el) return
      el.classList.toggle('pin-hovered', String(hoveredId) === id)
    })
  }, [hoveredId, mapLoaded])

  return (
    <div className={styles.mapContainer}>
      <style>{`
        .map-pin { display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform .2s; }
        .map-pin:hover, .pin-hovered { transform: scale(1.12) translateY(-2px) !important; z-index: 1000 !important; }
        .pin-bubble { padding: 6px 10px; border-radius: 10px; font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; white-space: nowrap; box-shadow: 0 3px 12px rgba(26,23,20,.2); }
        .pin-open .pin-bubble { background: #1A1714; color: #C9A84C; }
        .pin-closed .pin-bubble { background: #8A8178; color: #fff; }
        .pin-tail { width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; }
        .pin-open .pin-tail { border-top: 10px solid #1A1714; }
        .pin-closed .pin-tail { border-top: 10px solid #8A8178; }
      `}</style>

      <div ref={mapRef} className={styles.map} />

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#1A1714' }} />
          <span>Open</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#8A8178' }} />
          <span>Closed</span>
        </div>
      </div>

      {selected && (
        <div className={styles.popupCard}>
          <button className={styles.popupClose} onClick={() => setSelected(null)}>✕</button>
          <img src={selected.image} alt={selected.name} className={styles.popupImg} />
          <div className={styles.popupBody}>
            <div className={styles.popupTop}>
              <div>
                <h4 className={styles.popupName}>{selected.name}</h4>
                <p className={styles.popupCat}>{selected.category}</p>
              </div>
              <div className={styles.popupRating}>
                <FiStar size={12} style={{ color: 'var(--gold)' }} />
                {selected.rating}
              </div>
            </div>
            <div className={styles.popupMeta}>
              <span><FiMapPin size={11} /> {selected.location}</span>
              {selected.isOpen && selected.waitTime && (
                <span className={styles.popupWait}><FiClock size={11} /> {selected.waitTime}</span>
              )}
            </div>
            <div className={styles.popupFooter}>
              <span className={styles.popupPrice}>From {selected.price}</span>
              <Link to={`/salons/${selected.id}`} className={styles.popupBtn}>
                View & Book
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className={styles.sideList}>
        <div className={styles.sideListHeader}>
          <span>{salons.length} salons in view</span>
        </div>
        <div className={styles.sideListBody}>
          {salons.map(salon => (
            <button
              key={salon.id}
              className={`${styles.sideItem} ${(hoveredId === salon.id || selected?.id === salon.id) ? styles.sideItemActive : ''}`}
              onClick={() => {
                setSelected(salon)
                const coords = getSalonMapCoords(salon)
                if (coords && leafletRef.current) {
                  leafletRef.current.flyTo(coords, 15, { duration: 0.8 })
                }
              }}
              onMouseEnter={() => onHover?.(salon.id)}
              onMouseLeave={() => onHover?.(null)}
            >
              <img src={salon.image} alt={salon.name} className={styles.sideImg} />
              <div className={styles.sideInfo}>
                <div className={styles.sideName}>{salon.name}</div>
                <div className={styles.sideMeta}>
                  <span className={`${styles.sideStatus} ${salon.isOpen ? styles.sideOpen : styles.sideClosed}`}>
                    {salon.isOpen ? 'Open' : 'Closed'}
                  </span>
                  <span className={styles.sidePrice}>{salon.price}</span>
                </div>
                <div className={styles.sideLoc}><FiMapPin size={10} /> {salon.distance}</div>
              </div>
              <div className={styles.sideRating}>
                <FiStar size={11} style={{ color: 'var(--gold)' }} />
                {salon.rating}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
