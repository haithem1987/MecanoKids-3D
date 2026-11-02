import { describe, it, expect } from 'vitest'
import type { ParentalSettings } from '../types/game'
import {
  sanitizeParentalSettings,
  evaluateGentleTimerStatus,
  ASSEMBLY_GRACE_MAX_SECONDS,
  ASSEMBLY_GRACE_MIN_COMPLETION_RATIO,
  formatMinutesClock,
} from './sessionTimer'

const TODAY = '2026-11-01'
const YESTERDAY = '2026-10-31'

describe('sanitizeParentalSettings', () => {
  it('returns defaults for null/undefined', () => {
    const s = sanitizeParentalSettings(null, TODAY)
    expect(s.dailyLimitMinutes).toBeNull()
    expect(s.consumedTodaySeconds).toBe(0)
    expect(s.consumedDateKey).toBe(TODAY)
  })

  it('returns defaults for non-object', () => {
    expect(sanitizeParentalSettings('bad', TODAY).consumedTodaySeconds).toBe(0)
  })

  it('keeps valid dailyLimitMinutes (15|20|30|45)', () => {
    const s = sanitizeParentalSettings({ dailyLimitMinutes: 30, consumedTodaySeconds: 0, consumedDateKey: TODAY, extraGrantedMinutesToday: 0 }, TODAY)
    expect(s.dailyLimitMinutes).toBe(30)
  })

  it('rejects invalid dailyLimitMinutes', () => {
    const s = sanitizeParentalSettings({ dailyLimitMinutes: 99 }, TODAY)
    expect(s.dailyLimitMinutes).toBeNull()
  })

  it('resets consumed seconds when date changes', () => {
    const raw = { dailyLimitMinutes: 30, consumedTodaySeconds: 900, consumedDateKey: YESTERDAY, extraGrantedMinutesToday: 5 }
    const s = sanitizeParentalSettings(raw, TODAY)
    expect(s.consumedTodaySeconds).toBe(0)
    expect(s.extraGrantedMinutesToday).toBe(0)
    expect(s.consumedDateKey).toBe(TODAY)
  })

  it('keeps consumed seconds when date is same', () => {
    const raw = { dailyLimitMinutes: 30, consumedTodaySeconds: 600, consumedDateKey: TODAY, extraGrantedMinutesToday: 10 }
    const s = sanitizeParentalSettings(raw, TODAY)
    expect(s.consumedTodaySeconds).toBe(600)
    expect(s.extraGrantedMinutesToday).toBe(10)
  })

  it('clamps consumedTodaySeconds to 86400', () => {
    const raw = { consumedTodaySeconds: 999_999, consumedDateKey: TODAY }
    const s = sanitizeParentalSettings(raw, TODAY)
    expect(s.consumedTodaySeconds).toBe(86_400)
  })
})

describe('evaluateGentleTimerStatus – no limit', () => {
  const settings = { dailyLimitMinutes: null, consumedTodaySeconds: 0, consumedDateKey: TODAY, extraGrantedMinutesToday: 0 }

  it('isLimitEnabled is false, no curtain', () => {
    const r = evaluateGentleTimerStatus({ settings, todayKey: TODAY, currentPlacedCount: 0, currentTotalParts: 10, graceElapsedSeconds: 0 })
    expect(r.isLimitEnabled).toBe(false)
    expect(r.shouldShowCurtain).toBe(false)
    expect(r.remainingSeconds).toBeNull()
  })
})

describe('evaluateGentleTimerStatus – time remaining', () => {
  const settings: ParentalSettings = { dailyLimitMinutes: 30, consumedTodaySeconds: 100, consumedDateKey: TODAY, extraGrantedMinutesToday: 0 }

  it('no curtain, remaining > 0', () => {
    const r = evaluateGentleTimerStatus({ settings, todayKey: TODAY, currentPlacedCount: 0, currentTotalParts: 10, graceElapsedSeconds: 0 })
    expect(r.remainingSeconds).toBeGreaterThan(0)
    expect(r.shouldShowCurtain).toBe(false)
  })
})

describe('evaluateGentleTimerStatus – grace window', () => {
  // 30 min limit, fully consumed
  const settings: ParentalSettings = { dailyLimitMinutes: 30, consumedTodaySeconds: 1800, consumedDateKey: TODAY, extraGrantedMinutesToday: 0 }

  it('activates grace when ratio >= 0.5 and within ASSEMBLY_GRACE_MAX_SECONDS', () => {
    const r = evaluateGentleTimerStatus({
      settings,
      todayKey: TODAY,
      currentPlacedCount: 6,
      currentTotalParts: 10,
      graceElapsedSeconds: 0,
    })
    expect(r.isInAssemblyGrace).toBe(true)
    expect(r.shouldShowCurtain).toBe(false)
    expect(r.graceRemainingSeconds).toBe(ASSEMBLY_GRACE_MAX_SECONDS)
  })

  it('no grace when ratio < 0.5', () => {
    const r = evaluateGentleTimerStatus({
      settings,
      todayKey: TODAY,
      currentPlacedCount: 3,
      currentTotalParts: 10,
      graceElapsedSeconds: 0,
    })
    expect(r.isInAssemblyGrace).toBe(false)
    expect(r.shouldShowCurtain).toBe(true)
  })

  it('no grace when graceElapsedSeconds >= ASSEMBLY_GRACE_MAX_SECONDS', () => {
    const r = evaluateGentleTimerStatus({
      settings,
      todayKey: TODAY,
      currentPlacedCount: 6,
      currentTotalParts: 10,
      graceElapsedSeconds: ASSEMBLY_GRACE_MAX_SECONDS,
    })
    expect(r.isInAssemblyGrace).toBe(false)
    expect(r.shouldShowCurtain).toBe(true)
  })

  it('shows curtain when no parts placed', () => {
    const r = evaluateGentleTimerStatus({
      settings,
      todayKey: TODAY,
      currentPlacedCount: 0,
      currentTotalParts: 10,
      graceElapsedSeconds: 0,
    })
    expect(r.shouldShowCurtain).toBe(true)
  })

  it('grace ratio boundary: exactly 0.5 qualifies', () => {
    const r = evaluateGentleTimerStatus({
      settings,
      todayKey: TODAY,
      currentPlacedCount: 5,
      currentTotalParts: 10,
      graceElapsedSeconds: 10,
    })
    expect(r.isInAssemblyGrace).toBe(5 / 10 >= ASSEMBLY_GRACE_MIN_COMPLETION_RATIO)
  })
})

describe('formatMinutesClock', () => {
  it('formats 0 as 00:00', () => expect(formatMinutesClock(0)).toBe('00:00'))
  it('formats 90 as 01:30', () => expect(formatMinutesClock(90)).toBe('01:30'))
  it('formats 3600 as 60:00', () => expect(formatMinutesClock(3600)).toBe('60:00'))
  it('clamps negatives to 0', () => expect(formatMinutesClock(-5)).toBe('00:00'))
})
