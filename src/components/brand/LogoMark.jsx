import styles from './Logo.module.css'

export default function LogoMark({ className = '' }) {
  return (
    <svg
      className={`${styles.mark} ${className}`.trim()}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sbGold" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F8EED0" />
          <stop offset="38%" stopColor="#D4B56A" />
          <stop offset="72%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#7A5E1E" />
        </linearGradient>
        <linearGradient id="sbGoldSoft" x1="20" y1="18" x2="44" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF8E8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="sbGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 30) rotate(90) scale(22)">
          <stop stopColor="#F5E6B8" stopOpacity="0.45" />
          <stop offset="1" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="32" cy="32" r="30" stroke="url(#sbGold)" strokeWidth="1.2" opacity="0.55" />
      <circle cx="32" cy="32" r="26.5" stroke="url(#sbGold)" strokeWidth="1.8" />
      <circle cx="32" cy="32" r="23" fill="url(#sbGlow)" />

      <path
        d="M32 8 L38.2 12.2 L40 19.5 L32 23.5 L24 19.5 L25.8 12.2 Z"
        stroke="url(#sbGold)"
        strokeWidth="1.1"
        fill="url(#sbGoldSoft)"
      />

      <path
        d="M22 46 C22 34 27 28 32 28 C37 28 42 34 42 46"
        stroke="url(#sbGold)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M24 38 C26.5 33.5 29.5 31.5 32 31.5 C34.5 31.5 37.5 33.5 40 38"
        stroke="url(#sbGold)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />

      <path
        d="M26 20 C28 15.5 30 14 32 14 C34 14 36 15.5 38 20"
        stroke="url(#sbGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      <path
        d="M28.5 18.5 C30 22 31 24.5 32 26.5 C33 24.5 34 22 35.5 18.5"
        stroke="url(#sbGold)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 26.5 V42"
        stroke="url(#sbGold)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      <circle cx="32" cy="44.5" r="1.6" fill="url(#sbGold)" />
      <circle cx="18" cy="32" r="1.1" fill="#E8C97A" opacity="0.8" />
      <circle cx="46" cy="32" r="1.1" fill="#E8C97A" opacity="0.8" />
    </svg>
  )
}
