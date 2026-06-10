import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiMapPin, FiNavigation, FiPhone, FiMail, FiExternalLink } from 'react-icons/fi'
import { getSalonMapCoords } from '@/utils/salonMapCoords'
import styles from './LocationSection.module.css'

function buildMarkerIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center">
        <div style="width:44px;height:44px;border-radius:50% 50% 50% 0;background:#1A1714;border:3px solid #C9A84C;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(26,23,20,.35)">
          <span style="transform:rotate(45deg);font-size:18px">✦</span>
        </div>
      </div>
    `,
    iconSize: [44, 52],
    iconAnchor: [22, 52],
  })
}

export default function LocationSection({ salon }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  const [lat, lng] = getSalonMapCoords(salon)
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(salon.location)}`
  const cityLabel = salon.city || 'your city'

  useEffect(() => {
    if (!mapRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    L.marker([lat, lng], { icon: buildMarkerIcon() })
      .addTo(map)
      .bindPopup(
        `<b style="font-family:serif;font-size:15px">${salon.name}</b><br>` +
        `<span style="font-size:12px;color:#8A8178">${salon.location}</span>`
      )
      .openPopup()

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [lat, lng, salon.name, salon.location])

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className="overline">Find Us</span>
        <h2 className={styles.title}>Location <em>& Contact</em></h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.mapWrap}>
          <div ref={mapRef} className={styles.map} />
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.directionsBtn}
          >
            <FiNavigation size={14} />
            Get Directions
          </a>
        </div>

        <div className={styles.details}>
          <div className={styles.detailCard}>
            <div className={styles.detailIcon}><FiMapPin size={18} /></div>
            <div>
              <div className={styles.detailLabel}>Address</div>
              <div className={styles.detailValue}>{salon.location}</div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                Open in Google Maps <FiExternalLink size={11} />
              </a>
            </div>
          </div>

          {salon.phone && (
            <div className={styles.detailCard}>
              <div className={styles.detailIcon}><FiPhone size={18} /></div>
              <div>
                <div className={styles.detailLabel}>Phone</div>
                <a href={`tel:${salon.phone}`} className={styles.detailValue}>
                  {salon.phone}
                </a>
              </div>
            </div>
          )}

          {salon.email && (
            <div className={styles.detailCard}>
              <div className={styles.detailIcon}><FiMail size={18} /></div>
              <div>
                <div className={styles.detailLabel}>Email</div>
                <a href={`mailto:${salon.email}`} className={styles.detailValue}>
                  {salon.email}
                </a>
              </div>
            </div>
          )}

          {(salon.amenities || []).length > 0 && (
            <div className={styles.amenitiesBlock}>
              <div className={styles.detailLabel} style={{ marginBottom: 10 }}>Amenities</div>
              <div className={styles.amenityGrid}>
                {salon.amenities.map(a => (
                  <div key={a} className={styles.amenityItem}>
                    <span className={styles.amenityCheck}>✓</span>
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {salon.established && (
            <div className={styles.establishedBadge}>
              <span className={styles.estNum}>Est. {salon.established}</span>
              <span className={styles.estLabel}>Serving {cityLabel} with pride</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
