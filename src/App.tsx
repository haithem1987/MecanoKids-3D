/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VEHICLE_BLUEPRINTS } from './data/blueprints';
import {
  CameraPreset,
  ChatMessage,
  DiscoverySheet,
  PlayerProgress,
  VisualStyleMode,
} from './types/game';
import { soundEngine } from './audio/soundEngine';
import { TopBar } from './components/TopBar';
import { WorkshopCanvas } from './components/WorkshopCanvas';
import { BottomPartsDock } from './components/BottomPartsDock';
import { StageCatalogModal } from './components/StageCatalogModal';
import { MascotChatDrawer } from './components/MascotChatDrawer';
import { DiscoveryModal } from './components/DiscoveryModal';

const STORAGE_KEY = 'mecanokids_3d_progress_v1';

const DEFAULT_PROGRESS: PlayerProgress = {
  completedStages: {},
  preferredStyle: VisualStyleMode.WOOD,
  freeWorkshopUnlocked: false,
  muted: false,
};

function loadInitialProgress(): PlayerProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    return {
      completedStages: parsed.completedStages ?? {},
      preferredStyle: parsed.preferredStyle ?? VisualStyleMode.WOOD,
      freeWorkshopUnlocked: Boolean(parsed.freeWorkshopUnlocked),
      muted: Boolean(parsed.muted),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(loadInitialProgress);
  const [currentBlueprintId, setCurrentBlueprintId] = useState<string>(VEHICLE_BLUEPRINTS[0].id);
  const [placedPartIds, setPlacedPartIds] = useState<string[]>([]);
  const [stagedPartId, setStagedPartId] = useState<string | null>(null);
  const [activeDragPartId, setActiveDragPartId] = useState<string | null>(null);
  const [hintPartId, setHintPartId] = useState<string | null>(null);
  const [mistakesCount, setMistakesCount] = useState<number>(0);

  const [explodedFactor, setExplodedFactor] = useState<number>(0);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>(CameraPreset.ISO);
  const [cameraPresetNonce, setCameraPresetNonce] = useState<number>(0);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const statusTimerRef = useRef<number | null>(null);

  // Modals & Drawers (never fire arrival popups on page load)
  const [catalogOpen, setCatalogOpen] = useState<boolean>(false);
  const [mascotOpen, setMascotOpen] = useState<boolean>(false);
  const [discoveryOpen, setDiscoveryOpen] = useState<boolean>(false);

  // Mascot Multi-turn Chat History
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_leo',
      role: 'model',
      text: "Salut jeune mécanicien ! Je suis Mécano Léo. Saisis une pièce dans l'établi du bas et approche-la de sa silhouette guide 3D pour construire ton véhicule !",
    },
  ]);

  // Google Search Discovery Cache per Vehicle
  const [discoveryCache, setDiscoveryCache] = useState<Record<string, DiscoverySheet>>({});
  const [discoveryLoading, setDiscoveryLoading] = useState<boolean>(false);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);

  const currentBlueprint = useMemo(
    () => VEHICLE_BLUEPRINTS.find((b) => b.id === currentBlueprintId) ?? VEHICLE_BLUEPRINTS[0],
    [currentBlueprintId],
  );

  const currentIndex = useMemo(
    () => VEHICLE_BLUEPRINTS.findIndex((b) => b.id === currentBlueprint.id),
    [currentBlueprint.id],
  );
  const hasNextStage = currentIndex >= 0 && currentIndex < VEHICLE_BLUEPRINTS.length - 1;

  // Persist progress & sync sound mute
  useEffect(() => {
    soundEngine.setMuted(progress.muted);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors in restricted sandboxes
    }
  }, [progress]);

  // Keyboard shortcut 'H' to toggle Zen 3D Dock collapse (when not typing in chat input)
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

  // Fetch Real-World Google Search Grounded Discovery Sheet
  const fetchDiscoveryForBlueprint = useCallback(
    async (bp = currentBlueprint) => {
      if (discoveryCache[bp.id]) return;
      setDiscoveryLoading(true);
      setDiscoveryError(null);

      try {
        const res = await fetch('/api/discovery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicleName: bp.name,
            category: bp.category,
            realWorldQuery: bp.realWorldQuery,
            partsCount: bp.parts.length,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Impossible de charger la fiche découverte.');
        }

        setDiscoveryCache((prev) => ({
          ...prev,
          [bp.id]: {
            vehicleId: bp.id,
            content: data.content,
            sources: Array.isArray(data.sources) ? data.sources : [],
          },
        }));
      } catch (err) {
        setDiscoveryError(
          err instanceof Error
            ? err.message
            : 'Impossible de récupérer les informations Google Search.',
        );
      } finally {
        setDiscoveryLoading(false);
      }
    },
    [currentBlueprint, discoveryCache],
  );

  const handleSelectBlueprint = useCallback((blueprintId: string) => {
    setCurrentBlueprintId(blueprintId);
    setPlacedPartIds([]);
    setStagedPartId(null);
    setActiveDragPartId(null);
    setHintPartId(null);
    setMistakesCount(0);
    setExplodedFactor(0);
    setCameraPreset(CameraPreset.ISO);
    setCameraPresetNonce((n) => n + 1);
    setStatusMessage(null);
  }, []);

  const handleResetStage = useCallback(() => {
    setPlacedPartIds([]);
    setStagedPartId(null);
    setActiveDragPartId(null);
    setHintPartId(null);
    setMistakesCount(0);
    setExplodedFactor(0);
    setCameraPreset(CameraPreset.ISO);
    setCameraPresetNonce((n) => n + 1);
    flashStatus(`Établi remis à zéro pour ${currentBlueprint.name}.`);
  }, [currentBlueprint.name, flashStatus]);

  const handlePartSnapped = useCallback(
    (partId: string) => {
      setPlacedPartIds((prev) => {
        if (prev.includes(partId)) return prev;
        const updated = [...prev, partId];

        if (updated.length === currentBlueprint.parts.length) {
          // Stage Complete!
          const stars = mistakesCount === 0 ? 3 : mistakesCount <= 2 ? 2 : 1;
          window.setTimeout(() => {
            soundEngine.playStageVictory();
          }, 160);

          setProgress((p) => {
            const existing = p.completedStages[currentBlueprint.id];
            const bestStars = Math.max(existing?.stars ?? 0, stars);
            const bestMistakes =
              existing?.bestMistakes !== undefined
                ? Math.min(existing.bestMistakes, mistakesCount)
                : mistakesCount;
            return {
              ...p,
              completedStages: {
                ...p.completedStages,
                [currentBlueprint.id]: {
                  completed: true,
                  stars: bestStars,
                  bestMistakes,
                },
              },
            };
          });

          fetchDiscoveryForBlueprint(currentBlueprint);
          window.setTimeout(() => {
            setDiscoveryOpen(true);
          }, 900);
        } else {
          const snappedSpec = currentBlueprint.parts.find((p) => p.id === partId);
          if (snappedSpec) {
            flashStatus(`✓ ${snappedSpec.name} assemblée ! ${snappedSpec.roleHint}`);
          }
        }
        return updated;
      });

      setStagedPartId(null);
      setActiveDragPartId(null);
      setHintPartId((prev) => (prev === partId ? null : prev));
    },
    [currentBlueprint, fetchDiscoveryForBlueprint, flashStatus, mistakesCount],
  );

  const handlePartDropRejected = useCallback(
    (reason: string) => {
      setMistakesCount((m) => m + 1);
      flashStatus(reason);
    },
    [flashStatus],
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
            currentBlueprint.parts.find((p) => p.id === missing)?.name ?? 'la base';
          flashStatus(`Pose d'abord "${missingName}" avant d'installer "${spec.name}".`);
        } else {
          flashStatus(
            `"${spec.name}" prête : clique sur sa silhouette lumineuse ou glisse-la sur le plateau !`,
          );
        }
      }
    },
    [currentBlueprint.parts, flashStatus, placedPartIds],
  );

  const handleSelectStyle = useCallback((style: VisualStyleMode) => {
    setProgress((p) => ({ ...p, preferredStyle: style }));
  }, []);

  const handleSelectCamera = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    setCameraPresetNonce((n) => n + 1);
  }, []);

  const handleGoNextStage = useCallback(() => {
    if (hasNextStage) {
      handleSelectBlueprint(VEHICLE_BLUEPRINTS[currentIndex + 1].id);
    }
  }, [currentIndex, handleSelectBlueprint, hasNextStage]);

  const isCompleted = placedPartIds.length === currentBlueprint.parts.length;
  const currentStars =
    progress.completedStages[currentBlueprint.id]?.stars ??
    (mistakesCount === 0 ? 3 : mistakesCount <= 2 ? 2 : 1);

  return (
    <div className="flex flex-col w-full h-full bg-[#F4F6F9] text-slate-900 overflow-hidden">
      {/* 3-Zone Top Bar */}
      <TopBar
        visualStyle={progress.preferredStyle}
        onSelectStyle={handleSelectStyle}
        onOpenCatalog={() => setCatalogOpen(true)}
        onOpenDiscovery={() => {
          if (isCompleted) {
            fetchDiscoveryForBlueprint(currentBlueprint);
          }
          setDiscoveryOpen(true);
        }}
        onOpenMascot={() => setMascotOpen((o) => !o)}
      />

      {/* Full-Viewport 100% Unobstructed 3D Center Stage */}
      <main className="relative flex-1 w-full overflow-hidden">
        <WorkshopCanvas
          blueprint={currentBlueprint}
          placedPartIds={placedPartIds}
          visualStyle={progress.preferredStyle}
          explodedFactor={explodedFactor}
          cameraPreset={cameraPreset}
          cameraPresetNonce={cameraPresetNonce}
          activeDragPartId={activeDragPartId}
          stagedPartId={stagedPartId}
          hintPartId={hintPartId}
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
        blueprint={currentBlueprint}
        totalStages={VEHICLE_BLUEPRINTS.length}
        placedPartIds={placedPartIds}
        stagedPartId={stagedPartId}
        activeDragPartId={activeDragPartId}
        hintPartId={hintPartId}
        collapsed={dockCollapsed}
        onToggleCollapse={() => setDockCollapsed((c) => !c)}
        explodedFactor={explodedFactor}
        onChangeExploded={setExplodedFactor}
        cameraPreset={cameraPreset}
        onSelectCamera={handleSelectCamera}
        visualStyle={progress.preferredStyle}
        onSelectStyle={handleSelectStyle}
        muted={progress.muted}
        onToggleMute={() => setProgress((p) => ({ ...p, muted: !p.muted }))}
        onResetStage={handleResetStage}
        onStartPartDrag={handleStartPartDrag}
        onClickPartCard={handleClickPartCard}
        onOpenCatalog={() => setCatalogOpen(true)}
        onOpenVictoryModal={() => {
          fetchDiscoveryForBlueprint(currentBlueprint);
          setDiscoveryOpen(true);
        }}
        hasNextStage={hasNextStage}
        onGoNextStage={handleGoNextStage}
        statusMessage={statusMessage}
      />

      {/* Stage Catalog Modal */}
      <StageCatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        blueprints={VEHICLE_BLUEPRINTS}
        currentBlueprintId={currentBlueprint.id}
        progress={progress}
        visualStyle={progress.preferredStyle}
        onSelectStyle={handleSelectStyle}
        onSelectBlueprint={handleSelectBlueprint}
        onToggleFreeWorkshop={() =>
          setProgress((p) => ({ ...p, freeWorkshopUnlocked: !p.freeWorkshopUnlocked }))
        }
      />

      {/* Mascot Multi-Turn Gemini Chat Drawer */}
      <MascotChatDrawer
        isOpen={mascotOpen}
        onClose={() => setMascotOpen(false)}
        blueprint={currentBlueprint}
        placedPartIds={placedPartIds}
        visualStyle={progress.preferredStyle}
        messages={chatMessages}
        onAppendMessage={(msg) => setChatMessages((prev) => [...prev, msg])}
        onHighlightHintPart={(partId) => setHintPartId(partId)}
      />

      {/* Google Search Grounded Discovery & Victory Modal */}
      <DiscoveryModal
        isOpen={discoveryOpen}
        onClose={() => setDiscoveryOpen(false)}
        blueprint={currentBlueprint}
        isCompleted={isCompleted}
        starsEarned={currentStars}
        discovery={discoveryCache[currentBlueprint.id] ?? null}
        loading={discoveryLoading}
        error={discoveryError}
        onRetryDiscovery={() => fetchDiscoveryForBlueprint(currentBlueprint)}
        hasNextStage={hasNextStage}
        onNextStage={handleGoNextStage}
      />
    </div>
  );
}
