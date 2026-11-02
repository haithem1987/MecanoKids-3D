import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { LanguageCode, VehicleCategory, VisualStyleMode } from '../types/game';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { buildPartMeshGroup } from '../three/partGeometries';

interface Props {
  language: LanguageCode;
  onStart: () => void;
  onSelectLanguage: (lang: LanguageCode) => void;
}

const UNIVERSES = [
  { emoji: '🚗', fr: 'Route & Ville',    en: 'Road & City',    ar: 'الطريق والمدينة', category: VehicleCategory.CAR,          gradient: 'from-sky-500 to-blue-600'      },
  { emoji: '⛵', fr: 'Mer & Navigation', en: 'Sea & Sailing',  ar: 'البحر والملاحة',  category: VehicleCategory.BOAT,         gradient: 'from-teal-500 to-cyan-600'     },
  { emoji: '✈️', fr: 'Air & Espace',     en: 'Air & Space',    ar: 'الجو والفضاء',    category: VehicleCategory.PLANE,        gradient: 'from-indigo-500 to-violet-600' },
  { emoji: '🏗️', fr: 'Chantier',         en: 'Construction',   ar: 'البناء',          category: VehicleCategory.CONSTRUCTION, gradient: 'from-amber-500 to-orange-600'  },
  { emoji: '🚀', fr: 'Rail & Mines',     en: 'Rail & Mines',   ar: 'القطار والمناجم', category: VehicleCategory.SPACE,        gradient: 'from-rose-500 to-red-600'      },
] as const;


function blueprintForCategory(cat: VehicleCategory) {
  return (
    VEHICLE_BLUEPRINTS.find((b) => b.category === cat && b.tier === 1) ??
    VEHICLE_BLUEPRINTS.find((b) => b.category === cat) ??
    VEHICLE_BLUEPRINTS[0]
  );
}

// ── 3D Canvas ────────────────────────────────────────────────────────────────

function Hero3DCanvas({ blueprintId }: { blueprintId: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth || 800;
    const H = el.clientHeight || 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Closer camera + wider FOV → vehicle fills more of the canvas
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 2.5, 6);
    camera.lookAt(0, 0.5, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(5, 8, 5);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x93c5fd, 0.5);
    fill.position.set(-4, 2, -3);
    scene.add(fill);

    const bp = VEHICLE_BLUEPRINTS.find((b) => b.id === blueprintId) ?? VEHICLE_BLUEPRINTS[0];
    const pivot = new THREE.Group();
    scene.add(pivot);

    const partGroups = bp.parts.map((spec) => {
      const g = buildPartMeshGroup(spec, VisualStyleMode.REALISTIC, false, 1);
      const [tx, ty, tz] = spec.targetPos;
      const [ex, ey, ez] = spec.explodeOffset;
      g.position.set(tx + ex * 3.5, ty + ey * 3.5, tz + ez * 3.5);
      pivot.add(g);
      return { g, spec };
    });

    const CYCLE = 6000;
    function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

    let raf: number;
    function animate(now: number) {
      raf = requestAnimationFrame(animate);
      const t = (now % CYCLE) / CYCLE;
      const assembleT = Math.min(t / 0.6, 1);
      const disperseT = t > 0.8 ? (t - 0.8) / 0.2 : 0;
      for (let i = 0; i < partGroups.length; i++) {
        const { g, spec } = partGroups[i];
        const [tx, ty, tz] = spec.targetPos;
        const [ex, ey, ez] = spec.explodeOffset;
        const fx = tx + ex * 3.5, fy = ty + ey * 3.5, fz = tz + ez * 3.5;
        const partStart = (i / partGroups.length) * 0.45;
        const p = easeOut(Math.max(0, Math.min(1, (assembleT - partStart) / 0.45)));
        const final = t > 0.8 ? easeOut(1 - disperseT) : p;
        g.position.set(fx + (tx - fx) * final, fy + (ty - fy) * final, fz + (tz - fz) * final);
      }
      pivot.rotation.y += 0.004;
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(animate);

    const obs = new ResizeObserver(() => {
      if (!el) return;
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    obs.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [blueprintId]);

  return <div ref={mountRef} className="w-full h-full" />;
}


// ── Main ──────────────────────────────────────────────────────────────────────

export function LandingPage({ language, onStart, onSelectLanguage }: Props) {
  const t = UI_TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const [activeIdx, setActiveIdx] = useState(0);
  const activeBp = blueprintForCategory(UNIVERSES[activeIdx].category);

  const [form, setForm] = useState({ firstName: '', school: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  async function handleSchoolSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus('sending');
    setFormError('');
    try {
      const res = await fetch('/api/school-inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.ok) { setFormStatus('done'); } else { setFormStatus('error'); setFormError(data.error ?? 'Erreur'); }
    } catch { setFormStatus('error'); setFormError('Erreur réseau'); }
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="bg-white text-slate-900 font-sans"
      style={{ height: '100%', overflowY: 'auto' }}
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-slate-100 bg-white/90 backdrop-blur-sm sticky top-0 z-20">
        <span className="text-xl lg:text-2xl font-bold text-sky-600">MécanoKids 3D</span>
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

      {/* ── Hero ──
          mobile  : canvas top (h-64) + text below, stacked
          md      : side by side, 40/60
          lg+     : side by side, 35/65, fills viewport height
      */}
      <section className="bg-slate-900 flex flex-col md:flex-row md:min-h-[520px] lg:min-h-[calc(100vh-64px)]">

        {/* Text panel */}
        <div className={`flex flex-col justify-center px-8 md:px-10 lg:px-16
          py-10 md:py-0
          w-full md:w-[38%] lg:w-[32%]
          shrink-0 z-10 order-2 md:order-1
          ${isRtl ? 'md:order-2' : ''}`}
        >
          {/* Category pill — visible on mobile above text */}
          <div className="mb-4 md:hidden">
            <span className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${UNIVERSES[activeIdx].gradient} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
              {UNIVERSES[activeIdx].emoji} {UNIVERSES[activeIdx][language]}
            </span>
          </div>

          <h1 className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
            {t.landingHeroTitle}
          </h1>
          <p className="text-sky-300 text-sm lg:text-base mb-6 lg:mb-8 max-w-xs lg:max-w-sm">
            {language === 'fr' && 'Jeu éducatif 3D · 5–12 ans · 100% hors-ligne · Trilingue'}
            {language === 'en' && '3D educational game · Ages 5–12 · 100% offline · Trilingual'}
            {language === 'ar' && 'لعبة تعليمية ثلاثية الأبعاد · 5-12 سنة · بلا إنترنت · ثلاث لغات'}
          </p>
          <button
            onClick={onStart}
            className="self-start bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-bold px-7 lg:px-9 py-3 lg:py-4 rounded-xl text-base lg:text-lg transition-all shadow-lg shadow-sky-900/40"
          >
            {t.landingHeroCTA}
          </button>
          <div className="flex flex-col gap-1.5 mt-6 lg:mt-8">
            {[t.landingBadgeNoAds, t.landingBadgeOffline, t.landingBadgeTTS].map((b) => (
              <span key={b} className="text-sky-400 text-xs lg:text-sm">✓ {b}</span>
            ))}
          </div>
        </div>

        {/* 3D Canvas panel */}
        <div className={`relative flex-1 order-1 md:order-2 ${isRtl ? 'md:order-1' : ''}
          h-72 md:h-auto`}
        >
          {/* Blueprint name label — top centre */}
          <div className="absolute top-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
            <span className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${UNIVERSES[activeIdx].gradient} text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg`}>
              {UNIVERSES[activeIdx].emoji} {UNIVERSES[activeIdx][language]} — {activeBp.name}
            </span>
          </div>

          {/* Vignette left edge (md+) */}
          <div className={`hidden md:block absolute inset-y-0 ${isRtl ? 'right-0' : 'left-0'} w-20 z-10 pointer-events-none`}
            style={{ background: `linear-gradient(to ${isRtl ? 'left' : 'right'}, #0f172a, transparent)` }}
          />

          <Hero3DCanvas key={activeBp.id} blueprintId={activeBp.id} />

          {/* ── Universe pills — overlaid at bottom of canvas ── */}
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center px-4">
            <div className="flex gap-2 flex-wrap justify-center">
              {UNIVERSES.map((u, i) => {
                const active = i === activeIdx;
                return (
                  <button
                    key={u.fr}
                    onClick={() => setActiveIdx(i)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                      transition-all duration-200 shadow-md cursor-pointer
                      ${active
                        ? `bg-gradient-to-r ${u.gradient} text-white scale-105 shadow-lg`
                        : 'bg-white/15 text-white/80 hover:bg-white/25 hover:text-white backdrop-blur-sm'
                      }`}
                  >
                    <span>{u.emoji}</span>
                    <span className="hidden sm:inline">{u[language]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-slate-50 px-6 lg:px-16 py-12 lg:py-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-8 text-center">{t.landingPricingTitle}</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl lg:max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
            <div className="text-lg font-bold text-slate-800">
              {language === 'ar' ? 'ورشة الاستكشاف' : language === 'en' ? 'Discovery Workshop' : 'Atelier Découverte'}
            </div>
            <div className="text-4xl font-black text-sky-600 my-3">
              {language === 'ar' ? 'مجاني' : language === 'en' ? 'FREE' : 'GRATUIT'}
            </div>
            <ul className="text-sm text-slate-600 space-y-2 mb-6">
              <li>✓ {language === 'ar' ? '20 مركبة' : language === 'en' ? '20 vehicles' : '20 véhicules'}</li>
              <li>✓ {language === 'ar' ? 'ملف طفل واحد' : language === 'en' ? '1 child profile' : '1 profil enfant'}</li>
              <li>✓ {language === 'ar' ? 'وضع التشخيص' : language === 'en' ? 'Diagnostic mode' : 'Mode Diagnostic'}</li>
            </ul>
            <button onClick={onStart} className="w-full bg-sky-600 text-white rounded-xl py-3 font-semibold hover:bg-sky-700 transition-colors">
              {t.landingHeroCTA}
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm opacity-70">
            <div className="text-lg font-bold text-slate-800">
              {language === 'ar' ? 'تصريح العائلة' : language === 'en' ? 'Family Pass' : 'Pass Famille'}
            </div>
            <div className="text-4xl font-black text-slate-400 my-3">12,99 €</div>
            <ul className="text-sm text-slate-500 space-y-2 mb-6">
              <li>✓ {language === 'ar' ? '100 مركبة' : language === 'en' ? '100 vehicles' : '100 véhicules'}</li>
              <li>✓ {language === 'ar' ? '5 ملفات' : language === 'en' ? '5 profiles' : '5 profils'}</li>
              <li>✓ {language === 'ar' ? 'كل التشطيبات' : language === 'en' ? 'All finishes' : 'Toutes finitions'}</li>
            </ul>
            <button disabled className="w-full bg-slate-200 text-slate-500 rounded-xl py-3 font-semibold cursor-not-allowed">
              {language === 'ar' ? 'قريباً' : language === 'en' ? 'Coming soon' : 'Bientôt disponible'}
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          <a href="#ecole" className="underline hover:text-sky-600">
            {language === 'ar' ? 'تراخيص المدارس على طلب ←' : language === 'en' ? 'School licenses on request →' : 'Licences École sur devis →'}
          </a>
        </p>
      </section>

      {/* ── School inquiry ── */}
      <section id="ecole" className="px-6 py-12 lg:py-16 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">{t.landingSchoolTitle}</h2>
        {formStatus === 'done' ? (
          <p className="text-center text-sky-700 font-semibold text-lg">{t.landingSchoolThanks}</p>
        ) : (
          <form onSubmit={handleSchoolSubmit} className="space-y-4">
            <input required maxLength={50} placeholder={language === 'ar' ? 'الاسم' : language === 'en' ? 'First name' : 'Prénom'}
              value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            <input required maxLength={100} placeholder={language === 'ar' ? 'المدرسة' : language === 'en' ? 'School' : 'Établissement'}
              value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            <input required type="email" placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            <textarea maxLength={500} rows={3} placeholder={language === 'ar' ? 'رسالة (اختياري)' : language === 'en' ? 'Message (optional)' : 'Message (optionnel)'}
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            {formStatus === 'error' && <p className="text-red-600 text-sm">{formError}</p>}
            <button type="submit" disabled={formStatus === 'sending'}
              className="w-full bg-sky-600 text-white rounded-lg py-2 font-semibold hover:bg-sky-700 transition-colors disabled:opacity-60">
              {formStatus === 'sending' ? '…' : t.landingSchoolSubmit}
            </button>
          </form>
        )}
      </section>

      <footer className="border-t border-slate-100 px-6 py-6 text-center text-sm text-slate-400">
        MécanoKids 3D — {language === 'ar' ? 'لعبة تعليمية' : language === 'en' ? 'Educational game' : 'Jeu éducatif'} · © 2026 ·{' '}
        <a href="/privacy.html" className="underline hover:text-sky-600">
          {language === 'ar' ? 'سياسة الخصوصية' : language === 'en' ? 'Privacy policy' : 'Politique de confidentialité'}
        </a>
      </footer>
    </div>
  );
}
