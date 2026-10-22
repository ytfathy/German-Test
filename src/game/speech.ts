/**
 * Web Speech Recognition & Microphone Audio Level Analyzer
 * Configured specifically for German ('de-DE')
 */

export interface SpeechController {
  isSupported: boolean;
  start: (options: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (error: string) => void;
    onLevel: (level: number) => void;
    onEnd: () => void;
  }) => boolean;
  stop: () => void;
  isListening: () => boolean;
}

interface IWindowSpeech extends Window {
  SpeechRecognition?: unknown;
  webkitSpeechRecognition?: unknown;
}

export function createSpeechController(): SpeechController {
  const win = typeof window !== 'undefined' ? (window as unknown as IWindowSpeech) : ({} as Partial<IWindowSpeech>);
  const SpeechRecognitionClass = (win.SpeechRecognition || win.webkitSpeechRecognition) as
    | (new () => any)
    | undefined;

  let recognition: any = null;
  let audioContext: AudioContext | null = null;
  let micStream: MediaStream | null = null;
  let analyser: AnalyserNode | null = null;
  let animFrameId: number | null = null;
  let active = false;

  const isSupported = Boolean(SpeechRecognitionClass);

  function stop() {
    active = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
      try {
        audioContext.close();
      } catch {
        // ignore
      }
      audioContext = null;
    }
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
      recognition = null;
    }
  }

  function start({
    onResult,
    onError,
    onLevel,
    onEnd
  }: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (error: string) => void;
    onLevel: (level: number) => void;
    onEnd: () => void;
  }): boolean {
    if (!SpeechRecognitionClass) {
      onError('Browser does not support Web Speech Recognition.');
      return false;
    }

    stop();

    try {
      recognition = new SpeechRecognitionClass();
      recognition.lang = 'de-DE';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      active = true;

      // Microphone volume visualizer
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(stream => {
            if (!active) {
              stream.getTracks().forEach(t => t.stop());
              return;
            }
            micStream = stream;
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            audioContext = new AudioCtx();
            const source = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            function updateLevel() {
              if (!active || !analyser) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              onLevel(Math.min(1, avg / 80));
              animFrameId = requestAnimationFrame(updateLevel);
            }
            updateLevel();
          })
          .catch(() => {
            // microphone permission not granted for visualizer, recognition can still attempt
          });
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        const isFinal = Boolean(finalTranscript);
        onResult(text.trim(), isFinal);
      };

      recognition.onerror = (event: any) => {
        let msg = 'Sprachfehler: ' + (event.error || 'Unbekannt');
        if (event.error === 'not-allowed') {
          msg = 'Mikrofonzugriff wurde verweigert. Bitte erlaube den Mikrofonzugriff im Browser.';
        } else if (event.error === 'no-speech') {
          msg = 'Keine Sprache gehört. Bitte sprich lauter und deutlicher.';
        }
        onError(msg);
      };

      recognition.onend = () => {
        active = false;
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
        onEnd();
      };

      recognition.start();
      return true;
    } catch (err: any) {
      active = false;
      onError('Fehler beim Starten der Spracherkennung: ' + (err?.message || 'Error'));
      return false;
    }
  }

  return {
    isSupported,
    start,
    stop,
    isListening: () => active
  };
}
