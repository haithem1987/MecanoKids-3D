import { getWorkshopInstruction } from './utils/workshopInstruction';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { track } from './utils/stemAnalytics';
import { isAssemblyComplete } from './utils/assemblyValidation';
import { evaluatePlayerProgression, syncUnlockedBadgesMap } from './data/badges';
import { resolveEntitlements } from './utils/entitlements';
import { VEHICLE_BLUEPRINTS } from './data/blueprints';
import {
  buildDailyBlueprintForDate,
  getTodayDateKey,
  recordDailyChallengeCompletion,
} from './data/dailyChallenges';
import {
  DIAGNOSTIC_NARRATION,
  getLocalizedBlueprint,
  getLocalizedBlueprints,
  UI_TRANSLATIONS,
} from './i18n/translations';
import {
  AgeProfile,
  CameraPreset,
  DailyLimitMinutesOption,
  LanguageCode,
  LiveryPresetId,
  MultiProfileStore,
  PlayerProfile,
  PlayerProgress,
  ProfileAvatarColor,
  ProfileAvatarIcon,
  SpeedrunRecord,
  VisualStyleMode,
} from './types/game';
import { getMasterPartSnapMultiplier, getSnapMultiplier } from './utils/ageProfile';
import {
  getEffectiveDailyStreak,
  recordDailyEngagement,
} from './utils/dailyStreak';
import { createDiagnosticMission } from './utils/diagnosticMode';
import { ADULT_SESSION_TTL_MS } from './utils/parentalGate';
import { useOnlineStatus } from './utils/pwa';
import { evaluateGentleTimerStatus } from './utils/sessionTimer';
import { recordSpeedrunCompletion } from './utils/speedrun';
import { speechEngine } from './utils/speech';
import {
  createDefaultProgress,
  createNewPlayerProfile,
  downloadProgressBackup,
  loadMultiProfileStore,
  MAX_LOCAL_PROFILES,
  sanitizeProgress,
  saveMultiProfileStore,
} from './utils/storage';
import { soundEngine } from './audio/soundEngine';
import { useServiceWorkerUpdate } from './utils/pwa';
import { TopBar } from './components/TopBar';
import { WorkshopCanvas } from './components/WorkshopCanvas';
import { WorkshopHud } from './components/WorkshopHud';
import { StageCatalogModal } from './components/StageCatalogModal';
import { VirtualLabMission } from './components/VirtualLabMission';
import { OCTO_VICTORY_DURATION_MS, OctoSurprise } from './components/OctoSurprise';
import { DRAWBRIDGE_ID } from './components/DrawbridgeTrial';
import { ScienceChallengeMission } from './components/ScienceChallengeMission';
import { applyScienceAction, getScienceChallenges, type ScienceTrial } from './data/scienceChallenges';
import type { VirtualLabTrial } from './data/virtualLabs';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { SpeedLeaderboardModal } from './components/SpeedLeaderboardModal';
import { ProgressionModal } from './components/ProgressionModal';
import { ProfilesModal } from './components/ProfilesModal';
import { MechanicHintDrawer } from './components/MechanicHintDrawer';
import { DiscoveryModal, TimedCompletionResult } from './components/DiscoveryModal';
import { StudioCustomizeModal } from './components/StudioCustomizeModal';
import { GarageModal } from './components/GarageModal';
import { QuizModal } from './components/QuizModal';
import { StreakModal } from './components/StreakModal';
import { ParentalGateModal } from './components/ParentalGateModal';
import { ParentSpaceModal } from './components/ParentSpaceModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { GentleSessionCurtain } from './components/GentleSessionCurtain';
import { GuidedTourOverlay } from './components/GuidedTourOverlay';
import { DiagnosticTutorialOverlay } from './components/DiagnosticTutorialOverlay';
import { LandingPage } from './components/LandingPage';
import { AgeProfileSelector } from './components/AgeProfileSelector';
import { OnboardingModal } from './components/OnboardingModal';
import { UpgradeModal } from './components/UpgradeModal';
import { LicenseActivationModal } from './components/LicenseActivationModal';
import { canPlayStage, freeTrialExhausted, isUnlocked } from './utils/entitlements';
import { localAdminActive } from './utils/localAdmin';

interface ActiveDiagnosticSession {
  blueprintId: string;
  placedPartIds: string[];
  faultyPartIds: string[];
  seed: number;
}

const LANDING_SEEN_KEY = 'mkids_landing_seen';
const ONBOARDING_DONE_KEY = 'mkids_onboarding_v1';

export default function App() {
  const { needsRefresh, applyUpdate } = useServiceWorkerUpdate();

  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    () => !localAdminActive && !localStorage.getItem(ONBOARDING_DONE_KEY),
  );
  const [showLanding, setShowLanding] = useState<boolean>(
    () => !localAdminActive && !localStorage.getItem(LANDING_SEEN_KEY),
  );
  const [profileStore, setProfileStore] = useState<MultiProfileStore>(loadMultiProfileStore);
  const [todayDateKey, setTodayDateKey] = useState<string>(() => getTodayDateKey());
  const isOnline = useOnlineStatus();

  const activeProfile: PlayerProfile = useMemo(() => {
    return (
      profileStore.profiles.find((p) => p.id === profileStore.activeProfileId) ??
      profileStore.profiles[0]
    );
  }, [profileStore]);

  const progress = activeProfile.progress;

  // TODO: pass entitlements to gating components when Lot V UI lands
  const _entitlements = useMemo(
    () => resolveEntitlements(progress.licenseState),
    [progress.licenseState],
  );

  const setProgress = useCallback(
    (updater: PlayerProgress | ((prev: PlayerProgress) => PlayerProgress)) => {
      setProfileStore((store) => {
        const idx = store.profiles.findIndex((p) => p.id === store.activeProfileId);
        const targetIndex = idx >= 0 ? idx : 0;
        const currentProf = store.profiles[targetIndex];
        if (!currentProf) return store;

        const nextProgress =
          typeof updater === 'function' ? updater(currentProf.progress) : updater;
        if (nextProgress === currentProf.progress) return store;

        const now = Date.now();
        const updatedProfile: PlayerProfile = {
          ...currentProf,
          updatedAt: now,
          progress: {
            ...nextProgress,
            lastSavedAt: now,
          },
        };
        const nextProfiles = [...store.profiles];
        nextProfiles[targetIndex] = updatedProfile;
        return {
          ...store,
          profiles: nextProfiles,
        };
      });
    },
    [],
  );

  const [stagedPartId, setStagedPartId] = useState<string | null>(null);
  const [activeDragPartId, setActiveDragPartId] = useState<string | null>(null);
  const [hintPartId, setHintPartId] = useState<string | null>(null);
  const [explodedFactor, setExplodedFactor] = useState<number>(0);
  const [cameraPresetNonce, setCameraPresetNonce] = useState<number>(0);
  const effectiveTrayPosition = progress.partsTrayPosition === 'right' ? 'right' as const : 'left' as const;



  // Axe 1, 2 & 3 interactive states
  const [xRayMode, setXRayMode] = useState<boolean>(false);
  const [testDriveActive, setTestDriveActive] = useState<boolean>(false);
  const [labTrial, setLabTrial] = useState<VirtualLabTrial>();
  const [scienceTrial, setScienceTrial] = useState<ScienceTrial>();
  const startScienceTrial = useCallback((trial: ScienceTrial | undefined) => {
    setScienceTrial(trial);
  }, []);
  const handleScienceAction = useCallback((value: number) => {
    setScienceTrial(previous => previous && applyScienceAction(previous, value));
  }, []);
  const [studioOpen, setStudioOpen] = useState<boolean>(false);
  const [garageOpen, setGarageOpen] = useState<boolean>(false);
  const [quizOpen, setQuizOpen] = useState<boolean>(false);
  const [diagnosticSession, setDiagnosticSession] =
    useState<ActiveDiagnosticSession | null>(null);
  const diagnosticSeedCounterRef = useRef<number>(0);
  const snapshotCaptureRef = useRef<(() => string | null) | null>(null);
  const cleanNoSilhouetteRunRef = useRef<boolean>(Boolean(activeProfile.progress.noSilhouetteMode));

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const statusTimerRef = useRef<number | null>(null);

  // Modals, Profiles, Daily Challenge, Streak, Leaderboard, Progression, Guide Drawer & Guided Tour
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [upgradeReason, setUpgradeReason] = useState<'stages' | 'profiles' | 'liveries'>('stages');
  const [licenseActivationOpen, setLicenseActivationOpen] = useState<boolean>(false);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const [catalogOpen, setCatalogOpen] = useState<boolean>(localAdminActive);
  const [streakModalOpen, setStreakModalOpen] = useState<boolean>(false);
  const [dailyModalOpen, setDailyModalOpen] = useState<boolean>(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState<boolean>(false);
  const [progressionOpen, setProgressionOpen] = useState<boolean>(false);
  const [mechanicGuideOpen, setMechanicGuideOpen] = useState<boolean>(false);
  const [discoveryOpen, setDiscoveryOpen] = useState<boolean>(false);
  const [parentalGateOpen, setParentalGateOpen] = useState<boolean>(false);
  const [parentSpaceOpen, setParentSpaceOpen] = useState<boolean>(false);
  const [teacherDashboardOpen, setTeacherDashboardOpen] = useState<boolean>(false);
  const [parentSpaceInitialTab, setParentSpaceInitialTab] = useState<'stem' | 'timer' | 'diplomas'>('stem');
  const [graceElapsedSeconds, setGraceElapsedSeconds] = useState<number>(0);
  const adultSessionExpiresRef = useRef<number>(0);
  const pendingAdultActionRef = useRef<(() => void) | null>(null);
  const [recentUnlockedBadgeIds, setRecentUnlockedBadgeIds] = useState<string[]>([]);
  const [lastTimedResult, setLastTimedResult] = useState<TimedCompletionResult | null>(null);
  const [tourOpen, setTourOpen] = useState<boolean>(() => !localAdminActive && !activeProfile.progress.tutorialSeen);
  const [tourStep, setTourStep] = useState<number>(0);
  const [diagTutorialOpen, setDiagTutorialOpen] = useState<boolean>(false);

  // Live Stopwatch state (tracks active assembly delta on top of persisted elapsedMs)
  const [timerArmed, setTimerArmed] = useState<boolean>(false);
  const [liveDeltaMs, setLiveDeltaMs] = useState<number>(0);
  const segmentStartRef = useRef<number | null>(null);
  const undoStackRef = useRef<string[][]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const lastInteractionRef = useRef<number>(Date.now());


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

  const currentBlueprint = useMemo(() => {
    const bp = getLocalizedBlueprint(currentRawBlueprint, language);
    const mult = getSnapMultiplier(progress.ageProfile);
    if (mult === 1) return bp;
    return {
      ...bp,
      parts: bp.parts.map(p => ({
        ...p,
        snapRadius: p.snapRadius * mult * (bp.masterExpansion ? getMasterPartSnapMultiplier(progress.ageProfile, p) : 1),
      })),
    };
  }, [currentRawBlueprint, language, progress.ageProfile]);

  const progressionSummary = useMemo(
    () =>
      evaluatePlayerProgression(
        progress.completedStages,
        progress.unlockedBadges,
        language,
        progress.dailyChallenge,
        progress.speedrunRecords,
        progress.dailyStreak,
      ),
    [
      progress.completedStages,
      progress.unlockedBadges,
      progress.dailyChallenge,
      progress.speedrunRecords,
      progress.dailyStreak,
      language,
    ],
  );

  const newlyUnlockedBadges = useMemo(
    () =>
      progressionSummary.badges.filter((b) => recentUnlockedBadgeIds.includes(b.id)),
    [progressionSummary.badges, recentUnlockedBadgeIds],
  );

  const currentStageState = progress.inProgressStages[currentBlueprint.id];
  const standardPlacedPartIds = useMemo(
    () => currentStageState?.placedPartIds ?? [],
    [currentStageState],
  );

  const activeDiagnostic =
    diagnosticSession && diagnosticSession.blueprintId === currentBlueprint.id
      ? diagnosticSession
      : null;

  const effectivePlacedPartIds = activeDiagnostic
    ? activeDiagnostic.placedPartIds
    : standardPlacedPartIds;

  const effectiveFaultyPartIds = useMemo(
    () => (activeDiagnostic ? activeDiagnostic.faultyPartIds : []),
    [activeDiagnostic],
  );

  const mistakesCount = currentStageState?.mistakesCount ?? 0;
  const baseElapsedMs = currentStageState?.elapsedMs ?? 0;
  const isCompleted = !activeDiagnostic && isAssemblyComplete(currentBlueprint, standardPlacedPartIds);
  const activeLabTrial = isCompleted && labTrial?.id === currentBlueprint.virtualLab ? labTrial : undefined;
  const scienceChallenges = getScienceChallenges(currentBlueprint.id);
  const activeScienceTrial = isCompleted && scienceTrial?.blueprintId === currentBlueprint.id ? scienceTrial : undefined;
  useEffect(() => {
    setLabTrial(undefined);
    setScienceTrial(undefined);
  }, [currentBlueprint.id, isCompleted]);

  // Keep No-Silhouette clean-run tracker synchronized when starting fresh at 0 parts
  // Handle Stripe checkout return (?checkout=success&session_id=cs_xxx)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('checkout');
    const sessionId = params.get('session_id');
    if (status !== 'success' || !sessionId) return;
    // Clean URL immediately
    window.history.replaceState({}, '', window.location.pathname);
    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data: { tier?: string; licenseKey?: string }) => {
        if (data.tier === 'family' || data.tier === 'school') {
          setProgress((prev) => ({
            ...prev,
            licenseState: { tier: data.tier as 'family' | 'school' },
          }));
          setStatusMessage(
            data.tier === 'family'
              ? '🎉 Pass Famille activé ! Bonne construction !'
              : '🎉 Licence École activée !',
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (standardPlacedPartIds.length === 0) {
      cleanNoSilhouetteRunRef.current = Boolean(progress.noSilhouetteMode);
    } else if (!progress.noSilhouetteMode) {
      cleanNoSilhouetteRunRef.current = false;
    }
  }, [currentBlueprint.id, progress.noSilhouetteMode, standardPlacedPartIds.length]);

  // Auto-hint after 20s of inactivity
  useEffect(() => {
    const id = window.setInterval(() => {
      if (isCompleted || activeDiagnostic || hintPartId) return;
      if (Date.now() - lastInteractionRef.current >= 20_000) {
        const nextPart = currentBlueprint.parts.find((p) => !standardPlacedPartIds.includes(p.id));
        if (nextPart) {
          setHintPartId(nextPart.id);
          track('hint_requested', { blueprintId: currentBlueprint.id, trigger: 'inactivity' });
        }
      }
    }, 5_000);
    return () => window.clearInterval(id);
  }, [activeDiagnostic, currentBlueprint.id, currentBlueprint.parts, hintPartId, isCompleted, standardPlacedPartIds]);

  const currentIndex = useMemo(
    () => VEHICLE_BLUEPRINTS.findIndex((b) => b.id === currentBlueprint.id),
    [currentBlueprint.id],
  );
  const hasNextStage = currentIndex >= 0 && currentIndex < VEHICLE_BLUEPRINTS.length - 1;

  const gentleTimerStatus = useMemo(
    () =>
      evaluateGentleTimerStatus({
        settings: profileStore.parentalSettings,
        todayKey: todayDateKey,
        currentPlacedCount: effectivePlacedPartIds.length,
        currentTotalParts: currentBlueprint.parts.length,
        graceElapsedSeconds,
      }),
    [
      currentBlueprint.parts.length,
      effectivePlacedPartIds.length,
      graceElapsedSeconds,
      profileStore.parentalSettings,
      todayDateKey,
    ],
  );

  // Reset assembly grace counter whenever budget is positive or vehicle changes/completes
  useEffect(() => {
    if (
      gentleTimerStatus.remainingSeconds === null ||
      gentleTimerStatus.remainingSeconds > 0 ||
      effectivePlacedPartIds.length === 0 ||
      effectivePlacedPartIds.length >= currentBlueprint.parts.length
    ) {
      if (graceElapsedSeconds !== 0) {
        setGraceElapsedSeconds(0);
      }
    }
  }, [
    currentBlueprint.id,
    currentBlueprint.parts.length,
    effectivePlacedPartIds.length,
    gentleTimerStatus.remainingSeconds,
    graceElapsedSeconds,
  ]);

  // 1-second Gentle Session Timer tick (pauses in Adult views, hidden tabs, or once curtain is closed)
  useEffect(() => {
    if (parentalGateOpen || parentSpaceOpen || gentleTimerStatus.shouldShowCurtain) {
      return;
    }

    const tick = window.setInterval(() => {
      if (document.hidden) return;

      if (gentleTimerStatus.isInAssemblyGrace) {
        setGraceElapsedSeconds((prev) => prev + 1);
      }

      setProfileStore((store) => {
        const cur = store.parentalSettings;
        const isSameDay = cur.consumedDateKey === todayDateKey;
        const nextConsumed = isSameDay ? cur.consumedTodaySeconds + 1 : 1;
        const nextExtra = isSameDay ? cur.extraGrantedMinutesToday : 0;
        return {
          ...store,
          parentalSettings: {
            ...cur,
            consumedDateKey: todayDateKey,
            consumedTodaySeconds: nextConsumed,
            extraGrantedMinutesToday: nextExtra,
          },
        };
      });
    }, 1000);

    return () => window.clearInterval(tick);
  }, [
    gentleTimerStatus.isInAssemblyGrace,
    gentleTimerStatus.shouldShowCurtain,
    parentSpaceOpen,
    parentalGateOpen,
    todayDateKey,
  ]);

  const anyOverlayOpen =
    profilesOpen ||
    catalogOpen ||
    streakModalOpen ||
    dailyModalOpen ||
    leaderboardOpen ||
    progressionOpen ||
    mechanicGuideOpen ||
    discoveryOpen ||
    studioOpen ||
    garageOpen ||
    quizOpen ||
    parentalGateOpen ||
    parentSpaceOpen ||
    gentleTimerStatus.shouldShowCurtain ||
    tourOpen;

  const shouldRunStopwatch =
    !isCompleted &&
    !activeDiagnostic &&
    !anyOverlayOpen &&
    (standardPlacedPartIds.length > 0 || timerArmed || baseElapsedMs > 0);

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
    [setProgress],
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

  // Keep latest store & progress in refs for synchronous flush on tab close / app restart
  const latestStoreRef = useRef<MultiProfileStore>(profileStore);
  const latestProgressRef = useRef<PlayerProgress>(progress);
  useEffect(() => {
    latestStoreRef.current = profileStore;
    latestProgressRef.current = progress;
    soundEngine.setMuted(progress.muted || progress.classroomSilent);
    soundEngine.setVolumeSfx(progress.volumeSfx ?? 1);
    speechEngine.setVoiceVolume(progress.muted || progress.classroomSilent ? 0 : (progress.volumeVoice ?? 1));
    saveMultiProfileStore(profileStore);
  }, [profileStore, progress]);

  // Speak blueprint name on mission start in guided mode
  useEffect(() => {
    const p = latestProgressRef.current;
    if (!p.voiceAutoRead || p.muted) return;
    const name = currentBlueprint.name;
    speechEngine.speak(`mission-start-${currentBlueprint.id}`, name, language);
  }, [currentBlueprint.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const persistCurrentSession = useCallback(() => {
    const storeSnap = latestStoreRef.current;
    const extraDelta =
      segmentStartRef.current !== null
        ? Math.max(0, Date.now() - segmentStartRef.current)
        : 0;
    if (extraDelta > 0) {
      const nextProfiles = storeSnap.profiles.map((prof) => {
        if (prof.id !== storeSnap.activeProfileId) return prof;
        const bpId = prof.progress.currentBlueprintId;
        const cur = prof.progress.inProgressStages[bpId];
        return {
          ...prof,
          updatedAt: Date.now(),
          progress: {
            ...prof.progress,
            inProgressStages: {
              ...prof.progress.inProgressStages,
              [bpId]: {
                placedPartIds: cur?.placedPartIds ?? [],
                mistakesCount: cur?.mistakesCount ?? 0,
                elapsedMs: (cur?.elapsedMs ?? 0) + extraDelta,
                updatedAt: Date.now(),
              },
            },
          },
        };
      });
      return saveMultiProfileStore({
        ...storeSnap,
        profiles: nextProfiles,
      });
    }
    return saveMultiProfileStore(storeSnap);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', persistCurrentSession);
    window.addEventListener('pagehide', persistCurrentSession);
    return () => {
      window.removeEventListener('beforeunload', persistCurrentSession);
      window.removeEventListener('pagehide', persistCurrentSession);
    };
  }, [persistCurrentSession]);

  const canAutoUpdate = !anyOverlayOpen && !shouldRunStopwatch && !activeDragPartId && !stagedPartId
    && !activeScienceTrial && !activeLabTrial && !activeDiagnostic;
  useEffect(() => {
    if (!needsRefresh || !canAutoUpdate) return;
    const update = () => {
      if (!document.hidden) applyUpdate(persistCurrentSession);
    };
    document.addEventListener('visibilitychange', update);
    const retry = window.setInterval(update, 5000);
    update();
    return () => {
      document.removeEventListener('visibilitychange', update);
      window.clearInterval(retry);
    };
  }, [needsRefresh, canAutoUpdate, applyUpdate, persistCurrentSession]);

  // Sync HTML lang & RTL/LTR direction dynamically
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const flashStatus = useCallback((msg: string) => {
    setStatusMessage(msg);
    if (statusTimerRef.current) {
      window.clearTimeout(statusTimerRef.current);
    }
    statusTimerRef.current = window.setTimeout(() => {
      setStatusMessage(null);
    }, 4200);
  }, []);

  const resetTransientWorkbenchState = useCallback(() => {
    segmentStartRef.current = null;
    setTimerArmed(false);
    setLiveDeltaMs(0);
    setLastTimedResult(null);
    setStagedPartId(null);
    setActiveDragPartId(null);
    setHintPartId(null);
    setRecentUnlockedBadgeIds([]);
    setExplodedFactor(0);
    setTestDriveActive(false);
    setDiagnosticSession(null);
    setCameraPresetNonce((n) => n + 1);
  }, []);

  // Multi-Profile Handlers
  const handleSelectProfile = useCallback(
    (profileId: string) => {
      flushActiveStopwatchSegment(currentBlueprint.id);
      speechEngine.stop();
      const targetProfile = latestStoreRef.current.profiles.find((p) => p.id === profileId);
      if (!targetProfile) return;

      resetTransientWorkbenchState();
      setProfileStore((store) => ({
        ...store,
        activeProfileId: profileId,
      }));
      setTourOpen(!targetProfile.progress.tutorialSeen);
      const targetLang = targetProfile.progress.language;
      flashStatus(UI_TRANSLATIONS[targetLang].profileSwitchedToast(targetProfile.name));
    },
    [currentBlueprint.id, flushActiveStopwatchSegment, flashStatus, resetTransientWorkbenchState],
  );

  const handleCreateProfile = useCallback(
    (name: string, avatarColor: ProfileAvatarColor, avatarIcon: ProfileAvatarIcon) => {
      flushActiveStopwatchSegment(currentBlueprint.id);
      speechEngine.stop();
      const currentCount = latestStoreRef.current.profiles.length;
      if (currentCount >= MAX_LOCAL_PROFILES) return;

      const newProf = createNewPlayerProfile({
        name,
        avatarColor,
        avatarIcon,
        language,
        index: currentCount + 1,
      });

      resetTransientWorkbenchState();
      setProfileStore((store) => ({
        ...store,
        activeProfileId: newProf.id,
        profiles: [...store.profiles, newProf],
      }));
      setProfilesOpen(false);
      setTourOpen(!newProf.progress.tutorialSeen);
      flashStatus(t.profileCreatedToast(newProf.name));
    },
    [
      currentBlueprint.id,
      flushActiveStopwatchSegment,
      flashStatus,
      language,
      resetTransientWorkbenchState,
      t,
    ],
  );

  const handleUpdateProfileMeta = useCallback(
    (
      profileId: string,
      name: string,
      avatarColor: ProfileAvatarColor,
      avatarIcon: ProfileAvatarIcon,
    ) => {
      setProfileStore((store) => ({
        ...store,
        profiles: store.profiles.map((prof) => {
          if (prof.id !== profileId) return prof;
          const cleanName = name.trim().slice(0, 28) || prof.name;
          return {
            ...prof,
            name: cleanName,
            avatarColor,
            avatarIcon,
            updatedAt: Date.now(),
          };
        }),
      }));
    },
    [],
  );

  const handleDeleteProfile = useCallback(
    (profileId: string) => {
      const storeSnap = latestStoreRef.current;
      if (storeSnap.profiles.length <= 1) return;
      const deletedProf = storeSnap.profiles.find((p) => p.id === profileId);
      const remaining = storeSnap.profiles.filter((p) => p.id !== profileId);
      if (remaining.length === 0) return;

      const deletingActive = storeSnap.activeProfileId === profileId;
      if (deletingActive) {
        speechEngine.stop();
        resetTransientWorkbenchState();
      }

      const nextActiveId = deletingActive ? remaining[0].id : storeSnap.activeProfileId;
      setProfileStore((store) => ({
        ...store,
        activeProfileId: nextActiveId,
        profiles: remaining,
      }));

      if (deletedProf) {
        flashStatus(t.profileDeletedToast(deletedProf.name));
      }
    },
    [flashStatus, resetTransientWorkbenchState, t],
  );

  // Lot A: Adult Verification Gate & Parent Space Handlers
  const requireAdultVerification = useCallback((action: () => void) => {
    if (Date.now() < adultSessionExpiresRef.current) {
      action();
      return;
    }
    pendingAdultActionRef.current = action;
    setParentalGateOpen(true);
  }, []);

  const handleParentalGateVerified = useCallback(() => {
    adultSessionExpiresRef.current = Date.now() + ADULT_SESSION_TTL_MS;
    setParentalGateOpen(false);
    const nextAction = pendingAdultActionRef.current;
    pendingAdultActionRef.current = null;
    if (nextAction) {
      nextAction();
    } else {
      setParentSpaceOpen(true);
    }
  }, []);

  const handleOpenParentSpace = useCallback(
    (tab: 'stem' | 'timer' | 'diplomas' = 'stem') => {
      requireAdultVerification(() => {
        setParentSpaceInitialTab(tab);
        setParentSpaceOpen(true);
      });
    },
    [requireAdultVerification],
  );

  const handleCloseParentSpace = useCallback(() => {
    // Revoke adult session immediately upon returning to child workbench
    adultSessionExpiresRef.current = 0;
    setParentSpaceOpen(false);
  }, []);

  const handleChangeDailyLimit = useCallback(
    (limit: DailyLimitMinutesOption | null) => {
      setGraceElapsedSeconds(0);
      setProfileStore((store) => ({
        ...store,
        parentalSettings: {
          ...store.parentalSettings,
          dailyLimitMinutes: limit,
          consumedDateKey: todayDateKey,
        },
      }));
      flashStatus(t.parentTimerSavedToast);
    },
    [flashStatus, t.parentTimerSavedToast, todayDateKey],
  );

  const handleExtendToday15Min = useCallback(() => {
    setGraceElapsedSeconds(0);
    setProfileStore((store) => ({
      ...store,
      parentalSettings: {
        ...store.parentalSettings,
        consumedDateKey: todayDateKey,
        extraGrantedMinutesToday:
          (store.parentalSettings.consumedDateKey === todayDateKey
            ? store.parentalSettings.extraGrantedMinutesToday
            : 0) + 15,
      },
    }));
    flashStatus(t.parentTimerExtendedToast);
  }, [flashStatus, t.parentTimerExtendedToast, todayDateKey]);

  const handleResetTodayTimer = useCallback(() => {
    setGraceElapsedSeconds(0);
    setProfileStore((store) => ({
      ...store,
      parentalSettings: {
        ...store.parentalSettings,
        consumedDateKey: todayDateKey,
        consumedTodaySeconds: 0,
        extraGrantedMinutesToday: 0,
      },
    }));
    flashStatus(t.parentTimerSavedToast);
  }, [flashStatus, t.parentTimerSavedToast, todayDateKey]);

  const handleSelectLanguage = useCallback(
    (lang: LanguageCode) => {
      speechEngine.stop();
      setStatusMessage(null);
      setProgress((p) => ({
        ...p,
        language: lang,
      }));
    },
    [setProgress],
  );

  const handleToggleVoiceAutoRead = useCallback(
    (explicitNext?: boolean) => {
      const nextVal =
        typeof explicitNext === 'boolean'
          ? explicitNext
          : !latestProgressRef.current.voiceAutoRead;
      if (!nextVal) {
        speechEngine.stop();
      }
      setProgress((p) => ({
        ...p,
        voiceAutoRead: nextVal,
      }));
      flashStatus(nextVal ? t.voiceAutoEnabledToast : t.voiceAutoDisabledToast);
    },
    [flashStatus, setProgress, t.voiceAutoDisabledToast, t.voiceAutoEnabledToast],
  );

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
    [flashStatus, setProgress, t.timerDisabledToast, t.timerEnabledToast],
  );

  // Axe 1: 3D Test Drive, X-Ray Cutaway & Thematic Environment Handlers
  const handleToggleTestDrive = useCallback(() => {
    setTestDriveActive((prev) => {
      const next = !prev;
      if (next) {
        setExplodedFactor(0);
        soundEngine.playTestDriveEngage(currentBlueprint.category);
        flashStatus(t.testDriveStartedToast(currentBlueprint.name));
      } else {
        flashStatus(t.testDriveStoppedToast);
      }
      return next;
    });
  }, [currentBlueprint.category, currentBlueprint.name, flashStatus, t]);

  const handleToggleXRay = useCallback(() => {
    setXRayMode((prev) => {
      const next = !prev;
      flashStatus(next ? t.xRayEnabledToast : t.xRayDisabledToast);
      return next;
    });
  }, [flashStatus, t.xRayDisabledToast, t.xRayEnabledToast]);

  const handleToggleEnvironment = useCallback(() => {
    const nextMode =
      latestProgressRef.current.environmentMode === 'auto_thematic'
        ? 'studio'
        : 'auto_thematic';
    setProgress((p) => ({
      ...p,
      environmentMode: nextMode,
    }));
    flashStatus(nextMode === 'auto_thematic' ? t.envThematicToast : t.envStudioToast);
  }, [flashStatus, setProgress, t.envStudioToast, t.envThematicToast]);

  // Helper to record consecutive-day active engagement and grant milestone rewards
  const recordActiveWorkshopEngagement = useCallback(
    (preferCustomMessage?: string) => {
      const snap = latestProgressRef.current;
      const res = recordDailyEngagement(snap.dailyStreak, todayDateKey);
      if (!res.extendedToday) {
        if (preferCustomMessage) {
          flashStatus(preferCustomMessage);
        }
        return;
      }

      const { updatedUnlocked } = syncUnlockedBadgesMap(
        snap.completedStages,
        snap.unlockedBadges,
        snap.dailyChallenge,
        snap.speedrunRecords,
        res.nextStreak,
      );
      const unlockedFreePass = Boolean(res.nextStreak.unlockedMilestones.streak_14);

      setProgress((p) => ({
        ...p,
        dailyStreak: res.nextStreak,
        unlockedBadges: { ...p.unlockedBadges, ...updatedUnlocked },
        freeWorkshopUnlocked: p.freeWorkshopUnlocked || unlockedFreePass,
      }));

      if (res.newlyUnlockedMilestones.length > 0) {
        const topMilestone =
          res.newlyUnlockedMilestones[res.newlyUnlockedMilestones.length - 1];
        soundEngine.playBadgeUnlocked();
        flashStatus(
          t.streakMilestoneUnlockedToast(
            topMilestone.daysRequired,
            topMilestone.rewardLabel[language],
          ),
        );
      } else if (preferCustomMessage) {
        flashStatus(`${preferCustomMessage} · ${t.streakExtendedToast(res.nextStreak.currentStreak)}`);
      } else {
        flashStatus(t.streakExtendedToast(res.nextStreak.currentStreak));
      }
    },
    [flashStatus, language, setProgress, t, todayDateKey],
  );

  // Axe 2: Custom Paint Livery & Garage Showcase Handlers
  const handleSelectLivery = useCallback(
    (liveryId: LiveryPresetId, label: string) => {
      setProgress((p) => {
        const nextLiveries = { ...p.customLiveries };
        if (liveryId === 'original') {
          delete nextLiveries[currentBlueprint.id];
        } else {
          nextLiveries[currentBlueprint.id] = liveryId;
        }
        return {
          ...p,
          customLiveries: nextLiveries,
        };
      });
      recordActiveWorkshopEngagement(t.liveryAppliedToast(label));
    },
    [currentBlueprint.id, recordActiveWorkshopEngagement, setProgress, t],
  );

  const handleGarageLoadVehicle = useCallback(
    (blueprintId: string, startTestDrive: boolean) => {
      flushActiveStopwatchSegment(currentBlueprint.id);
      speechEngine.stop();

      const targetRaw =
        blueprintId === todayDailyBundle.blueprint.id
          ? todayDailyBundle.blueprint
          : VEHICLE_BLUEPRINTS.find((b) => b.id === blueprintId);
      if (!targetRaw) return;

      const allPartIds = targetRaw.parts.map((p) => p.id);
      const targetLocalized = getLocalizedBlueprint(targetRaw, language);

      setTimerArmed(false);
      setLiveDeltaMs(0);
      setLastTimedResult(null);
      setDiagnosticSession(null);
      setStagedPartId(null);
      setActiveDragPartId(null);
      setHintPartId(null);
      setRecentUnlockedBadgeIds([]);
      setExplodedFactor(0);
      setCameraPresetNonce((n) => n + 1);

      setProgress((p) => {
        const curStage = p.inProgressStages[blueprintId];
        return {
          ...p,
          currentBlueprintId: blueprintId,
          lastStandardBlueprintId: blueprintId.startsWith('daily-')
            ? p.lastStandardBlueprintId
            : blueprintId,
          cameraPreset: CameraPreset.ISO,
          inProgressStages: {
            ...p.inProgressStages,
            [blueprintId]: {
              placedPartIds: allPartIds,
              mistakesCount: curStage?.mistakesCount ?? 0,
              elapsedMs: curStage?.elapsedMs ?? 0,
              updatedAt: Date.now(),
            },
          },
        };
      });

      if (startTestDrive) {
        setTestDriveActive(true);
        soundEngine.playTestDriveEngage(targetRaw.category);
        flashStatus(t.testDriveStartedToast(targetLocalized.name));
      } else {
        setTestDriveActive(false);
        setStatusMessage(null);
      }
    },
    [
      currentBlueprint.id,
      flashStatus,
      flushActiveStopwatchSegment,
      language,
      setProgress,
      t,
      todayDailyBundle.blueprint,
    ],
  );

  const handleSelectAgeProfile = useCallback(
    (profile: AgeProfile) => {
      setProgress((p) => ({
        ...p,
        ageProfile: profile,
        noSilhouetteMode: profile === '11-12' ? true : profile === '5-7' ? false : p.noSilhouetteMode,
      }));
    },
    [setProgress],
  );

  // Axe 3: Master No-Silhouette Mode, 3-Question Patent Quiz & Diagnostic/Repair Mode Handlers
  const handleToggleNoSilhouette = useCallback(() => {
    const nextVal = !latestProgressRef.current.noSilhouetteMode;
    if (!nextVal) {
      cleanNoSilhouetteRunRef.current = false;
    } else if (standardPlacedPartIds.length === 0) {
      cleanNoSilhouetteRunRef.current = true;
    }
    setProgress((p) => ({
      ...p,
      noSilhouetteMode: nextVal,
    }));
    flashStatus(nextVal ? t.noSilhouetteEnabledToast : t.noSilhouetteDisabledToast);
  }, [
    flashStatus,
    setProgress,
    standardPlacedPartIds.length,
    t.noSilhouetteDisabledToast,
    t.noSilhouetteEnabledToast,
  ]);

  const handlePassQuiz = useCallback(
    (score: number, total: number) => {
      setProgress((p) => {
        const existing = p.engineeringPatents[currentBlueprint.id];
        return {
          ...p,
          engineeringPatents: {
            ...p.engineeringPatents,
            [currentBlueprint.id]: {
              score: Math.max(existing?.score ?? 0, score),
              total,
              passedAt: existing?.passedAt ?? Date.now(),
            },
          },
        };
      });
      recordActiveWorkshopEngagement();
    },
    [currentBlueprint.id, recordActiveWorkshopEngagement, setProgress],
  );

  const handleStartDiagnostic = useCallback(() => {
    flushActiveStopwatchSegment(currentBlueprint.id);
    speechEngine.stop();
    diagnosticSeedCounterRef.current += 1;
    const plan = createDiagnosticMission(currentBlueprint, diagnosticSeedCounterRef.current);

    setTimerArmed(false);
    setLiveDeltaMs(0);
    setTestDriveActive(false);
    setExplodedFactor(0);
    setStagedPartId(null);
    setActiveDragPartId(null);
    setHintPartId(null);
    setCameraPresetNonce((n) => n + 1);

    setDiagnosticSession({
      blueprintId: currentBlueprint.id,
      placedPartIds: plan.initialPlacedPartIds,
      faultyPartIds: plan.initialFaultyPartIds,
      seed: diagnosticSeedCounterRef.current,
    });

    if (!progress.diagnosticTutorialSeen) {
      setDiagTutorialOpen(true);
    }

    flashStatus(t.diagnosticStartedToast(currentBlueprint.name, plan.targetInterventionsCount));
  }, [currentBlueprint, flashStatus, flushActiveStopwatchSegment, progress.diagnosticTutorialSeen, t]);

  const handleQuitDiagnostic = useCallback(() => {
    setDiagnosticSession(null);
    setStagedPartId(null);
    setActiveDragPartId(null);
    setHintPartId(null);
    setStatusMessage(null);
  }, []);

  const handleExtractFaultyPart = useCallback(
    (partId: string) => {
      setDiagnosticSession((prev) => {
        if (!prev || !prev.faultyPartIds.includes(partId)) return prev;
        return {
          ...prev,
          faultyPartIds: prev.faultyPartIds.filter((id) => id !== partId),
        };
      });
      setHintPartId((prev) => (prev === partId ? null : prev));
      soundEngine.playDiagnosticExtract();

      const spec = currentBlueprint.parts.find((p) => p.id === partId);
      if (spec) {
        const msg = t.diagnosticExtractedToast(spec.name);
        recordActiveWorkshopEngagement(msg);
        if (latestProgressRef.current.voiceAutoRead && !latestProgressRef.current.muted) {
          const cue = DIAGNOSTIC_NARRATION.extracted[language === 'fr' ? 0 : language === 'en' ? 1 : 2];
          speechEngine.speak(`diag-extract-${spec.id}`, `${spec.name}. ${cue}`, language);
        }
      } else {
        recordActiveWorkshopEngagement();
      }
    },
    [currentBlueprint.parts, language, recordActiveWorkshopEngagement, t],
  );

  const handleSelectBlueprint = useCallback(
    (blueprintId: string) => {
      const completedCount = Object.keys(progress.completedStages).length;
      const target = VEHICLE_BLUEPRINTS.find(bp => bp.id === blueprintId);
      if (!localAdminActive && !target?.virtualLab && freeTrialExhausted(completedCount) && !isUnlocked(progress.licenseState)) {
        track('paywall_shown', { missionsCompleted: completedCount });
        setUpgradeReason('stages');
        setUpgradeModalOpen(true);
        return;
      }
      track('mission_started', { blueprintId });
      lastInteractionRef.current = Date.now();
      flushActiveStopwatchSegment(currentBlueprint.id);
      speechEngine.stop();
      undoStackRef.current = [];
      setCanUndo(false);
      setTimerArmed(false);
      setLiveDeltaMs(0);
      setLastTimedResult(null);
      setTestDriveActive(false);
      setDiagnosticSession(null);
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
    [currentBlueprint.id, flushActiveStopwatchSegment, setProgress, progress.completedStages, progress.licenseState, scienceTrial],
  );

  const handleStartTimedStage = useCallback(
    (blueprintId: string) => {
      speechEngine.stop();
      segmentStartRef.current = null;
      setTimerArmed(false);
      setLiveDeltaMs(0);
      setLastTimedResult(null);
      setTestDriveActive(false);
      setDiagnosticSession(null);
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
      setStagedPartId(null);
      setActiveDragPartId(null);
      setHintPartId(null);
      setRecentUnlockedBadgeIds([]);
      setExplodedFactor(0);
      setCameraPresetNonce((n) => n + 1);
      flashStatus(t.timerEnabledToast);
    },
    [flashStatus, setProgress, t.timerEnabledToast],
  );

  const handleStartDailyBuild = useCallback(
    (resetIfCompleted = false) => {
      flushActiveStopwatchSegment(currentBlueprint.id);
      speechEngine.stop();
      const dailyId = todayDailyBundle.blueprint.id;
      setTimerArmed(false);
      setLiveDeltaMs(0);
      setLastTimedResult(null);
      setTestDriveActive(false);
      setDiagnosticSession(null);
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
      setProgress,
      todayDailyBundle.blueprint.id,
      todayDailyBundle.blueprint.parts.length,
    ],
  );

  const handleResetStage = useCallback(() => {
    speechEngine.stop();
    segmentStartRef.current = null;
    setTimerArmed(false);
    setLiveDeltaMs(0);
    setLastTimedResult(null);
    setTestDriveActive(false);
    setDiagnosticSession(null);
    cleanNoSilhouetteRunRef.current = Boolean(latestProgressRef.current.noSilhouetteMode);
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
    undoStackRef.current = [];
    setCanUndo(false);
    flashStatus(t.stageResetMsg(currentBlueprint.name));
  }, [currentBlueprint.id, currentBlueprint.name, flashStatus, setProgress, t]);

  const handleUndo = useCallback(() => {
    const stack = undoStackRef.current;
    if (stack.length === 0) return;
    track('undo_used', { blueprintId: currentBlueprint.id });
    const prev = stack[stack.length - 1];
    undoStackRef.current = stack.slice(0, -1);
    setCanUndo(undoStackRef.current.length > 0);
    setProgress((p) => {
      const cur = p.inProgressStages[currentBlueprint.id];
      return {
        ...p,
        inProgressStages: {
          ...p.inProgressStages,
          [currentBlueprint.id]: {
            placedPartIds: prev,
            mistakesCount: cur?.mistakesCount ?? 0,
            elapsedMs: cur?.elapsedMs ?? 0,
            updatedAt: Date.now(),
          },
        },
      };
    });
  }, [currentBlueprint.id, setProgress]);

  const handlePartSnapped = useCallback(
    (partId: string) => {
      // Branch 1: Active Diagnostic & Repair Mission
      if (activeDiagnostic) {
        if (activeDiagnostic.placedPartIds.includes(partId)) return;
        const nextDiagPlaced = [...activeDiagnostic.placedPartIds, partId];
        const allRepaired =
          activeDiagnostic.faultyPartIds.length === 0 &&
          nextDiagPlaced.length === currentBlueprint.parts.length;

        if (!allRepaired) {
          setDiagnosticSession((prev) =>
            prev ? { ...prev, placedPartIds: nextDiagPlaced } : null,
          );
          const snappedSpec = currentBlueprint.parts.find((p) => p.id === partId);
          if (snappedSpec) {
            flashStatus(t.partSnappedMsg(snappedSpec.name, snappedSpec.roleHint));
            if (latestProgressRef.current.voiceAutoRead && !latestProgressRef.current.muted) {
              speechEngine.speak(
                `diag-snap-${snappedSpec.id}`,
                `${snappedSpec.name}. ${snappedSpec.roleHint}`,
                language,
              );
            }
          }
        } else {
          // Diagnostic & Repair completed!
          setDiagnosticSession(null);
          setProgress((p) => {
            const curCount = p.repairedStages[currentBlueprint.id] ?? 0;
            const curInProg = p.inProgressStages[currentBlueprint.id];
            const nextCompleted = currentBlueprint.isDailyBonus
              ? p.completedStages
              : {
                  ...p.completedStages,
                  [currentBlueprint.id]: p.completedStages[currentBlueprint.id] ?? {
                    completed: true,
                    stars: 3,
                    bestMistakes: 0,
                    completedAt: Date.now(),
                  },
                };

            return {
              ...p,
              repairedStages: {
                ...p.repairedStages,
                [currentBlueprint.id]: curCount + 1,
              },
              inProgressStages: {
                ...p.inProgressStages,
                [currentBlueprint.id]: {
                  placedPartIds: nextDiagPlaced,
                  mistakesCount: curInProg?.mistakesCount ?? 0,
                  elapsedMs: curInProg?.elapsedMs ?? 0,
                  updatedAt: Date.now(),
                },
              },
              completedStages: nextCompleted,
            };
          });

          track('diagnostic_solved', { blueprintId: currentBlueprint.id });
          window.setTimeout(() => {
            soundEngine.playStageVictory();
          }, 140);
          recordActiveWorkshopEngagement(t.diagnosticCompletedToast(currentBlueprint.name));
        }

        setStagedPartId(null);
        setActiveDragPartId(null);
        setHintPartId((prev) => (prev === partId ? null : prev));
        return;
      }

      // Branch 2: Standard / Daily / Timed Assembly
      const alreadyPlaced = standardPlacedPartIds.includes(partId);
      if (alreadyPlaced) return;

      track('part_snapped', { partId, blueprintId: currentBlueprint.id });
      lastInteractionRef.current = Date.now();
      undoStackRef.current = [...undoStackRef.current, [...standardPlacedPartIds]];
      setCanUndo(true);
      const updatedPlaced = [...standardPlacedPartIds, partId];
      const justCompleted = isAssemblyComplete(currentBlueprint, updatedPlaced);
      if (justCompleted) track('mission_completed', { blueprintId: currentBlueprint.id });

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
          recordActiveWorkshopEngagement(
            t.partSnappedMsg(snappedSpec.name, snappedSpec.roleHint),
          );
          if (latestProgressRef.current.voiceAutoRead && !latestProgressRef.current.muted) {
            speechEngine.speak(
              `snap-${snappedSpec.id}`,
              `${snappedSpec.name}. ${snappedSpec.roleHint}`,
              language,
            );
          }
        } else {
          recordActiveWorkshopEngagement();
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
        const earnedMasterNoSilhouette =
          Boolean(prevSnap.noSilhouetteMode) && cleanNoSilhouetteRunRef.current;

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
        const streakOutcome = recordDailyEngagement(prevSnap.dailyStreak, todayDateKey);
        const unlockedFreePass = Boolean(
          streakOutcome.nextStreak.unlockedMilestones.streak_14,
        );

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
            streakOutcome.nextStreak,
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
            dailyStreak: streakOutcome.nextStreak,
            freeWorkshopUnlocked: p.freeWorkshopUnlocked || unlockedFreePass,
            speedrunRecords: nextSpeedRecords,
            unlockedBadges: updatedUnlocked,
            masterNoSilhouetteStages: earnedMasterNoSilhouette
              ? {
                  ...p.masterNoSilhouetteStages,
                  [currentBlueprint.id]:
                    p.masterNoSilhouetteStages[currentBlueprint.id] ?? Date.now(),
                }
              : p.masterNoSilhouetteStages,
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
            streakOutcome.nextStreak,
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
            dailyStreak: streakOutcome.nextStreak,
            freeWorkshopUnlocked: p.freeWorkshopUnlocked || unlockedFreePass,
            speedrunRecords: nextSpeedRecords,
            unlockedBadges: updatedUnlocked,
            masterNoSilhouetteStages: earnedMasterNoSilhouette
              ? {
                  ...p.masterNoSilhouetteStages,
                  [currentBlueprint.id]:
                    p.masterNoSilhouetteStages[currentBlueprint.id] ?? Date.now(),
                }
              : p.masterNoSilhouetteStages,
          }));

          window.setTimeout(() => {
            soundEngine.playStageVictory();
            if (
              newlyUnlockedIds.length > 0 ||
              timedOutcome?.isNewRecord ||
              streakOutcome.newlyUnlockedMilestones.length > 0
            ) {
              window.setTimeout(() => {
                soundEngine.playBadgeUnlocked();
              }, 420);
            }
          }, 160);
        }

        if (streakOutcome.newlyUnlockedMilestones.length > 0) {
          const topMilestone =
            streakOutcome.newlyUnlockedMilestones[
              streakOutcome.newlyUnlockedMilestones.length - 1
            ];
          flashStatus(
            t.streakMilestoneUnlockedToast(
              topMilestone.daysRequired,
              topMilestone.rewardLabel[language],
            ),
          );
        } else if (streakOutcome.extendedToday) {
          flashStatus(t.streakExtendedToast(streakOutcome.nextStreak.currentStreak));
        }

        if (currentBlueprint.id !== DRAWBRIDGE_ID && !currentBlueprint.interactiveTrial && !currentBlueprint.virtualLab && !getScienceChallenges(currentBlueprint.id)) {
          window.setTimeout(() => {
            const latest = latestProgressRef.current;
            if (latest.currentBlueprintId === currentBlueprint.id &&
              isAssemblyComplete(currentBlueprint, latest.inProgressStages[currentBlueprint.id]?.placedPartIds ?? [])) {
              setDiscoveryOpen(true);
            }
          }, OCTO_VICTORY_DURATION_MS);
        }
      }

      setStagedPartId(null);
      setActiveDragPartId(null);
      setHintPartId((prev) => (prev === partId ? null : prev));
    },
    [
      activeDiagnostic,
      currentBlueprint,
      currentRawBlueprint,
      flashStatus,
      language,
      recordActiveWorkshopEngagement,
      setProgress,
      standardPlacedPartIds,
      t,
      todayDailyBundle.rareSpec.id,
      todayDailyBundle.templateId,
      todayDateKey,
    ],
  );

  const handlePartDropRejected = useCallback(
    (reason: string) => {
      lastInteractionRef.current = Date.now();
      if (!activeDiagnostic) {
        setTimerArmed(true);
        setProgress((p) => {
          const cur = p.inProgressStages[currentBlueprint.id];
          const newMistakes = (cur?.mistakesCount ?? 0) + 1;
          if (newMistakes >= 3 && !hintPartId) {
            const nextPart = currentBlueprint.parts.find(
              (p) => !standardPlacedPartIds.includes(p.id),
            );
            if (nextPart) {
              setHintPartId(nextPart.id);
              track('hint_requested', { blueprintId: currentBlueprint.id, trigger: 'failures' });
            }
          }
          return {
            ...p,
            inProgressStages: {
              ...p.inProgressStages,
              [currentBlueprint.id]: {
                placedPartIds: cur?.placedPartIds ?? [],
                mistakesCount: newMistakes,
                elapsedMs: cur?.elapsedMs ?? 0,
                updatedAt: Date.now(),
              },
            },
          };
        });
      }
      flashStatus(reason);
    },
    [activeDiagnostic, currentBlueprint.id, currentBlueprint.parts, flashStatus, hintPartId, setHintPartId, setProgress, standardPlacedPartIds],
  );

  const handleStartPartDrag = useCallback(
    (partId: string) => {
      lastInteractionRef.current = Date.now();
      soundEngine.playPickup(progress.preferredStyle);
      if (!activeDiagnostic) {
        setTimerArmed(true);
      }
      setStagedPartId(partId);
      setActiveDragPartId(partId);
      setExplodedFactor(0);
      // tray collapse deferred to onPartDraggedOut (pointer leaving the tray) to avoid interrupting the gesture
    },
    [activeDiagnostic, progress.preferredStyle],
  );

  const handleClickPartCard = useCallback(
    (partId: string) => {
      const spec = currentBlueprint.parts.find((p) => p.id === partId);
      if (!spec) return;

      // If this part is currently mounted as faulty on the 3D model, guide the child to click it in 3D!
      if (activeDiagnostic && activeDiagnostic.faultyPartIds.includes(partId)) {
        setHintPartId(partId);
        const msg = t.diagnosticClickFaultyHint(spec.name);
        flashStatus(msg);
        if (latestProgressRef.current.voiceAutoRead && !latestProgressRef.current.muted) {
          const cue = DIAGNOSTIC_NARRATION.locate[language === 'fr' ? 0 : language === 'en' ? 1 : 2];
          speechEngine.speak(`diag-hint-${spec.id}`, `${spec.name}. ${cue}`, language);
        }
        return;
      }

      if (!activeDiagnostic) {
        setTimerArmed(true);
      }
      setStagedPartId(partId);

      const placedSet = new Set(effectivePlacedPartIds);
      const missing = spec.dependsOn.find((d) => !placedSet.has(d));
      if (missing) {
        const missingName =
          currentBlueprint.parts.find((p) => p.id === missing)?.name ?? '';
        const msg = t.placeFirstMsg(missingName, spec.name);
        flashStatus(msg);
        if (latestProgressRef.current.voiceAutoRead && !latestProgressRef.current.muted) {
          speechEngine.speak(`card-dep-${spec.id}`, msg, language);
        }
      } else {
        flashStatus(t.partStagedMsg(spec.name));
        if (latestProgressRef.current.voiceAutoRead && !latestProgressRef.current.muted) {
          speechEngine.speak(
            `card-ready-${spec.id}`,
            `${spec.name}. ${spec.roleHint}`,
            language,
          );
        }
      }
    },
    [activeDiagnostic, currentBlueprint.parts, effectivePlacedPartIds, flashStatus, language, t],
  );

  const handleSelectStyle = useCallback(
    (style: VisualStyleMode) => {
      setProgress((p) => ({ ...p, preferredStyle: style }));
    },
    [setProgress],
  );

  const handleChangePartsTrayPosition = useCallback(
    (pos: 'bottom' | 'left' | 'right') => {
      setProgress((p) => ({ ...p, partsTrayPosition: pos }));
      // When moving the tray to a side panel, collapse the bottom dock to give more room to the canvas
    },
    [setProgress],
  );

  const handleSelectCamera = useCallback(
    (preset: CameraPreset) => {
      setProgress((p) => ({ ...p, cameraPreset: preset }));
      setCameraPresetNonce((n) => n + 1);
    },
    [setProgress],
  );

  const handleGoNextStage = useCallback(() => {
    if (currentBlueprint.isDailyBonus) {
      const targetId =
        VEHICLE_BLUEPRINTS.find((b) => b.id === progress.lastStandardBlueprintId)?.id ??
        VEHICLE_BLUEPRINTS[0].id;
      handleSelectBlueprint(targetId);
      return;
    }
    if (hasNextStage) {
      const nextBp = VEHICLE_BLUEPRINTS[currentIndex + 1];
      if (!localAdminActive && !nextBp.virtualLab && !canPlayStage(progress.licenseState, nextBp.stageNumber, nextBp.masterExpansion)) {
        track('paywall_shown', { reason: 'stages' });
        setUpgradeReason('stages');
        setUpgradeModalOpen(true);
        return;
      }
      handleSelectBlueprint(nextBp.id);
    }
  }, [
    currentBlueprint.isDailyBonus,
    currentIndex,
    handleSelectBlueprint,
    hasNextStage,
    progress.lastStandardBlueprintId,
    progress.licenseState,
  ]);

  const handleOpenTour = useCallback(() => {
    setProfilesOpen(false);
    setCatalogOpen(false);
    setStreakModalOpen(false);
    setDailyModalOpen(false);
    setLeaderboardOpen(false);
    setProgressionOpen(false);
    setDiscoveryOpen(false);
    setStudioOpen(false);
    setGarageOpen(false);
    setQuizOpen(false);
    setParentSpaceOpen(false);
    setParentalGateOpen(false);
    setTourStep(0);
    setTourOpen(true);
  }, []);

  const handleFinishTour = useCallback(() => {
    setTourOpen(false);
    setProgress((p) => {
      if (p.tutorialSeen) return p;
      track('tutorial_completed');
      return { ...p, tutorialSeen: true };
    });
  }, [setProgress]);

  const handleFinishDiagTutorial = useCallback(() => {
    setDiagTutorialOpen(false);
    setProgress((p) => {
      if (p.diagnosticTutorialSeen) return p;
      return { ...p, diagnosticTutorialSeen: true };
    });
  }, [setProgress]);

  const handleActivateLicense = useCallback(
    (key: string) => {
      setProgress((p) => ({
        ...p,
        licenseState: {
          tier: 'school',
          schoolOrg: p.licenseState?.schoolOrg ?? 'Mon école',
          activatedAt: Date.now(),
        },
      }));
      flashStatus(t.teacherLicenseActivatedToast);
    },
    [flashStatus, setProgress, t.teacherLicenseActivatedToast],
  );

  const handleManualSave = useCallback(() => {
    saveMultiProfileStore(latestStoreRef.current);
    flashStatus(t.progressSavedToast);
  }, [flashStatus, t.progressSavedToast]);

  const handleExportSave = useCallback(() => {
    downloadProgressBackup(progress, activeProfile.name);
    flashStatus(t.progressSavedToast);
  }, [activeProfile.name, flashStatus, progress, t.progressSavedToast]);

  const handleImportSaveFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          const restored = sanitizeProgress(parsed);
          resetTransientWorkbenchState();
          setProgress(restored);
          flashStatus(UI_TRANSLATIONS[restored.language].progressImportedToast);
        } catch {
          flashStatus(t.progressImportErrorToast);
        }
      };
      reader.readAsText(file);
    },
    [flashStatus, resetTransientWorkbenchState, setProgress, t.progressImportErrorToast],
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
  }, [setProgress]);

  const handleResetAllProgress = useCallback(() => {
    speechEngine.stop();
    resetTransientWorkbenchState();
    const fresh = createDefaultProgress(language, true);
    setProgress(fresh);
    flashStatus(t.progressResetToast);
  }, [flashStatus, language, resetTransientWorkbenchState, setProgress, t.progressResetToast]);

  const firstReadyPart = useMemo(() => {
    if (activeDiagnostic && activeDiagnostic.faultyPartIds.length > 0) {
      const firstFaultyId = activeDiagnostic.faultyPartIds[0];
      return (
        currentBlueprint.parts.find((p) => p.id === firstFaultyId) ??
        currentBlueprint.parts[0]
      );
    }
    const placedSet = new Set(effectivePlacedPartIds);
    return (
      currentBlueprint.parts.find(
        (p) => !placedSet.has(p.id) && p.dependsOn.every((dep) => placedSet.has(dep)),
      ) ?? currentBlueprint.parts[0]
    );
  }, [activeDiagnostic, currentBlueprint.parts, effectivePlacedPartIds]);

  const effectiveHintPartId =
    hintPartId ??
    (tourOpen && (tourStep === 0 || tourStep === 1)
      ? firstReadyPart?.id ?? null
      : progress.ageProfile === '5-7'
        ? firstReadyPart?.id ?? null
        : null);

  const twoStarMaxMistakes = Math.max(2, Math.floor(currentBlueprint.parts.length / 4));
  const currentStars = currentBlueprint.isDailyBonus
    ? progress.dailyChallenge.completedByDate[todayDateKey]?.stars ??
      (mistakesCount === 0 ? 3 : mistakesCount <= twoStarMaxMistakes ? 2 : 1)
    : progress.completedStages[currentBlueprint.id]?.stars ??
      (mistakesCount === 0 ? 3 : mistakesCount <= twoStarMaxMistakes ? 2 : 1);

  const isDailyCompletedToday = Boolean(progress.dailyChallenge.completedByDate[todayDateKey]);
  const dailyInProgressCount =
    progress.inProgressStages[todayDailyBundle.blueprint.id]?.placedPartIds.length ?? 0;

  const currentLivery: LiveryPresetId =
    progress.customLiveries[currentBlueprint.id] ?? 'original';
  const currentPatent = progress.engineeringPatents[currentBlueprint.id];
  const garageCount =
    Object.values(progress.completedStages).filter((c) => c.completed).length +
    (isDailyCompletedToday ? 1 : 0);

  const streakStatus = useMemo(
    () => getEffectiveDailyStreak(progress.dailyStreak, todayDateKey),
    [progress.dailyStreak, todayDateKey],
  );
  const bestStreakCount = Math.max(
    progress.dailyStreak.bestStreak,
    streakStatus.displayCount,
  );

  const diagnosticInfo = useMemo(() => {
    if (!activeDiagnostic) return null;
    const missingLeft = Math.max(
      0,
      currentBlueprint.parts.length -
        activeDiagnostic.placedPartIds.length -
        activeDiagnostic.faultyPartIds.length,
    );
    return {
      faultyPartIds: activeDiagnostic.faultyPartIds,
      missingLeft,
    };
  }, [activeDiagnostic, currentBlueprint.parts.length]);

  const handleRegisterSnapshotCapture = useCallback((fn: (() => string | null) | null) => {
    snapshotCaptureRef.current = fn;
  }, []);

  const triggerSnapshotCapture = useCallback(() => {
    return snapshotCaptureRef.current ? snapshotCaptureRef.current() : null;
  }, []);

  const handleOnboardingComplete = useCallback(
    (
      lang: LanguageCode,
      name: string,
      avatarColor: ProfileAvatarColor,
      avatarIcon: ProfileAvatarIcon,
    ) => {
      const currentCount = latestStoreRef.current.profiles.length;
      const newProf = createNewPlayerProfile({
        name,
        avatarColor,
        avatarIcon,
        language: lang,
        index: currentCount + 1,
      });
      const nextStore: MultiProfileStore = {
        ...latestStoreRef.current,
        activeProfileId: newProf.id,
        profiles: [newProf],
      };
      setProfileStore(nextStore);
      saveMultiProfileStore(nextStore);
      localStorage.setItem(ONBOARDING_DONE_KEY, '1');
      localStorage.setItem(LANDING_SEEN_KEY, '1');
      setShowOnboarding(false);
      setShowLanding(false);
      setTourOpen(!newProf.progress.tutorialSeen);
    },
    [],
  );

  if (showOnboarding) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  if (!localAdminActive && progress.ageProfile === undefined) {
    return <AgeProfileSelector language={language} onConfirm={handleSelectAgeProfile} />;
  }

  if (showLanding) {
    return (
      <LandingPage
        language={language}
        onSelectLanguage={handleSelectLanguage}
        onStart={() => {
          localStorage.setItem(LANDING_SEEN_KEY, '1');
          setShowLanding(false);
        }}
      />
    );
  }

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      data-tbi={progress.tbiMode ? 'true' : undefined}
      className="flex flex-col w-full h-full bg-[#F4F6F9] text-slate-900 overflow-hidden"
    >
      {/* Service Worker update banner */}
      {needsRefresh && (
        <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-3 px-4 py-2 bg-sky-700 text-white text-sm font-medium shadow-md">
          <span>{t.swUpdateAvailable}</span>
          <button type="button" disabled={Boolean(activeDragPartId)} onClick={() => applyUpdate(persistCurrentSession)} className="shrink-0 px-3 py-1 rounded-md bg-white text-sky-700 font-semibold text-xs hover:bg-sky-50 transition-colors cursor-pointer disabled:opacity-50">
            {t.swUpdateBtn}
          </button>
        </div>
      )}

      {/* Top Bar with Active Profile + Garage + Daily Streak Flame + Daily Challenge + Stopwatch + FR / EN / العربية */}
      <TopBar
        language={language}
        onSelectLanguage={handleSelectLanguage}
        visualStyle={progress.preferredStyle}
        onSelectStyle={handleSelectStyle}
        activeProfile={activeProfile}
        onOpenProfiles={() => setProfilesOpen(true)}
        onOpenCatalog={() => setCatalogOpen(true)}
        onOpenGarage={() => setGarageOpen(true)}
        garageCount={garageCount}
        streakCount={streakStatus.displayCount}
        isStreakActiveToday={streakStatus.isActiveToday}
        onOpenStreak={() => setStreakModalOpen(true)}
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
            } else if (!nextOpen) {
              speechEngine.stop();
            }
            return nextOpen;
          });
        }}
        onOpenParentSpace={() => handleOpenParentSpace('stem')}
        onOpenTeacherDashboard={() => setTeacherDashboardOpen(true)}
        remainingSessionMinutes={
          gentleTimerStatus.remainingSeconds !== null
            ? Math.ceil(gentleTimerStatus.remainingSeconds / 60)
            : null
        }
      />

      {/* Reserved areas for the 3D scene, instructions and parts. */}
      <main className="workbench-workspace relative flex min-h-0 flex-1 w-full overflow-hidden" data-tray-position={effectiveTrayPosition}>
        <div className="workbench-scene relative min-h-0 min-w-0 flex-1">
        <OctoSurprise key={`${activeProfile.id}-${currentBlueprint.id}`} placed={standardPlacedPartIds.length}
          total={currentBlueprint.parts.length} stageNumber={currentBlueprint.stageNumber} blocked={anyOverlayOpen || Boolean(activeDiagnostic)}
          completed={isCompleted} congratulations={t.octoCongratulations} />
        {/* Non-intrusive Offline Connectivity Indicator */}
        {!isOnline && (
          <div className="pointer-events-none absolute top-3 start-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-amber-300 rounded-lg shadow-xs text-xs font-medium text-amber-950">
            <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{t.pwaOfflineActiveBanner}</span>
          </div>
        )}

        {/* Gentle Session Assembly Grace Notice (>= 50% vehicle in progress) */}
        {gentleTimerStatus.isInAssemblyGrace && (
          <div className="pointer-events-none absolute top-3 end-4 z-10 px-3 py-1.5 bg-white border border-sky-300 rounded-lg shadow-xs text-xs font-mono tabular-nums font-medium text-sky-950">
            {t.sessionCurtainGraceBanner(gentleTimerStatus.graceRemainingSeconds)}
          </div>
        )}

        <WorkshopCanvas
          trayPosition={effectiveTrayPosition}
          language={language}
          blueprint={currentBlueprint}
          placedPartIds={effectivePlacedPartIds}
          visualStyle={progress.preferredStyle}
          liveryPreset={currentLivery}
          environmentMode={progress.environmentMode}
          xRayMode={xRayMode}
          testDriveActive={testDriveActive}
          labTrial={activeLabTrial}
          scienceTrial={activeScienceTrial}
          onScienceAction={handleScienceAction}
          noSilhouetteMode={progress.noSilhouetteMode}
          faultyPartIds={effectiveFaultyPartIds}
          onExtractFaultyPart={handleExtractFaultyPart}
          onRegisterSnapshotCapture={handleRegisterSnapshotCapture}
          explodedFactor={explodedFactor}
          cameraPreset={progress.cameraPreset}
          cameraPresetNonce={cameraPresetNonce}
          activeDragPartId={activeDragPartId}
          stagedPartId={stagedPartId}
          hintPartId={effectiveHintPartId}
          onPartSnapped={handlePartSnapped}
          onPartDropRejected={handlePartDropRejected}
          onDragEndSignal={() => { setActiveDragPartId(null); }}
          workshopTheme={progress.workshopTheme}
          onStartCanvasDrag={(partId) => {
            soundEngine.playPickup(progress.preferredStyle);
            if (!activeDiagnostic) {
              setTimerArmed(true);
            }
            setActiveDragPartId(partId);
          }}
        />
        </div>
        {!activeDiagnostic && (currentBlueprint.virtualLab || scienceChallenges || ((currentBlueprint.id === DRAWBRIDGE_ID || currentBlueprint.interactiveTrial) && isCompleted)) && (
          <div className="workbench-mission min-h-0 overflow-y-auto p-2">
            {(currentBlueprint.id === DRAWBRIDGE_ID || currentBlueprint.interactiveTrial) && <div id="workbench-trial-controls" />}
            {currentBlueprint.virtualLab && (
              <VirtualLabMission key={`${currentBlueprint.id}-${isCompleted}`} id={currentBlueprint.virtualLab}
                language={language} assembled={isCompleted} trial={activeLabTrial} onTrial={setLabTrial} />
            )}
            {scienceChallenges && (
              <ScienceChallengeMission blueprintId={currentBlueprint.id} challenges={scienceChallenges} trial={activeScienceTrial}
                language={language} assembled={isCompleted} onTrial={startScienceTrial} onAction={handleScienceAction} />
            )}
          </div>
        )}

      {/* Persistent floating palettes and secondary settings. */}
      <WorkshopHud
        language={language}
        blueprint={currentBlueprint}
        totalStages={VEHICLE_BLUEPRINTS.length}
        placedPartIds={effectivePlacedPartIds}
        faultyPartIds={effectiveFaultyPartIds}
        liveryPreset={currentLivery}
        testDriveActive={testDriveActive}
        onToggleTestDrive={handleToggleTestDrive}
        xRayMode={xRayMode}
        onToggleXRay={handleToggleXRay}
        environmentMode={progress.environmentMode}
        onToggleEnvironment={handleToggleEnvironment}
        noSilhouetteMode={progress.noSilhouetteMode}
        onToggleNoSilhouette={handleToggleNoSilhouette}
        onOpenStudio={() => setStudioOpen(true)}
        hasPatent={Boolean(currentPatent)}
        onOpenQuiz={() => setQuizOpen(true)}
        diagnosticInfo={diagnosticInfo}
        onStartDiagnostic={handleStartDiagnostic}
        onQuitDiagnostic={handleQuitDiagnostic}
        stagedPartId={stagedPartId}
        activeDragPartId={activeDragPartId}
        hintPartId={effectiveHintPartId}
        explodedFactor={explodedFactor}
        onChangeExploded={(val) => {
          if (val > 0 && testDriveActive) {
            setTestDriveActive(false);
          }
          setExplodedFactor(val);
        }}
        cameraPreset={progress.cameraPreset}
        onSelectCamera={handleSelectCamera}
        visualStyle={progress.preferredStyle}
        onSelectStyle={handleSelectStyle}
        muted={progress.muted}
        onToggleMute={() => {
          if (!progress.muted) {
            speechEngine.stop();
          }
          setProgress((p) => ({ ...p, muted: !p.muted }));
        }}
        onReplayInstruction={() => speechEngine.speak('manual-workshop', getWorkshopInstruction(currentBlueprint, effectivePlacedPartIds, stagedPartId ?? activeDragPartId ?? effectiveHintPartId), language)}
        voiceAutoRead={progress.voiceAutoRead}
        onToggleVoiceAutoRead={() => handleToggleVoiceAutoRead()}
        timerModeEnabled={progress.timerModeEnabled}
        liveElapsedMs={liveElapsedMs}
        personalBestMs={currentPersonalBestMs}
        onToggleTimerMode={() => handleToggleTimerMode()}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onUndo={handleUndo}
        canUndo={!activeDiagnostic && canUndo}
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
        partsTrayPosition={effectiveTrayPosition}
        onChangePartsTrayPosition={handleChangePartsTrayPosition}
      />

      </main>

      {/* Family Multi-Profiles, Trilingual Web Speech & Offline PWA Modal */}
      <ProfilesModal
        isOpen={profilesOpen}
        onClose={() => {
          speechEngine.stop();
          setProfilesOpen(false);
        }}
        language={language}
        profiles={profileStore.profiles}
        activeProfileId={activeProfile.id}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onUpdateProfileMeta={handleUpdateProfileMeta}
        onDeleteProfile={handleDeleteProfile}
        voiceAutoRead={progress.voiceAutoRead}
        onToggleVoiceAutoRead={(nextVal) => handleToggleVoiceAutoRead(nextVal)}
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
          requireAdultVerification(() => {
            setProgress((p) => ({ ...p, freeWorkshopUnlocked: !p.freeWorkshopUnlocked }));
          })
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
        onExportSave={() => requireAdultVerification(handleExportSave)}
        onImportSaveFile={(file) => requireAdultVerification(() => handleImportSaveFile(file))}
        onResetAllProgress={() => requireAdultVerification(handleResetAllProgress)}
        onOpenUpgrade={(reason) => {
          setUpgradeReason(reason);
          setUpgradeModalOpen(true);
        }}
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

      {/* Progression & Achievement Badges Modal */}
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

      {/* Daily Engagement Streak & Consecutive-Day Milestone Rewards Modal */}
      <StreakModal
        isOpen={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        language={language}
        dailyStreak={progress.dailyStreak}
        todayDateKey={todayDateKey}
        onOpenPaintBooth={() => setStudioOpen(true)}
        onOpenProgression={() => setProgressionOpen(true)}
      />

      {/* Axe 2: Paint Booth & 3D Souvenir Postcard Studio Modal */}
      <StudioCustomizeModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        language={language}
        blueprint={currentBlueprint}
        profileName={activeProfile.name}
        stars={currentStars}
        bestTimeMs={currentPersonalBestMs}
        hasPatent={Boolean(currentPatent)}
        bestStreak={bestStreakCount}
        currentLivery={currentLivery}
        onSelectLivery={handleSelectLivery}
        onLockedLiveryAttempt={(days) => {
          soundEngine.playGentleBounce();
          flashStatus(t.liveryLockedStreakHint(days));
        }}
        licenseState={progress.licenseState}
        onOpenUpgrade={() => {
          setStudioOpen(false);
          setUpgradeReason('liveries');
          setUpgradeModalOpen(true);
        }}
        captureSnapshot={triggerSnapshotCapture}
        onPostcardDownloaded={() => flashStatus(t.postcardDownloadedToast)}
        workshopTheme={progress.workshopTheme}
        onSelectGroundPreset={(preset) => {
          setProgress((p) => ({ ...p, workshopTheme: { groundPreset: preset } }));
        }}
      />

      {/* Axe 2: Personal 3D Garage Showcase & Rare Vault Modal */}
      <GarageModal
        isOpen={garageOpen}
        onClose={() => setGarageOpen(false)}
        language={language}
        localizedBlueprints={localizedBlueprints}
        localizedDailyBlueprint={localizedDailyBlueprint}
        todayDateKey={todayDateKey}
        progress={progress}
        onLoadVehicle={handleGarageLoadVehicle}
      />

      {/* Axe 3: 3-Question Mechanical Quiz & Engineering Patent Modal */}
      <QuizModal
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        language={language}
        blueprint={currentBlueprint}
        existingPatent={currentPatent}
        onPassQuiz={handlePassQuiz}
      />

      {/* 100% Local Offline Mechanical Hint & Assembly Plan Drawer */}
      <MechanicHintDrawer
        isOpen={mechanicGuideOpen}
        onClose={() => {
          speechEngine.stop();
          setMechanicGuideOpen(false);
        }}
        language={language}
        blueprint={currentBlueprint}
        placedPartIds={effectivePlacedPartIds}
        hintPartId={effectiveHintPartId}
        onHighlightHintPart={(partId) => setHintPartId(partId)}
        voiceAutoRead={progress.voiceAutoRead}
        onToggleVoiceAutoRead={() => handleToggleVoiceAutoRead()}
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
        hasPatent={Boolean(currentPatent)}
        onOpenQuiz={() => setQuizOpen(true)}
        onStartTestDrive={currentBlueprint.id === DRAWBRIDGE_ID || currentBlueprint.staticStructure ? undefined : () => {
          if (!testDriveActive) {
            handleToggleTestDrive();
          }
        }}
        onOpenStudio={() => setStudioOpen(true)}
        hasNextStage={hasNextStage}
        onNextStage={handleGoNextStage}
      />

      {/* Lot B: Paywall Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        reason={upgradeReason}
        language={language}
        onUpgradeClick={() => {
          flashStatus('Bientôt disponible');
          setUpgradeModalOpen(false);
        }}
        onHaveKey={() => {
          setUpgradeModalOpen(false);
          setLicenseActivationOpen(true);
        }}
        onPromoUnlock={() => {
          setProgress((p) => ({ ...p, purchasedFull: true, licenseState: { tier: 'family' } }));
          setUpgradeModalOpen(false);
        }}
      />

      {/* License key activation */}
      <LicenseActivationModal
        isOpen={licenseActivationOpen}
        onClose={() => setLicenseActivationOpen(false)}
        language={language}
        onActivate={(licenseState, extra) => {
          setProgress((prev) => ({ ...prev, licenseState, ...extra }));
        }}
      />

      {/* Lot A: Gentle End-of-Session Curtain */}
      <GentleSessionCurtain
        isOpen={gentleTimerStatus.shouldShowCurtain && !parentSpaceOpen}
        language={language}
        profileName={activeProfile.name}
        completedVehiclesCount={
          Object.values(progress.completedStages).filter((c) => c.completed).length
        }
        onRequestParentAccess={() => handleOpenParentSpace('timer')}
      />

      {/* Lot A: Adult Verification Gate (Word-Form Arithmetic) */}
      <ParentalGateModal
        isOpen={parentalGateOpen}
        language={language}
        onClose={() => {
          pendingAdultActionRef.current = null;
          setParentalGateOpen(false);
        }}
        onVerified={handleParentalGateVerified}
      />

      {/* Lot A: Parent & Teacher Space (STEM Report, Gentle Timer & Printable A4 Diplomas) */}
      <ParentSpaceModal
        isOpen={parentSpaceOpen}
        onClose={handleCloseParentSpace}
        language={language}
        todayDateKey={todayDateKey}
        profiles={profileStore.profiles}
        activeProfileId={activeProfile.id}
        onSwitchActiveProfile={handleSelectProfile}
        parentalSettings={profileStore.parentalSettings}
        gentleTimerStatus={gentleTimerStatus}
        onChangeDailyLimit={handleChangeDailyLimit}
        onExtendToday15Min={handleExtendToday15Min}
        onResetTodayTimer={handleResetTodayTimer}
        onBackupProfile={(prof) => {
          downloadProgressBackup(prof.progress, prof.name);
          flashStatus(t.progressSavedToast);
        }}
        onDiplomaDownloaded={() => flashStatus(t.parentDiplomaDownloadedToast)}
        isOnline={isOnline}
        initialTab={parentSpaceInitialTab}
        onShowLanding={() => {
          setParentSpaceOpen(false);
          setShowLanding(true);
        }}
        onDeleteAllData={() => {
          localStorage.clear();
          window.location.reload();
        }}
        ageProfile={progress.ageProfile}
        onChangeAgeProfile={handleSelectAgeProfile}
        volumeSfx={progress.volumeSfx}
        volumeVoice={progress.volumeVoice}
        classroomSilent={progress.classroomSilent}
        tbiMode={progress.tbiMode}
        onChangeClassroomSettings={(patch) =>
          setProgress((p) => ({ ...p, ...patch }))
        }
      />

      {/* Lot E: Teacher Dashboard (school tier) */}
      <TeacherDashboard
        isOpen={teacherDashboardOpen}
        onClose={() => setTeacherDashboardOpen(false)}
        language={language}
        profiles={profileStore.profiles}
        activeProfileId={activeProfile.id}
        onActivateLicense={handleActivateLicense}
      />

      {/* Diagnostic mode first-use tutorial */}
      <DiagnosticTutorialOverlay
        isOpen={diagTutorialOpen}
        t={t}
        onFinish={handleFinishDiagTutorial}
      />

      {/* Automatic Interactive Guided Tour */}
      <GuidedTourOverlay
        isOpen={tourOpen}
        language={language}
        firstPartName={firstReadyPart?.name ?? ''}
        vehicleName={currentBlueprint.name}
        hasSnappedAnyPart={effectivePlacedPartIds.length > 0}
        onStepChange={(idx) => {
          setTourStep(idx);
          if (idx <= 2) {
          }
        }}
        onFinish={handleFinishTour}
      />
    </div>
  );
}
