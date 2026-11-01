import React, { useState } from 'react';
import {
  Anchor,
  Car,
  Check,
  CheckCircle2,
  Download,
  Edit3,
  Plane,
  Plus,
  Rocket,
  Share,
  Square,
  Trash2,
  Users,
  Volume2,
  WifiOff,
  Wrench,
  X,
} from 'lucide-react';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  LanguageCode,
  PlayerProfile,
  ProfileAvatarColor,
  ProfileAvatarIcon,
} from '../types/game';
import { useOnlineStatus, usePWAInstall } from '../utils/pwa';
import { useSpeech } from '../utils/speech';
import { MAX_LOCAL_PROFILES } from '../utils/storage';

export const PROFILE_AVATAR_COLORS: ProfileAvatarColor[] = [
  'sky',
  'amber',
  'emerald',
  'indigo',
  'rose',
];

export const PROFILE_AVATAR_ICONS: ProfileAvatarIcon[] = [
  'wrench',
  'car',
  'rocket',
  'anchor',
  'plane',
];

export const PROFILE_COLOR_STYLES: Record<
  ProfileAvatarColor,
  { bg: string; swatch: string; ring: string }
> = {
  sky: {
    bg: 'bg-sky-600 text-white',
    swatch: 'bg-sky-600',
    ring: 'ring-sky-600',
  },
  amber: {
    bg: 'bg-amber-500 text-white',
    swatch: 'bg-amber-500',
    ring: 'ring-amber-500',
  },
  emerald: {
    bg: 'bg-emerald-600 text-white',
    swatch: 'bg-emerald-600',
    ring: 'ring-emerald-600',
  },
  indigo: {
    bg: 'bg-indigo-600 text-white',
    swatch: 'bg-indigo-600',
    ring: 'ring-indigo-600',
  },
  rose: {
    bg: 'bg-rose-600 text-white',
    swatch: 'bg-rose-600',
    ring: 'ring-rose-600',
  },
};

export function renderProfileAvatarIcon(
  icon: ProfileAvatarIcon,
  className = 'w-4 h-4',
): React.ReactNode {
  switch (icon) {
    case 'car':
      return <Car className={className} />;
    case 'rocket':
      return <Rocket className={className} />;
    case 'anchor':
      return <Anchor className={className} />;
    case 'plane':
      return <Plane className={className} />;
    case 'wrench':
    default:
      return <Wrench className={className} />;
  }
}

interface ProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  profiles: PlayerProfile[];
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (
    name: string,
    avatarColor: ProfileAvatarColor,
    avatarIcon: ProfileAvatarIcon,
  ) => void;
  onUpdateProfileMeta: (
    profileId: string,
    name: string,
    avatarColor: ProfileAvatarColor,
    avatarIcon: ProfileAvatarIcon,
  ) => void;
  onDeleteProfile: (profileId: string) => void;
  voiceAutoRead: boolean;
  onToggleVoiceAutoRead: (nextVal?: boolean) => void;
}

export const ProfilesModal: React.FC<ProfilesModalProps> = ({
  isOpen,
  onClose,
  language,
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfileMeta,
  onDeleteProfile,
  voiceAutoRead,
  onToggleVoiceAutoRead,
}) => {
  const [creatingNew, setCreatingNew] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newColor, setNewColor] = useState<ProfileAvatarColor>('emerald');
  const [newIcon, setNewIcon] = useState<ProfileAvatarIcon>('rocket');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editColor, setEditColor] = useState<ProfileAvatarColor>('sky');
  const [editIcon, setEditIcon] = useState<ProfileAvatarIcon>('wrench');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);

  const { isSupported: speechSupported, isSpeaking, activeId, toggle: toggleSpeech } = useSpeech();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const totalBlueprints = VEHICLE_BLUEPRINTS.length;
  const canCreateMore = profiles.length < MAX_LOCAL_PROFILES;

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateMore) return;
    onCreateProfile(newName, newColor, newIcon);
    setNewName('');
    setCreatingNew(false);
  };

  const startEditing = (profile: PlayerProfile) => {
    setConfirmDeleteId(null);
    setEditingId(profile.id);
    setEditName(profile.name);
    setEditColor(profile.avatarColor);
    setEditIcon(profile.avatarIcon);
  };

  const handleSaveEdit = (profileId: string) => {
    onUpdateProfileMeta(profileId, editName, editColor, editIcon);
    setEditingId(null);
  };

  const isTestingVoice = isSpeaking && activeId === 'voice-test-sample';

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profiles-modal-title"
    >
      <div className="w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="profiles-modal-title"
                className="font-display text-xl sm:text-2xl font-bold text-slate-900"
              >
                {t.profilesModalTitle}
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                {t.profilesModalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeProfilesAria}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Section 1: Multi-Profile Switcher & Manager */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-slate-900">
                {t.profilesListTitle(profiles.length, MAX_LOCAL_PROFILES)}
              </h3>

              {canCreateMore ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setCreatingNew((v) => !v);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap min-h-[36px] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.profileNewBtn}</span>
                </button>
              ) : (
                <span className="text-xs text-slate-500">
                  {t.profileMaxReached(MAX_LOCAL_PROFILES)}
                </span>
              )}
            </div>

            {/* New Profile Form */}
            {creatingNew && canCreateMore && (
              <form
                onSubmit={handleSubmitCreate}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5"
              >
                <div>
                  <label
                    htmlFor="new-profile-name"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    {t.profileNameLabel}
                  </label>
                  <input
                    id="new-profile-name"
                    type="text"
                    maxLength={28}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={t.profileNamePlaceholder}
                    autoFocus
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t.profileColorLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      {PROFILE_AVATAR_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewColor(color)}
                          className={`w-7 h-7 rounded-md ${PROFILE_COLOR_STYLES[color].swatch} transition-transform cursor-pointer ${
                            newColor === color
                              ? `ring-2 ring-offset-2 ${PROFILE_COLOR_STYLES[color].ring} scale-105`
                              : 'opacity-75 hover:opacity-100'
                          }`}
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t.profileIconLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {PROFILE_AVATAR_ICONS.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setNewIcon(icon)}
                          className={`w-8 h-8 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                            newIcon === icon
                              ? 'bg-sky-600 border-sky-600 text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                          aria-label={icon}
                        >
                          {renderProfileAvatarIcon(icon, 'w-4 h-4')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCreatingNew(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer min-h-[36px]"
                  >
                    {t.cancelResetBtn}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer min-h-[36px]"
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.profileCreateSubmit}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Profiles List */}
            <div className="space-y-2.5">
              {profiles.map((profile) => {
                const isActive = profile.id === activeProfileId;
                const isEditing = editingId === profile.id;
                const completedList = Object.values(profile.progress.completedStages).filter(
                  (r) => r.completed,
                );
                const completedCount = completedList.length;
                const starsCount = completedList.reduce((acc, r) => acc + (r.stars || 0), 0);
                const badgesCount = Object.keys(profile.progress.unlockedBadges).length;

                return (
                  <div
                    key={profile.id}
                    className={`p-3.5 rounded-xl border transition-colors ${
                      isActive
                        ? 'bg-sky-50/60 border-sky-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          maxLength={28}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                          className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-sky-600"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5">
                            {PROFILE_AVATAR_COLORS.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setEditColor(color)}
                                className={`w-6 h-6 rounded-md ${PROFILE_COLOR_STYLES[color].swatch} cursor-pointer ${
                                  editColor === color
                                    ? `ring-2 ring-offset-1 ${PROFILE_COLOR_STYLES[color].ring}`
                                    : 'opacity-70 hover:opacity-100'
                                }`}
                                aria-label={color}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-1">
                            {PROFILE_AVATAR_ICONS.map((icon) => (
                              <button
                                key={icon}
                                type="button"
                                onClick={() => setEditIcon(icon)}
                                className={`w-7 h-7 rounded-md border flex items-center justify-center cursor-pointer ${
                                  editIcon === icon
                                    ? 'bg-sky-600 border-sky-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-600'
                                }`}
                                aria-label={icon}
                              >
                                {renderProfileAvatarIcon(icon, 'w-3.5 h-3.5')}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md cursor-pointer"
                            >
                              {t.cancelResetBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(profile.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md cursor-pointer"
                            >
                              {t.profileSaveEditBtn}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                              PROFILE_COLOR_STYLES[profile.avatarColor].bg
                            }`}
                          >
                            {renderProfileAvatarIcon(profile.avatarIcon, 'w-5 h-5')}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-sm sm:text-base font-bold text-slate-900 truncate">
                                {profile.name}
                              </span>
                              {isActive && (
                                <>
                                  <span aria-hidden="true" className="text-slate-300">
                                    ·
                                  </span>
                                  <span className="text-xs font-semibold text-sky-700 whitespace-nowrap">
                                    {t.profileActiveTag}
                                  </span>
                                </>
                              )}
                            </div>

                            <p className="mt-0.5 text-xs font-mono tabular-nums text-slate-600">
                              {t.profileStatsLine(
                                completedCount,
                                totalBlueprints,
                                starsCount,
                                badgesCount,
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectProfile(profile.id);
                                onClose();
                              }}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap min-h-[36px] cursor-pointer"
                            >
                              {t.profileSwitchBtn}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => startEditing(profile)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap min-h-[36px] cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 shrink-0" />
                            <span>{t.profileEditBtn}</span>
                          </button>

                          {profiles.length > 1 && (
                            <>
                              {confirmDeleteId === profile.id ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConfirmDeleteId(null);
                                      onDeleteProfile(profile.id);
                                    }}
                                    className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap min-h-[36px] cursor-pointer"
                                  >
                                    {t.profileConfirmDeleteBtn}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer min-h-[36px]"
                                  >
                                    {t.cancelResetBtn}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(profile.id)}
                                  aria-label={t.profileDeleteBtn}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors whitespace-nowrap min-h-[36px] cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                  <span className="hidden sm:inline">{t.profileDeleteBtn}</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section 2: Native Trilingual Web Speech Accessibility */}
          <section className="space-y-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                {t.voiceSectionTitle}
              </h3>
              <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                {t.voiceSectionDesc}
              </p>
            </div>

            {speechSupported ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div className="max-w-md">
                  <p className="text-sm font-semibold text-slate-900">
                    {t.voiceAutoReadLabel}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                    {t.voiceAutoReadDesc}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      toggleSpeech('voice-test-sample', t.voiceTestSample, language)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap min-h-[38px] cursor-pointer"
                  >
                    {isTestingVoice ? (
                      <Square className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    )}
                    <span>{isTestingVoice ? t.voiceStopBtn : t.voiceTestBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleVoiceAutoRead(!voiceAutoRead)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap min-h-[38px] cursor-pointer ${
                      voiceAutoRead
                        ? 'bg-sky-600 border-sky-600 text-white hover:bg-sky-700'
                        : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.voiceAutoToggleShort}</span>
                    <span aria-hidden="true">·</span>
                    <span>{voiceAutoRead ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">{t.voiceUnsupportedLabel}</p>
            )}
          </section>

          <hr className="border-slate-200" />

          {/* Section 3: Offline Progressive Web App (PWA) Installation */}
          <section className="space-y-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                {t.pwaSectionTitle}
              </h3>
              <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                {t.pwaSectionDesc}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                {isOnline ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span className="font-medium">
                  {isInstalled
                    ? t.pwaInstalledLabel
                    : isOnline
                      ? t.pwaOnlineReadyLabel
                      : t.pwaOfflineActiveBanner}
                </span>
              </div>

              {!isInstalled && (
                <div className="flex items-center gap-2 shrink-0">
                  {isInstallable && (
                    <button
                      type="button"
                      onClick={() => void install()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap min-h-[38px] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.pwaInstallBtn}</span>
                    </button>
                  )}

                  {!isInstallable && isIOS && (
                    <button
                      type="button"
                      onClick={() => setShowIosGuide((v) => !v)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-900 bg-white border border-sky-300 hover:bg-sky-50 rounded-lg transition-colors whitespace-nowrap min-h-[38px] cursor-pointer"
                    >
                      <Share className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.pwaIosGuideTitle}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {showIosGuide && !isInstalled && (
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1.5 text-xs text-slate-700">
                <p className="font-bold text-slate-900">{t.pwaIosGuideTitle}</p>
                <p>{t.pwaIosStep1}</p>
                <p>{t.pwaIosStep2}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
