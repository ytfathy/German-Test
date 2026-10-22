import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, RotateCcw, Zap, Keyboard, HelpCircle, X } from 'lucide-react';
import { VoiceCheckpoint } from '../game/curriculum';
import { soundEngine } from '../game/audio';
import { createSpeechController, SpeechController } from '../game/speech';
import { evaluateGermanPronunciation, PronunciationResult } from '../game/pronunciation';

interface PronunciationModalProps {
  checkpoint: VoiceCheckpoint;
  onComplete: (score: number, boostSpeed: boolean) => void;
  onSkip: () => void;
}

export const PronunciationModal: React.FC<PronunciationModalProps> = ({
  checkpoint,
  onComplete,
  onSkip
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [micLevel, setMicLevel] = useState(0);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const speechCtrlRef = useRef<SpeechController | null>(null);

  useEffect(() => {
    speechCtrlRef.current = createSpeechController();
    // Play German phrase once on open
    soundEngine.speakGerman(checkpoint.germanText, 0.85);

    return () => {
      speechCtrlRef.current?.stop();
    };
  }, [checkpoint.germanText]);

  const handleListenGerman = () => {
    soundEngine.speakGerman(checkpoint.germanText, 0.85);
  };

  const startVoiceRecording = () => {
    setErrorMessage(null);
    setRecognizedText('');
    setResult(null);

    const controller = speechCtrlRef.current;
    if (!controller || !controller.isSupported) {
      setErrorMessage('Spracherkennung wird von diesem Browser nicht unterstützt. Du kannst den Text eintippen!');
      setManualMode(true);
      return;
    }

    const started = controller.start({
      onResult: (transcript, isFinal) => {
        setRecognizedText(transcript);
        if (isFinal) {
          const evalResult = evaluateGermanPronunciation(checkpoint.germanText, transcript);
          setResult(evalResult);
          if (evalResult.accuracyScore >= 70) {
            soundEngine.playCorrectGate();
          } else {
            soundEngine.playWrongGate();
          }
        }
      },
      onError: (err) => {
        setErrorMessage(err);
        setIsListening(false);
      },
      onLevel: (lvl) => {
        setMicLevel(lvl);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (started) {
      setIsListening(true);
    }
  };

  const stopVoiceRecording = () => {
    speechCtrlRef.current?.stop();
    setIsListening(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const evalResult = evaluateGermanPronunciation(checkpoint.germanText, manualInput);
    setResult(evalResult);
    if (evalResult.accuracyScore >= 70) {
      soundEngine.playCorrectGate();
    }
  };

  const handleContinueWithBoost = () => {
    const score = result ? result.accuracyScore : 80;
    const boost = score >= 65;
    onComplete(score, boost);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-none select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border-2 border-amber-500/80 p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-white animate-in zoom-in-95 duration-200">
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <span className="font-race text-sm font-bold tracking-wider text-amber-400 uppercase">
              RADAR-ZONE: AUSSPRACHE-CHECKPOINT
            </span>
          </div>
          <button
            onClick={onSkip}
            aria-label="Überspringen"
            className="flex items-center gap-1 text-xs font-hud text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Überspringen</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* German Target Phrase Card */}
        <div className="my-5 p-5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <div className="text-xs uppercase font-hud text-cyan-400 font-bold tracking-widest mb-1">
            SPRICH DIESEN SATZ LAUT AUS:
          </div>
          <div className="font-race text-xl md:text-2xl font-black text-white drop-shadow my-2">
            „{checkpoint.germanText}”
          </div>
          <div className="text-xs text-slate-400 font-hud mb-2">
            {checkpoint.englishTranslation}
          </div>

          {/* Phonetic Pronunciation Guide */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono">
            <span>Aussprache:</span>
            <span className="font-bold">{checkpoint.phoneticGuide}</span>
          </div>
        </div>

        {/* Audio Listen & Coach Tip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <button
            onClick={handleListenGerman}
            aria-label="Deutschen Ton anhören"
            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-hud font-bold transition-colors cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>Muster anhören</span>
          </button>
          <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 font-hud leading-snug">
            <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
            <span>{checkpoint.pronunciationTip}</span>
          </div>
        </div>

        {/* Voice Recognition Section */}
        {!manualMode ? (
          <div className="flex flex-col items-center gap-4">
            {/* Microphone Button with Pulsing Wave */}
            <div className="relative">
              {isListening && (
                <div
                  className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping"
                  style={{ transform: `scale(${1 + micLevel * 0.8})` }}
                />
              )}
              <button
                onClick={isListening ? stopVoiceRecording : startVoiceRecording}
                aria-label={isListening ? 'Aufnahme stoppen' : 'Jetzt sprechen'}
                className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-xl ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/50 scale-105'
                    : 'bg-gradient-to-tr from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-amber-500/40'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-7 h-7" />
                    <span className="text-[9px] font-hud uppercase mt-0.5">Stopp</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-7 h-7" />
                    <span className="text-[9px] font-hud uppercase mt-0.5">Sprechen</span>
                  </>
                )}
              </button>
            </div>

            {/* Audio Waveform Meter */}
            {isListening && (
              <div className="flex items-center gap-1 h-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-rose-400 rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(4, Math.random() * micLevel * 24)}px`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Speech Transcript Output */}
            {recognizedText && (
              <div className="text-center font-hud text-sm text-cyan-300">
                Gehört: <span className="font-bold underline">„{recognizedText}”</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="text-xs text-rose-400 font-hud text-center bg-rose-950/60 p-2 rounded-lg border border-rose-800">
                {errorMessage}
              </div>
            )}

            {/* Manual Keyboard Switch */}
            <button
              onClick={() => setManualMode(true)}
              aria-label="Per Tastatur eingeben"
              className="text-xs text-slate-400 hover:text-cyan-300 font-hud flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Kein Mikrofon? Hier per Tastatur üben</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
            <label className="text-xs font-hud text-slate-300">
              Tippe den deutschen Satz ein:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="z.B. Ich spreche Deutsch..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-hud focus:border-cyan-400 outline-none text-sm"
              />
              <button
                type="submit"
                aria-label="Antwort prüfen"
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-hud font-bold text-xs text-white cursor-pointer"
              >
                Prüfen
              </button>
            </div>
            <button
              type="button"
              onClick={() => setManualMode(false)}
              className="text-xs text-slate-400 hover:text-cyan-300 font-hud self-start cursor-pointer"
            >
              ← Zurück zur Sprachaufnahme
            </button>
          </form>
        )}

        {/* Evaluation Results Card */}
        {result && (
          <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-amber-500/50 flex flex-col gap-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="font-race font-bold text-sm text-white">
                  Aussprache-Genauigkeit:
                </span>
              </div>
              <div className="font-race text-xl font-black text-amber-400 tabular-nums">
                {result.accuracyScore}%
              </div>
            </div>

            {/* Token-by-token alignment */}
            <div className="flex flex-wrap gap-1.5 justify-center py-2">
              {result.tokens.map((tok, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded-md text-xs font-hud font-bold ${
                    tok.matched
                      ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                      : 'bg-rose-950 border border-rose-500 text-rose-300'
                  }`}
                >
                  {tok.expected}
                </span>
              ))}
            </div>

            {/* Coach Feedback Tip */}
            <p className="text-xs text-slate-300 font-hud text-center">
              {result.feedbackTip}
            </p>

            {/* Action Button: Nitro Turbo Surge! */}
            <button
              onClick={handleContinueWithBoost}
              aria-label="Weiter mit Turbo Boost"
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500 text-white font-race font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-98 transition-transform cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>NITRO-BOOST ZÜNDEN & WEITER!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
