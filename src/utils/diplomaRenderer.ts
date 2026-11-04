import { LanguageCode } from '../types/game';
import { DiplomaMilestoneEvaluation, StemCompetencyReport } from './stemAnalytics';

export interface DiplomaRenderMetadata {
  language: LanguageCode;
  profileName: string;
  diploma: DiplomaMilestoneEvaluation;
  report: StemCompetencyReport;
}

/**
 * Renders a crisp A4-landscape (2000x1414) Official Young Engineer Diploma
 * 100% offline using HTML5 Canvas 2D API after awaiting webfont readiness.
 */
export async function composeDiplomaDataUrl(meta: DiplomaRenderMetadata): Promise<string> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed safely if font API is restricted
    }
  }

  const width = 2000;
  const height = 1414; // Exact A4 landscape aspect ratio (sqrt(2) : 1)
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const { language, profileName, diploma, report } = meta;
  const isRtl = language === 'ar';
  ctx.direction = isRtl ? 'rtl' : 'ltr';

  // 1. Warm ivory parchment-grade engineering paper background
  ctx.fillStyle = '#fcfbf7';
  ctx.fillRect(0, 0, width, height);

  // Subtle geometric blueprint corner grid accents
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Architectural double frame (Navy & Gold)
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(72, 72, width - 144, height - 144);

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(88, 88, width - 176, height - 176);

  // Corner registration brackets
  const corners: Array<[number, number, number, number]> = [
    [108, 108, 1, 1],
    [width - 108, 108, -1, 1],
    [108, height - 108, 1, -1],
    [width - 108, height - 108, -1, -1],
  ];
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 4;
  for (const [cx, cy, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + dy * 42);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * 42, cy);
    ctx.stroke();
  }

  // 2. Top Institution Kicker
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0284c7';
  ctx.font = '700 28px "Plus Jakarta Sans", "Cairo", sans-serif';
  const academyKicker =
    language === 'ar'
      ? 'ميكانو كيدز 3D · أكاديمية الهندسة الميكانيكية للناشئين'
      : language === 'en'
        ? 'MÉCANOKIDS 3D · YOUNG MECHANICAL ENGINEERING ACADEMY'
        : 'MÉCANOKIDS 3D · ACADÉMIE D’INGÉNIERIE MÉCANIQUE JEUNESSE';
  ctx.fillText(academyKicker, width / 2, 195);

  // Main Diploma Rank Headline
  ctx.fillStyle = '#0f172a';
  ctx.font = '700 64px "Outfit", "Cairo", sans-serif';
  ctx.fillText(diploma.rankTitle[language], width / 2, 295);

  // Decorative central divider rule
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 260, 340);
  ctx.lineTo(width / 2 + 260, 340);
  ctx.stroke();

  // 3. "Awarded to" + Child Builder Name
  ctx.fillStyle = '#475569';
  ctx.font = '500 30px "Plus Jakarta Sans", "Cairo", sans-serif';
  const awardedToLine =
    language === 'ar'
      ? 'تُمنح هذه الشهادة الرسمية بكل فخر إلى المهندس(ة) الشاب(ة):'
      : language === 'en'
        ? 'This official engineering certificate is proudly awarded to:'
        : 'Ce certificat officiel d’atelier est décerné avec félicitations à :';
  ctx.fillText(awardedToLine, width / 2, 415);

  ctx.fillStyle = '#0369a1';
  ctx.font = '700 84px "Outfit", "Cairo", sans-serif';
  ctx.fillText(profileName, width / 2, 525);

  // Subtitle achievement citation
  ctx.fillStyle = '#334155';
  ctx.font = '500 30px "Plus Jakarta Sans", "Cairo", sans-serif';
  ctx.fillText(diploma.subtitle[language], width / 2, 600);

  // 4. Verified STEM Competency Box Grid (4 Pillars)
  const boxTop = 670;
  const boxWidth = 780;
  const boxHeight = 148;
  const gapX = 48;
  const gapY = 28;
  const startX = (width - (boxWidth * 2 + gapX)) / 2;

  report.pillars.forEach((pillar, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const bx = startX + col * (boxWidth + gapX);
    const by = boxTop + row * (boxHeight + gapY);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bx, by, boxWidth, boxHeight, 16);
    ctx.fill();

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bx, by, boxWidth, boxHeight, 16);
    ctx.stroke();

    const textPad = 28;
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 26px "Plus Jakarta Sans", "Cairo", sans-serif';
    ctx.fillText(pillar.title, isRtl ? bx + boxWidth - textPad : bx + textPad, by + 48);

    // Numeric Pillar Score
    ctx.textAlign = isRtl ? 'left' : 'right';
    ctx.fillStyle = '#0284c7';
    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.fillText(
      `${pillar.score}%`,
      isRtl ? bx + textPad : bx + boxWidth - textPad,
      by + 48,
    );

    // Progress track
    const barX = bx + textPad;
    const barY = by + 68;
    const barW = boxWidth - textPad * 2;
    const barH = 12;
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 6);
    ctx.fill();

    const fillW = Math.max(8, (barW * pillar.score) / 100);
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(isRtl ? barX + barW - fillW : barX, barY, fillW, barH, 6);
    ctx.fill();

    // Evidence caption
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '500 21px "Plus Jakarta Sans", "Cairo", sans-serif';
    ctx.fillText(pillar.evidenceLine, isRtl ? bx + boxWidth - textPad : bx + textPad, by + 118);
  });

  // 5. Footer: Summary Metrics, Official Gold Seal & Issue Date
  const footerY = 1165;
  const sideMargin = 196;

  // Left/Start column: Verified Workshop Totals
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = '700 26px "JetBrains Mono", "Plus Jakarta Sans", "Cairo", sans-serif';
  const summaryLine =
    language === 'ar'
      ? `المركبات: ${report.completedVehicles}/100  ·  النجوم: ${report.totalStars} ★  ·  البراءات: ${report.patentsCount}`
      : language === 'en'
        ? `Vehicles: ${report.completedVehicles}/100  ·  Stars: ${report.totalStars} ★  ·  Patents: ${report.patentsCount}`
        : `Véhicules : ${report.completedVehicles}/100  ·  Étoiles : ${report.totalStars} ★  ·  Brevets : ${report.patentsCount}`;
  ctx.fillText(summaryLine, isRtl ? width - sideMargin : sideMargin, footerY);

  const dateStr = new Date().toLocaleDateString(
    language === 'ar' ? 'ar' : language === 'en' ? 'en-US' : 'fr-FR',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
  ctx.fillStyle = '#64748b';
  ctx.font = '500 24px "Plus Jakarta Sans", "Cairo", sans-serif';
  const issuedLine =
    language === 'ar'
      ? `تاريخ الإصدار: ${dateStr}`
      : language === 'en'
        ? `Issued on ${dateStr}`
        : `Délivré le ${dateStr}`;
  ctx.fillText(issuedLine, isRtl ? width - sideMargin : sideMargin, footerY + 46);

  // Official Gold Engineering Seal on opposite side
  const sealX = isRtl ? sideMargin + 95 : width - sideMargin - 95;
  const sealY = footerY + 8;

  ctx.save();
  ctx.beginPath();
  ctx.arc(sealX, sealY, 82, 0, Math.PI * 2);
  ctx.fillStyle = '#fef3c7';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#d97706';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sealX, sealY, 68, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = '#b45309';
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#92400e';
  ctx.font = '700 22px "JetBrains Mono", sans-serif';
  ctx.fillText('STEM 3D', sealX, sealY - 12);
  ctx.font = '700 32px "Outfit", sans-serif';
  ctx.fillText(`${diploma.requiredVehicles}+`, sealX, sealY + 26);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

export function downloadDiplomaPng(
  dataUrl: string,
  profileName: string,
  diplomaId: string,
): void {
  if (typeof document === 'undefined') return;
  const safeName =
    profileName
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 24) || 'ingenieur';
  const datePart = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `diplome-octo-gears-${safeName}-${diplomaId}-${datePart}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Prints the rendered Diploma PNG cleanly using a hidden in-page iframe
 * (avoids window.open popups so it works inside standalone PWAs and iframes).
 */
export function printDiplomaImage(dataUrl: string, documentTitle: string): void {
  if (typeof document === 'undefined') return;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const cleanup = () => {
    window.setTimeout(() => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 1500);
  };

  const doc = iframe.contentWindow?.document;
  if (!doc || !iframe.contentWindow) {
    cleanup();
    return;
  }

  doc.open();
  doc.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${documentTitle.replace(/[<>&"]/g, '')}</title>
    <style>
      @page { size: A4 landscape; margin: 8mm; }
      html, body { margin: 0; padding: 0; background: #ffffff; display: flex; align-items: center; justify-content: center; height: 100%; }
      img { max-width: 100%; max-height: 100%; object-fit: contain; }
    </style>
  </head>
  <body>
    <img id="diploma-img" src="${dataUrl}" alt="" />
  </body>
</html>`);
  doc.close();

  const imgEl = doc.getElementById('diploma-img') as HTMLImageElement | null;
  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      cleanup();
    }
  };

  if (imgEl && !imgEl.complete) {
    imgEl.onload = triggerPrint;
    imgEl.onerror = cleanup;
  } else {
    window.setTimeout(triggerPrint, 120);
  }
}
