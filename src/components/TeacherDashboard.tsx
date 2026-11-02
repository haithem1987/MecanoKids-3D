import React, { useState } from 'react';
import { GraduationCap, Printer, X } from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode, PlayerProfile } from '../types/game';
import { resolveEntitlements } from '../utils/entitlements';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { PROFILE_COLOR_STYLES, renderProfileAvatarIcon } from './ProfilesModal';

interface TeacherDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  profiles: PlayerProfile[];
  activeProfileId: string;
  onActivateLicense: (key: string) => void;
}

function isValidLicenseKey(key: string): boolean {
  const trimmed = key.trim();
  if (trimmed.startsWith('SK-')) return trimmed.length >= 5;
  // base64: 88 chars (512-bit key) or any multiple of 4 of reasonable length
  return /^[A-Za-z0-9+/=]{20,}$/.test(trimmed) && trimmed.length % 4 === 0;
}

const TOTAL_STAGES = VEHICLE_BLUEPRINTS.length;

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  isOpen,
  onClose,
  language,
  profiles,
  activeProfileId,
  onActivateLicense,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [licenseKey, setLicenseKey] = useState('');
  const [keyError, setKeyError] = useState(false);

  if (!isOpen) return null;

  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? profiles[0];
  const licenseState = activeProfile?.progress.licenseState;
  const schoolOrg = licenseState?.schoolOrg ?? 'Mon école';

  const sortedProfiles = [...profiles].sort((a, b) => {
    const aCompleted = Object.values(a.progress.completedStages).filter((s) => s.completed).length;
    const bCompleted = Object.values(b.progress.completedStages).filter((s) => s.completed).length;
    return bCompleted - aCompleted;
  });

  function handleActivate() {
    if (!isValidLicenseKey(licenseKey)) {
      setKeyError(true);
      return;
    }
    setKeyError(false);
    onActivateLicense(licenseKey.trim());
    setLicenseKey('');
  }

  function handleExportPdf() {
    window.print();
  }

  const isSchool = resolveEntitlements(licenseState).teacherTools;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.teacherDashboardTitle}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-sky-600 shrink-0" />
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                {t.teacherDashboardTitle}
              </h2>
              {isSchool && (
                <p className="text-xs text-slate-500">{t.teacherDashboardSubtitle(schoolOrg)}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeTeacherDashboardAria}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Students list */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">{t.teacherStudentsTitle}</h3>
              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {t.teacherExportPdfBtn}
              </button>
            </div>

            {sortedProfiles.length === 0 ? (
              <p className="text-sm text-slate-500">{t.teacherNoStudents}</p>
            ) : (
              <ul className="space-y-2">
                {sortedProfiles.map((profile) => {
                  const completed = Object.values(profile.progress.completedStages).filter(
                    (s) => s.completed,
                  ).length;
                  const badgeCount = Object.keys(profile.progress.unlockedBadges).length;
                  const streak = profile.progress.dailyStreak.currentStreak;
                  const isActive = profile.id === activeProfileId;

                  return (
                    <li
                      key={profile.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                        isActive
                          ? 'bg-sky-50 border-sky-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          PROFILE_COLOR_STYLES[profile.avatarColor].bg
                        }`}
                      >
                        {renderProfileAvatarIcon(profile.avatarIcon, 'w-4 h-4')}
                      </span>
                      <span className="font-medium text-sm text-slate-800 flex-1 min-w-0 truncate">
                        {profile.name}
                      </span>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {t.teacherStagesLabel(completed, TOTAL_STAGES)}
                      </span>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {t.teacherStreakLabel(streak)}
                      </span>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {t.teacherBadgesLabel(badgeCount)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* License activation */}
          <section className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">
              {t.teacherLicenseSectionTitle}
            </h3>
            <p className="text-xs text-slate-500 mb-3">{t.teacherLicenseSectionDesc}</p>

            {isSchool && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                ✓ {t.teacherSchoolLabel} : {schoolOrg}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => {
                  setLicenseKey(e.target.value);
                  setKeyError(false);
                }}
                placeholder={t.teacherLicenseKeyPlaceholder}
                className={`flex-1 min-w-0 px-3 py-2 text-sm border rounded-lg outline-none transition-colors ${
                  keyError
                    ? 'border-rose-400 bg-rose-50 focus:border-rose-500'
                    : 'border-slate-300 bg-white focus:border-sky-500'
                }`}
              />
              <button
                type="button"
                onClick={handleActivate}
                className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {t.teacherActivateBtn}
              </button>
            </div>
            {keyError && (
              <p className="mt-1.5 text-xs text-rose-600">{t.teacherLicenseInvalidMsg}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
