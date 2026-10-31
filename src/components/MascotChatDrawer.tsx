import React, { useEffect, useRef, useState } from 'react';
import { Lightbulb, Send, Wrench, X } from 'lucide-react';
import { ChatMessage, VehicleBlueprint, VisualStyleMode } from '../types/game';

interface MascotChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: VehicleBlueprint;
  placedPartIds: string[];
  visualStyle: VisualStyleMode;
  messages: ChatMessage[];
  onAppendMessage: (msg: ChatMessage) => void;
  onHighlightHintPart: (partId: string | null) => void;
}

const STYLE_LABELS: Record<VisualStyleMode, string> = {
  [VisualStyleMode.WOOD]: 'Jouet en Bois & Métal Peint',
  [VisualStyleMode.BLOCKS]: 'Blocs Modulaires',
  [VisualStyleMode.REALISTIC]: 'Maquette Mécanique Réaliste',
};

export const MascotChatDrawer: React.FC<MascotChatDrawerProps> = ({
  isOpen,
  onClose,
  blueprint,
  placedPartIds,
  visualStyle,
  messages,
  onAppendMessage,
  onHighlightHintPart,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const placedSet = new Set(placedPartIds);
  const nextValidPart =
    blueprint.parts.find(
      (p) => !placedSet.has(p.id) && p.dependsOn.every((dep) => placedSet.has(dep)),
    ) ?? null;

  const sendQuery = async (promptText: string, mode: 'fast' | 'general') => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    setErrorText(null);
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: trimmed,
      isFastHint: mode === 'fast',
    };
    onAppendMessage(userMsg);
    setInputValue('');
    setLoading(true);

    if (mode === 'fast' && nextValidPart) {
      onHighlightHintPart(nextValidPart.id);
    }

    try {
      const placedParts = blueprint.parts
        .filter((p) => placedSet.has(p.id))
        .map((p) => p.name);
      const remainingParts = blueprint.parts
        .filter((p) => !placedSet.has(p.id))
        .map((p) => p.name);

      const response = await fetch('/api/mascot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          message: trimmed,
          mode,
          context: {
            vehicleName: blueprint.name,
            category: blueprint.category,
            tierLabel: blueprint.tierLabel,
            placedParts,
            remainingParts,
            nextValidPartName: nextValidPart ? `${nextValidPart.name} (${nextValidPart.roleHint})` : null,
            visualStyleLabel: STYLE_LABELS[visualStyle],
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur de communication avec Mécano Léo.');
      }

      onAppendMessage({
        id: `m_${Date.now()}`,
        role: 'model',
        text: data.reply,
        isFastHint: mode === 'fast',
      });
    } catch (err) {
      setErrorText(
        err instanceof Error
          ? err.message
          : "Impossible de joindre Mécano Léo pour l'instant.",
      );
    } finally {
      setLoading(false);
    }
  };

  const starterQuestions = [
    nextValidPart
      ? `À quoi sert la pièce "${nextValidPart.name}" ?`
      : `Comment ${blueprint.name} avance dans la vraie vie ?`,
    blueprint.category === 'bateau'
      ? 'Pourquoi un bateau lourd ne coule-t-il pas ?'
      : blueprint.category === 'avion'
        ? "Comment les ailes soulèvent l'avion dans l'air ?"
        : 'À quoi sert le châssis sur une voiture ?',
  ];

  return (
    <aside
      aria-label="Assistant Mécano Léo"
      className="fixed top-16 right-4 bottom-4 z-30 w-[92vw] max-w-md bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Mécano Léo
            </h2>
            <p className="text-xs text-slate-500">
              Compagnon d&apos;atelier · Indices &amp; Questions curieuses
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer l'assistant"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Fast Hint Action Bar */}
      <div className="px-4 py-2.5 bg-amber-50/70 border-b border-amber-200/70 flex items-center justify-between gap-2">
        <span className="text-xs text-amber-900 font-medium">
          {nextValidPart
            ? 'Besoin d’un coup de pouce sur la prochaine pièce ?'
            : 'Bravo, ton véhicule est complet ! Pose tes questions.'}
        </span>
        {nextValidPart && (
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              sendQuery(
                'Donne-moi un indice rapide sur la prochaine pièce que je dois poser et où elle va.',
                'fast',
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Indice éclair</span>
          </button>
        )}
      </div>

      {/* Scrollable Multi-Turn Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white border border-slate-200 text-slate-500">
              Mécano Léo observe ton établi...
            </div>
          </div>
        )}

        {errorText && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {errorText}
          </div>
        )}

        <div ref={threadEndRef} />
      </div>

      {/* Starter Curiosity Buttons */}
      <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto bg-white">
        {starterQuestions.map((q) => (
          <button
            key={q}
            type="button"
            disabled={loading}
            onClick={() => sendQuery(q, 'general')}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendQuery(inputValue, 'general');
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pose une question mécanique à Léo..."
          className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-600 text-slate-900"
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          aria-label="Envoyer le message"
          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-45 text-white rounded-lg transition-colors min-h-[40px] flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
};
