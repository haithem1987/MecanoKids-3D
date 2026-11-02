import { describe, it, expect } from 'vitest'
import { sanitizeProgress, createDefaultProgress, sanitizeMultiProfileStore, MAX_LOCAL_PROFILES } from './storage'
import { VisualStyleMode, CameraPreset } from '../types/game'
import { VEHICLE_BLUEPRINTS } from '../data/blueprints'

describe('sanitizeProgress – missing / corrupt input', () => {
  it('returns default progress for null', () => {
    const p = sanitizeProgress(null)
    expect(p.language).toBe('fr')
    expect(p.completedStages).toEqual({})
  })

  it('returns default progress for a bare string', () => {
    const p = sanitizeProgress('not-an-object')
    expect(p.preferredStyle).toBe(VisualStyleMode.WOOD)
  })
})

describe('sanitizeProgress – backward-compatible migration', () => {
  it('old save without language defaults to fr', () => {
    const p = sanitizeProgress({ currentBlueprintId: 'car-01' })
    expect(p.language).toBe('fr')
  })

  it('old save without preferredStyle defaults to WOOD', () => {
    const p = sanitizeProgress({})
    expect(p.preferredStyle).toBe(VisualStyleMode.WOOD)
  })

  it('old save without cameraPreset defaults to ISO', () => {
    const p = sanitizeProgress({})
    expect(p.cameraPreset).toBe(CameraPreset.ISO)
  })

  it('invalid preferredStyle falls back to WOOD', () => {
    const p = sanitizeProgress({ preferredStyle: 'rainbow' })
    expect(p.preferredStyle).toBe(VisualStyleMode.WOOD)
  })

  it('invalid language falls back to fr', () => {
    const p = sanitizeProgress({ language: 'de' })
    expect(p.language).toBe('fr')
  })

  it('supports ar and en languages', () => {
    expect(sanitizeProgress({ language: 'ar' }).language).toBe('ar')
    expect(sanitizeProgress({ language: 'en' }).language).toBe('en')
  })

  it('completedStages with unknown blueprintId are dropped', () => {
    const p = sanitizeProgress({ completedStages: { 'not-a-real-id': { completed: true, stars: 3, bestMistakes: 0 } } })
    expect(Object.keys(p.completedStages)).toHaveLength(0)
  })

  it('stars are clamped to 1..3', () => {
    const bp = VEHICLE_BLUEPRINTS[0]
    const p = sanitizeProgress({ completedStages: { [bp.id]: { completed: true, stars: 99, bestMistakes: -1 } } })
    expect(p.completedStages[bp.id].stars).toBe(3)
    expect(p.completedStages[bp.id].bestMistakes).toBe(0)
  })

  it('freeWorkshopUnlocked is false for empty progress', () => {
    const p = sanitizeProgress({})
    expect(p.freeWorkshopUnlocked).toBe(false)
  })

  it('boolean fields default to false', () => {
    const p = sanitizeProgress({})
    expect(p.muted).toBe(false)
    expect(p.voiceAutoRead).toBe(false)
    expect(p.tutorialSeen).toBe(false)
    expect(p.timerModeEnabled).toBe(false)
  })
})

describe('createDefaultProgress', () => {
  it('creates valid progress with defaults', () => {
    const p = createDefaultProgress()
    expect(p.language).toBe('fr')
    expect(p.completedStages).toEqual({})
    expect(p.speedrunRecords).toEqual([])
  })

  it('respects language override', () => {
    expect(createDefaultProgress('ar').language).toBe('ar')
    expect(createDefaultProgress('en').language).toBe('en')
  })
})

describe('sanitizeMultiProfileStore', () => {
  it('creates a default store for null input', () => {
    const store = sanitizeMultiProfileStore(null)
    expect(store.profiles.length).toBeGreaterThanOrEqual(1)
    expect(store.activeProfileId).toBe(store.profiles[0].id)
  })

  it('caps profiles at MAX_LOCAL_PROFILES', () => {
    const profiles = Array.from({ length: MAX_LOCAL_PROFILES + 5 }, (_, i) => ({
      id: `p-${i}`,
      name: `P${i}`,
      avatarColor: 'sky',
      avatarIcon: 'wrench',
      createdAt: 1000,
      updatedAt: 1000,
      progress: {},
    }))
    const store = sanitizeMultiProfileStore({ profiles, activeProfileId: 'p-0' })
    expect(store.profiles.length).toBeLessThanOrEqual(MAX_LOCAL_PROFILES)
  })

  it('deduplicates profiles with the same id', () => {
    const profile = { id: 'dup', name: 'Dup', avatarColor: 'sky', avatarIcon: 'wrench', createdAt: 1, updatedAt: 1, progress: {} }
    const store = sanitizeMultiProfileStore({ profiles: [profile, profile], activeProfileId: 'dup' })
    const dupCount = store.profiles.filter(p => p.id === 'dup').length
    expect(dupCount).toBe(1)
  })

  it('falls back activeProfileId to first profile when id is unknown', () => {
    const profile = { id: 'known', name: 'K', avatarColor: 'sky', avatarIcon: 'wrench', createdAt: 1, updatedAt: 1, progress: {} }
    const store = sanitizeMultiProfileStore({ profiles: [profile], activeProfileId: 'unknown-id' })
    expect(store.activeProfileId).toBe('known')
  })
})
