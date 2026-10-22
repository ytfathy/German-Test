import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { LESEN_UNITS, LesenUnit, LesenQuestion } from '../game/lesenCurriculum';
import { soundEngine } from '../game/audio';

interface LesenStudioModalProps {
  onClose: () => void;
  onAddScore: (points: number) => void;
  isMuted: boolean;
}

export const LesenStudioModal: React.FC<LesenStudioModalProps> = ({
  onClose,
  onAddScore,
  isMuted
}) => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [unitScore, setUnitScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isUnitCompleted, setIsUnitCompleted] = useState(false);

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.85);
  const [showArabicTranslation, setShowArabicTranslation] = useState(true);

  const currentUnit = LESEN_UNITS[selectedUnitIndex] || LESEN_UNITS[0];
  const currentQuestion = currentUnit.questions[currentQuestionIndex];

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopSpeech();
    };
  }, []);

  // When changing units, reset question state
  const handleSelectUnit = (index: number) => {
    soundEngine.stopSpeech();
    setIsPlayingAudio(false);
    setSelectedUnitIndex(index);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setHasAnswered(false);
    setUnitScore(0);
    setCorrectAnswersCount(0);
    setIsUnitCompleted(false);
  };

  // Play audio recitation of current passage
  const handlePlayPassageAudio = useCallback(() => {
    if (isMuted) return;
    setIsPlayingAudio(true);
    soundEngine.speakGerman(
      currentUnit.passage,
      audioSpeed,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(true)
    );
  }, [currentUnit.passage, audioSpeed, isMuted]);

  const handleStopPassageAudio = useCallback(() => {
    soundEngine.stopSpeech();
    setIsPlayingAudio(false);
  }, []);

  // Play question prompt audio
  const handleSpeakQuestion = useCallback((text: string) => {
    if (isMuted) return;
    soundEngine.speakGerman(text, 0.9);
  }, [isMuted]);

  // Handle Answer Selection (NO TIMER - Stays until student clicks an option)
  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;

    setSelectedAnswerIndex(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) {
      soundEngine.playCorrectGate();
      setUnitScore(s => s + 100);
      setCorrectAnswersCount(c => c + 1);
      onAddScore(100);
    } else {
      soundEngine.playWrongGate();
    }

    // Pronounce the correct option in German
    const correctText = currentQuestion.options[currentQuestion.correctIndex];
    setTimeout(() => {
      if (!isMuted) {
        soundEngine.speakGerman(correctText, 0.9);
      }
    }, 400);
  };

  // Move to next question ONLY when user clicks the button
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentUnit.questions.length - 1) {
      setCurrentQuestionIndex(idx => idx + 1);
      setSelectedAnswerIndex(null);
      setHasAnswered(false);
    } else {
      // Completed all questions in unit
      soundEngine.playVictoryFanfare();
      setIsUnitCompleted(true);
    }
  };

  const handleRestartUnit = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setHasAnswered(false);
    setUnitScore(0);
    setCorrectAnswersCount(0);
    setIsUnitCompleted(false);
  };

  const starsEarned =
    correctAnswersCount === currentUnit.questions.length
      ? 3
      : correctAnswersCount >= Math.ceil(currentUnit.questions.length * 0.6)
      ? 2
      : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* TOP HEADER */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border-b border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-lg">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-race text-sm sm:text-base font-black text-amber-400 tracking-wider">
                  📖 LESEN &amp; HÖREN STUDIO
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-hud font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {currentUnit.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-hud truncate">
                قسم نصوص القراءة والاستماع • بدون تايمر (خذ وقتك الكامل بالراحة)
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              soundEngine.stopSpeech();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            aria-label="إغلاق"
            title="إغلاق والعودة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* UNIT SELECTOR TABS (Horizontal Scroll) */}
        <div className="px-3 sm:px-6 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          {LESEN_UNITS.map((unit, idx) => {
            const isSelected = idx === selectedUnitIndex;
            return (
              <button
                key={unit.id}
                onClick={() => handleSelectUnit(idx)}
                className={`px-3 py-1.5 rounded-xl font-hud text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <span>{unit.icon}</span>
                <span>{unit.title}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!isUnitCompleted ? (
            <>
              {/* READING PASSAGE CARD WITH GERMAN AUDIO CONTROLLER */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/50 p-4 sm:p-5 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-2xl">{currentUnit.icon}</span>
                    <div>
                      <h3 className="font-race text-white text-base sm:text-lg font-bold">
                        {currentUnit.passageTitle}
                      </h3>
                      <p className="text-xs text-amber-300/80 font-hud">
                        {currentUnit.titleArabic} • {currentUnit.topic}
                      </p>
                    </div>
                  </div>

                  {/* Audio Controls Bar */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Speed Selector */}
                    <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-1 rounded-lg border border-slate-700 text-[10px] font-hud text-slate-300">
                      <span>السرعة:</span>
                      <button
                        onClick={() => setAudioSpeed(0.8)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${
                          audioSpeed === 0.8 ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:text-white'
                        }`}
                        title="سرعة هادئة للمبتدئين"
                      >
                        0.8x
                      </button>
                      <button
                        onClick={() => setAudioSpeed(1.0)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${
                          audioSpeed === 1.0 ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:text-white'
                        }`}
                        title="سرعة طبيعية"
                      >
                        1.0x
                      </button>
                    </div>

                    {/* Audio Play/Stop Button */}
                    {isPlayingAudio ? (
                      <button
                        onClick={handleStopPassageAudio}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-hud text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
                      >
                        <span className="flex items-end gap-0.5 h-3">
                          <span className="w-1 bg-white animate-pulse h-2" />
                          <span className="w-1 bg-white animate-pulse h-3.5" />
                          <span className="w-1 bg-white animate-pulse h-2" />
                        </span>
                        <span>⏹ إيقاف الصوت</span>
                      </button>
                    ) : (
                      <button
                        onClick={handlePlayPassageAudio}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-hud text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer active:scale-95 hover:scale-105"
                      >
                        <Volume2 className="w-4 h-4 text-slate-950" />
                        <span>🔊 استمع للقطعة (Vorlesen)</span>
                      </button>
                    )}

                    {/* Toggle Arabic helper */}
                    <button
                      onClick={() => setShowArabicTranslation(s => !s)}
                      className={`px-2.5 py-1.5 rounded-xl font-hud text-xs border transition-colors cursor-pointer ${
                        showArabicTranslation
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                      title="إظهار / إخفاء الترجمة العربية التوضيحية"
                    >
                      {showArabicTranslation ? '🇸🇦 إخفاء المعنى' : '🇸🇦 معنى القطعة'}
                    </button>
                  </div>
                </div>

                {/* German Reading Passage Text */}
                <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-black/60 border border-slate-800">
                  <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed font-sans font-medium tracking-wide">
                    &ldquo;{currentUnit.passage}&rdquo;
                  </p>

                  {/* Optional Arabic Translation */}
                  {showArabicTranslation && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-right">
                      <p className="text-xs sm:text-sm text-cyan-200/90 leading-relaxed font-sans">
                        💡 {currentUnit.passageArabic}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* UNTIMED QUESTION SECTION */}
              <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/40 p-4 sm:p-5 shadow-xl">
                {/* Status Bar: Question Progress & Untimed Indicator */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-hud text-xs font-bold">
                      Frage {currentQuestionIndex + 1} / {currentUnit.questions.length}
                    </span>
                    <span className="text-xs font-hud text-slate-400">
                      • النقاط: <strong className="text-amber-400">+{unitScore}</strong>
                    </span>
                  </div>

                  {/* UNTIMED BADGE */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-hud font-bold">
                    <span>⏳ بدون تايمر</span>
                    <span className="text-[10px] opacity-80">(السؤال يفضل موجود لغاية ما تختار)</span>
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="mb-4 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-race text-white text-base sm:text-lg md:text-xl font-bold leading-snug">
                        {currentQuestion.prompt}
                      </h4>
                      {currentQuestion.promptArabic && (
                        <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
                          {currentQuestion.promptArabic}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleSpeakQuestion(currentQuestion.prompt)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                      title="قراءة السؤال بصوت واضح"
                      aria-label="قراءة السؤال بصوت واضح"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3 Interactive Lane Answer Choices */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswerIndex === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;

                    let buttonClass =
                      'bg-slate-950/80 hover:bg-slate-800/90 text-slate-200 border-slate-700 hover:border-amber-500/60';

                    if (hasAnswered) {
                      if (isSelected) {
                        buttonClass = isCorrect
                          ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500 shadow-lg shadow-emerald-950'
                          : 'bg-rose-950/90 border-rose-500 text-rose-100 ring-2 ring-rose-500 shadow-lg shadow-rose-950';
                      } else if (isCorrect) {
                        buttonClass =
                          'bg-emerald-950/50 border-emerald-500/70 text-emerald-200 ring-1 ring-emerald-400 animate-pulse';
                      } else {
                        buttonClass = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-3 sm:p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${buttonClass}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-hud text-xs font-black shrink-0 ${
                              hasAnswered && isCorrect
                                ? 'bg-emerald-500 text-slate-950'
                                : hasAnswered && isSelected && !isCorrect
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}
                          </span>
                          <span className="font-hud text-sm sm:text-base font-bold text-white break-words">
                            {option}
                          </span>
                        </div>

                        {hasAnswered && isSelected && (
                          <div className="shrink-0 flex items-center gap-1.5 font-hud text-xs font-black">
                            {isCorrect ? (
                              <span className="flex items-center gap-1 text-emerald-400">
                                <CheckCircle2 className="w-5 h-5" />
                                RICHTIG! (+100)
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-rose-400">
                                <XCircle className="w-5 h-5" />
                                FALSCH!
                              </span>
                            )}
                          </div>
                        )}

                        {hasAnswered && !isSelected && isCorrect && (
                          <span className="shrink-0 text-emerald-400 font-hud text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            الإجابة الصحيحة
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* FEEDBACK & NEXT QUESTION ACTION (Advances ONLY when clicked!) */}
                {hasAnswered && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
                    <div className="text-left w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-race text-sm font-bold ${
                            selectedAnswerIndex === currentQuestion.correctIndex
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {selectedAnswerIndex === currentQuestion.correctIndex
                            ? '✅ إجابة ممتازة و صحيحة!'
                            : '💡 التوضيح والإجابة الصحيحة:'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-hud mt-0.5">
                        {currentQuestion.explanation}
                      </p>
                      {currentQuestion.explanationArabic && (
                        <p className="text-xs text-cyan-300 font-sans mt-0.5">
                          {currentQuestion.explanationArabic}
                        </p>
                      )}
                    </div>

                    {/* PROCEED TO NEXT QUESTION BUTTON */}
                    <button
                      onClick={handleNextQuestion}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-slate-950 font-race text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                    >
                      <span>
                        {currentQuestionIndex < currentUnit.questions.length - 1
                          ? 'السؤال التالي ➔'
                          : 'إنهاء القطعة وعرض النتيجة 🏆'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* UNIT COMPLETED CARD */
            <div className="p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/80 text-center space-y-6 max-w-xl mx-auto shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40">
                <Trophy className="w-10 h-10 text-slate-950" />
              </div>

              <div>
                <span className="font-race text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
                  UNIT COMPLETED • تم إنهاء نص القراءة بنجاح
                </span>
                <h3 className="font-race text-2xl sm:text-3xl font-black text-white">
                  {currentUnit.title}
                </h3>
                <p className="text-sm text-slate-300 font-hud mt-1">
                  {currentUnit.titleArabic}
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex items-center justify-center gap-2 text-3xl">
                {[1, 2, 3].map(star => (
                  <span
                    key={star}
                    className={`transition-all duration-300 ${
                      star <= starsEarned ? 'text-amber-400 scale-110' : 'text-slate-700'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Score stats */}
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-hud text-slate-400 uppercase block">الإجابات الصحيحة</span>
                  <span className="font-hud text-xl font-bold text-emerald-400">
                    {correctAnswersCount} / {currentUnit.questions.length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-hud text-slate-400 uppercase block">النقاط المكتسبة</span>
                  <span className="font-hud text-xl font-bold text-amber-400">
                    +{unitScore} PKT
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestartUnit}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-hud text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة حل هذه الوحدة</span>
                </button>

                {selectedUnitIndex < LESEN_UNITS.length - 1 && (
                  <button
                    onClick={() => handleSelectUnit(selectedUnitIndex + 1)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-hud text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/30"
                  >
                    <span>الوحدة التالية ➔</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-hud text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <span>العودة للسباق 🏎️</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
