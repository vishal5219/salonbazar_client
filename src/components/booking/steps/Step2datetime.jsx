// Step 2: Date & Time Selection
import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi'
import { setSelectedDate, setSelectedSlot, goNextStep, goPrevStep } from '@/store/slices/bookingSlice'
import styles from './Step2DateTime.module.css'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTH_ABR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Mock slot data: key = "YYYY-M-D", value = array of available slots
const BOOKED_SLOTS = {
  default: new Set(['10:00 AM', '12:30 PM', '03:00 PM', '06:00 PM']),
}

const ALL_SLOTS = [
  { time: '10:00 AM', period: 'Morning' },
  { time: '10:30 AM', period: 'Morning' },
  { time: '11:00 AM', period: 'Morning' },
  { time: '11:30 AM', period: 'Morning' },
  { time: '12:00 PM', period: 'Afternoon' },
  { time: '12:30 PM', period: 'Afternoon' },
  { time: '01:00 PM', period: 'Afternoon' },
  { time: '01:30 PM', period: 'Afternoon' },
  { time: '02:00 PM', period: 'Afternoon' },
  { time: '02:30 PM', period: 'Afternoon' },
  { time: '03:00 PM', period: 'Afternoon' },
  { time: '03:30 PM', period: 'Afternoon' },
  { time: '04:00 PM', period: 'Evening' },
  { time: '04:30 PM', period: 'Evening' },
  { time: '05:00 PM', period: 'Evening' },
  { time: '05:30 PM', period: 'Evening' },
  { time: '06:00 PM', period: 'Evening' },
  { time: '06:30 PM', period: 'Evening' },
  { time: '07:00 PM', period: 'Evening' },
]

const PERIOD_ORDER = ['Morning', 'Afternoon', 'Evening']

function groupSlots(slots) {
  return PERIOD_ORDER.reduce((acc, period) => {
    acc[period] = slots.filter(s => s.period === period)
    return acc
  }, {})
}

export default function Step2DateTime() {
  const dispatch = useDispatch()
  const { selectedDate, selectedSlot, selectedService } = useSelector(s => s.booking)

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [hovDay, setHovDay] = useState(null)

  // Build calendar grid
  const calDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const numDays = new Date(year, month + 1, 0).getDate()
    return [...Array(firstDay).fill(null), ...Array.from({ length: numDays }, (_, i) => i + 1)]
  }, [year, month])

  const isPast = (day) => {
    if (!day) return false
    const d = new Date(year, month, day)
    d.setHours(0, 0, 0, 0)
    const t = new Date(); t.setHours(0, 0, 0, 0)
    return d < t
  }

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const isSelected = (day) =>
    selectedDate?.day === day && selectedDate?.month === month && selectedDate?.year === year

  const handleDayClick = (day) => {
    if (!day || isPast(day)) return
    dispatch(setSelectedDate({
      day,
      month,
      monthName: MONTH_ABR[month],
      monthFull: MONTHS[month],
      year,
      displayDate: `${day} ${MONTH_ABR[month]} ${year}`,
    }))
  }

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // Slots for selected day
  const bookedForDay = BOOKED_SLOTS.default
  const slotGroups = groupSlots(ALL_SLOTS)

  const canContinue = selectedDate && selectedSlot

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.stepTag}>Step 2 of 3</span>
        <h2 className={styles.title}>Pick a <em>Date & Time</em></h2>
        <p className={styles.sub}>
          {selectedService
            ? `${selectedService.name} · ${selectedService.duration} min`
            : 'Choose your preferred appointment time'}
        </p>
      </div>

      <div className={styles.calendarWrap}>
        {/* Calendar */}
        <div className={styles.calendar}>
          {/* Month navigation */}
          <div className={styles.calNav}>
            <button
              className={styles.calNavBtn}
              onClick={prevMonth}
              disabled={month === today.getMonth() && year === today.getFullYear()}
            >
              <FiChevronLeft size={18} />
            </button>
            <h3 className={styles.calMonthTitle}>{MONTHS[month]} {year}</h3>
            <button className={styles.calNavBtn} onClick={nextMonth}>
              <FiChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className={styles.calGrid}>
            {DAY_NAMES.map(d => (
              <div key={d} className={styles.calDayName}>{d}</div>
            ))}

            {calDays.map((day, i) => {
              const past = isPast(day)
              const today_ = isToday(day)
              const sel = isSelected(day)
              const hov = hovDay === day && !past && day

              return (
                <button
                  key={i}
                  className={`
                    ${styles.calDay}
                    ${!day ? styles.calBlank : ''}
                    ${past ? styles.calPast : ''}
                    ${today_ ? styles.calToday : ''}
                    ${sel ? styles.calSelected : ''}
                  `}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => setHovDay(day)}
                  onMouseLeave={() => setHovDay(null)}
                  disabled={!day || past}
                >
                  {day || ''}
                  {today_ && !sel && <span className={styles.todayDot} />}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className={styles.calLegend}>
            <span className={styles.legendItem}>
              <span className={styles.legendDotToday} /> Today
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDotSel} /> Selected
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDotPast} /> Unavailable
            </span>
          </div>
        </div>

        {/* Time slots */}
        <div className={styles.slotsPanel}>
          {selectedDate ? (
            <>
              <div className={styles.slotsPanelHeader}>
                <div className={styles.slotDate}>
                  {selectedDate.displayDate}
                </div>
                <div className={styles.slotAvail}>
                  {ALL_SLOTS.length - bookedForDay.size} slots available
                </div>
              </div>

              {PERIOD_ORDER.map(period => (
                <div key={period} className={styles.slotGroup}>
                  <div className={styles.slotGroupLabel}>{period}</div>
                  <div className={styles.slotsGrid}>
                    {slotGroups[period].map(({ time }) => {
                      const booked = bookedForDay.has(time)
                      const slotStr = typeof selectedSlot === 'string' ? selectedSlot : selectedSlot?.time
                      const isSel = slotStr === time
                      return (
                        <button
                          key={time}
                          className={`
                            ${styles.slot}
                            ${booked ? styles.slotBooked : ''}
                            ${isSel ? styles.slotSel : ''}
                          `}
                          onClick={() => !booked && dispatch(setSelectedSlot(time))}
                          disabled={booked}
                          title={booked ? 'Slot not available' : ''}
                        >
                          <FiClock size={11} className={styles.slotIcon} />
                          {time}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.noDateMsg}>
              <span className={styles.noDateIcon}>📅</span>
              <p>Select a date to see available time slots</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected summary row */}
      {selectedDate && selectedSlot && (
        <div className={styles.selectionSummary}>
          <span className={styles.summaryItem}>📅 {selectedDate.displayDate}</span>
          <span className={styles.summaryDot}>·</span>
          <span className={styles.summaryItem}>⏰ {typeof selectedSlot === 'string' ? selectedSlot : selectedSlot?.time}</span>
        </div>
      )}

      {/* Nav buttons */}
      <div className={styles.navRow}>
        <button className={styles.backBtn} onClick={() => dispatch(goPrevStep())}>
          ← Back
        </button>
        <button
          className={`${styles.continueBtn} ${!canContinue ? styles.continueBtnDisabled : ''}`}
          onClick={() => canContinue && dispatch(goNextStep())}
          disabled={!canContinue}
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  )
}