import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  RotateCcw,
  Square,
  Volume2,
  X,
  XCircle,
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  EngineeringPatentRecord,
  LanguageCode,
  VehicleBlueprint,
  VisualStyleMode,
} from '../types/game';
import { generateMechanicalQuiz } from '../utils/quizGenerator';
import { useSpeech } from '../utils/speech';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  blueprint: VehicleBlueprint;
  existingPatent?: EngineeringPatentRecord;
  onPassQuiz: (score: number, total: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  language,
  blueprint,
  existingPatent,
  onPassQuiz,
}) => {
  const { isSupported: speechSupported, isSpeaking, activeId, toggle: toggleSpeech, stop } =
    useSpeech();

  const questions = useMemo(
    () => generateMechanicalQuiz(blueprint, language),
    [blueprint, language],
  );

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);

  // Reset quiz progress cleanly when opened or blueprint changes
  useEffect(() => {
    if (isOpen) {
      setStepIndex(0);
      setSelectedOption(null);
      setScore(0);
      setFinished(false);
    }
  }, [blueprint.id, isOpen]);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const currentQ = questions[stepIndex] ?? questions[0];
  const totalQuestions = questions.length;
  const speechId = `quiz-q-${blueprint.id}-${stepIndex}`;

  const handleClose = () => {
    stop();
    onClose();
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      soundEngine.playSnapSuccess(VisualStyleMode.REALISTIC);
    } else {
      soundEngine.playGentleBounce();
    }
  };

  const handleAdvance = () => {
    stop();
    if (stepIndex + 1 < totalQuestions) {
      setStepIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      const finalScore = score;
      setFinished(true);
      if (finalScore >= 2) {
        soundEngine.playPatentEarned();
        onPassQuiz(finalScore, totalQuestions);
      }
    }
  };

  const handleRetry = () => {
    stop();
    setStepIndex(0);
    setSelectedOption(null);
    setScore(0);
    setFinished(false);
  };

  const passed = score >= 2;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
    >
      <div className="w-full max-w-xl max-h-[90vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>
                {finished
                  ? t.quizScoreTitle(score, totalQuestions)
                  : t.quizQuestionCounter(stepIndex + 1, totalQuestions)}
              </span>
              {existingPatent && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700">{t.garagePatentTag}</span>
                </>
              )}
            </div>
            <h2
              id="quiz-modal-title"
              className="mt-1 font-display text-xl font-bold text-slate-900"
            >
              {t.quizModalTitle(blueprint.name)}
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">{t.quizModalSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label={t.closeQuizAria}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!finished ? (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-sky-600 transition-all duration-200"
                  style={{ width: `${((stepIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question Prompt + Speech Button */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {currentQ.prompt}
                </h3>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={() =>
                      toggleSpeech(
                        speechId,
                        `${currentQ.prompt}. ${currentQ.options.join('. ')}`,
                        language,
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg shrink-0 cursor-pointer"
                  >
                    {isSpeaking && activeId === speechId ? (
                      <>
                        <Square className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>{t.voiceStopBtn}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                        <span>{t.voiceListenBtn}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Multiple-choice Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const answered = selectedOption !== null;
                  const isCorrectOpt = idx === currentQ.correctIndex;
                  const isChosen = idx === selectedOption;

                  let styleClasses =
                    'bg-white border-slate-200 hover:border-sky-500 text-slate-800 cursor-pointer';
                  if (answered) {
                    if (isCorrectOpt) {
                      styleClasses =
                        'bg-emerald-50 border-emerald-500 text-emerald-950 cursor-default';
                    } else if (isChosen) {
                      styleClasses = 'bg-rose-50 border-rose-400 text-rose-950 cursor-default';
                    } else {
                      styleClasses = 'bg-slate-50 border-slate-200 text-slate-500 cursor-default';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={answered}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full p-3.5 rounded-lg border text-start text-xs sm:text-sm font-medium flex items-center justify-between gap-3 transition-colors min-h-[48px] ${styleClasses}`}
                    >
                      <span className="leading-relaxed">{opt}</span>
                      {answered && isCorrectOpt && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {answered && isChosen && !isCorrectOpt && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Educational Explanation Card */}
              {selectedOption !== null && (
                <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {currentQ.explanation}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div
                className={`p-5 rounded-xl border ${
                  passed
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-amber-50 border-amber-300'
                } space-y-2`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      passed ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-mono tabular-nums text-xs font-bold text-slate-600">
                      {t.quizScoreTitle(score, totalQuestions)}
                    </p>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {passed ? t.quizPatentEarnedTitle : t.quizAlmostTitle}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {passed ? t.quizPatentEarnedDesc(blueprint.name) : t.quizAlmostDesc}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {!finished ? (
            <>
              <span className="font-mono tabular-nums text-xs text-slate-500">
                {t.quizScoreTitle(score, totalQuestions)}
              </span>
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleAdvance}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-40 rounded-lg transition-colors min-h-[40px] cursor-pointer"
              >
                {stepIndex + 1 < totalQuestions ? t.quizNextQuestionBtn : t.quizSeeResultsBtn}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors min-h-[40px] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>{t.quizRetryBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors min-h-[40px] cursor-pointer"
              >
                {t.admire3DBtn}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
