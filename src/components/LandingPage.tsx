import React, { useState } from 'react';
import { LanguageCode } from '../types/game';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface Props {
  language: LanguageCode;
  onStart: () => void;
  onSelectLanguage: (lang: LanguageCode) => void;
}

const UNIVERSES = [
  { emoji: '🚗', fr: 'Route & Ville', en: 'Road & City', ar: 'الطريق والمدينة', count: 20 },
  { emoji: '⛵', fr: 'Mer & Navigation', en: 'Sea & Sailing', ar: 'البحر والملاحة', count: 20 },
  { emoji: '✈️', fr: 'Air & Espace', en: 'Air & Space', ar: 'الجو والفضاء', count: 20 },
  { emoji: '🏗️', fr: 'Chantier', en: 'Construction', ar: 'البناء', count: 20 },
  { emoji: '🚂', fr: 'Rail & Mines', en: 'Rail & Mines', ar: 'القطار والمناجم', count: 20 },
];

const UNIVERSE_LABEL: Record<LanguageCode, string> = {
  fr: 'véhicules',
  en: 'vehicles',
  ar: 'مركبة',
};

export function LandingPage({ language, onStart, onSelectLanguage }: Props) {
  const t = UI_TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const [form, setForm] = useState({ firstName: '', school: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  async function handleSchoolSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus('sending');
    setFormError('');
    try {
      const res = await fetch('/api/school-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setFormStatus('done');
      } else {
        setFormStatus('error');
        setFormError(data.error ?? 'Erreur');
      }
    } catch {
      setFormStatus('error');
      setFormError('Erreur réseau');
    }
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
        <span className="text-xl font-bold text-sky-600">MécanoKids 3D</span>
        <select
          value={language}
          onChange={(e) => onSelectLanguage(e.target.value as LanguageCode)}
          className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700"
          aria-label={t.langSwitchAria}
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </header>

      {/* Hero */}
      <section className="bg-sky-600 text-white px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t.landingHeroTitle}</h1>
        <p className="text-sky-100 mb-8 max-w-lg mx-auto">
          {language === 'fr' && 'Jeu éducatif 3D pour enfants · 5–12 ans · 100% hors-ligne · Trilingue'}
          {language === 'en' && '3D educational game for children · Ages 5–12 · 100% offline · Trilingual'}
          {language === 'ar' && 'لعبة تعليمية ثلاثية الأبعاد للأطفال · 5-12 سنة · 100% بلا إنترنت · ثلاث لغات'}
        </p>
        <button
          onClick={onStart}
          className="bg-white text-sky-700 font-bold px-8 py-3 rounded-xl text-lg hover:bg-sky-50 transition-colors"
        >
          {t.landingHeroCTA}
        </button>
        {/* Reassurance badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[t.landingBadgeNoAds, t.landingBadgeOffline, t.landingBadgeTTS].map((badge) => (
            <span key={badge} className="bg-sky-500 rounded-full px-4 py-1 text-sm font-medium">
              ✓ {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Universes */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">{t.landingUniversesTitle}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {UNIVERSES.map((u) => (
            <div key={u.fr} className="border border-slate-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{u.emoji}</div>
              <div className="font-semibold text-slate-800 text-sm">{u[language]}</div>
              <div className="text-xs text-slate-500 mt-1">{u.count} {UNIVERSE_LABEL[language]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-slate-50 px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">{t.landingPricingTitle}</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="text-lg font-bold text-slate-800">
              {language === 'ar' ? 'ورشة الاستكشاف' : language === 'en' ? 'Discovery Workshop' : 'Atelier Découverte'}
            </div>
            <div className="text-3xl font-black text-sky-600 my-2">
              {language === 'ar' ? 'مجاني' : language === 'en' ? 'FREE' : 'GRATUIT'}
            </div>
            <ul className="text-sm text-slate-600 space-y-1 mb-4">
              <li>✓ {language === 'ar' ? '20 مركبة' : language === 'en' ? '20 vehicles' : '20 véhicules'}</li>
              <li>✓ {language === 'ar' ? 'ملف طفل واحد' : language === 'en' ? '1 child profile' : '1 profil enfant'}</li>
              <li>✓ {language === 'ar' ? 'وضع التشخيص' : language === 'en' ? 'Diagnostic mode' : 'Mode Diagnostic'}</li>
            </ul>
            <button onClick={onStart} className="w-full bg-sky-600 text-white rounded-lg py-2 font-semibold hover:bg-sky-700 transition-colors">
              {t.landingHeroCTA}
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 opacity-70">
            <div className="text-lg font-bold text-slate-800">
              {language === 'ar' ? 'تصريح العائلة' : language === 'en' ? 'Family Pass' : 'Pass Famille'}
            </div>
            <div className="text-3xl font-black text-slate-400 my-2">12,99 €</div>
            <ul className="text-sm text-slate-500 space-y-1 mb-4">
              <li>✓ {language === 'ar' ? '100 مركبة' : language === 'en' ? '100 vehicles' : '100 véhicules'}</li>
              <li>✓ {language === 'ar' ? '5 ملفات' : language === 'en' ? '5 profiles' : '5 profils'}</li>
              <li>✓ {language === 'ar' ? 'كل التشطيبات' : language === 'en' ? 'All finishes' : 'Toutes finitions'}</li>
            </ul>
            <button disabled className="w-full bg-slate-200 text-slate-500 rounded-lg py-2 font-semibold cursor-not-allowed">
              {language === 'ar' ? 'قريباً' : language === 'en' ? 'Coming soon' : 'Bientôt disponible'}
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          <a href="#ecole" className="underline hover:text-sky-600">
            {language === 'ar' ? 'تراخيص المدارس على طلب ←' : language === 'en' ? 'School licenses on request →' : 'Licences École sur devis →'}
          </a>
        </p>
      </section>

      {/* School inquiry */}
      <section id="ecole" className="px-6 py-12 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">{t.landingSchoolTitle}</h2>
        {formStatus === 'done' ? (
          <p className="text-center text-sky-700 font-semibold text-lg">{t.landingSchoolThanks}</p>
        ) : (
          <form onSubmit={handleSchoolSubmit} className="space-y-4">
            <input
              required
              maxLength={50}
              placeholder={language === 'ar' ? 'الاسم' : language === 'en' ? 'First name' : 'Prénom'}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              required
              maxLength={100}
              placeholder={language === 'ar' ? 'المدرسة' : language === 'en' ? 'School' : 'Établissement'}
              value={form.school}
              onChange={(e) => setForm({ ...form, school: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              required
              type="email"
              placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <textarea
              maxLength={500}
              rows={3}
              placeholder={language === 'ar' ? 'رسالة (اختياري)' : language === 'en' ? 'Message (optional)' : 'Message (optionnel)'}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {formStatus === 'error' && <p className="text-red-600 text-sm">{formError}</p>}
            <button
              type="submit"
              disabled={formStatus === 'sending'}
              className="w-full bg-sky-600 text-white rounded-lg py-2 font-semibold hover:bg-sky-700 transition-colors disabled:opacity-60"
            >
              {formStatus === 'sending' ? '…' : t.landingSchoolSubmit}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-6 text-center text-sm text-slate-400">
        MécanoKids 3D — {language === 'ar' ? 'لعبة تعليمية' : language === 'en' ? 'Educational game' : 'Jeu éducatif'} · © 2026 ·{' '}
        <a href="#" className="underline hover:text-sky-600">
          {language === 'ar' ? 'سياسة الخصوصية' : language === 'en' ? 'Privacy policy' : 'Politique de confidentialité'}
        </a>
      </footer>
    </div>
  );
}
