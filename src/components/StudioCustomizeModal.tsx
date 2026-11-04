import React, { useCallback, useEffect, useState } from 'react';
import { Camera, Check, Download, Lock, Paintbrush, RefreshCw, X } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { LIVERY_PRESETS, LiveryPresetSpec } from '../data/liveries';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode, LicenseState, LiveryPresetId, VehicleBlueprint, WorkshopGroundPreset, WorkshopThemeConfig } from '../types/game';
import { composePostcardDataUrl, downloadDataUrlAsPng } from '../utils/postcard';
import { canUseLivery } from '../utils/entitlements';

const GROUND_PRESETS: {
  preset: WorkshopGroundPreset;
  emoji: string;
  labelKey: 'groundAsphalt' | 'groundGrass' | 'groundSand' | 'groundSnow' | 'groundCircuit' | 'groundLightWood' | 'groundMoon' | 'groundWater';
  colors: string;
}[] = [
  { preset: 'asphalt',    emoji: '🛣️',  labelKey: 'groundAsphalt',   colors: 'linear-gradient(135deg, #3a3a3a 50%, #555 50%)' },
  { preset: 'grass',      emoji: '🌿',  labelKey: 'groundGrass',     colors: 'linear-gradient(135deg, #4a7c3f 50%, #3d6834 50%)' },
  { preset: 'sand',       emoji: '🏖️',  labelKey: 'groundSand',      colors: 'linear-gradient(135deg, #e2c97e 50%, #d4b96a 50%)' },
  { preset: 'snow',       emoji: '❄️',  labelKey: 'groundSnow',      colors: 'linear-gradient(135deg, #eef4fb 50%, #dde8f5 50%)' },
  { preset: 'circuit',    emoji: '⚡',  labelKey: 'groundCircuit',   colors: 'linear-gradient(135deg, #1a1a2e 50%, #001a2e 50%)' },
  { preset: 'light_wood', emoji: '🪵',  labelKey: 'groundLightWood', colors: 'linear-gradient(135deg, #d4aa70 50%, #b8926a 50%)' },
  { preset: 'moon',       emoji: '🌕',  labelKey: 'groundMoon',      colors: 'linear-gradient(135deg, #2d2d35 50%, #3a3a44 50%)' },
  { preset: 'water',      emoji: '🌊',  labelKey: 'groundWater',     colors: 'linear-gradient(135deg, #1e6b8e 50%, #0d4d6b 50%)' },
];

interface StudioCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  blueprint: VehicleBlueprint;
  profileName: string;
  stars: number;
  bestTimeMs: number | null;
  hasPatent: boolean;
  bestStreak: number;
  currentLivery: LiveryPresetId;
  onSelectLivery: (liveryId: LiveryPresetId, label: string) => void;
  onLockedLiveryAttempt?: (requiredDays: number) => void;
  licenseState: LicenseState;
  onOpenUpgrade?: () => void;
  captureSnapshot: () => string | null;
  onPostcardDownloaded: () => void;
  workshopTheme?: WorkshopThemeConfig;
  onSelectGroundPreset: (preset: WorkshopGroundPreset) => void;
}

export const StudioCustomizeModal: React.FC<StudioCustomizeModalProps> = ({
  isOpen,
  onClose,
  language,
  blueprint,
  profileName,
  stars,
  bestTimeMs,
  hasPatent,
  bestStreak,
  currentLivery,
  onSelectLivery,
  onLockedLiveryAttempt,
  licenseState,
  onOpenUpgrade,
  captureSnapshot,
  onPostcardDownloaded,
  workshopTheme,
  onSelectGroundPreset,
}) => {
  const [postcardUrl, setPostcardUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generatePreview = useCallback(
    async (playSound: boolean) => {
      const rawSnap = captureSnapshot();
      if (!rawSnap) return;
      if (playSound) {
        soundEngine.playCameraShutter();
      }
      setIsGenerating(true);
      try {
        const composed = await composePostcardDataUrl(rawSnap, {
          language,
          vehicleName: blueprint.name,
          stageSubtitle: blueprint.tierLabel,
          profileName,
          stars,
          bestTimeMs,
          hasPatent,
          liveryId: currentLivery,
        });
        setPostcardUrl(composed);
      } catch {
        setPostcardUrl(rawSnap);
      } finally {
        setIsGenerating(false);
      }
    },
    [
      bestTimeMs,
      blueprint.name,
      blueprint.tierLabel,
      captureSnapshot,
      currentLivery,
      hasPatent,
      language,
      profileName,
      stars,
    ],
  );

  // Refresh the souvenir postcard whenever the modal opens or livery changes (giving 1 frame for WebGL material update)
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      void generatePreview(false);
    }, 60);
    return () => window.clearTimeout(timer);
  }, [currentLivery, generatePreview, isOpen]);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];

  const freeLiveryIds = LIVERY_PRESETS.slice(0, 3).map((p) => p.id);

  const handleChooseLivery = (preset: LiveryPresetSpec) => {
    if (!canUseLivery(licenseState, preset.id, freeLiveryIds)) {
      onOpenUpgrade?.();
      return;
    }
    if (preset.requiredStreakDays && bestStreak < preset.requiredStreakDays) {
      onLockedLiveryAttempt?.(preset.requiredStreakDays);
      return;
    }
    onSelectLivery(preset.id, preset.label[language]);
  };

  const handleDownload = () => {
    if (!postcardUrl) return;
    downloadDataUrlAsPng(postcardUrl, blueprint.name);
    onPostcardDownloaded();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-modal-title"
    >
      <div className="w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
              <Paintbrush className="w-3.5 h-3.5 shrink-0" />
              <span>{blueprint.name}</span>
            </div>
            <h2
              id="studio-modal-title"
              className="mt-1 font-display text-xl sm:text-2xl font-bold text-slate-900"
            >
              {t.studioModalTitle}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">{t.studioModalSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeStudioAria}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Section 1: Paint Booth */}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.studioPaintSectionTitle}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{t.studioPaintSectionDesc}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LIVERY_PRESETS.map((preset) => {
                const isSelected = currentLivery === preset.id;
                const isStreakLocked = Boolean(
                  preset.requiredStreakDays && bestStreak < preset.requiredStreakDays,
                );
                const isPaywalled = !canUseLivery(licenseState, preset.id, freeLiveryIds);
                const isLocked = isStreakLocked || isPaywalled;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleChooseLivery(preset)}
                    title={
                      isPaywalled
                        ? 'Pass Famille requis'
                        : isStreakLocked && preset.requiredStreakDays
                          ? t.liveryLockedStreakHint(preset.requiredStreakDays)
                          : preset.label[language]
                    }
                    className={`flex items-center justify-between gap-2.5 p-2.5 rounded-lg border text-start transition-colors cursor-pointer min-h-[48px] ${
                      isPaywalled
                        ? 'bg-amber-50/70 border-amber-200 text-slate-500 hover:border-amber-400'
                        : isStreakLocked
                          ? 'bg-slate-50 border-slate-200 text-slate-500 hover:border-amber-300'
                          : isSelected
                            ? 'bg-sky-50 border-sky-600 text-slate-900'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-5 h-5 rounded-md border border-black/15 shrink-0"
                        style={{
                          background:
                            preset.id === 'original'
                              ? `linear-gradient(135deg, ${blueprint.parts[0]?.primaryColor ?? preset.primaryHex} 55%, ${blueprint.parts[0]?.secondaryColor ?? preset.secondaryHex} 45%)`
                              : `linear-gradient(135deg, ${preset.primaryHex} 60%, ${preset.secondaryHex} 40%)`,
                        }}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-semibold truncate">
                        {preset.label[language]}
                      </span>
                    </div>
                    {isPaywalled ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                        ✨
                      </span>
                    ) : isStreakLocked ? (
                      <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                    ) : isSelected ? (
                      <Check className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 2: 3D Souvenir Postcard Studio */}
          <section className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t.studioPhotoSectionTitle}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{t.studioPhotoSectionDesc}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void generatePreview(true)}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer min-h-[38px]"
                >
                  {postcardUrl ? (
                    <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{postcardUrl ? t.retakePostcardBtn : t.capturePostcardBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!postcardUrl || isGenerating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer min-h-[38px]"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.downloadPostcardBtn}</span>
                </button>
              </div>
            </div>

            <div className="w-full rounded-xl border border-slate-200 bg-slate-100 p-3 flex items-center justify-center min-h-[240px]">
              {postcardUrl ? (
                <img
                  src={postcardUrl}
                  alt={blueprint.name}
                  className="max-h-[340px] w-auto rounded-lg border border-slate-200 shadow-xs object-contain"
                />
              ) : (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 py-12">
                  <Camera className="w-4 h-4 shrink-0" />
                  <span>{t.capturePostcardBtn}</span>
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Mon Atelier — Workshop Ground Customization */}
          <section className="pt-4 border-t border-slate-200 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.workshopThemeSectionTitle}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{t.workshopThemeSectionDesc}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GROUND_PRESETS.map(({ preset, emoji, labelKey, colors }) => {
                const isSelected = (workshopTheme?.groundPreset ?? 'asphalt') === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onSelectGroundPreset(preset)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-colors cursor-pointer min-h-[72px] ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 text-slate-900'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg border border-black/10 shrink-0"
                      style={{ background: colors }}
                      aria-hidden="true"
                    />
                    <span className="text-[11px] font-semibold leading-tight text-center">
                      {emoji} {t[labelKey]}
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-sky-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
