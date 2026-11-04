import { getLiveryPreset } from '../data/liveries';
import { LanguageCode, LiveryPresetId } from '../types/game';
import { formatStopwatchMs } from './speedrun';

export interface PostcardMetadata {
  language: LanguageCode;
  vehicleName: string;
  stageSubtitle: string;
  profileName: string;
  stars: number;
  bestTimeMs: number | null;
  hasPatent: boolean;
  liveryId: LiveryPresetId;
}

/**
 * Composites a crisp 1200x820 PNG Souvenir Postcard from a WebGL snapshot data URL
 * completely offline using the HTML5 2D Canvas API.
 */
export async function composePostcardDataUrl(
  snapshotDataUrl: string,
  meta: PostcardMetadata,
): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = (err) => reject(err);
    el.src = snapshotDataUrl;
  });

  const width = 1200;
  const height = 820;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const isRtl = meta.language === 'ar';
  ctx.direction = isRtl ? 'rtl' : 'ltr';

  const livery = getLiveryPreset(meta.liveryId);

  // 1. Clean studio card outer surface
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);

  // Subtle top accent band matching custom livery
  ctx.fillStyle = livery.swatchHex;
  ctx.fillRect(0, 0, width, 10);

  // Outer hairline border
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 22, width - 36, height - 40);

  // 2. Top Header Bar
  const padX = 48;
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px "Outfit", "Cairo", sans-serif';
  ctx.textAlign = isRtl ? 'right' : 'left';
  const brandLabel =
    meta.language === 'ar'
      ? 'ميكانو كيدز 3D — بطاقة تذكارية من الورشة'
      : meta.language === 'en'
        ? 'Octo Gears — Official Workshop Souvenir'
        : 'Octo Gears — Carte Postale Souvenir d’Atelier';
  ctx.fillText(brandLabel, isRtl ? width - padX : padX, 66);

  const dateStr = new Date().toLocaleDateString(
    meta.language === 'ar' ? 'ar' : meta.language === 'en' ? 'en-US' : 'fr-FR',
    { year: 'numeric', month: 'short', day: 'numeric' },
  );
  ctx.fillStyle = '#64748b';
  ctx.font = '600 18px "Plus Jakarta Sans", "Cairo", sans-serif';
  ctx.textAlign = isRtl ? 'left' : 'right';
  ctx.fillText(dateStr, isRtl ? padX : width - padX, 64);

  // 3. Center 3D Photograph Viewport Frame (cover-crop maintaining aspect ratio)
  const frameX = 48;
  const frameY = 88;
  const frameW = width - 96;
  const frameH = 540;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(frameX, frameY, frameW, frameH, 16);
  ctx.clip();

  ctx.fillStyle = '#eef2f7';
  ctx.fillRect(frameX, frameY, frameW, frameH);

  const imgAspect = img.width / Math.max(1, img.height);
  const boxAspect = frameW / frameH;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgAspect > boxAspect) {
    sw = img.height * boxAspect;
    sx = (img.width - sw) * 0.5;
  } else {
    sh = img.width / boxAspect;
    sy = (img.height - sh) * 0.5;
  }

  ctx.drawImage(img, sx, sy, sw, sh, frameX, frameY, frameW, frameH);
  ctx.restore();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(frameX, frameY, frameW, frameH, 16);
  ctx.stroke();

  // 4. Bottom Engineering Title Block
  const footerY = 672;
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 34px "Outfit", "Cairo", sans-serif';
  ctx.fillText(meta.vehicleName, isRtl ? width - padX : padX, footerY);

  ctx.fillStyle = '#475569';
  ctx.font = '500 19px "Plus Jakarta Sans", "Cairo", sans-serif';
  const builderLine =
    meta.language === 'ar'
      ? `المهندس الباني: ${meta.profileName} · ${meta.stageSubtitle}`
      : meta.language === 'en'
        ? `Built by: ${meta.profileName} · ${meta.stageSubtitle}`
        : `Construit par : ${meta.profileName} · ${meta.stageSubtitle}`;
  ctx.fillText(builderLine, isRtl ? width - padX : padX, footerY + 36);

  // Livery finish caption
  ctx.fillStyle = '#64748b';
  ctx.font = '600 16px "Plus Jakarta Sans", "Cairo", sans-serif';
  const liveryText =
    meta.language === 'ar'
      ? `الطلاء: ${livery.label.ar}`
      : meta.language === 'en'
        ? `Finish: ${livery.label.en}`
        : `Finition : ${livery.label.fr}`;
  ctx.fillText(liveryText, isRtl ? width - padX : padX, footerY + 68);

  // Right / End Column: Stars, Patent Seal & Best Chrono
  ctx.textAlign = isRtl ? 'left' : 'right';
  const endX = isRtl ? padX : width - padX;

  const starStr = '★'.repeat(Math.max(1, Math.min(3, meta.stars))) + '☆'.repeat(Math.max(0, 3 - meta.stars));
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(starStr, endX, footerY + 2);

  const statsParts: string[] = [];
  if (meta.bestTimeMs !== null && meta.bestTimeMs > 0) {
    const timeLabel =
      meta.language === 'ar'
        ? `الزمن: ${formatStopwatchMs(meta.bestTimeMs)}`
        : meta.language === 'en'
          ? `Best: ${formatStopwatchMs(meta.bestTimeMs)}`
          : `Chrono : ${formatStopwatchMs(meta.bestTimeMs)}`;
    statsParts.push(timeLabel);
  }
  if (meta.hasPatent) {
    statsParts.push(
      meta.language === 'ar'
        ? '✓ براءة مهندس معتمدة'
        : meta.language === 'en'
          ? '✓ Engineering Patent'
          : '✓ Brevet d’Ingénieur',
    );
  }

  if (statsParts.length > 0) {
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 18px "JetBrains Mono", "Plus Jakarta Sans", "Cairo", sans-serif';
    ctx.fillText(statsParts.join('  ·  '), endX, footerY + 42);
  }

  return canvas.toDataURL('image/png');
}

export function downloadDataUrlAsPng(dataUrl: string, vehicleName: string): void {
  if (typeof document === 'undefined') return;
  const safeSlug =
    vehicleName
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 32) || 'vehicule';
  const datePart = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `octo-gears-${safeSlug}-${datePart}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
