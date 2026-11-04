import React, { useEffect, useMemo, useState } from 'react';
import { FichesPedaPanel } from './FichesPedaPanel';
import {
  Award,
  Clock,
  Download,
  GraduationCap,
  Monitor,
  Printer,
  RotateCcw,
  ShieldCheck,
  Trash2,
  User,
  Volume2,
  X,
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  AgeProfile,
  DailyLimitMinutesOption,
  LanguageCode,
  ParentalSettings,
  PlayerProfile,
} from '../types/game';
import { getEffectiveDailyStreak } from '../utils/dailyStreak';
import {
  composeDiplomaDataUrl,
  downloadDiplomaPng,
  printDiplomaImage,
} from '../utils/diplomaRenderer';
import {
  formatMinutesClock,
  GentleTimerStatus,
  VALID_DAILY_LIMIT_OPTIONS,
} from '../utils/sessionTimer';
import {
  computeStemCompetencyReport,
  DiplomaMilestoneId,
} from '../utils/stemAnalytics';
import { PROFILE_COLOR_STYLES, renderProfileAvatarIcon } from './ProfilesModal';

type ParentTabId = 'stem' | 'timer' | 'diplomas' | 'profile' | 'classroom' | 'fiches';

interface ParentSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  todayDateKey: string;
  profiles: PlayerProfile[];
  activeProfileId: string;
  onSwitchActiveProfile: (profileId: string) => void;
  parentalSettings: ParentalSettings;
  gentleTimerStatus: GentleTimerStatus;
  onChangeDailyLimit: (limit: DailyLimitMinutesOption | null) => void;
  onExtendToday15Min: () => void;
  onResetTodayTimer: () => void;
  onBackupProfile: (profile: PlayerProfile) => void;
  onDiplomaDownloaded: () => void;
  isOnline: boolean;
  initialTab?: ParentTabId;
  onShowLanding?: () => void;
  onDeleteAllData?: () => void;
  ageProfile?: AgeProfile;
  onChangeAgeProfile?: (profile: AgeProfile) => void;
  volumeSfx?: number;
  volumeVoice?: number;
  classroomSilent?: boolean;
  tbiMode?: boolean;
  onChangeClassroomSettings?: (patch: { volumeSfx?: number; volumeVoice?: number; classroomSilent?: boolean; tbiMode?: boolean }) => void;
}

export const ParentSpaceModal: React.FC<ParentSpaceModalProps> = ({
  isOpen,
  onClose,
  language,
  todayDateKey,
  profiles,
  activeProfileId,
  onSwitchActiveProfile,
  parentalSettings,
  gentleTimerStatus,
  onChangeDailyLimit,
  onExtendToday15Min,
  onResetTodayTimer,
  onBackupProfile,
  onDiplomaDownloaded,
  isOnline,
  initialTab = 'stem',
  onShowLanding,
  onDeleteAllData,
  ageProfile,
  onChangeAgeProfile,
  volumeSfx = 1,
  volumeVoice = 1,
  classroomSilent = false,
  tbiMode = false,
  onChangeClassroomSettings,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const t = UI_TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<ParentTabId>(initialTab);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(activeProfileId);
  const [selectedDiplomaId, setSelectedDiplomaId] = useState<DiplomaMilestoneId>('diploma_1');
  const [diplomaPreviewUrl, setDiplomaPreviewUrl] = useState<string | null>(null);
  const [renderingDiploma, setRenderingDiploma] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedProfileId(activeProfileId);
    setActiveTab(initialTab);
  }, [activeProfileId, initialTab, isOpen]);

  const inspectedProfile = useMemo(() => {
    return profiles.find((p) => p.id === selectedProfileId) ?? profiles[0];
  }, [profiles, selectedProfileId]);

  const stemReport = useMemo(() => {
    return computeStemCompetencyReport(inspectedProfile.progress, language);
  }, [inspectedProfile.progress, language]);

  const streakInfo = useMemo(() => {
    return getEffectiveDailyStreak(inspectedProfile.progress.dailyStreak, todayDateKey);
  }, [inspectedProfile.progress.dailyStreak, todayDateKey]);

  const bestStreak = Math.max(
    inspectedProfile.progress.dailyStreak.bestStreak,
    streakInfo.displayCount,
  );

  // Automatically select highest unlocked diploma when switching inspected child profile
  useEffect(() => {
    if (stemReport.highestUnlockedDiploma) {
      setSelectedDiplomaId(stemReport.highestUnlockedDiploma.id);
    } else {
      setSelectedDiplomaId('diploma_1');
    }
  }, [inspectedProfile.id, stemReport.highestUnlockedDiploma]);

  const activeDiplomaSpec = useMemo(() => {
    return (
      stemReport.diplomas.find((d) => d.id === selectedDiplomaId) ?? stemReport.diplomas[0]
    );
  }, [selectedDiplomaId, stemReport.diplomas]);

  // Render A4 Canvas preview whenever Diplomas tab is open and unlocked
  useEffect(() => {
    if (!isOpen || activeTab !== 'diplomas' || !activeDiplomaSpec.unlocked) {
      setDiplomaPreviewUrl(null);
      return;
    }
    let cancelled = false;
    setRenderingDiploma(true);
    composeDiplomaDataUrl({
      language,
      profileName: inspectedProfile.name,
      diploma: activeDiplomaSpec,
      report: stemReport,
    })
      .then((url) => {
        if (!cancelled) {
          setDiplomaPreviewUrl(url);
          setRenderingDiploma(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRenderingDiploma(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeDiplomaSpec, activeTab, inspectedProfile.name, isOpen, language, stemReport]);

  if (!isOpen) return null;

  const handleDownloadDiploma = () => {
    if (!diplomaPreviewUrl || !activeDiplomaSpec.unlocked) return;
    downloadDiplomaPng(diplomaPreviewUrl, inspectedProfile.name, activeDiplomaSpec.id);
    onDiplomaDownloaded();
  };

  const handlePrintDiploma = () => {
    if (!diplomaPreviewUrl || !activeDiplomaSpec.unlocked) return;
    printDiplomaImage(
      diplomaPreviewUrl,
      `${activeDiplomaSpec.rankTitle[language]} - ${inspectedProfile.name}`,
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parent-space-title"
    >
      <div className="flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 sm:px-7 py-5 border-b border-slate-200 bg-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0" />
              <h2
                id="parent-space-title"
                className="font-display text-xl font-bold text-slate-900"
              >
                {t.parentSpaceTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {t.parentSpaceSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeParentSpaceAria}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Child Profile Selector + Section Tabs */}
        <div className="px-5 sm:px-7 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-600">
              {t.parentProfileSelectLabel}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {profiles.map((prof) => {
                const isSelected = prof.id === inspectedProfile.id;
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => setSelectedProfileId(prof.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px] cursor-pointer ${
                      isSelected
                        ? 'bg-white border-sky-400 text-slate-900 shadow-2xs'
                        : 'bg-transparent border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                        PROFILE_COLOR_STYLES[prof.avatarColor].bg
                      }`}
                    >
                      {renderProfileAvatarIcon(prof.avatarIcon, 'w-3 h-3')}
                    </span>
                    <span className="max-w-[110px] truncate">{prof.name}</span>
                  </button>
                );
              })}
            </div>

            {inspectedProfile.id !== activeProfileId && (
              <button
                type="button"
                onClick={() => onSwitchActiveProfile(inspectedProfile.id)}
                className="px-2.5 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline underline-offset-4 cursor-pointer"
              >
                {t.parentSwitchActiveBtn}
              </button>
            )}
          </div>

          {/* Segmented Section Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('stem')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'stem'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span>{t.parentTabStem}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timer')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'timer'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{t.parentTabTimer}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diplomas')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'diplomas'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>{t.parentTabDiplomas}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>{t.parentTabProfile}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('classroom')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'classroom'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 shrink-0" />
              <span>{t.parentTabClassroom}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fiches')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'fiches'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>{t.parentTabFiches}</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-6">
          {activeTab === 'stem' && (
            <>
              {/* Key Quantitative Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs text-slate-500">{t.parentKpiCompleted}</p>
                  <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-slate-900">
                    {stemReport.completedVehicles}
                    <span className="text-sm font-normal text-slate-400">
                      /{stemReport.totalCatalogVehicles}
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs text-slate-500">{t.parentKpiPatents}</p>
                  <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-sky-700">
                    {stemReport.patentsCount}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs text-slate-500">{t.parentKpiRepairs}</p>
                  <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-emerald-700">
                    {stemReport.repairsCompletedCount}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs text-slate-500">{t.parentKpiStreak}</p>
                  <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-amber-700">
                    {t.streakDaysUnit(bestStreak)}
                  </p>
                </div>
              </div>

              {/* 4 STEM Competency Pillars */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {t.parentStemOverviewTitle}
                  </h3>
                  <div className="text-xs text-slate-600">
                    <span>{t.parentStemIndexLabel} : </span>
                    <span className="font-mono tabular-nums font-bold text-sky-700">
                      {stemReport.overallStemIndex}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stemReport.pillars.map((pillar) => (
                    <div
                      key={pillar.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-900">
                          {pillar.title}
                        </h4>
                        <span className="font-mono tabular-nums text-sm font-bold text-sky-700">
                          {pillar.score}%
                        </span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-600 transition-all duration-300"
                          style={{ width: `${Math.max(pillar.score > 0 ? 4 : 0, pillar.score)}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {pillar.summary}
                      </p>

                      <p className="text-[11px] font-mono tabular-nums text-slate-500 pt-0.5">
                        {pillar.evidenceLine}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Backup Action */}
              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={() => onBackupProfile(inspectedProfile)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[40px] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.parentBackupBtn}</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'timer' && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h3 className="font-display text-base font-bold text-slate-900">
                  {t.parentTimerSectionTitle}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.parentTimerSectionDesc}
                </p>
              </div>

              {/* Segmented Daily Limit Options */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <button
                  type="button"
                  onClick={() => onChangeDailyLimit(null)}
                  className={`px-3.5 py-3 rounded-xl border text-xs font-semibold transition-colors min-h-[44px] cursor-pointer ${
                    parentalSettings.dailyLimitMinutes === null
                      ? 'bg-sky-600 border-sky-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t.parentTimerUnlimited}
                </button>

                {VALID_DAILY_LIMIT_OPTIONS.map((mins) => {
                  const selected = parentalSettings.dailyLimitMinutes === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => onChangeDailyLimit(mins)}
                      className={`px-3.5 py-3 rounded-xl border font-mono tabular-nums text-xs font-semibold transition-colors min-h-[44px] cursor-pointer ${
                        selected
                          ? 'bg-sky-600 border-sky-600 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {t.parentTimerMinutesOption(mins)}
                    </button>
                  );
                })}
              </div>

              {/* Today's Telemetry & Controls */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">{t.parentTimerConsumedLabel}</p>
                    <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-slate-900">
                      {formatMinutesClock(gentleTimerStatus.consumedSeconds)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">{t.parentTimerRemainingLabel}</p>
                    <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-sky-700">
                      {gentleTimerStatus.remainingSeconds === null
                        ? t.parentTimerUnlimited
                        : formatMinutesClock(gentleTimerStatus.remainingSeconds)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                  {t.parentTimerGraceRuleNote}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {parentalSettings.dailyLimitMinutes !== null && (
                    <button
                      type="button"
                      onClick={onExtendToday15Min}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 text-xs font-semibold text-white hover:bg-sky-700 transition-colors min-h-[40px] cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t.parentTimerExtend15Btn}</span>
                    </button>
                  )}

                  {gentleTimerStatus.consumedSeconds > 0 && (
                    <button
                      type="button"
                      onClick={onResetTodayTimer}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors min-h-[40px] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t.parentTimerResetTodayBtn}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diplomas' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-display text-base font-bold text-slate-900">
                  {t.parentDiplomasSectionTitle}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.parentDiplomasSectionDesc}
                </p>
              </div>

              {/* Diploma Tier Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {stemReport.diplomas.map((dip) => {
                  const isSelected = dip.id === activeDiplomaSpec.id;
                  return (
                    <button
                      key={dip.id}
                      type="button"
                      onClick={() => setSelectedDiplomaId(dip.id)}
                      className={`text-start rounded-xl border p-3 transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/70'
                          : dip.unlocked
                            ? 'border-slate-200 bg-white hover:bg-slate-50'
                            : 'border-slate-200 bg-slate-50/60 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <p className="font-mono tabular-nums text-xs font-bold text-sky-700">
                        {dip.requiredVehicles}+
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-900 line-clamp-2">
                        {dip.rankTitle[language]}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {dip.unlocked
                          ? `✓ ${t.parentDiplomaUnlockedStatus}`
                          : t.parentDiplomaLockedStatus(dip.requiredVehicles)}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Live Diploma Canvas Preview or Locked Message */}
              {activeDiplomaSpec.unlocked ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 flex items-center justify-center min-h-[260px]">
                    {diplomaPreviewUrl && !renderingDiploma ? (
                      <img
                        src={diplomaPreviewUrl}
                        alt={activeDiplomaSpec.rankTitle[language]}
                        className="max-h-[360px] w-auto rounded-lg shadow-sm border border-slate-200"
                      />
                    ) : (
                      <p className="text-xs text-slate-500">...</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={handlePrintDiploma}
                      disabled={!diplomaPreviewUrl}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-45 min-h-[40px] cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-slate-600" />
                      <span>{t.parentDiplomaPrintBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadDiploma}
                      disabled={!diplomaPreviewUrl}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-xs font-semibold text-white hover:bg-sky-700 transition-colors disabled:opacity-45 min-h-[40px] cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.parentDiplomaDownloadBtn}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center space-y-2">
                  <Award className="w-7 h-7 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-900">
                    {activeDiplomaSpec.rankTitle[language]}
                  </p>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    {stemReport.completedVehicles === 0
                      ? t.parentDiplomaEmptyHint
                      : `${stemReport.completedVehicles} / ${activeDiplomaSpec.requiredVehicles}`}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-5">
              <h3 className="font-display text-base font-bold text-slate-900">
                {t.parentAgeProfileSectionTitle}
              </h3>
              <p className="text-xs text-slate-500">{t.parentAgeProfileCurrentLabel} : <strong>{ageProfile ?? '8-10'}</strong></p>
              <div className="grid grid-cols-1 gap-2.5">
                {(['5-7', '8-10', '11-12'] as AgeProfile[]).map((id) => {
                  const labelKey = id === '5-7' ? 'ageProfile57Label' : id === '8-10' ? 'ageProfile810Label' : 'ageProfile1112Label';
                  const descKey = id === '5-7' ? 'ageProfile57Desc' : id === '8-10' ? 'ageProfile810Desc' : 'ageProfile1112Desc';
                  const emoji = id === '5-7' ? '🧡' : id === '8-10' ? '⚙️' : '🏆';
                  const isSelected = (ageProfile ?? '8-10') === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onChangeAgeProfile?.(id)}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-start transition-colors cursor-pointer min-h-[64px] ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{emoji}</span>
                      <div>
                        <p className={`font-semibold text-sm ${isSelected ? 'text-sky-700' : 'text-slate-900'}`}>
                          {t[labelKey]}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">{t[descKey]}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'classroom' && (
            <div className="space-y-5">
              {/* Mode classe silencieux */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{t.classroomSilentLabel}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.classroomSilentDesc}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={classroomSilent}
                  onClick={() => onChangeClassroomSettings?.({ classroomSilent: !classroomSilent })}
                  className={`shrink-0 relative w-11 h-6 rounded-full transition-colors cursor-pointer ${classroomSilent ? 'bg-sky-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 start-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${classroomSilent ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Mode TBI */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{t.tbiModeLabel}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.tbiModeDesc}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={tbiMode}
                  onClick={() => onChangeClassroomSettings?.({ tbiMode: !tbiMode })}
                  className={`shrink-0 relative w-11 h-6 rounded-full transition-colors cursor-pointer ${tbiMode ? 'bg-sky-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 start-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${tbiMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Volumes */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <Volume2 className="w-4 h-4" />
                    {t.volumeSfxLabel} — {Math.round(volumeSfx * 100)} %
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volumeSfx}
                    onChange={(e) => onChangeClassroomSettings?.({ volumeSfx: Number(e.target.value) })}
                    className="w-full accent-sky-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <Volume2 className="w-4 h-4" />
                    {t.volumeVoiceLabel} — {Math.round(volumeVoice * 100)} %
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volumeVoice}
                    onChange={(e) => onChangeClassroomSettings?.({ volumeVoice: Number(e.target.value) })}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fiches' && (
            <FichesPedaPanel language={language} fichePrintBtn={t.fichePrintBtn} />
          )}
        </div>

        {/* Quiet Zero-Touch Support Diagnostic Footer */}
        <div className="px-5 sm:px-7 py-3 bg-slate-50 border-t border-slate-200 text-[11px] font-mono tabular-nums text-slate-500 flex items-center justify-between gap-4 flex-wrap">
          <span>{t.parentDiagnosticFooter(profiles.length, isOnline)}</span>
          <div className="flex items-center gap-3 shrink-0">
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline hover:text-sky-800">
              {language === 'ar' ? 'الخصوصية' : language === 'en' ? 'Privacy' : 'Confidentialité'}
            </a>
            {onShowLanding && (
              <button onClick={onShowLanding} className="text-sky-600 underline hover:text-sky-800">
                {language === 'ar' ? 'الواجهة الرئيسية' : language === 'en' ? 'View showcase' : 'Voir la vitrine'}
              </button>
            )}
            {onDeleteAllData && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 underline"
              >
                <Trash2 className="w-3 h-3" />
                {language === 'ar' ? 'حذف بياناتي' : language === 'en' ? 'Delete my data' : 'Supprimer mes données'}
              </button>
            )}
            {onDeleteAllData && confirmDelete && (
              <span className="flex items-center gap-2">
                <span className="text-rose-600 font-semibold">
                  {language === 'ar' ? 'تأكيد الحذف؟' : language === 'en' ? 'Confirm delete?' : 'Confirmer ?'}
                </span>
                <button onClick={onDeleteAllData} className="text-rose-600 font-bold hover:text-rose-800 underline">
                  {language === 'ar' ? 'نعم' : language === 'en' ? 'Yes' : 'Oui'}
                </button>
                <button onClick={() => setConfirmDelete(false)} className="text-slate-500 hover:text-slate-700 underline">
                  {language === 'ar' ? 'لا' : language === 'en' ? 'No' : 'Non'}
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
