import { useEffect, useRef, useState } from 'react';

const moves = ['high-five', 'crab-clap', 'dance', 'fish-bubbles', 'juggle', 'turtle-spin'] as const;
type Move = typeof moves[number] | 'victory';
export const OCTO_VICTORY_DURATION_MS = 2600;

function Crab() {
  return <g className="octo-crab">
    <path d="M38 76 23 89 M42 84 36 100 M99 76 116 89 M95 84 103 100" stroke="#c2410c" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="69" cy="72" rx="31" ry="20" fill="#fb923c" />
    <path className="octo-crab-claw" d="M42 63 29 46a12 12 0 0 1-12-16l9 5 5-9a12 12 0 0 1 4 17l15 16Z" fill="#f97316" />
    <path className="octo-crab-claw" d="M97 63 110 46a12 12 0 0 0 12-16l-9 5-5-9a12 12 0 0 0-4 17L89 59Z" fill="#f97316" />
    <circle cx="60" cy="60" r="6" fill="#fff" /><circle cx="79" cy="60" r="6" fill="#fff" />
    <circle cx="61" cy="61" r="3" fill="#172554" /><circle cx="78" cy="61" r="3" fill="#172554" />
    <path d="M63 75q6 6 12 0" fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
  </g>;
}

function Fish() {
  return <>
    <g className="octo-fish">
      <path d="M45 58 17 42v33Z" fill="#0d9488" />
      <ellipse cx="72" cy="58" rx="34" ry="22" fill="#2dd4bf" />
      <path d="M69 39q-10 18 0 38M80 38q-8 19 0 40" fill="none" stroke="#0f766e" strokeWidth="4" />
      <circle cx="92" cy="52" r="6" fill="white" /><circle cx="94" cy="52" r="3" fill="#172554" />
      <path d="M93 66q5 4 9-2" fill="none" stroke="#115e59" strokeWidth="3" strokeLinecap="round" />
    </g>
    <g className="octo-bubbles" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2">
      <circle cx="111" cy="43" r="5" /><circle cx="121" cy="29" r="7" /><circle cx="133" cy="15" r="4" />
    </g>
  </>;
}

function Turtle() {
  return <g className="octo-turtle">
    <path d="M42 66q-22 4-19 15 9 5 24-3m45-13q20 3 19 15-9 6-22-3M44 72q-12 14-2 19 9 1 14-13m22 0q7 15 15 12 6-6-6-18"
      fill="#22c55e" />
    <path d="M37 68q0-32 31-33 31 1 32 33-31 24-63 0Z" fill="#15803d" />
    <path d="m53 52 15-9 15 9v15l-15 9-15-9Z" fill="#86efac" stroke="#166534" strokeWidth="3" />
    <circle cx="105" cy="57" r="14" fill="#4ade80" /><circle cx="109" cy="53" r="3" fill="#172554" />
  </g>;
}

export function OctoSurprise({ placed, total, stageNumber, blocked, completed, congratulations }: {
  placed: number;
  total: number;
  stageNumber: number;
  blocked: boolean;
  completed: boolean;
  congratulations: string;
}) {
  const highest = useRef(placed);
  const [surprise, setSurprise] = useState<{ move: Move; step: number }>();
  useEffect(() => {
    const previous = highest.current;
    highest.current = Math.max(previous, placed);
    if (blocked) {
      setSurprise(undefined);
      return;
    }
    if (placed <= previous) return;
    if (completed) {
      setSurprise({ move: 'victory', step: placed });
      return;
    }
    const first = total <= 5 ? 2 : 3;
    if (placed >= total || placed < first || (placed - first) % 5 !== 0) return;
    const move = moves[(stageNumber + (placed - first) / 5) % moves.length];
    setSurprise({ move, step: placed });
  }, [placed, total, stageNumber, blocked, completed]);
  useEffect(() => {
    if (!surprise) return;
    const timer = window.setTimeout(() => setSurprise(undefined), OCTO_VICTORY_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [surprise]);

  if (!surprise || blocked) return null;
  const victory = surprise.move === 'victory';
  const isOcto = victory || surprise.move === 'high-five' || surprise.move === 'dance' || surprise.move === 'juggle';
  return (
    <div dir="ltr" className="octo-surprise-position pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center">
      <div key={surprise.step} data-octo-surprise={surprise.move} className="octo-surprise flex flex-col items-center">
      <svg aria-hidden="true" viewBox={victory ? '-52 0 244 112' : '0 0 140 112'}
        className={`h-24 drop-shadow-md sm:h-28 ${victory ? 'w-44 sm:w-48' : 'w-28 sm:w-36'}`}>
        {victory && <>
          <g transform="translate(-45 31) scale(.58)"><Crab /></g>
          <g transform="translate(104 34) scale(.55)"><Fish /></g>
          <path className="octo-surprise-spark" d="M9 18v11m-5-5h10M136 13v10m-5-5h10M113 8v10m-5-5h10" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
        </>}
        {surprise.move === 'crab-clap' && <Crab />}
        {surprise.move === 'fish-bubbles' && <Fish />}
        {surprise.move === 'turtle-spin' && <Turtle />}
        {isOcto && <g className="octo-surprise-body" strokeLinecap="round" strokeLinejoin="round">
          <path d="M46 68 Q35 95 20 91 M56 75 Q47 102 34 99 M65 78 Q62 102 53 104 M75 78 Q78 102 87 104 M84 75 Q93 102 106 99 M94 68 Q105 95 120 91"
            fill="none" stroke="#db2777" strokeWidth="9" />
          <path className="octo-surprise-arm" d="M98 65 Q120 70 121 49 Q121 40 128 39"
            fill="none" stroke="#f472b6" strokeWidth="10" />
          <path d="M42 65 Q21 73 15 57" fill="none" stroke="#f472b6" strokeWidth="10" />
          <ellipse cx="70" cy="60" rx="34" ry="30" fill="#f472b6" />
          <path d="M42 48 Q43 27 69 25 Q93 25 98 48 Z" fill="#fbbf24" />
          <path d="M40 48 H101" stroke="#d97706" strokeWidth="5" />
          <path d="M69 27 V38" stroke="#fef3c7" strokeWidth="4" />
          <ellipse cx="58" cy="62" rx="5" ry="7" fill="#172554" />
          <ellipse cx="82" cy="62" rx="5" ry="7" fill="#172554" />
          <path d="M64 74 Q70 80 76 74" fill="none" stroke="#831843" strokeWidth="3" />
        </g>}
        {surprise.move === 'high-five' && <path className="octo-surprise-spark" d="M126 20 V29 M118 25 L122 31 M135 25 L131 31" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />}
        {surprise.move === 'dance' && <path d="M20 38 V25 L34 21 V34 M118 55 V44 L132 40 V51" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />}
        {surprise.move === 'juggle' && <g fill="#f59e0b" stroke="#92400e" strokeWidth="2">
          <rect className="octo-surprise-piece" x="30" y="19" width="9" height="9" rx="2" />
          <rect className="octo-surprise-piece" x="65" y="10" width="9" height="9" rx="2" />
          <rect className="octo-surprise-piece" x="101" y="19" width="9" height="9" rx="2" />
        </g>}
      </svg>
      {victory && <span role="status" dir="auto" className="rounded-full bg-white px-4 py-1 font-bold text-indigo-950 shadow">{congratulations}</span>}
      </div>
    </div>
  );
}
