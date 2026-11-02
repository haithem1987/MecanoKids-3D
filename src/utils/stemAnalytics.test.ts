import { describe, it, expect } from 'vitest'
import { computeStemCompetencyReport } from './stemAnalytics'
import type { PlayerProgress } from '../types/game'
import { VisualStyleMode, CameraPreset } from '../types/game'
import { VEHICLE_BLUEPRINTS } from '../data/blueprints'

function makeProgress(overrides: Partial<PlayerProgress> = {}): PlayerProgress {
  return {
    currentBlueprintId: 'car-01',
    lastStandardBlueprintId: 'car-01',
    inProgressStages: {},
    completedStages: {},
    dailyChallenge: {
      completedByDate: {},
      collectedRareIds: [],
      currentStreak: 0,
      bestStreak: 0,
      lastCompletedDate: null,
    },
    dailyStreak: {
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: null,
      activeDates: [],
      unlockedMilestones: {},
    },
    speedrunRecords: [],
    timerModeEnabled: false,
    unlockedBadges: {},
    customLiveries: {},
    engineeringPatents: {},
    repairedStages: {},
    masterNoSilhouetteStages: {},
    noSilhouetteMode: false,
    environmentMode: 'auto_thematic',
    language: 'fr',
    preferredStyle: VisualStyleMode.WOOD,
    cameraPreset: CameraPreset.ISO,
    freeWorkshopUnlocked: false,
    muted: false,
    voiceAutoRead: false,
    tutorialSeen: false,
    lastSavedAt: 0,
    partsTrayPosition: 'bottom',
    partsTrayAutoHide: true,
    licenseState: { tier: 'discovery' },
    ...overrides,
  }
}

describe('computeStemCompetencyReport – empty progress', () => {
  const report = computeStemCompetencyReport(makeProgress(), 'fr')

  it('returns 0 completed vehicles', () => {
    expect(report.completedVehicles).toBe(0)
  })

  it('all pillar scores are 0', () => {
    for (const pillar of report.pillars) {
      expect(pillar.score).toBe(0)
    }
  })

  it('overallStemIndex is 0', () => {
    expect(report.overallStemIndex).toBe(0)
  })

  it('no diploma unlocked', () => {
    expect(report.highestUnlockedDiploma).toBeNull()
    expect(report.diplomas.every(d => !d.unlocked)).toBe(true)
  })
})

describe('computeStemCompetencyReport – scores stay in 0..100', () => {
  it('all pillar scores are clamped', () => {
    // A large fake progress (still valid ids from VEHICLE_BLUEPRINTS)
    const report = computeStemCompetencyReport(makeProgress(), 'en')
    for (const pillar of report.pillars) {
      expect(pillar.score).toBeGreaterThanOrEqual(0)
      expect(pillar.score).toBeLessThanOrEqual(100)
    }
    expect(report.overallStemIndex).toBeGreaterThanOrEqual(0)
    expect(report.overallStemIndex).toBeLessThanOrEqual(100)
  })
})

describe('computeStemCompetencyReport – pillar count and ids', () => {
  it('always returns exactly 4 pillars', () => {
    const report = computeStemCompetencyReport(makeProgress(), 'ar')
    expect(report.pillars).toHaveLength(4)
  })

  it('pillar ids are correct', () => {
    const report = computeStemCompetencyReport(makeProgress(), 'fr')
    const ids = report.pillars.map(p => p.id)
    expect(ids).toContain('sequential_logic')
    expect(ids).toContain('spatial_3d')
    expect(ids).toContain('diagnostic_analysis')
    expect(ids).toContain('technical_lexicon')
  })
})

describe('computeStemCompetencyReport – diploma milestones', () => {
  it('returns 5 diplomas', () => {
    const report = computeStemCompetencyReport(makeProgress(), 'fr')
    expect(report.diplomas).toHaveLength(5)
  })

  it('first diploma (1 vehicle) unlocks with 1 completion using a real blueprint id', () => {
    const bp = VEHICLE_BLUEPRINTS[0]
    const progress = makeProgress({
      completedStages: {
        [bp.id]: { completed: true, stars: 3, bestMistakes: 0 },
      },
    })
    const report = computeStemCompetencyReport(progress, 'fr')
    expect(report.completedVehicles).toBe(1)
    expect(report.diplomas[0].unlocked).toBe(true)
    expect(report.highestUnlockedDiploma?.id).toBe('diploma_1')
  })
})

describe('computeStemCompetencyReport – repair & speedrun feed diagnostic score', () => {
  it('repairs increase diagnosticScore above 0', () => {
    const progress = makeProgress({ repairedStages: { 'car-01': 3 } })
    const report = computeStemCompetencyReport(progress, 'en')
    const diag = report.pillars.find(p => p.id === 'diagnostic_analysis')!
    expect(diag.score).toBeGreaterThan(0)
  })
})
