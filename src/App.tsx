/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { evaluatePlayerProgression, syncUnlockedBadgesMap } from './data/badges';
import { VEHICLE_BLUEPRINTS } from './data/blueprints';
import {
  getLocalizedBlueprint,
  getLocalizedBlueprints,
  UI_TRANSLATIONS,
} from './i18n/translations';
import {
  CameraPreset,
  LanguageCode,
  PlayerProgress,
  VisualStyleMode,
} from './types/game';
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
import { ProgressionModal } from './components/ProgressionModal';
import { MechanicHintDrawer } from './components/MechanicHintDrawer';
import { DiscoveryModal } from './components/DiscoveryModal';
import { GuidedTourOverlay } from './components/GuidedTourOverlay';

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(loadPlayerProgress);

  const [stagedPartId, setStagedPartId] = useState<string | null>(null);
  const [activeDragPartId, setActiveDragPartId] = useState<string | null>(null);
  const [hintPartId, setHintPartId] = useState<string | null>(null);
  const [explodedFactor, setExplodedFactor] = useState<number>(0);
  const [cameraPresetNonce, setCameraPresetNonce] = useState<number>(0);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const statusTimerRef = useRef<number | null>(null);

  // Modals, Progression, Guide Drawer & Automatic Guided Tour for New Users
  const [catalogOpen, setCatalogOpen] = useState<boolean>(false);
  const [progressionOpen, setProgressionOpen] = useState<boolean>(false);
  const [mechanicGuideOpen, setMechanicGuideOpen] = useState<boolean>(false);
  const [discoveryOpen, setDiscoveryOpen] = useState<boolean>(false);
  const [recentUnlockedBadgeIds, setRecentUnlockedBadgeIds] = useState<string[]>([]);
  const [tourOpen, setTourOpen] = useState<boolean>(() => !loadPlayerProgress().tutorialSeen);
  const [tourStep, setTourStep] = useState<number>(0);

  const language = progress.language;
  const t = UI_TRANSLATIONS[language];

  const localizedBlueprints = useMemo(
    () => getLocalizedBlueprints(VEHICLE_BLUEPRINTS, language),
    [language],
  );

  const currentBlueprint = useMemo(() => {
    const raw =
      VEHICLE_BLUEPRINTS.find((b) => b.id === progress.currentBlueprintId) ??
      VEHICLE_BLUEPRINTS[0];
    return getLocalizedBlueprint(raw, language);
  }, [progress.currentBlueprintId, language]);

  const progressionSummary = useMemo(
    () =>
      evaluatePlayerProgression(
        progress.completedStages,
        progress.unlockedBadges,
        language,
      ),
    [progress.completedStages, progress.unlockedBadges, language],
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

  const currentIndex = useMemo(
    () => VEHICLE_BLUEPRINTS.findIndex((b) => b.id === currentBlueprint.id),
    [currentBlueprint.id],
  );
  const hasNextStage = currentIndex >= 0 && currentIndex < VEHICLE_BLUEPRINTS.length - 1;

  // Keep latest progress in a ref for synchronous flush on tab close / app restart
  const latestProgressRef = useRef<PlayerProgress>(progress);
  useEffect(() => {
    latestProgressRef.current = progress;
    soundEngine.setMuted(progress.muted);
    savePlayerProgress(progress);
  }, [progress]);

  useEffect(() => {
    const handleUnload = () => {
      savePlayerProgress(latestProgressRef.current);
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

  const handleSelectBlueprint = useCallback((blueprintId: string) => {
    setProgress((p) => ({
      ...p,
      currentBlueprintId: blueprintId,
      cameraPreset: CameraPreset.ISO,
    }));
    setStagedPartId(null);
    setActiveDragPartId(null);
    setHintPartId(null);
    setRecentUnlockedBadgeIds([]);
    setExplodedFactor(0);
    setCameraPresetNonce((n) => n + 1);
    setStatusMessage(null);
  }, []);

  const handleResetStage = useCallback(() => {
    setProgress((p) => ({
      ...p,
      cameraPreset: CameraPreset.ISO,
      inProgressStages: {
        ...p.inProgressStages,
        [currentBlueprint.id]: {
          placedPartIds: [],
          mistakesCount: 0,
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
        setProgress((p) => {
          const curMistakes = p.inProgressStages[currentBlueprint.id]?.mistakesCount ?? 0;
          return {
            ...p,
            inProgressStages: {
              ...p.inProgressStages,
              [currentBlueprint.id]: {
                placedPartIds: updatedPlaced,
                mistakesCount: curMistakes,
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
        // Stage Completed! Compute stars & evaluate any newly unlocked achievement badges
        const prevSnap = latestProgressRef.current;
        const curMistakes = prevSnap.inProgressStages[currentBlueprint.id]?.mistakesCount ?? 0;
        const stars = curMistakes === 0 ? 3 : curMistakes <= 2 ? 2 : 1;
        const existing = prevSnap.completedStages[currentBlueprint.id];
        const bestStars = Math.max(existing?.stars ?? 0, stars);
        const bestMistakes =
          existing?.bestMistakes !== undefined
            ? Math.min(existing.bestMistakes, curMistakes)
            : curMistakes;

        const nextCompletedStages = {
          ...prevSnap.completedStages,
          [currentBlueprint.id]: {
            completed: true,
            stars: bestStars,
            bestMistakes,
            completedAt: Date.now(),
          },
        };

        const { updatedUnlocked, newlyUnlockedIds } = syncUnlockedBadgesMap(
          nextCompletedStages,
          prevSnap.unlockedBadges,
        );

        setRecentUnlockedBadgeIds(newlyUnlockedIds);

        setProgress((p) => ({
          ...p,
          inProgressStages: {
            ...p.inProgressStages,
            [currentBlueprint.id]: {
              placedPartIds: updatedPlaced,
              mistakesCount: curMistakes,
              updatedAt: Date.now(),
            },
          },
          completedStages: nextCompletedStages,
          unlockedBadges: updatedUnlocked,
        }));

        window.setTimeout(() => {
          soundEngine.playStageVictory();
          if (newlyUnlockedIds.length > 0) {
            window.setTimeout(() => {
              soundEngine.playBadgeUnlocked();
            }, 420);
          }
        }, 160);

        window.setTimeout(() => {
          setDiscoveryOpen(true);
        }, 850);
      }

      setStagedPartId(null);
      setActiveDragPartId(null);
      setHintPartId((prev) => (prev === partId ? null : prev));
    },
    [currentBlueprint, flashStatus, placedPartIds, t],
  );

  const handlePartDropRejected = useCallback(
    (reason: string) => {
      setProgress((p) => {
        const cur = p.inProgressStages[currentBlueprint.id];
        return {
          ...p,
          inProgressStages: {
            ...p.inProgressStages,
            [currentBlueprint.id]: {
              placedPartIds: cur?.placedPartIds ?? [],
              mistakesCount: (cur?.mistakesCount ?? 0) + 1,
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
      setStagedPartId(partId);
      setActiveDragPartId(partId);
      setExplodedFactor(0);
    },
    [progress.preferredStyle],
  );

  const handleClickPartCard = useCallback(
    (partId: string) => {
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
    if (hasNextStage) {
      handleSelectBlueprint(VEHICLE_BLUEPRINTS[currentIndex + 1].id);
    }
  }, [currentIndex, handleSelectBlueprint, hasNextStage]);

  const handleOpenTour = useCallback(() => {
    setDockCollapsed(false);
    setCatalogOpen(false);
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

  const handleResetAllProgress = useCallback(() => {
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

  const isCompleted = placedPartIds.length === currentBlueprint.parts.length;
  const currentStars =
    progress.completedStages[currentBlueprint.id]?.stars ??
    (mistakesCount === 0 ? 3 : mistakesCount <= 2 ? 2 : 1);

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="flex flex-col w-full h-full bg-[#F4F6F9] text-slate-900 overflow-hidden"
    >
      {/* Top Bar with FR / العربية Language Switcher */}
      <TopBar
        language={language}
        onSelectLanguage={handleSelectLanguage}
        visualStyle={progress.preferredStyle}
        onSelectStyle={handleSelectStyle}
        onOpenCatalog={() => setCatalogOpen(true)}
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
        onSaveNow={handleManualSave}
        onExportSave={handleExportSave}
        onImportSaveFile={handleImportSaveFile}
        onResetAllProgress={handleResetAllProgress}
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
        onOpenProgression={() => setProgressionOpen(true)}
        hasNextStage={hasNextStage}
        onNextStage={handleGoNextStage}
      />

      {/* Automatic Interactive Guided Tour ("Tour du Propriétaire" / "جولة تعريفية") */}
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
