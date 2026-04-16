import { useEffect, useRef } from 'react'
import { FiMapPin, FiNavigation, FiPhone, FiMail, FiExternalLink } from 'react-icons/fi'
import styles from './LocationSection.module.css'

export default function LocationSection({ salon }) {
  const mapRef = useRef(null)

  // Ahmedabad center coords (Navrangpura area for mock)
  const LAT = 23.0395
  const LNG = 72.5600

  useEffect(() => {
    if (!mapRef.current) return

    // Load Leaflet if not already loaded
    if (window.L) { initMap(); return }

    const script  = document.createElement('script')
    script.src    = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
    script.onload = initMap
    document.head.appendChild(script)

    const link  = document.createElement('link')
    link.rel    = 'stylesheet'
    link.href   = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
    document.head.appendChild(link)

    return () => { /* Leaflet handles its own cleanup */ }
  }, [])

  const initMap = () => {
    if (!mapRef.current || mapRef.current._leaflet_id) return
    const L   = window.L
    const map = L.map(mapRef.current, {
      center:      [LAT, LNG],
      zoom:        16,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Custom gold pin marker
    const icon = L.divIcon({
      className: '',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center">
          <div style="width:44px;height:44px;border-radius:50% 50% 50% 0;background:#1A1714;border:3px solid #C9A84C;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(26,23,20,.35)">
            <span style="transform:rotate(45deg);font-size:18px">✦</span>
          </div>
        </div>
      `,
      iconSize:   [44, 52],
      iconAnchor: [22, 52],
    })

    L.marker([LAT, LNG], { icon })
      .addTo(map)
      .bindPopup(`<b style="font-family:serif;font-size:15px">${salon.name}</b><br><span style="font-size:12px;color:#8A8178">${salon.location}</span>`)
      .openPopup()
  }

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(salon.location)}`

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className="overline">Find Us</span>
        <h2 className={styles.title}>Location <em>& Contact</em></h2>
      </div>

      <div className={styles.grid}>
        {/* Map */}
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

        {/* Contact details */}
        <div className={styles.details}>
          {/* Address */}
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

          {/* Phone */}
          <div className={styles.detailCard}>
            <div className={styles.detailIcon}><FiPhone size={18} /></div>
            <div>
              <div className={styles.detailLabel}>Phone</div>
              <a href={`tel:${salon.phone}`} className={styles.detailValue}>
                {salon.phone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className={styles.detailCard}>
            <div className={styles.detailIcon}><FiMail size={18} /></div>
            <div>
              <div className={styles.detailLabel}>Email</div>
              <a href={`mailto:${salon.email}`} className={styles.detailValue}>
                {salon.email}
              </a>
            </div>
          </div>

          {/* Amenities */}
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

          {/* Established */}
          <div className={styles.establishedBadge}>
            <span className={styles.estNum}>Est. {salon.established}</span>
            <span className={styles.estLabel}>Serving Ahmedabad with pride</span>
          </div>
        </div>
      </div>
    </div>
  )
}
