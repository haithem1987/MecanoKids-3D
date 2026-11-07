import { CATEGORIES, CATEGORY_META, getCategoryLabel } from '../data/categories';
import React, { useState } from 'react';
import { Copy, Download, GraduationCap, Printer, X } from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode, PlayerProfile, VehicleCategory } from '../types/game';
import { resolveEntitlements } from '../utils/entitlements';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { MISSIONS } from '../missions/catalog';
import { PROFILE_COLOR_STYLES, renderProfileAvatarIcon } from './ProfilesModal';

const LS_CLASS_CODE = 'oc_classroom_code';
const LS_ASSIGNED_MISSIONS = 'oc_assigned_missions';

function lsGet(key: string): string {
  try { return localStorage.getItem(key) ?? ''; } catch { return ''; }
}
function lsSet(key: string, val: string): void {
  try { localStorage.setItem(key, val); } catch {}
}

interface TeacherDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  profiles: PlayerProfile[];
  activeProfileId: string;
  onActivateLicense: (key: string) => void;
}

// Build a blueprint-id → category lookup once
const BP_CATEGORY = new Map(VEHICLE_BLUEPRINTS.map((bp) => [bp.id, bp.category]));

const UNIVERSE_META = CATEGORIES.map((category) => ({ category, color: CATEGORY_META[category].color }));

function getTotalStars(profile: PlayerProfile): number {
  return Object.values(profile.progress.completedStages)
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + (s.stars ?? 0), 0);
}

function formatDateShort(ts: number): string {
  return new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
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
  const [classCode, setClassCode] = useState<string>(() => lsGet(LS_CLASS_CODE));
  const [assignedMissions, setAssignedMissions] = useState<string[]>(() => {
    try { return JSON.parse(lsGet(LS_ASSIGNED_MISSIONS) || '[]') as string[]; } catch { return []; }
  });
  const [codeCopied, setCodeCopied] = useState(false);

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

  function generateCode() {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setClassCode(code);
    lsSet(LS_CLASS_CODE, code);
  }

  async function copyCode() {
    try { await navigator.clipboard.writeText(classCode); } catch {}
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  function toggleMission(id: string) {
    setAssignedMissions((prev) => {
      const next = prev.includes(id)
        ? prev.filter((m) => m !== id)
        : prev.length < 3 ? [...prev, id] : prev;
      lsSet(LS_ASSIGNED_MISSIONS, JSON.stringify(next));
      return next;
    });
  }

  type CellStatus = 'done' | 'error' | 'progress' | 'none';
  function getCellStatus(profile: PlayerProfile, bpId: string): CellStatus {
    if (profile.progress.completedStages[bpId]?.completed) return 'done';
    const mistakes = profile.progress.inProgressStages[bpId]?.mistakesCount ?? 0;
    if (mistakes >= 3) return 'error';
    if (mistakes >= 1) return 'progress';
    return 'none';
  }

  const isSchool = resolveEntitlements(licenseState).teacherTools;

  // Aggregate completed stages per category across all profiles (class total)
  const completedPerUniverse = new Map<VehicleCategory, number>(
    UNIVERSE_META.map((u) => [u.category, 0]),
  );
  for (const profile of sortedProfiles) {
    for (const [bpId, rec] of Object.entries(profile.progress.completedStages)) {
      if (!rec.completed) continue;
      const cat = BP_CATEGORY.get(bpId);
      if (cat && completedPerUniverse.has(cat)) {
        completedPerUniverse.set(cat, completedPerUniverse.get(cat)! + 1);
      }
    }
  }
  const maxUniverseCount = Math.max(1, ...Array.from(completedPerUniverse.values()));

  function handleExportCsv() {
    const date = new Date().toISOString().slice(0, 10);
    const rows = [
      ['nom', 'stages_completes', 'etoiles', 'serie_max', 'derniere_activite'],
      ...sortedProfiles.map((p) => {
        const completed = Object.values(p.progress.completedStages).filter((s) => s.completed).length;
        return [
          p.name,
          completed,
          getTotalStars(p),
          p.progress.dailyStreak.bestStreak,
          formatDateShort(p.progress.lastSavedAt),
        ];
      }),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `progression_classe_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  Exporter CSV
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {t.teacherExportPdfBtn}
                </button>
              </div>
            </div>

            {sortedProfiles.length === 0 ? (
              <p className="text-sm text-slate-500">{t.teacherNoStudents}</p>
            ) : (
              <ul className="space-y-2">
                {sortedProfiles.map((profile) => {
                  const completed = Object.values(profile.progress.completedStages).filter(
                    (s) => s.completed,
                  ).length;
                  const stars = getTotalStars(profile);
                  const bestStreak = profile.progress.dailyStreak.bestStreak;
                  const lastActivity = formatDateShort(profile.progress.lastSavedAt);
                  const isActive = profile.id === activeProfileId;
                  const pct = TOTAL_STAGES > 0 ? Math.round((completed / TOTAL_STAGES) * 100) : 0;

                  return (
                    <li
                      key={profile.id}
                      className={`px-4 py-3 rounded-xl border transition-colors ${
                        isActive ? 'bg-sky-50 border-sky-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
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
                        <span className="text-xs text-amber-600 whitespace-nowrap">★ {stars}</span>
                        <span className="text-xs text-slate-500 whitespace-nowrap">🔥 {bestStreak}</span>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{lastActivity}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-sky-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap tabular-nums">
                          {completed}/{TOTAL_STAGES}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* SVG bar chart — stages completed per universe (class total) */}
          {sortedProfiles.length > 0 && (
            <section className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Stages complétés par univers
              </h3>
              <svg
                viewBox="0 0 500 120"
                width="100%"
                height="120"
                aria-label="Graphique stages par univers"
                role="img"
              >
                {UNIVERSE_META.map((u, i) => {
                  const count = completedPerUniverse.get(u.category) ?? 0;
                  const barMaxH = 72;
                  const barH = Math.round((count / maxUniverseCount) * barMaxH);
                  const slotW = 500 / UNIVERSE_META.length;
                  const barW = 36;
                  const x = i * slotW + slotW / 2 - barW / 2;
                  const y = 8 + barMaxH - barH;
                  return (
                    <g key={u.category}>
                      <rect x={x} y={y} width={barW} height={Math.max(barH, 2)} rx={4} fill={u.color} />
                      <text
                        x={x + barW / 2}
                        y={y - 4}
                        textAnchor="middle"
                        fontSize={10}
                        fill="#475569"
                        fontFamily="sans-serif"
                      >
                        {count > 0 ? count : ''}
                      </text>
                      <text
                        x={x + barW / 2}
                        y={112}
                        textAnchor="middle"
                        fontSize={9}
                        fill="#94a3b8"
                        fontFamily="sans-serif"
                      >
                        {getCategoryLabel(u.category, language).split(' & ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </section>
          )}

          {/* Class code + mission assignment + progress grid — school tier only */}
          {isSchool && (
            <>
              {/* Class code */}
              <section className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-1">{t.teacherClassCodeTitle}</h3>
                <p className="text-xs text-slate-500 mb-3">{t.teacherClassCodeDesc}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-800 font-mono text-base font-bold tracking-widest text-center select-all">
                    {classCode || '——'}
                  </code>
                  <button
                    type="button"
                    onClick={copyCode}
                    disabled={!classCode}
                    className="min-h-[48px] px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40"
                    aria-label={t.teacherClassCodeCopied}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={generateCode}
                    className="min-h-[48px] px-3 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {codeCopied ? t.teacherClassCodeCopied : t.teacherClassCodeGenerate}
                  </button>
                </div>
              </section>

              {/* Mission assignment */}
              <section className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-1">{t.teacherMissionsTitle}</h3>
                <p className="text-xs text-slate-500 mb-3">{t.teacherMissionsDesc}</p>
                <ul className="space-y-1.5">
                  {MISSIONS.map((m) => {
                    const checked = assignedMissions.includes(m.id);
                    const disabled = !checked && assignedMissions.length >= 3;
                    return (
                      <li key={m.id}>
                        <label className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                          checked ? 'bg-sky-50 border-sky-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggleMission(m.id)}
                            className="w-4 h-4 accent-sky-600"
                          />
                          <span className="text-xs text-slate-700 flex-1 min-w-0 truncate">
                            {m.objectifs[0]?.[language === 'ar' ? 'ar' : language === 'en' ? 'en' : 'fr'] ?? m.id}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* Progress grid */}
              {assignedMissions.length > 0 && sortedProfiles.length > 0 && (
                <section className="border-t border-slate-100 pt-5">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">{t.teacherProgressGridTitle}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-separate border-spacing-y-1">
                      <thead>
                        <tr>
                          <th className="text-start ps-2 pb-1 text-slate-500 font-medium w-28"></th>
                          {assignedMissions.map((mid) => {
                            const mission = MISSIONS.find((m) => m.id === mid);
                            const label = mission?.objectifs[0]?.[language === 'ar' ? 'ar' : language === 'en' ? 'en' : 'fr'] ?? mid;
                            return (
                              <th key={mid} className="pb-1 text-center text-slate-500 font-medium max-w-[80px]">
                                <span className="block truncate max-w-[80px] mx-auto">{label}</span>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedProfiles.map((profile) => (
                          <tr key={profile.id}>
                            <td className="ps-2 py-1">
                              <span className="truncate max-w-[112px] block font-medium text-slate-700">{profile.name}</span>
                            </td>
                            {assignedMissions.map((mid) => {
                              const mission = MISSIONS.find((m) => m.id === mid);
                              const bpId = mission?.vehicule ?? mid;
                              const status = getCellStatus(profile, bpId);
                              const { bg, label } = {
                                done:     { bg: 'bg-emerald-500', label: t.teacherProgressDone },
                                error:    { bg: 'bg-rose-400',    label: t.teacherProgressError },
                                progress: { bg: 'bg-amber-400',   label: t.teacherProgressInProgress },
                                none:     { bg: 'bg-slate-200',   label: t.teacherProgressNotStarted },
                              }[status];
                              return (
                                <td key={mid} className="text-center py-1">
                                  <span
                                    title={label}
                                    aria-label={label}
                                    className={`inline-block w-5 h-5 rounded-full ${bg}`}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {([
                      { bg: 'bg-emerald-500', label: t.teacherProgressDone },
                      { bg: 'bg-amber-400',   label: t.teacherProgressInProgress },
                      { bg: 'bg-rose-400',    label: t.teacherProgressError },
                      { bg: 'bg-slate-200',   label: t.teacherProgressNotStarted },
                    ] as { bg: string; label: string }[]).map(({ bg, label }) => (
                      <span key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className={`inline-block w-3 h-3 rounded-full ${bg}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

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
