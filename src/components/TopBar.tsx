import React, { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Download,
  Flame,
  Globe,
  GraduationCap,
  Lightbulb,
  Menu,
  Share,
  ShieldCheck,
  Timer,
  Warehouse,
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode, PlayerProfile, VisualStyleMode } from '../types/game';
import { resolveEntitlements } from '../utils/entitlements';
import { usePWAInstall } from '../utils/pwa';
import { PROFILE_COLOR_STYLES, renderProfileAvatarIcon } from './ProfilesModal';

interface TopBarProps {
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  visualStyle: VisualStyleMode;
  onSelectStyle: (style: VisualStyleMode) => void;
  activeProfile: PlayerProfile;
  onOpenProfiles: () => void;
  onOpenCatalog: () => void;
  onOpenGarage: () => void;
  garageCount: number;
  streakCount: number;
  isStreakActiveToday: boolean;
  onOpenStreak: () => void;
  onOpenDailyChallenge: () => void;
  isDailyCompletedToday: boolean;
  isDailyActiveNow: boolean;
  timerModeEnabled: boolean;
  onOpenLeaderboard: () => void;
  onOpenDiscovery: () => void;
  onOpenMechanicGuide: () => void;
  onOpenParentSpace: () => void;
  remainingSessionMinutes: number | null;
  onOpenTeacherDashboard?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  language,
  onSelectLanguage,
  visualStyle,
  onSelectStyle,
  activeProfile,
  onOpenProfiles,
  onOpenCatalog,
  onOpenGarage,
  garageCount,
  streakCount,
  isStreakActiveToday,
  onOpenStreak,
  onOpenDailyChallenge,
  isDailyCompletedToday,
  isDailyActiveNow,
  timerModeEnabled,
  onOpenLeaderboard,
  onOpenDiscovery,
  onOpenMechanicGuide,
  onOpenParentSpace,
  remainingSessionMinutes,
  onOpenTeacherDashboard,
}) => {
  const t = UI_TRANSLATIONS[language];
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [iosGuideOpen, setIosGuideOpen] = useState<boolean>(false);
  const [navMenuOpen, setNavMenuOpen] = useState<boolean>(false);
  const navMenuRef = useRef<HTMLDivElement>(null);
  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const hasTeacherTools = resolveEntitlements(activeProfile.progress.licenseState).teacherTools;

  useEffect(() => {
    if (!langMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langMenuOpen]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileMenuOpen]);

  useEffect(() => {
    if (!navMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (navMenuRef.current && !navMenuRef.current.contains(e.target as Node)) {
        setNavMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [navMenuOpen]);

  return (
    <>
      <header className="relative z-30 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-gradient-to-b from-sky-50 to-white border-b-2 border-sky-100">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={onOpenCatalog}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
        >
          🐙 {t.appName}
        </button>

        {/* Zone 2: Navigation & 3D Visual Style Switcher */}
        <nav
          data-tour="topbar-styles"
          aria-label={t.navAriaLabel}
          className="hidden 2xl:flex items-center gap-5 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={onOpenCatalog}
            className="py-1 text-slate-700 hover:text-slate-900 hover:underline underline-offset-8 decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.stagesBtn}
          </button>

          <button
            type="button"
            onClick={() => onSelectStyle(VisualStyleMode.WOOD)}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              visualStyle === VisualStyleMode.WOOD
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : 'hover:text-slate-900 hover:underline underline-offset-8'
            }`}
          >
            {t.styleWood}
          </button>

          <button
            type="button"
            onClick={() => onSelectStyle(VisualStyleMode.BLOCKS)}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              visualStyle === VisualStyleMode.BLOCKS
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : 'hover:text-slate-900 hover:underline underline-offset-8'
            }`}
          >
            {t.styleBlocks}
          </button>

          <button
            type="button"
            onClick={() => onSelectStyle(VisualStyleMode.REALISTIC)}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              visualStyle === VisualStyleMode.REALISTIC
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : 'hover:text-slate-900 hover:underline underline-offset-8'
            }`}
          >
            {t.styleRealistic}
          </button>

          <button
            type="button"
            onClick={onOpenDiscovery}
            className="py-1 text-slate-700 hover:text-slate-900 hover:underline underline-offset-8 decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.discoveryBtn}
          </button>
        </nav>

        {/* Zone 3: Active Profile + PWA Install + Daily + Stopwatch + Language + Hint */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Profile dropdown — profile + parent space + garage regroupés */}
          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              data-testid="topbar-parents-btn"
              onClick={() => setProfileMenuOpen((o) => !o)}
              title={activeProfile.name}
              aria-expanded={profileMenuOpen}
              className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                remainingSessionMinutes !== null && remainingSessionMinutes <= 5
                  ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${PROFILE_COLOR_STYLES[activeProfile.avatarColor].bg}`}>
                {renderProfileAvatarIcon(activeProfile.avatarIcon, 'w-3.5 h-3.5')}
              </span>
              <span className="hidden lg:inline max-w-[80px] truncate">{activeProfile.name}</span>
              {remainingSessionMinutes !== null && (
                <span className="font-mono tabular-nums text-[11px] font-bold text-sky-700">{remainingSessionMinutes}m</span>
              )}
              {garageCount > 0 && remainingSessionMinutes === null && (
                <span className="font-mono tabular-nums text-[11px] font-bold text-sky-700 hidden lg:inline">{garageCount}</span>
              )}
            </button>

            {profileMenuOpen && (
              <div className="absolute end-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 min-w-[200px]">
                {/* Profile switcher */}
                <button
                  type="button"
                  onClick={() => { onOpenProfiles(); setProfileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${PROFILE_COLOR_STYLES[activeProfile.avatarColor].bg}`}>
                    {renderProfileAvatarIcon(activeProfile.avatarIcon, 'w-4 h-4')}
                  </span>
                  <div className="text-start">
                    <div className="font-semibold text-slate-900 truncate max-w-[120px]">{activeProfile.name}</div>
                    <div className="text-xs text-slate-500">{t.profilesModalTitle}</div>
                  </div>
                </button>

                <div className="border-t border-slate-100 my-1" />

                {/* Espace parents */}
                <button
                  type="button"
                  onClick={() => { onOpenParentSpace(); setProfileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    remainingSessionMinutes !== null && remainingSessionMinutes <= 5
                      ? 'text-amber-800 hover:bg-amber-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-sky-600" />
                  <span className="flex-1 text-start">{t.parentsNavBtn}</span>
                  {remainingSessionMinutes !== null && (
                    <span className="font-mono font-bold text-xs text-sky-700">{remainingSessionMinutes}m</span>
                  )}
                </button>

                {/* Teacher (école) */}
                {hasTeacherTools && onOpenTeacherDashboard && (
                  <button
                    type="button"
                    onClick={() => { onOpenTeacherDashboard!(); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="text-start">{t.teacherNavBtn}</span>
                  </button>
                )}

                <div className="border-t border-slate-100 my-1" />

                {/* Garage */}
                <button
                  type="button"
                  onClick={() => { onOpenGarage(); setProfileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Warehouse className="w-4 h-4 shrink-0 text-sky-600" />
                  <span className="flex-1 text-start">{t.garageNavBtn}</span>
                  {garageCount > 0 && (
                    <span className="font-mono font-bold text-xs text-sky-700">{garageCount}</span>
                  )}
                </button>

                {/* PWA Install */}
                {!isInstalled && (isInstallable || isIOS) && (
                  <button
                    type="button"
                    onClick={() => { isIOS ? setIosGuideOpen(true) : void install(); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sky-800 hover:bg-sky-50 transition-colors cursor-pointer"
                  >
                    {isIOS ? <Share className="w-4 h-4 shrink-0 text-sky-600" /> : <Download className="w-4 h-4 shrink-0 text-sky-600" />}
                    <span className="text-start">{t.pwaInstallShortBtn}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Daily Engagement Streak Fire Indicator */}
          <button
            type="button"
            data-testid="topbar-streak-btn"
            onClick={onOpenStreak}
            title={t.streakTopBarTitle(streakCount, isStreakActiveToday)}
            aria-label={t.streakTopBarTitle(streakCount, isStreakActiveToday)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${
              isStreakActiveToday && streakCount > 0
                ? 'bg-orange-50 border-orange-300 text-orange-950 hover:bg-orange-100'
                : streakCount > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flame
              className={`w-4 h-4 shrink-0 ${
                isStreakActiveToday && streakCount > 0
                  ? 'fill-orange-500 text-orange-600'
                  : streakCount > 0
                    ? 'text-orange-500'
                    : 'text-slate-400'
              }`}
            />
            <span className="font-mono tabular-nums font-bold">{streakCount}</span>
          </button>

          <button
            type="button"
            onClick={onOpenDailyChallenge}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
              isDailyActiveNow
                ? 'bg-amber-100 border-amber-400 text-amber-950'
                : isDailyCompletedToday
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {isDailyCompletedToday ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            )}
            <span className="hidden md:inline">{t.dailyNavBtn}</span>
          </button>

          <button
            type="button"
            onClick={onOpenLeaderboard}
            title={t.leaderboardTitle}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
              timerModeEnabled
                ? 'bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Timer
              className={`w-3.5 h-3.5 shrink-0 ${
                timerModeEnabled ? 'text-sky-600' : 'text-slate-500'
              }`}
            />
            <span className="hidden md:inline">{t.leaderboardNavBtn}</span>
          </button>

          {/* Language — compact globe dropdown */}
          <div ref={langMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen((o) => !o)}
              aria-label={t.langSwitchAria}
              aria-expanded={langMenuOpen}
              className={`flex items-center gap-1 px-2 py-2 rounded-lg transition-colors cursor-pointer min-h-[40px] ${
                langMenuOpen ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold hidden sm:inline">
                {language === 'fr' ? 'FR' : language === 'en' ? 'EN' : 'ع'}
              </span>
            </button>
            {langMenuOpen && (
              <div className="absolute end-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 min-w-[140px]">
                {([
                  { code: 'fr', label: 'Français', flag: '🇫🇷' },
                  { code: 'en', label: 'English', flag: '🇬🇧' },
                  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
                ] as { code: 'fr' | 'en' | 'ar'; label: string; flag: string }[]).map(({ code, label, flag }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => { onSelectLanguage(code); setLangMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer ${
                      language === code ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{flag}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Compact navigation leaves room for profile and language controls on tablets. */}
          <div ref={navMenuRef} className="relative 2xl:hidden">
            <button
              type="button"
              onClick={() => setNavMenuOpen((o) => !o)}
              aria-label={t.navAriaLabel}
              aria-expanded={navMenuOpen}
              className="inline-flex items-center justify-center w-10 h-10 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <Menu className="w-4 h-4 shrink-0" />
            </button>
            {navMenuOpen && (
              <div className="absolute end-0 top-full mt-1 z-50 min-w-[180px] bg-white border border-slate-200 rounded-xl shadow-lg py-1">
                <button
                  type="button"
                  onClick={() => { onOpenCatalog(); setNavMenuOpen(false); }}
                  className="w-full text-start px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t.stagesBtn}
                </button>
                {([
                  [VisualStyleMode.WOOD, t.styleWood],
                  [VisualStyleMode.BLOCKS, t.styleBlocks],
                  [VisualStyleMode.REALISTIC, t.styleRealistic],
                ] as [VisualStyleMode, string][]).map(([style, label]) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => { onSelectStyle(style); setNavMenuOpen(false); }}
                    className={`w-full text-start px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                      visualStyle === style
                        ? 'font-semibold text-sky-700 bg-sky-50'
                        : 'font-medium text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { onOpenDiscovery(); setNavMenuOpen(false); }}
                  className="w-full text-start px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t.discoveryBtn}
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            data-tour="mascot-cta"
            onClick={onOpenMechanicGuide}
            aria-label={t.hintBtn}
            className="inline-flex items-center justify-center p-2.5 text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shrink-0 min-h-[40px] min-w-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <Lightbulb className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </header>

      {/* iOS Safari Home Screen Install Guide Modal */}
      {iosGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl bg-white border border-slate-200 p-6 shadow-lg space-y-3">
            <h3 className="font-display text-lg font-bold text-slate-900">
              {t.pwaIosGuideTitle}
            </h3>
            <div className="space-y-1.5 text-sm text-slate-600 leading-relaxed">
              <p>{t.pwaIosStep1}</p>
              <p>{t.pwaIosStep2}</p>
            </div>
            <button
              type="button"
              onClick={() => setIosGuideOpen(false)}
              className="mt-2 w-full rounded-lg bg-sky-600 py-2 text-xs font-semibold text-white hover:bg-sky-700 transition-colors min-h-[40px] cursor-pointer"
            >
              {t.pwaCloseGuideBtn}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
