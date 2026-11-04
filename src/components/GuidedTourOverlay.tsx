import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Hand,
  Magnet,
  Rotate3d,
  Sparkles,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode } from '../types/game';
import { useSpeech } from '../utils/speech';

interface SpotlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

interface GuidedTourOverlayProps {
  isOpen: boolean;
  language: LanguageCode;
  firstPartName: string;
  vehicleName: string;
  hasSnappedAnyPart: boolean;
  onStepChange: (stepIndex: number) => void;
  onFinish: () => void;
}

function roundedRectSvgPath(r: SpotlightRect): string {
  const { x, y, width: w, height: h } = r;
  const rad = Math.min(r.radius, w / 2, h / 2);
  return [
    `M ${x + rad} ${y}`,
    `H ${x + w - rad}`,
    `Q ${x + w} ${y} ${x + w} ${y + rad}`,
    `V ${y + h - rad}`,
    `Q ${x + w} ${y + h} ${x + w - rad} ${y + h}`,
    `H ${x + rad}`,
    `Q ${x} ${y + h} ${x} ${y + h - rad}`,
    `V ${y + rad}`,
    `Q ${x} ${y} ${x + rad} ${y}`,
    'Z',
  ].join(' ');
}

export const GuidedTourOverlay: React.FC<GuidedTourOverlayProps> = ({
  isOpen,
  language,
  firstPartName,
  vehicleName,
  hasSnappedAnyPart,
  onStepChange,
  onFinish,
}) => {
  const t = UI_TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const totalSteps = t.tourSteps.length;
  const { isSupported: speechSupported, isSpeaking, activeId, toggle: toggleSpeech, stop } =
    useSpeech();

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  });
  const [spotlights, setSpotlights] = useState<SpotlightRect[]>([]);
  const [dragTrajectory, setDragTrajectory] = useState<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  } | null>(null);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setStepIndex(0);
      onStepChange(0);
    }
    if (!isOpen) stop();
    wasOpenRef.current = isOpen;
  }, [isOpen, onStepChange, stop]);

  const measureTargets = useCallback(() => {
    if (!isOpen || typeof window === 'undefined') return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setViewportSize({ w: vw, h: vh });

    const pad = 8;
    const rects: SpotlightRect[] = [];
    let trajectory: { fromX: number; fromY: number; toX: number; toY: number } | null = null;

    if (stepIndex === 0) {
      const trayEl = document.querySelector('[data-tour="parts-tray"]');
      if (trayEl) {
        const b = trayEl.getBoundingClientRect();
        rects.push({
          x: Math.max(8, b.left - pad),
          y: Math.max(8, b.top - pad),
          width: Math.min(vw - 16, b.width + pad * 2),
          height: b.height + pad * 2,
          radius: 12,
        });
      }
    } else if (stepIndex === 1) {
      const firstCardEl =
        document.querySelector('[data-tour="first-part-card"]') ??
        document.querySelector('[data-tour="parts-tray"]');
      const centerW = Math.min(360, vw * 0.42);
      const centerH = Math.min(230, vh * 0.3);
      const centerZone: SpotlightRect = {
        x: vw / 2 - centerW / 2,
        y: Math.max(76, vh * 0.34 - centerH / 2),
        width: centerW,
        height: centerH,
        radius: 16,
      };
      rects.push(centerZone);

      if (firstCardEl) {
        const b = firstCardEl.getBoundingClientRect();
        const cardSpot: SpotlightRect = {
          x: Math.max(8, b.left - 6),
          y: Math.max(8, b.top - 6),
          width: b.width + 12,
          height: b.height + 12,
          radius: 12,
        };
        rects.push(cardSpot);

        trajectory = {
          fromX: cardSpot.x + cardSpot.width / 2,
          fromY: cardSpot.y,
          toX: centerZone.x + centerZone.width / 2,
          toY: centerZone.y + centerZone.height * 0.62,
        };
      }
    } else if (stepIndex === 2) {
      const camEl = document.querySelector('[data-tour="camera-controls"]');
      if (camEl) {
        const b = camEl.getBoundingClientRect();
        rects.push({
          x: Math.max(8, b.left - pad),
          y: Math.max(8, b.top - pad),
          width: Math.min(vw - 16, b.width + pad * 2),
          height: b.height + pad * 2,
          radius: 12,
        });
      }
    } else if (stepIndex === 3) {
      const stylesEl = document.querySelector('[data-tour="topbar-styles"]');
      const mascotEl = document.querySelector('[data-tour="mascot-cta"]');
      if (stylesEl) {
        const b = stylesEl.getBoundingClientRect();
        if (b.width > 0) {
          rects.push({
            x: b.left - 10,
            y: b.top - 6,
            width: b.width + 20,
            height: b.height + 12,
            radius: 10,
          });
        }
      }
      if (mascotEl) {
        const b = mascotEl.getBoundingClientRect();
        rects.push({
          x: b.left - 6,
          y: b.top - 6,
          width: b.width + 12,
          height: b.height + 12,
          radius: 10,
        });
      }
    }

    setSpotlights(rects);
    setDragTrajectory(trajectory);
  }, [isOpen, stepIndex, firstPartName, language]);

  useEffect(() => {
    if (!isOpen) return;
    const raf = window.requestAnimationFrame(measureTargets);
    window.addEventListener('resize', measureTargets);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', measureTargets);
    };
  }, [isOpen, measureTargets]);

  const goToStep = useCallback(
    (next: number) => {
      stop();
      const clamped = Math.max(0, Math.min(totalSteps - 1, next));
      setStepIndex(clamped);
      onStepChange(clamped);
    },
    [onStepChange, stop, totalSteps],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onFinish();
      } else if (e.key === (isRtl ? 'ArrowLeft' : 'ArrowRight')) {
        if (stepIndex < totalSteps - 1) goToStep(stepIndex + 1);
        else onFinish();
      } else if (e.key === (isRtl ? 'ArrowRight' : 'ArrowLeft') && stepIndex > 0) {
        goToStep(stepIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goToStep, isOpen, isRtl, onFinish, stepIndex, totalSteps]);

  if (!isOpen) return null;

  const currentStep = t.tourSteps[stepIndex] ?? t.tourSteps[0];
  const isLastStep = stepIndex === totalSteps - 1;
  const PrevIcon = isRtl ? ArrowRight : ArrowLeft;
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;

  const outerPath = `M 0 0 H ${viewportSize.w} V ${viewportSize.h} H 0 Z`;
  const cutoutsPath = spotlights.map(roundedRectSvgPath).join(' ');
  const combinedMaskPath = `${outerPath} ${cutoutsPath}`;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      role="dialog"
      aria-modal="false"
      aria-label={t.tourAriaLabel}
    >
      {/* Dimming Spotlight SVG in absolute screen space */}
      <svg
        width={viewportSize.w}
        height={viewportSize.h}
        viewBox={`0 0 ${viewportSize.w} ${viewportSize.h}`}
        className="pointer-events-none absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="tour-arrow-head"
            markerWidth="10"
            markerHeight="10"
            refX="7"
            refY="5"
            orient="auto"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
          </marker>
        </defs>

        <path d={combinedMaskPath} fill="rgba(15, 23, 42, 0.54)" fillRule="evenodd" />

        {spotlights.map((s, idx) => (
          <rect
            key={idx}
            x={s.x}
            y={s.y}
            width={s.width}
            height={s.height}
            rx={s.radius}
            ry={s.radius}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />
        ))}

        {stepIndex === 1 && dragTrajectory && (
          <path
            d={`M ${dragTrajectory.fromX} ${dragTrajectory.fromY - 6} Q ${
              (dragTrajectory.fromX + dragTrajectory.toX) / 2 + (isRtl ? 48 : -48)
            } ${(dragTrajectory.fromY + dragTrajectory.toY) / 2} ${dragTrajectory.toX} ${
              dragTrajectory.toY
            }`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="8 6"
            markerEnd="url(#tour-arrow-head)"
          />
        )}
      </svg>

      {/* Guided Tour Coach Card — anchored to start edge so center 3D & end CTA stay visible */}
      <div
        className={`pointer-events-auto absolute top-20 w-[92vw] max-w-sm max-h-[55vh] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg p-5 ${
          isRtl ? 'right-4 sm:right-6' : 'left-4 sm:left-6'
        }`}
      >
        {/* Top Kicker & Dismiss */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-sky-700">{t.tourKicker}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {t.tourStepCounter(stepIndex + 1, totalSteps)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {speechSupported && (
              <button
                type="button"
                onClick={() =>
                  toggleSpeech(
                    `tour-step-${stepIndex}`,
                    `${currentStep.title}. ${currentStep.description}. ${currentStep.tip}`,
                    language,
                  )
                }
                aria-label={
                  isSpeaking && activeId === `tour-step-${stepIndex}`
                    ? t.voiceStopBtn
                    : t.voiceListenBtn
                }
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors cursor-pointer"
              >
                {isSpeaking && activeId === `tour-step-${stepIndex}` ? (
                  <>
                    <Square className="w-3 h-3 text-rose-600 shrink-0" />
                    <span>{t.voiceStopBtn}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.voiceListenBtn}</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                stop();
                onFinish();
              }}
              aria-label={t.closeTourAria}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Explanation */}
        <div className="mt-3">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {currentStep.title}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Visual Drag-and-Drop Mini-Simulator on Step 2 */}
        {stepIndex === 1 && (
          <div className="mt-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="relative h-28 flex flex-col items-center justify-between overflow-hidden">
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 border-dashed border-sky-400 bg-sky-50/70 text-xs font-semibold text-sky-800">
                <Magnet className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{t.tourSilhouetteLabel(firstPartName)}</span>

                <span
                  className={`tour-snap-badge absolute -top-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-semibold shadow-xs ${
                    isRtl ? '-left-2' : '-right-2'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{t.tourSnappedBadge}</span>
                </span>
              </div>

              <div className="tour-drag-piece flex items-center gap-1.5 px-3 py-1.5 bg-white border border-sky-600 rounded-md shadow-xs text-xs font-semibold text-slate-900">
                <Hand className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{t.tourDragUpLabel(firstPartName)}</span>
              </div>
            </div>

            {hasSnappedAnyPart && (
              <p className="mt-2 pt-2 border-t border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{t.tourGreatFirstSnap(vehicleName)}</span>
              </p>
            )}
          </div>
        )}

        {/* Quick Camera Visual Hint on Step 3 */}
        {stepIndex === 2 && (
          <div className="mt-3 flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
            <Rotate3d className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{t.tourRotateHint}</span>
          </div>
        )}

        {/* Practical Tip */}
        <p className="mt-3 text-xs text-slate-500 leading-relaxed">{currentStep.tip}</p>

        {/* Step Navigation Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onFinish}
            className="px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
          >
            {t.tourSkipBtn}
          </button>

          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => goToStep(stepIndex - 1)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
              >
                <PrevIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{t.tourPrevBtn}</span>
              </button>
            )}

            {isLastStep ? (
              <button
                type="button"
                onClick={onFinish}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
              >
                <span>{t.tourPlayNowBtn}</span>
                <Check className="w-3.5 h-3.5 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToStep(stepIndex + 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
              >
                <span>{t.tourNextBtn}</span>
                <NextIcon className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
