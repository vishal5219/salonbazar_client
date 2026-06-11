import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiCheck, FiChevronDown, FiClock, FiLogOut, FiUserX, FiZap } from 'react-icons/fi'
import styles from './QueueStatusSelect.module.css'

const MENU_WIDTH = 172
const MENU_EST_HEIGHT = 200

export const QUEUE_STATUS_OPTIONS = [
  {
    value: 'waiting',
    label: 'Waiting',
    shortLabel: 'Waiting',
    icon: FiClock,
    color: '#D97706',
    bg: 'rgba(245, 158, 11, 0.12)',
  },
  {
    value: 'in_progress',
    label: 'In Service',
    shortLabel: 'In Service',
    icon: FiZap,
    color: '#059669',
    bg: 'rgba(16, 185, 129, 0.12)',
  },
  {
    value: 'completed',
    label: 'Completed',
    shortLabel: 'Done',
    icon: FiCheck,
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.12)',
  },
  {
    value: 'no_show',
    label: 'No Show',
    shortLabel: 'No Show',
    icon: FiUserX,
    color: '#DC2626',
    bg: 'rgba(220, 38, 38, 0.1)',
  },
  {
    value: 'left',
    label: 'Left',
    shortLabel: 'Left',
    icon: FiLogOut,
    color: '#6B7280',
    bg: 'rgba(107, 114, 128, 0.12)',
  },
]

export function getStatusOption(value) {
  return QUEUE_STATUS_OPTIONS.find(opt => opt.value === value) || QUEUE_STATUS_OPTIONS[0]
}

export default function QueueStatusSelect({
  value,
  onChange,
  disabled = false,
  variant = 'light',
  fullWidth = false,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: MENU_WIDTH })
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const selected = getStatusOption(value)
  const SelectedIcon = selected.icon

  const updateMenuPosition = useCallback(() => {
    const el = triggerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const width = fullWidth ? rect.width : MENU_WIDTH
    const gap = 5

    let top = rect.bottom + gap
    let left = rect.left

    if (top + MENU_EST_HEIGHT > window.innerHeight - 8) {
      top = Math.max(8, rect.top - MENU_EST_HEIGHT - gap)
    }

    if (left + width > window.innerWidth - 8) {
      left = window.innerWidth - width - 8
    }

    setMenuPos({ top, left, width })
  }, [fullWidth])

  useEffect(() => {
    if (!open) return undefined

    updateMenuPosition()

    const handlePointerDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return
      if (menuRef.current?.contains(e.target)) return
      setOpen(false)
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    const handleReposition = () => updateMenuPosition()

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [open, updateMenuPosition])

  const handleSelect = (nextValue) => {
    setOpen(false)
    if (nextValue !== value) onChange(nextValue)
  }

  const menu = open ? (
    <div
      ref={menuRef}
      className={styles.menuPortal}
      role="listbox"
      style={{
        top: menuPos.top,
        left: menuPos.left,
        width: menuPos.width,
      }}
    >
      <ul className={styles.optionList}>
        {QUEUE_STATUS_OPTIONS.map(opt => {
          const Icon = opt.icon
          const isActive = opt.value === value
          return (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span
                  className={styles.optionIcon}
                  style={{ background: opt.bg, color: opt.color }}
                >
                  <Icon size={11} />
                </span>
                <span className={styles.optionLabel}>{opt.label}</span>
                {isActive && (
                  <span className={styles.optionCheck} style={{ color: opt.color }}>
                    <FiCheck size={11} />
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  ) : null

  return (
    <>
      <div
        ref={triggerRef}
        className={`${styles.root} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${open ? styles.open : ''} ${className}`}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.trigger}
          onClick={() => !disabled && setOpen(prev => !prev)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={styles.triggerDot} style={{ background: selected.color }} />
          <span className={styles.triggerIcon} style={{ color: selected.color }}>
            <SelectedIcon size={13} />
          </span>
          <span className={styles.triggerLabel}>{selected.shortLabel}</span>
          <FiChevronDown size={14} className={styles.chevron} />
        </button>
      </div>

      {menu && createPortal(menu, document.body)}
    </>
  )
}
