/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CURRICULUM_LEVELS, LevelCurriculum, QuestionGate, VoiceCheckpoint } from './game/curriculum';
import { AVAILABLE_CARS, CarModel, INITIAL_LEADERBOARD, LeaderboardEntry, calculateLapStars, updateStreak } from './game/racingRules';
import { soundEngine } from './game/audio';
import { RacingCanvas, LaneAnswerSelection } from './game/RacingCanvas';
import { HUD, GateFeedback } from './components/HUD';
import { TitleScreen } from './components/TitleScreen';
import { PronunciationModal } from './components/PronunciationModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GarageModal } from './components/GarageModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { RaceFinishModal } from './components/RaceFinishModal';
import { PauseModal } from './components/PauseModal';
import { LesenStudioModal } from './components/LesenStudioModal';

type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [currentLevel, setCurrentLevel] = useState<LevelCurriculum>(CURRICULUM_LEVELS[0]);
  const [currentCar, setCurrentCar] = useState<CarModel>(AVAILABLE_CARS[0]);

  // Answer Feedback & Interactive Selection
  const [gateFeedback, setGateFeedback] = useState<GateFeedback | null>(null);
  const [laneAnswerSelection, setLaneAnswerSelection] = useState<LaneAnswerSelection | null>(null);

  // Audio mute & Reading Audio
  const [isMuted, setIsMuted] = useState(false);
  const [isReadingAudioPlaying, setIsReadingAudioPlaying] = useState(false);
  const spokenGateIdRef = React.useRef<string | null>(null);

  // Player & Progression
  const [currentUserName, setCurrentUserName] = useState<string>('Malek S.');
  const [streakDays, setStreakDays] = useState<number>(5);
  const [completedStars, setCompletedStars] = useState<Record<number, number>>({ 1: 3 });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  // In-Race State
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [speedKmH, setSpeedKmH] = useState<number>(0);
  const [nitroPct, setNitroPct] = useState<number>(100);
  const [distancePct, setDistancePct] = useState<number>(0);
  const [upcomingGate, setUpcomingGate] = useState<QuestionGate | null>(null);
  const [gateDistance, setGateDistance] = useState<number>(9999);
  const [correctGatesHit, setCorrectGatesHit] = useState<number>(0);

  // Mobile / Touch Steering Intents
  const [steerIntent, setSteerIntent] = useState<-1 | 0 | 1>(0);
  const [nitroIntent, setNitroIntent] = useState<boolean>(false);

  // Active Modals
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGarage, setShowGarage] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showLesenStudio, setShowLesenStudio] = useState(false);
  const [activeVoiceCheckpoint, setActiveVoiceCheckpoint] = useState<VoiceCheckpoint | null>(null);
  const [voiceCheckpointIndex, setVoiceCheckpointIndex] = useState(0);

  // Race Finish Stats
  const [finishStats, setFinishStats] = useState<{
    timeSeconds: number;
    maxSpeed: number;
    gatesHit: number;
    totalGates: number;
    score: number;
    stars: number;
  } | null>(null);

  // Check URL params for ?autostart=1 or ?level=
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      handleStartRace();
    }
    const lvlParam = params.get('level');
    if (lvlParam) {
      const found = CURRICULUM_LEVELS.find(l => l.id === Number(lvlParam) || l.slug === lvlParam);
      if (found) setCurrentLevel(found);
    }
  }, []);

  // Sync state to body dataset
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // Daily Streak check
  useEffect(() => {
    try {
      const savedDate = localStorage.getItem('autobahn_last_play');
      const savedStreak = Number(localStorage.getItem('autobahn_streak')) || 5;
      const { newStreak, todayStr } = updateStreak(savedDate, savedStreak);
      setStreakDays(newStreak);
      localStorage.setItem('autobahn_last_play', todayStr);
      localStorage.setItem('autobahn_streak', String(newStreak));
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const toggleMute = useCallback(() => {
    const next = soundEngine.toggleMute();
    setIsMuted(next);
  }, []);

  // Global Key Listeners for Pause and Mute
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        if (e.code === 'Escape' || e.code === 'KeyP') {
          e.preventDefault();
          soundEngine.stopSpeech();
          setIsReadingAudioPlaying(false);
          setGameState('paused');
        }
      } else if (gameState === 'paused') {
        if (e.code === 'Escape' || e.code === 'KeyP') {
          e.preventDefault();
          setGameState('playing');
        }
      }
      if (e.code === 'KeyM') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [gameState, toggleMute]);

  const handleStartRace = useCallback(() => {
    setScore(0);
    setCombo(0);
    setDistancePct(0);
    setSpeedKmH(200);
    setCorrectGatesHit(0);
    setVoiceCheckpointIndex(0);
    setActiveVoiceCheckpoint(null);
    setFinishStats(null);
    setGateFeedback(null);
    setLaneAnswerSelection(null);
    soundEngine.stopSpeech();
    setIsReadingAudioPlaying(false);
    spokenGateIdRef.current = null;
    setGameState('playing');
  }, []);

  // Auto-dismiss gate feedback badge after 3.2 seconds
  useEffect(() => {
    if (!gateFeedback) return;
    const timer = setTimeout(() => {
      setGateFeedback(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [gateFeedback]);

  const handleSelectLaneAnswer = useCallback((laneIndex: 0 | 1 | 2) => {
    setLaneAnswerSelection({
      laneIndex,
      timestamp: Date.now()
    });
  }, []);

  const handlePlayReadingAudio = useCallback((text?: string) => {
    const passageToRead = text || (upcomingGate?.isLesen ? upcomingGate.passage : undefined);
    if (!passageToRead) return;
    setIsReadingAudioPlaying(true);
    soundEngine.speakGerman(
      passageToRead,
      0.88,
      () => setIsReadingAudioPlaying(false),
      () => setIsReadingAudioPlaying(true)
    );
  }, [upcomingGate]);

  const handleStopReadingAudio = useCallback(() => {
    soundEngine.stopSpeech();
    setIsReadingAudioPlaying(false);
  }, []);

  // Auto-play German recitation when approaching a "Lesen" gate
  useEffect(() => {
    if (gameState !== 'playing' || isMuted) {
      soundEngine.stopSpeech();
      setIsReadingAudioPlaying(false);
      return;
    }

    if (upcomingGate && upcomingGate.isLesen && upcomingGate.passage) {
      if (gateDistance < 16000 && gateDistance > 400) {
        if (spokenGateIdRef.current !== upcomingGate.id) {
          spokenGateIdRef.current = upcomingGate.id;
          handlePlayReadingAudio(upcomingGate.passage);
        }
      }
    }
  }, [upcomingGate, gateDistance, gameState, isMuted, handlePlayReadingAudio]);

  const handleGatePassed = useCallback((gate: QuestionGate, chosenLane: 0 | 1 | 2, isCorrect: boolean) => {
    // Stop any ongoing reading narration immediately upon passing the gate
    soundEngine.stopSpeech();
    setIsReadingAudioPlaying(false);

    const chosenOption = gate.options[chosenLane] || '';
    const correctOption = gate.options[gate.correctIndex] || '';
    let pointsAwarded = 0;

    if (isCorrect) {
      setCombo(c => {
        pointsAwarded = 250 + (c + 1) * 50;
        setScore(s => s + pointsAwarded);
        return c + 1;
      });
      setCorrectGatesHit(h => h + 1);
    } else {
      setCombo(0);
      pointsAwarded = -50;
      setScore(s => Math.max(0, s - 50));
    }

    setGateFeedback({
      gatePrompt: gate.prompt,
      chosenOption,
      correctOption,
      isCorrect,
      points: Math.abs(pointsAwarded),
      timestamp: Date.now()
    });
  }, []);

  const handleTriggerVoiceCheckpoint = useCallback(() => {
    const checkpoints = currentLevel.voiceCheckpoints;
    if (checkpoints.length === 0) return;
    const cp = checkpoints[voiceCheckpointIndex % checkpoints.length];
    setActiveVoiceCheckpoint(cp);
    setVoiceCheckpointIndex(idx => idx + 1);
  }, [currentLevel, voiceCheckpointIndex]);

  const handleVoiceCheckpointComplete = useCallback((accuracyScore: number, boostSpeed: boolean) => {
    setActiveVoiceCheckpoint(null);
    const addedPoints = accuracyScore * 5;
    setScore(s => s + addedPoints);
    if (boostSpeed) {
      soundEngine.playNitroBoost();
      setNitroPct(100);
    }
  }, []);

  const handleRaceFinish = useCallback((stats: { timeSeconds: number; maxSpeed: number; gatesHit: number }) => {
    soundEngine.stopSpeech();
    setIsReadingAudioPlaying(false);
    const totalGates = currentLevel.gates.length;
    const maxPossible = totalGates * 350 + 1500;
    const earnedStars = calculateLapStars(score, maxPossible);

    setCompletedStars(prev => ({
      ...prev,
      [currentLevel.id]: Math.max(prev[currentLevel.id] || 0, earnedStars)
    }));

    setFinishStats({
      timeSeconds: stats.timeSeconds,
      maxSpeed: stats.maxSpeed,
      gatesHit: correctGatesHit,
      totalGates,
      score,
      stars: earnedStars
    });

    // Update player on leaderboard
    setLeaderboard(prev => {
      const existingUserIdx = prev.findIndex(e => e.id === 'user-player');
      const userEntry: LeaderboardEntry = {
        id: 'user-player',
        name: currentUserName,
        school: 'Salahaldin School (SIS Cairo)',
        score: Math.max(score, existingUserIdx !== -1 ? prev[existingUserIdx].score : score),
        accuracy: 96,
        levelReached: currentLevel.id,
        carId: currentCar.id,
        streakDays,
        avatar: '🏎️',
        isCurrentUser: true
      };

      const filtered = prev.filter(e => e.id !== 'user-player');
      const updated = [...filtered, userEntry].sort((a, b) => b.score - a.score);
      return updated;
    });

    setGameState('gameover');
  }, [currentLevel, score, correctGatesHit, currentUserName, currentCar, streakDays]);

  const totalStarsEarned = useMemo(() => {
    return Object.values(completedStars).reduce((acc, curr) => acc + curr, 0);
  }, [completedStars]);

  const handleNextLevel = () => {
    const nextIdx = CURRICULUM_LEVELS.findIndex(l => l.id === currentLevel.id) + 1;
    if (nextIdx < CURRICULUM_LEVELS.length) {
      setCurrentLevel(CURRICULUM_LEVELS[nextIdx]);
      handleStartRace();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 1. 3D Simulated Canvas (Always rendered to preserve webgl/canvas context) */}
      <RacingCanvas
        level={currentLevel}
        selectedCar={currentCar}
        isPaused={gameState !== 'playing'}
        isVoiceCheckpointActive={Boolean(activeVoiceCheckpoint)}
        onGatePassed={handleGatePassed}
        onTriggerVoiceCheckpoint={handleTriggerVoiceCheckpoint}
        onRaceFinish={handleRaceFinish}
        onSpeedUpdate={(spd, nit, dist) => {
          setSpeedKmH(spd);
          setNitroPct(nit);
          setDistancePct(dist);
        }}
        onGateUpcoming={(gate, dist) => {
          setUpcomingGate(gate);
          setGateDistance(dist);
        }}
        steerIntent={steerIntent}
        nitroIntent={nitroIntent}
        laneAnswerSelection={laneAnswerSelection}
      />

      {/* 2. HUD Overlay during Gameplay */}
      {gameState === 'playing' && (
        <HUD
          level={currentLevel}
          speedKmH={speedKmH}
          nitroPct={nitroPct}
          distancePct={distancePct}
          score={score}
          streakDays={streakDays}
          comboCount={combo}
          upcomingGate={upcomingGate}
          gateDistance={gateDistance}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onPause={() => {
            soundEngine.stopSpeech();
            setIsReadingAudioPlaying(false);
            setGameState('paused');
          }}
          onTriggerVoice={handleTriggerVoiceCheckpoint}
          onSteerTouch={setSteerIntent}
          onNitroTouch={setNitroIntent}
          onSelectLaneAnswer={handleSelectLaneAnswer}
          gateFeedback={gateFeedback}
          isReadingAudioPlaying={isReadingAudioPlaying}
          onPlayReadingAudio={() => handlePlayReadingAudio()}
          onStopReadingAudio={handleStopReadingAudio}
          onOpenLesenStudio={() => setShowLesenStudio(true)}
        />
      )}

      {/* 3. Title Screen */}
      {gameState === 'title' && (
        <div className="absolute inset-0 z-30">
          <TitleScreen
            onStartRace={handleStartRace}
            onOpenLevels={() => setShowLevelSelect(true)}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onOpenGarage={() => setShowGarage(true)}
            onOpenLesenStudio={() => setShowLesenStudio(true)}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            currentLevel={currentLevel}
            currentCar={currentCar}
            streakDays={streakDays}
          />
        </div>
      )}

      {/* Dedicated Untimed Reading & Listening Comprehension Studio */}
      {showLesenStudio && (
        <LesenStudioModal
          onClose={() => setShowLesenStudio(false)}
          onAddScore={(points) => setScore(s => s + points)}
          isMuted={isMuted}
        />
      )}

      {/* 4. Real-time Voice Pronunciation Checkpoint */}
      {activeVoiceCheckpoint && (
        <PronunciationModal
          checkpoint={activeVoiceCheckpoint}
          onComplete={handleVoiceCheckpointComplete}
          onSkip={() => setActiveVoiceCheckpoint(null)}
        />
      )}

      {/* 5. Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal
          level={currentLevel}
          onResume={() => setGameState('playing')}
          onRestart={handleStartRace}
          onOpenLevelSelect={() => {
            setShowLevelSelect(true);
          }}
          onReturnToTitle={() => setGameState('title')}
        />
      )}

      {/* 6. Victory / Race Finish Modal */}
      {gameState === 'gameover' && finishStats && (
        <RaceFinishModal
          level={currentLevel}
          stats={finishStats}
          onNextLevel={handleNextLevel}
          onRestart={handleStartRace}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          hasNextLevel={currentLevel.id < CURRICULUM_LEVELS.length}
        />
      )}

      {/* 7. Level Selection Modal */}
      {showLevelSelect && (
        <LevelSelectModal
          currentLevelId={currentLevel.id}
          completedLevelStars={completedStars}
          onSelectLevel={(lvl) => {
            setCurrentLevel(lvl);
            if (gameState === 'paused') {
              handleStartRace();
            }
          }}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {/* 8. Global Student Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          entries={leaderboard}
          currentUserId="user-player"
          currentUserName={currentUserName}
          onUpdateUserName={setCurrentUserName}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* 9. Autobahn Garage Modal */}
      {showGarage && (
        <GarageModal
          currentCar={currentCar}
          onSelectCar={setCurrentCar}
          onClose={() => setShowGarage(false)}
          totalStarsEarned={totalStarsEarned}
        />
      )}
    </div>
  );
}
