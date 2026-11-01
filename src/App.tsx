/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { evaluatePlayerProgression, syncUnlockedBadgesMap } from './data/badges';
import { VEHICLE_BLUEPRINTS } from './data/blueprints';
import {
  buildDailyBlueprintForDate,
  getTodayDateKey,
  recordDailyChallengeCompletion,
} from './data/dailyChallenges';
import {
  getLocalizedBlueprint,
  getLocalizedBlueprints,
  UI_TRANSLATIONS,
} from './i18n/translations';
import {
  CameraPreset,
  LanguageCode,
  PlayerProgress,
  SpeedrunRecord,
  VisualStyleMode,
} from './types/game';
import { recordSpeedrunCompletion } from './utils/speedrun';
import {
  createDefaultProgress,
  downloadProgressBackup,
  loadPlayerProgress,
  sanitizeProgress,
  savePlayerProgress,
} from './utils/storage';
import { soundEngine } from './audio/soundEngine';
import { TopBar } from './components/TopBar';
import { WorkshopCanvas } from './components/WorkshopCanvas';
import { BottomPartsDock } from './components/BottomPartsDock';
import { StageCatalogModal } from './components/StageCatalogModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { SpeedLeaderboardModal } from './components/SpeedLeaderboardModal';
import { ProgressionModal } from './components/ProgressionModal';
import { MechanicHintDrawer } from './components/MechanicHintDrawer';
import { DiscoveryModal, TimedCompletionResult } from './components/DiscoveryModal';
import { GuidedTourOverlay } from './components/GuidedTourOverlay';

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(loadPlayerProgress);
  const [todayDateKey, setTodayDateKey] = useState<string>(() => getTodayDateKey());

  const [stagedPartId, setStagedPartId] = useState<string | null>(null);
  const [activeDragPartId, setActiveDragPartId] = useState<string | null>(null);
  const [hintPartId, setHintPartId] = useState<string | null>(null);
  const [explodedFactor, setExplodedFactor] = useState<number>(0);
  const [cameraPresetNonce, setCameraPresetNonce] = useState<number>(0);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const statusTimerRef = useRef<number | null>(null);

  // Modals, Daily Challenge, Leaderboard, Progression, Guide Drawer & Guided Tour
  const [catalogOpen, setCatalogOpen] = useState<boolean>(false);
  const [dailyModalOpen, setDailyModalOpen] = useState<boolean>(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState<boolean>(false);
  const [progressionOpen, setProgressionOpen] = useState<boolean>(false);
  const [mechanicGuideOpen, setMechanicGuideOpen] = useState<boolean>(false);
  const [discoveryOpen, setDiscoveryOpen] = useState<boolean>(false);
  const [recentUnlockedBadgeIds, setRecentUnlockedBadgeIds] = useState<string[]>([]);
  const [lastTimedResult, setLastTimedResult] = useState<TimedCompletionResult | null>(null);
  const [tourOpen, setTourOpen] = useState<boolean>(() => !loadPlayerProgress().tutorialSeen);
  const [tourStep, setTourStep] = useState<number>(0);

  // Live Stopwatch state (tracks active assembly delta on top of persisted elapsedMs)
  const [timerArmed, setTimerArmed] = useState<boolean>(false);
  const [liveDeltaMs, setLiveDeltaMs] = useState<number>(0);
  const segmentStartRef = useRef<number | null>(null);

  // Keep todayDateKey fresh across midnight rollovers
  useEffect(() => {
    const id = window.setInterval(() => {
      const nextKey = getTodayDateKey();
      setTodayDateKey((prev) => (prev === nextKey ? prev : nextKey));
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const language = progress.language;
  const t = UI_TRANSLATIONS[language];

  const todayDailyBundle = useMemo(
    () => buildDailyBlueprintForDate(todayDateKey),
    [todayDateKey],
  );

  const localizedDailyBlueprint = useMemo(
    () => getLocalizedBlueprint(todayDailyBundle.blueprint, language),
    [todayDailyBundle.blueprint, language],
  );

  const localizedBlueprints = useMemo(
    () => getLocalizedBlueprints(VEHICLE_BLUEPRINTS, language),
    [language],
  );

  const currentRawBlueprint = useMemo(() => {
    if (progress.currentBlueprintId === todayDailyBundle.blueprint.id) {
      return todayDailyBundle.blueprint;
    }
    return (
      VEHICLE_BLUEPRINTS.find((b) => b.id === progress.currentBlueprintId) ??
      VEHICLE_BLUEPRINTS.find((b) => b.id === progress.lastStandardBlueprintId) ??
      VEHICLE_BLUEPRINTS[0]
    );
  }, [
    progress.currentBlueprintId,
    progress.lastStandardBlueprintId,
    todayDailyBundle.blueprint,
  ]);

  const currentBlueprint = useMemo(
    () => getLocalizedBlueprint(currentRawBlueprint, language),
    [currentRawBlueprint, language],
  );

  const progressionSummary = useMemo(
    () =>
      evaluatePlayerProgression(
        progress.completedStages,
        progress.unlockedBadges,
        language,
        progress.dailyChallenge,
        progress.speedrunRecords,
      ),
    [
      progress.completedStages,
      progress.unlockedBadges,
      progress.dailyChallenge,
      progress.speedrunRecords,
      language,
    ],
  );

  const newlyUnlockedBadges = useMemo(
    () =>
      progressionSummary.badges.filter((b) => recentUnlockedBadgeIds.includes(b.id)),
    [progressionSummary.badges, recentUnlockedBadgeIds],
  );

  const currentStageState = progress.inProgressStages[currentBlueprint.id];
  const placedPartIds = useMemo(
    () => currentStageState?.placedPartIds ?? [],
    [currentStageState],
  );
  const mistakesCount = currentStageState?.mistakesCount ?? 0;
  const baseElapsedMs = currentStageState?.elapsedMs ?? 0;
  const isCompleted = placedPartIds.length === currentBlueprint.parts.length;

  const currentIndex = useMemo(
    () => VEHICLE_BLUEPRINTS.findIndex((b) => b.id === currentBlueprint.id),
    [currentBlueprint.id],
  );
  const hasNextStage = currentIndex >= 0 && currentIndex < VEHICLE_BLUEPRINTS.length - 1;

  const anyOverlayOpen =
    catalogOpen ||
    dailyModalOpen ||
    leaderboardOpen ||
    progressionOpen ||
    mechanicGuideOpen ||
    discoveryOpen ||
    tourOpen;

  const shouldRunStopwatch =
    !isCompleted &&
    !anyOverlayOpen &&
    (placedPartIds.length > 0 || timerArmed || baseElapsedMs > 0);

  // Flush active stopwatch segment into persisted inProgressStages whenever paused or stage switches
  const flushActiveStopwatchSegment = useCallback(
    (bpId: string) => {
      if (segmentStartRef.current === null) return 0;
      const delta = Math.max(0, Date.now() - segmentStartRef.current);
      segmentStartRef.current = null;
      setLiveDeltaMs(0);
      if (delta > 0) {
        setProgress((p) => {
          const cur = p.inProgressStages[bpId];
          if (!cur && delta < 50) return p;
          return {
            ...p,
            inProgressStages: {
              ...p.inProgressStages,
              [bpId]: {
                placedPartIds: cur?.placedPartIds ?? [],
                mistakesCount: cur?.mistakesCount ?? 0,
                elapsedMs: (cur?.elapsedMs ?? 0) + delta,
                updatedAt: Date.now(),
              },
            },
          };
        });
      }
      return delta;
    },
    [],
  );

  useEffect(() => {
    if (!shouldRunStopwatch) {
      if (segmentStartRef.current !== null) {
        flushActiveStopwatchSegment(currentBlueprint.id);
      }
      return;
    }

    segmentStartRef.current = Date.now();
    setLiveDeltaMs(0);

    const tick = window.setInterval(() => {
      if (document.hidden) return;
      if (segmentStartRef.current !== null) {
        setLiveDeltaMs(Math.max(0, Date.now() - segmentStartRef.current));
      }
    }, 100);

    const handleVisibility = () => {
      if (document.hidden && segmentStartRef.current !== null) {
        flushActiveStopwatchSegment(currentBlueprint.id);
      } else if (!document.hidden && shouldRunStopwatch && segmentStartRef.current === null) {
        segmentStartRef.current = Date.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(tick);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [currentBlueprint.id, flushActiveStopwatchSegment, shouldRunStopwatch]);

  const liveElapsedMs = baseElapsedMs + liveDeltaMs;

  const currentPersonalBestMs = useMemo(() => {
    if (currentBlueprint.isDailyBonus) {
      return progress.dailyChallenge.completedByDate[todayDateKey]?.bestTimeMs ?? null;
    }
    return progress.completedStages[currentBlueprint.id]?.bestTimeMs ?? null;
  }, [
    currentBlueprint.id,
    currentBlueprint.isDailyBonus,
    progress.completedStages,
    progress.dailyChallenge.completedByDate,
    todayDateKey,
  ]);

  // Keep latest progress in a ref for synchronous flush on tab close / app restart
  const latestProgressRef = useRef<PlayerProgress>(progress);
  useEffect(() => {
    latestProgressRef.current = progress;
    soundEngine.setMuted(progress.muted);
    savePlayerProgress(progress);
  }, [progress]);

  useEffect(() => {
    const handleUnload = () => {
      const snap = latestProgressRef.current;
      const extraDelta =
        segmentStartRef.current !== null
          ? Math.max(0, Date.now() - segmentStartRef.current)
          : 0;
      if (extraDelta > 0) {
        const cur = snap.inProgressStages[snap.currentBlueprintId];
        savePlayerProgress({
          ...snap,
          inProgressStages: {
            ...snap.inProgressStages,
            [snap.currentBlueprintId]: {
              placedPartIds: cur?.placedPartIds ?? [],
              mistakesCount: cur?.mistakesCount ?? 0,
              elapsedMs: (cur?.elapsedMs ?? 0) + extraDelta,
              updatedAt: Date.now(),
            },
          },
        });
      } else {
        savePlayerProgress(snap);
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, []);

  // Sync HTML lang & RTL/LTR direction dynamically
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Keyboard shortcut 'H' to toggle Zen 3D Dock collapse
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.key === 'h' || e.key === 'H') {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const flashStatus = useCallback((msg: string) => {
    setStatusMessage(msg);
    if (statusTimerRef.current) {
      window.clearTimeout(statusTimerRef.current);
    }
    statusTimerRef.current = window.setTimeout(() => {
      setStatusMessage(null);
    }, 4200);
  }, []);

  const handleSelectLanguage = useCallback((lang: LanguageCode) => {
    setStatusMessage(null);
    setProgress((p) => ({
      ...p,
      language: lang,
    }));
  }, []);

  const handleToggleTimerMode = useCallback(
    (explicitNext?: boolean) => {
      const nextEnabled =
        typeof explicitNext === 'boolean'
          ? explicitNext
          : !latestProgressRef.current.timerModeEnabled;
      setProgress((p) => ({
        ...p,
        timerModeEnabled: nextEnabled,
      }));
      flashStatus(nextEnabled ? t.timerEnabledToast : t.timerDisabledToast);
    },
    [flashStatus, t.timerDisabledToast, t.timerEnabledToast],
  );

  const handleSelectBlueprint = useCallback(
    (blueprintId: string) => {
      flushActiveStopwatchSegment(currentBlueprint.id);
      setTimerArmed(false);
      setLiveDeltaMs(0);
      setLastTimedResult(null);
      setProgress((p) => ({
        ...p,
        currentBlueprintId: blueprintId,
        lastStandardBlueprintId: blueprintId.startsWith('daily-')
          ? p.lastStandardBlueprintId
          : blueprintId,
        cameraPreset: CameraPreset.ISO,
      }));
      setStagedPartId(null);
      setActiveDragPartId(null);
      setHintPartId(null);
      setRecentUnlockedBadgeIds([]);
      setExplodedFactor(0);
      setCameraPresetNonce((n) => n + 1);
      setStatusMessage(null);
    },
    [currentBlueprint.id, flushActiveStopwatchSegment],
  );

  const handleStartTimedStage = useCallback(
    (blueprintId: string) => {
      segmentStartRef.current = null;
      setTimerArmed(false);
      setLiveDeltaMs(0);
      setLastTimedResult(null);
      setProgress((p) => ({
        ...p,
        timerModeEnabled: true,
        currentBlueprintId: blueprintId,
        lastStandardBlueprintId: blueprintId.startsWith('daily-')
          ? p.lastStandardBlueprintId
          : blueprintId,
        cameraPreset: CameraPreset.ISO,
        inProgressStages: {
          ...p.inProgressStages,
          [blueprintId]: {
            placedPartIds: [],
            mistakesCount: 0,
            elapsedMs: 0,
            updatedAt: Date.now(),
          },
        },
      }));
      setDockCollapsed(false);
      setStagedPartId(null);
      setActiveDragPartId(null);
      setHintPartId(null);
      setRecentUnlockedBadgeIds([]);
      setExplodedFactor(0);
      setCameraPresetNonce((n) => n + 1);
      flashStatus(t.timerEnabledToast);
    },
    [flashStatus, t.timerEnabledToast],
  );

  const handleStartDailyBuild = useCallback(
    (resetIfCompleted = false) => {
      flushActiveStopwatchSegment(currentBlueprint.id);
      const dailyId = todayDailyBundle.blueprint.id;
      setTimerArmed(false);
      setLiveDeltaMs(0);
      setLastTimedResult(null);
      setProgress((p) => {
        const existingInProg = p.inProgressStages[dailyId];
        const shouldReset =
          resetIfCompleted ||
          (existingInProg?.placedPartIds.length ?? 0) ===
            todayDailyBundle.blueprint.parts.length;

        return {
          ...p,
          currentBlueprintId: dailyId,
          lastStandardBlueprintId: p.currentBlueprintId.startsWith('daily-')
            ? p.lastStandardBlueprintId
            : p.currentBlueprintId,
          cameraPreset: CameraPreset.ISO,
          inProgressStages: shouldReset
            ? {
                ...p.inProgressStages,
                [dailyId]: {
                  placedPartIds: [],
                  mistakesCount: 0,
                  elapsedMs: 0,
                  updatedAt: Date.now(),
                },
              }
            : p.inProgressStages,
        };
      });
      setDockCollapsed(false);
      setStagedPartId(null);
      setActiveDragPartId(null);
      setHintPartId(null);
      setRecentUnlockedBadgeIds([]);
      setExplodedFactor(0);
      setCameraPresetNonce((n) => n + 1);
      setStatusMessage(null);
    },
    [
      currentBlueprint.id,
      flushActiveStopwatchSegment,
      todayDailyBundle.blueprint.id,
      todayDailyBundle.blueprint.parts.length,
    ],
  );

  const handleResetStage = useCallback(() => {
    segmentStartRef.current = null;
    setTimerArmed(false);
    setLiveDeltaMs(0);
    setLastTimedResult(null);
    setProgress((p) => ({
      ...p,
      cameraPreset: CameraPreset.ISO,
      inProgressStages: {
        ...p.inProgressStages,
        [currentBlueprint.id]: {
          placedPartIds: [],
          mistakesCount: 0,
          elapsedMs: 0,
          updatedAt: Date.now(),
        },
      },
    }));
    setStagedPartId(null);
    setActiveDragPartId(null);
    setHintPartId(null);
    setRecentUnlockedBadgeIds([]);
    setExplodedFactor(0);
    setCameraPresetNonce((n) => n + 1);
    flashStatus(t.stageResetMsg(currentBlueprint.name));
  }, [currentBlueprint.id, currentBlueprint.name, flashStatus, t]);

  const handlePartSnapped = useCallback(
    (partId: string) => {
      const alreadyPlaced = placedPartIds.includes(partId);
      if (alreadyPlaced) return;

      const updatedPlaced = [...placedPartIds, partId];
      const justCompleted = updatedPlaced.length === currentBlueprint.parts.length;

      if (!justCompleted) {
        setTimerArmed(true);
        setProgress((p) => {
          const cur = p.inProgressStages[currentBlueprint.id];
          return {
            ...p,
            inProgressStages: {
              ...p.inProgressStages,
              [currentBlueprint.id]: {
                placedPartIds: updatedPlaced,
                mistakesCount: cur?.mistakesCount ?? 0,
                elapsedMs: cur?.elapsedMs ?? 0,
                updatedAt: Date.now(),
              },
            },
          };
        });

        const snappedSpec = currentBlueprint.parts.find((p) => p.id === partId);
        if (snappedSpec) {
          flashStatus(t.partSnappedMsg(snappedSpec.name, snappedSpec.roleHint));
        }
      } else {
        // Capture exact final elapsed time for this stage run
        const segmentDelta =
          segmentStartRef.current !== null
            ? Math.max(0, Date.now() - segmentStartRef.current)
            : 0;
        segmentStartRef.current = null;
        setTimerArmed(false);
        setLiveDeltaMs(0);

        const prevSnap = latestProgressRef.current;
        const curStage = prevSnap.inProgressStages[currentBlueprint.id];
        const curMistakes = curStage?.mistakesCount ?? 0;
        const finalElapsedMs = Math.max(500, (curStage?.elapsedMs ?? 0) + segmentDelta);
        const twoStarLimit = Math.max(2, Math.floor(currentBlueprint.parts.length / 4));
        const stars = curMistakes === 0 ? 3 : curMistakes <= twoStarLimit ? 2 : 1;

        let nextSpeedRecords = prevSnap.speedrunRecords;
        let timedOutcome: TimedCompletionResult | null = null;

        if (prevSnap.timerModeEnabled) {
          const frBp = getLocalizedBlueprint(currentRawBlueprint, 'fr');
          const enBp = getLocalizedBlueprint(currentRawBlueprint, 'en');
          const arBp = getLocalizedBlueprint(currentRawBlueprint, 'ar');

          const newRecord: SpeedrunRecord = {
            id: `${currentBlueprint.id}-${Date.now()}`,
            blueprintId: currentBlueprint.id,
            stageNumber: currentBlueprint.stageNumber,
            category: currentBlueprint.category,
            tier: currentBlueprint.tier,
            partsCount: currentBlueprint.parts.length,
            timeMs: finalElapsedMs,
            mistakesCount: curMistakes,
            stars,
            achievedAt: Date.now(),
            isDailyBonus: Boolean(currentBlueprint.isDailyBonus),
            vehicleNameFr: frBp.name,
            vehicleNameEn: enBp.name,
            vehicleNameAr: arBp.name,
          };

          const speedRes = recordSpeedrunCompletion(prevSnap.speedrunRecords, newRecord);
          nextSpeedRecords = speedRes.updatedRecords;
          timedOutcome = {
            timeMs: finalElapsedMs,
            isNewRecord: speedRes.isNewPersonalBest,
            previousBestMs: speedRes.previousBestMs,
          };
        }

        setLastTimedResult(timedOutcome);

        if (currentBlueprint.isDailyBonus) {
          const { nextState: rawNextDaily } = recordDailyChallengeCompletion(
            prevSnap.dailyChallenge,
            todayDateKey,
            stars,
            todayDailyBundle.rareSpec.id,
            todayDailyBundle.templateId,
          );

          const prevDailyBest =
            prevSnap.dailyChallenge.completedByDate[todayDateKey]?.bestTimeMs;
          const nextDailyBest = prevSnap.timerModeEnabled
            ? prevDailyBest !== undefined
              ? Math.min(prevDailyBest, finalElapsedMs)
              : finalElapsedMs
            : prevDailyBest;

          const nextDailyState = {
            ...rawNextDaily,
            completedByDate: {
              ...rawNextDaily.completedByDate,
              [todayDateKey]: {
                ...rawNextDaily.completedByDate[todayDateKey],
                bestTimeMs: nextDailyBest,
              },
            },
          };

          const { updatedUnlocked, newlyUnlockedIds } = syncUnlockedBadgesMap(
            prevSnap.completedStages,
            prevSnap.unlockedBadges,
            nextDailyState,
            nextSpeedRecords,
          );

          setRecentUnlockedBadgeIds(newlyUnlockedIds);

          setProgress((p) => ({
            ...p,
            inProgressStages: {
              ...p.inProgressStages,
              [currentBlueprint.id]: {
                placedPartIds: updatedPlaced,
                mistakesCount: curMistakes,
                elapsedMs: finalElapsedMs,
                updatedAt: Date.now(),
              },
            },
            dailyChallenge: nextDailyState,
            speedrunRecords: nextSpeedRecords,
            unlockedBadges: updatedUnlocked,
          }));

          window.setTimeout(() => {
            soundEngine.playStageVictory();
            window.setTimeout(() => {
              soundEngine.playBadgeUnlocked();
            }, 420);
          }, 160);
        } else {
          const existing = prevSnap.completedStages[currentBlueprint.id];
          const bestStars = Math.max(existing?.stars ?? 0, stars);
          const bestMistakes =
            existing?.bestMistakes !== undefined
              ? Math.min(existing.bestMistakes, curMistakes)
              : curMistakes;
          const bestTimeMs = prevSnap.timerModeEnabled
            ? existing?.bestTimeMs !== undefined
              ? Math.min(existing.bestTimeMs, finalElapsedMs)
              : finalElapsedMs
            : existing?.bestTimeMs;

          const nextCompletedStages = {
            ...prevSnap.completedStages,
            [currentBlueprint.id]: {
              completed: true,
              stars: bestStars,
              bestMistakes,
              bestTimeMs,
              completedAt: Date.now(),
            },
          };

          const { updatedUnlocked, newlyUnlockedIds } = syncUnlockedBadgesMap(
            nextCompletedStages,
            prevSnap.unlockedBadges,
            prevSnap.dailyChallenge,
            nextSpeedRecords,
          );

          setRecentUnlockedBadgeIds(newlyUnlockedIds);

          setProgress((p) => ({
            ...p,
            inProgressStages: {
              ...p.inProgressStages,
              [currentBlueprint.id]: {
                placedPartIds: updatedPlaced,
                mistakesCount: curMistakes,
                elapsedMs: finalElapsedMs,
                updatedAt: Date.now(),
              },
            },
            completedStages: nextCompletedStages,
            speedrunRecords: nextSpeedRecords,
            unlockedBadges: updatedUnlocked,
          }));

          window.setTimeout(() => {
            soundEngine.playStageVictory();
            if (newlyUnlockedIds.length > 0 || timedOutcome?.isNewRecord) {
              window.setTimeout(() => {
                soundEngine.playBadgeUnlocked();
              }, 420);
            }
          }, 160);
        }

        window.setTimeout(() => {
          setDiscoveryOpen(true);
        }, 850);
      }

      setStagedPartId(null);
      setActiveDragPartId(null);
      setHintPartId((prev) => (prev === partId ? null : prev));
    },
    [
      currentBlueprint,
      currentRawBlueprint,
      flashStatus,
      placedPartIds,
      t,
      todayDailyBundle.rareSpec.id,
      todayDailyBundle.templateId,
      todayDateKey,
    ],
  );

  const handlePartDropRejected = useCallback(
    (reason: string) => {
      setTimerArmed(true);
      setProgress((p) => {
        const cur = p.inProgressStages[currentBlueprint.id];
        return {
          ...p,
          inProgressStages: {
            ...p.inProgressStages,
            [currentBlueprint.id]: {
              placedPartIds: cur?.placedPartIds ?? [],
              mistakesCount: (cur?.mistakesCount ?? 0) + 1,
              elapsedMs: cur?.elapsedMs ?? 0,
              updatedAt: Date.now(),
            },
          },
        };
      });
      flashStatus(reason);
    },
    [currentBlueprint.id, flashStatus],
  );

  const handleStartPartDrag = useCallback(
    (partId: string) => {
      soundEngine.playPickup(progress.preferredStyle);
      setTimerArmed(true);
      setStagedPartId(partId);
      setActiveDragPartId(partId);
      setExplodedFactor(0);
    },
    [progress.preferredStyle],
  );

  const handleClickPartCard = useCallback(
    (partId: string) => {
      setTimerArmed(true);
      setStagedPartId(partId);
      const spec = currentBlueprint.parts.find((p) => p.id === partId);
      if (spec) {
        const placedSet = new Set(placedPartIds);
        const missing = spec.dependsOn.find((d) => !placedSet.has(d));
        if (missing) {
          const missingName =
            currentBlueprint.parts.find((p) => p.id === missing)?.name ?? '';
          flashStatus(t.placeFirstMsg(missingName, spec.name));
        } else {
          flashStatus(t.partStagedMsg(spec.name));
        }
      }
    },
    [currentBlueprint.parts, flashStatus, placedPartIds, t],
  );

  const handleSelectStyle = useCallback((style: VisualStyleMode) => {
    setProgress((p) => ({ ...p, preferredStyle: style }));
  }, []);

  const handleSelectCamera = useCallback((preset: CameraPreset) => {
    setProgress((p) => ({ ...p, cameraPreset: preset }));
    setCameraPresetNonce((n) => n + 1);
  }, []);

  const handleGoNextStage = useCallback(() => {
    if (currentBlueprint.isDailyBonus) {
      const targetId =
        VEHICLE_BLUEPRINTS.find((b) => b.id === progress.lastStandardBlueprintId)?.id ??
        VEHICLE_BLUEPRINTS[0].id;
      handleSelectBlueprint(targetId);
      return;
    }
    if (hasNextStage) {
      handleSelectBlueprint(VEHICLE_BLUEPRINTS[currentIndex + 1].id);
    }
  }, [
    currentBlueprint.isDailyBonus,
    currentIndex,
    handleSelectBlueprint,
    hasNextStage,
    progress.lastStandardBlueprintId,
  ]);

  const handleOpenTour = useCallback(() => {
    setDockCollapsed(false);
    setCatalogOpen(false);
    setDailyModalOpen(false);
    setLeaderboardOpen(false);
    setProgressionOpen(false);
    setDiscoveryOpen(false);
    setTourStep(0);
    setTourOpen(true);
  }, []);

  const handleFinishTour = useCallback(() => {
    setTourOpen(false);
    setProgress((p) => (p.tutorialSeen ? p : { ...p, tutorialSeen: true }));
  }, []);

  const handleManualSave = useCallback(() => {
    savePlayerProgress(progress);
    flashStatus(t.progressSavedToast);
  }, [flashStatus, progress, t.progressSavedToast]);

  const handleExportSave = useCallback(() => {
    downloadProgressBackup(progress);
    flashStatus(t.progressSavedToast);
  }, [flashStatus, progress, t.progressSavedToast]);

  const handleImportSaveFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          const restored = sanitizeProgress(parsed);
          segmentStartRef.current = null;
          setTimerArmed(false);
          setLiveDeltaMs(0);
          setLastTimedResult(null);
          setProgress(restored);
          savePlayerProgress(restored);
          setStagedPartId(null);
          setActiveDragPartId(null);
          setHintPartId(null);
          setRecentUnlockedBadgeIds([]);
          setExplodedFactor(0);
          setCameraPresetNonce((n) => n + 1);
          flashStatus(UI_TRANSLATIONS[restored.language].progressImportedToast);
        } catch {
          flashStatus(t.progressImportErrorToast);
        }
      };
      reader.readAsText(file);
    },
    [flashStatus, t.progressImportErrorToast],
  );

  const handleClearLeaderboard = useCallback(() => {
    setLastTimedResult(null);
    setProgress((p) => {
      const cleanedCompleted = { ...p.completedStages };
      for (const [bpId, rec] of Object.entries(cleanedCompleted)) {
        if (rec.bestTimeMs !== undefined) {
          cleanedCompleted[bpId] = { ...rec, bestTimeMs: undefined };
        }
      }
      const cleanedDailyCompleted = { ...p.dailyChallenge.completedByDate };
      for (const [dKey, entry] of Object.entries(cleanedDailyCompleted)) {
        if (entry.bestTimeMs !== undefined) {
          cleanedDailyCompleted[dKey] = { ...entry, bestTimeMs: undefined };
        }
      }
      return {
        ...p,
        speedrunRecords: [],
        completedStages: cleanedCompleted,
        dailyChallenge: {
          ...p.dailyChallenge,
          completedByDate: cleanedDailyCompleted,
        },
      };
    });
  }, []);

  const handleResetAllProgress = useCallback(() => {
    segmentStartRef.current = null;
    setTimerArmed(false);
    setLiveDeltaMs(0);
    setLastTimedResult(null);
    const fresh = createDefaultProgress(language, true);
    setProgress(fresh);
    savePlayerProgress(fresh);
    setStagedPartId(null);
    setActiveDragPartId(null);
    setHintPartId(null);
    setRecentUnlockedBadgeIds([]);
    setExplodedFactor(0);
    setCameraPresetNonce((n) => n + 1);
    flashStatus(t.progressResetToast);
  }, [flashStatus, language, t.progressResetToast]);

  const firstReadyPart = useMemo(() => {
    const placedSet = new Set(placedPartIds);
    return (
      currentBlueprint.parts.find(
        (p) => !placedSet.has(p.id) && p.dependsOn.every((dep) => placedSet.has(dep)),
      ) ?? currentBlueprint.parts[0]
    );
  }, [currentBlueprint.parts, placedPartIds]);

  const effectiveHintPartId =
    hintPartId ?? (tourOpen && (tourStep === 0 || tourStep === 1) ? firstReadyPart?.id ?? null : null);

  const twoStarMaxMistakes = Math.max(2, Math.floor(currentBlueprint.parts.length / 4));
  const currentStars = currentBlueprint.isDailyBonus
    ? progress.dailyChallenge.completedByDate[todayDateKey]?.stars ??
      (mistakesCount === 0 ? 3 : mistakesCount <= twoStarMaxMistakes ? 2 : 1)
    : progress.completedStages[currentBlueprint.id]?.stars ??
      (mistakesCount === 0 ? 3 : mistakesCount <= twoStarMaxMistakes ? 2 : 1);

  const isDailyCompletedToday = Boolean(progress.dailyChallenge.completedByDate[todayDateKey]);
  const dailyInProgressCount =
    progress.inProgressStages[todayDailyBundle.blueprint.id]?.placedPartIds.length ?? 0;

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="flex flex-col w-full h-full bg-[#F4F6F9] text-slate-900 overflow-hidden"
    >
      {/* Top Bar with Daily Challenge + Stopwatch Leaderboard + FR / EN / العربية */}
      <TopBar
        language={language}
        onSelectLanguage={handleSelectLanguage}
        visualStyle={progress.preferredStyle}
        onSelectStyle={handleSelectStyle}
        onOpenCatalog={() => setCatalogOpen(true)}
        onOpenDailyChallenge={() => setDailyModalOpen(true)}
        isDailyCompletedToday={isDailyCompletedToday}
        isDailyActiveNow={Boolean(currentBlueprint.isDailyBonus)}
        timerModeEnabled={progress.timerModeEnabled}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenDiscovery={() => setDiscoveryOpen(true)}
        onOpenMechanicGuide={() => {
          setMechanicGuideOpen((open) => {
            const nextOpen = !open;
            if (nextOpen && firstReadyPart && !isCompleted) {
              setHintPartId(firstReadyPart.id);
            }
            return nextOpen;
          });
        }}
      />

      {/* Full-Viewport 100% Unobstructed 3D Center Stage */}
      <main className="relative flex-1 w-full overflow-hidden">
        <WorkshopCanvas
          language={language}
          blueprint={currentBlueprint}
          placedPartIds={placedPartIds}
          visualStyle={progress.preferredStyle}
          explodedFactor={explodedFactor}
          cameraPreset={progress.cameraPreset}
          cameraPresetNonce={cameraPresetNonce}
          activeDragPartId={activeDragPartId}
          stagedPartId={stagedPartId}
          hintPartId={effectiveHintPartId}
          onPartSnapped={handlePartSnapped}
          onPartDropRejected={handlePartDropRejected}
          onDragEndSignal={() => setActiveDragPartId(null)}
          onStartCanvasDrag={(partId) => {
            soundEngine.playPickup(progress.preferredStyle);
            setTimerArmed(true);
            setActiveDragPartId(partId);
          }}
        />
      </main>

      {/* Collapsible Unified Bottom Parts & Controls Dock */}
      <BottomPartsDock
        language={language}
        blueprint={currentBlueprint}
        totalStages={VEHICLE_BLUEPRINTS.length}
        placedPartIds={placedPartIds}
        stagedPartId={stagedPartId}
        activeDragPartId={activeDragPartId}
        hintPartId={effectiveHintPartId}
        collapsed={dockCollapsed}
        onToggleCollapse={() => setDockCollapsed((c) => !c)}
        explodedFactor={explodedFactor}
        onChangeExploded={setExplodedFactor}
        cameraPreset={progress.cameraPreset}
        onSelectCamera={handleSelectCamera}
        visualStyle={progress.preferredStyle}
        onSelectStyle={handleSelectStyle}
        muted={progress.muted}
        onToggleMute={() => setProgress((p) => ({ ...p, muted: !p.muted }))}
        timerModeEnabled={progress.timerModeEnabled}
        liveElapsedMs={liveElapsedMs}
        personalBestMs={currentPersonalBestMs}
        onToggleTimerMode={() => handleToggleTimerMode()}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onResetStage={handleResetStage}
        onSaveNow={handleManualSave}
        onStartPartDrag={handleStartPartDrag}
        onClickPartCard={handleClickPartCard}
        onOpenCatalog={() => setCatalogOpen(true)}
        onOpenVictoryModal={() => setDiscoveryOpen(true)}
        hasNextStage={hasNextStage}
        onGoNextStage={handleGoNextStage}
        onOpenTour={handleOpenTour}
        statusMessage={statusMessage}
      />

      {/* Stage Catalog & LocalStorage Save Management Modal */}
      <StageCatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        language={language}
        blueprints={localizedBlueprints}
        currentBlueprintId={currentBlueprint.id}
        progress={progress}
        visualStyle={progress.preferredStyle}
        onSelectStyle={handleSelectStyle}
        onSelectBlueprint={handleSelectBlueprint}
        onToggleFreeWorkshop={() =>
          setProgress((p) => ({ ...p, freeWorkshopUnlocked: !p.freeWorkshopUnlocked }))
        }
        unlockedBadgesCount={progressionSummary.unlockedCount}
        totalBadgesCount={progressionSummary.badges.length}
        onOpenProgression={() => {
          setCatalogOpen(false);
          setProgressionOpen(true);
        }}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        dailyVehicleName={localizedDailyBlueprint.name}
        dailyRarePartName={todayDailyBundle.rareSpec.name[language]}
        isDailyCompletedToday={isDailyCompletedToday}
        onOpenDailyChallenge={() => setDailyModalOpen(true)}
        onSaveNow={handleManualSave}
        onExportSave={handleExportSave}
        onImportSaveFile={handleImportSaveFile}
        onResetAllProgress={handleResetAllProgress}
      />

      {/* Daily Mechanical Challenge & Rare Collector Parts Vault Modal */}
      <DailyChallengeModal
        isOpen={dailyModalOpen}
        onClose={() => setDailyModalOpen(false)}
        language={language}
        todayDateKey={todayDateKey}
        dailyBlueprint={localizedDailyBlueprint}
        todayRareSpec={todayDailyBundle.rareSpec}
        dailyState={progress.dailyChallenge}
        isCurrentlyOnWorkbench={Boolean(currentBlueprint.isDailyBonus)}
        inProgressPartCount={dailyInProgressCount}
        onStartDailyBuild={handleStartDailyBuild}
      />

      {/* Optional Stopwatch Mode & Local Best-Times Leaderboard Modal */}
      <SpeedLeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        language={language}
        timerModeEnabled={progress.timerModeEnabled}
        onToggleTimerMode={(nextEnabled) => handleToggleTimerMode(nextEnabled)}
        records={progress.speedrunRecords}
        localizedBlueprints={localizedBlueprints}
        currentBlueprint={currentBlueprint}
        onStartTimedStage={handleStartTimedStage}
        onClearLeaderboard={handleClearLeaderboard}
      />

      {/* Progression & Achievement Badges Modal (Accessible from Catalog & Victory Screen) */}
      <ProgressionModal
        isOpen={progressionOpen}
        onClose={() => setProgressionOpen(false)}
        onBackToCatalog={() => {
          setProgressionOpen(false);
          setCatalogOpen(true);
        }}
        language={language}
        progression={progressionSummary}
      />

      {/* 100% Local Offline Mechanical Hint & Assembly Plan Drawer */}
      <MechanicHintDrawer
        isOpen={mechanicGuideOpen}
        onClose={() => setMechanicGuideOpen(false)}
        language={language}
        blueprint={currentBlueprint}
        placedPartIds={placedPartIds}
        hintPartId={effectiveHintPartId}
        onHighlightHintPart={(partId) => setHintPartId(partId)}
      />

      {/* Local Offline Encyclopedic Discovery & Victory Modal */}
      <DiscoveryModal
        isOpen={discoveryOpen}
        onClose={() => setDiscoveryOpen(false)}
        language={language}
        blueprint={currentBlueprint}
        isCompleted={isCompleted}
        starsEarned={currentStars}
        newlyUnlockedBadges={newlyUnlockedBadges}
        rareRewardSpec={currentBlueprint.isDailyBonus ? todayDailyBundle.rareSpec : null}
        onOpenDailyVault={() => setDailyModalOpen(true)}
        timedResult={progress.timerModeEnabled ? lastTimedResult : null}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onRetryTimedRun={() => handleStartTimedStage(currentBlueprint.id)}
        onOpenProgression={() => setProgressionOpen(true)}
        hasNextStage={hasNextStage}
        onNextStage={handleGoNextStage}
      />

      {/* Automatic Interactive Guided Tour ("Tour du Propriétaire" / "Guided Tour" / "جولة تعريفية") */}
      <GuidedTourOverlay
        isOpen={tourOpen}
        language={language}
        firstPartName={firstReadyPart?.name ?? ''}
        vehicleName={currentBlueprint.name}
        hasSnappedAnyPart={placedPartIds.length > 0}
        onStepChange={(idx) => {
          setTourStep(idx);
          if (idx <= 2) {
            setDockCollapsed(false);
          }
        }}
        onFinish={handleFinishTour}
      />
    </div>
  );
}
