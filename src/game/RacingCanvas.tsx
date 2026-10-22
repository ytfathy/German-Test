import React, { useEffect, useRef } from 'react';
import { LevelCurriculum, QuestionGate } from './curriculum';
import { CarModel } from './racingRules';
import { soundEngine } from './audio';

export interface LaneAnswerSelection {
  laneIndex: 0 | 1 | 2;
  timestamp: number;
}

interface RacingCanvasProps {
  level: LevelCurriculum;
  selectedCar: CarModel;
  isPaused: boolean;
  isVoiceCheckpointActive: boolean;
  onGatePassed: (gate: QuestionGate, chosenLane: 0 | 1 | 2, isCorrect: boolean) => void;
  onTriggerVoiceCheckpoint: () => void;
  onRaceFinish: (stats: { timeSeconds: number; maxSpeed: number; gatesHit: number }) => void;
  onSpeedUpdate: (speed: number, nitro: number, distancePct: number) => void;
  onGateUpcoming: (gate: QuestionGate | null, distanceToGate: number) => void;
  // External control triggers (e.g. mobile buttons)
  steerIntent: -1 | 0 | 1;
  nitroIntent: boolean;
  laneAnswerSelection?: LaneAnswerSelection | null;
}

export const RacingCanvas: React.FC<RacingCanvasProps> = ({
  level,
  selectedCar,
  isPaused,
  isVoiceCheckpointActive,
  onGatePassed,
  onTriggerVoiceCheckpoint,
  onRaceFinish,
  onSpeedUpdate,
  onGateUpcoming,
  steerIntent,
  nitroIntent,
  laneAnswerSelection
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Store latest props in refs to decouple 60fps loop from React render cycle
  const propsRef = useRef({
    level,
    selectedCar,
    isPaused,
    isVoiceCheckpointActive,
    onGatePassed,
    onTriggerVoiceCheckpoint,
    onRaceFinish,
    onSpeedUpdate,
    onGateUpcoming,
    steerIntent,
    nitroIntent,
    laneAnswerSelection
  });

  useEffect(() => {
    propsRef.current = {
      level,
      selectedCar,
      isPaused,
      isVoiceCheckpointActive,
      onGatePassed,
      onTriggerVoiceCheckpoint,
      onRaceFinish,
      onSpeedUpdate,
      onGateUpcoming,
      steerIntent,
      nitroIntent,
      laneAnswerSelection
    };
  }, [
    level,
    selectedCar,
    isPaused,
    isVoiceCheckpointActive,
    onGatePassed,
    onTriggerVoiceCheckpoint,
    onRaceFinish,
    onSpeedUpdate,
    onGateUpcoming,
    steerIntent,
    nitroIntent,
    laneAnswerSelection
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    // Road configuration (tuned for fast-paced arcade action)
    const segmentLength = 200;
    const totalSegments = 540;
    const trackLength = totalSegments * segmentLength;
    const roadWidth = 2000;
    const cameraDepth = 0.84;
    const cameraHeight = 1000;

    // Build track curvature and elevation
    const segments: Array<{
      index: number;
      p1: { x: number; y: number; z: number; screen: { x: number; y: number; w: number; scale: number } };
      p2: { x: number; y: number; z: number; screen: { x: number; y: number; w: number; scale: number } };
      curve: number;
      y: number;
      gate?: QuestionGate;
      isVoiceCheckpoint?: boolean;
      color: { grass: string; rumble: string; road: string; lane: string };
    }> = [];

    // Distribute question gates comfortably so questions arrive with great rhythm and readability
    const numGates = level.gates.length;
    const gateStep = Math.max(54, Math.floor((totalSegments - 100) / Math.max(1, numGates)));
    const gatePositions = new Map<number, QuestionGate>();
    level.gates.forEach((g, idx) => {
      // First question arrives after a smooth launch (~3.5-4 seconds at segment 32)
      const segIdx = 32 + idx * gateStep;
      gatePositions.set(segIdx, g);
    });

    // Distribute voice checkpoints at 45% and 82% of track
    const voiceSegments = new Set([
      Math.floor(totalSegments * 0.45),
      Math.floor(totalSegments * 0.82)
    ]);

    for (let i = 0; i < totalSegments; i++) {
      const isAlt = Math.floor(i / 3) % 2 === 0;
      const curve = Math.sin(i / 35) * (i > 60 ? 2.2 : 0.3);
      const hillY = Math.sin(i / 25) * 700;

      segments.push({
        index: i,
        p1: { x: 0, y: hillY, z: i * segmentLength, screen: { x: 0, y: 0, w: 0, scale: 0 } },
        p2: { x: 0, y: hillY, z: (i + 1) * segmentLength, screen: { x: 0, y: 0, w: 0, scale: 0 } },
        curve,
        y: hillY,
        gate: gatePositions.get(i),
        isVoiceCheckpoint: voiceSegments.has(i),
        color: {
          grass: isAlt ? '#0b1329' : '#080d1c',
          rumble: isAlt ? level.trackStyle.curbColorLight : level.trackStyle.curbColorDark,
          road: isAlt ? level.trackStyle.roadColor : '#1b2234',
          lane: isAlt ? '#ffffff' : 'transparent'
        }
      });
    }

    // AI Rival cars scaled to track length
    const rivals = [
      { name: 'PB3 Rover', x: -0.6, pos: 3000, speed: 180, color: '#22c55e' },
      { name: 'Petra Bot', x: 0.6, pos: 7500, speed: 195, color: '#a855f7' },
      { name: 'Tim Muscle', x: 0.0, pos: 12500, speed: 210, color: '#ea580c' },
      { name: 'Lena Coupe', x: -0.4, pos: 17500, speed: 225, color: '#38bdf8' }
    ];

    // Particle ring buffer (pooled zero-GC)
    const MAX_PARTICLES = 120;
    const particles = new Float32Array(MAX_PARTICLES * 6); // x, y, z, vx, vy, life
    let particleHead = 0;

    function spawnParticle(x: number, y: number, z: number, vx: number, vy: number, life: number) {
      const idx = (particleHead % MAX_PARTICLES) * 6;
      particles[idx] = x;
      particles[idx + 1] = y;
      particles[idx + 2] = z;
      particles[idx + 3] = vx;
      particles[idx + 4] = vy;
      particles[idx + 5] = life;
      particleHead++;
    }

    // Player state
    let playerX = 0; // -1 to 1 road space
    let playerPos = 0; // along track
    let currentSpeed = 200; // km/h (launch baseline at 200 km/h)
    let nitroMeter = 100;
    let cameraShake = 0;
    let hitstopTimer = 0;
    let lapFinished = false;
    let startTime = performance.now();
    let maxSpeedReached = 0;
    let gatesHitCount = 0;
    let lastHandledAnswerTime = 0;

    // Keys pressed hub
    const keysPressed = new Set<string>();

    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.code);
      keysPressed.add(e.key.toLowerCase());
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.code);
      keysPressed.delete(e.key.toLowerCase());
    };

    const onBlur = () => {
      keysPressed.clear();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    // Coordinate projection
    function project(
      p: { x: number; y: number; z: number; screen: { x: number; y: number; w: number; scale: number } },
      camX: number,
      camY: number,
      camZ: number,
      width: number,
      height: number
    ) {
      const transZ = p.z - camZ;
      if (transZ <= 0) {
        p.screen.scale = 0;
        return;
      }
      p.screen.scale = cameraDepth / transZ;
      p.screen.x = Math.round(width / 2 + (p.screen.scale * (p.x - camX) * width) / 2);
      p.screen.y = Math.round(height / 2 - (p.screen.scale * (p.y - camY) * height) / 2);
      p.screen.w = Math.round((p.screen.scale * roadWidth * width) / 2);
    }

    function renderPolygon(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number,
      x4: number,
      y4: number,
      color: string
    ) {
      ctx!.fillStyle = color;
      ctx!.beginPath();
      ctx!.moveTo(x1, y1);
      ctx!.lineTo(x2, y2);
      ctx!.lineTo(x3, y3);
      ctx!.lineTo(x4, y4);
      ctx!.closePath();
      ctx!.fill();
    }

    // Main 60fps Loop
    function loop(now: number) {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      const {
        isPaused,
        isVoiceCheckpointActive,
        selectedCar,
        onGatePassed,
        onTriggerVoiceCheckpoint,
        onRaceFinish,
        onSpeedUpdate,
        onGateUpcoming,
        steerIntent,
        nitroIntent,
        laneAnswerSelection
      } = propsRef.current;

      // Handle hitstop
      if (hitstopTimer > 0) {
        hitstopTimer -= dt;
      }

      let isNitroActive = false;

      // Helper to submit gate answer cleanly
      function submitGateAnswer(laneIndex: 0 | 1 | 2) {
        playerX = laneIndex === 0 ? -0.65 : laneIndex === 2 ? 0.65 : 0.0;
        const currentSegIdx = Math.floor(playerPos / segmentLength) % totalSegments;
        for (let offset = 0; offset < 120; offset++) {
          const seg = segments[(currentSegIdx + offset) % totalSegments];
          if (seg.gate) {
            const gate = seg.gate;
            const isCorrect = laneIndex === gate.correctIndex;
            seg.gate = undefined; // consume gate immediately

            gatesHitCount++;
            if (isCorrect) {
              soundEngine.playCorrectGate();
              nitroMeter = 100; // Instant Nitro award!
              currentSpeed = Math.min(selectedCar.topSpeed, currentSpeed + 45);
              cameraShake = 4;
            } else {
              soundEngine.playWrongGate();
              currentSpeed = Math.max(150, currentSpeed - 25);
              cameraShake = 12;
              hitstopTimer = 0.04;
            }
            onGatePassed(gate, laneIndex, isCorrect);
            // Advance smoothly past gate arch
            playerPos = (seg.index + 2) * segmentLength;
            break;
          }
        }
      }

      if (!isPaused && hitstopTimer <= 0) {
        // Handle direct interactive answer click from HUD
        if (laneAnswerSelection && laneAnswerSelection.timestamp > lastHandledAnswerTime) {
          lastHandledAnswerTime = laneAnswerSelection.timestamp;
          submitGateAnswer(laneAnswerSelection.laneIndex);
        }

        // Accelerate / Brake input
        const up = keysPressed.has('KeyW') || keysPressed.has('ArrowUp') || keysPressed.has('Space');
        const down = keysPressed.has('KeyS') || keysPressed.has('ArrowDown');
        const left = keysPressed.has('KeyA') || keysPressed.has('ArrowLeft') || steerIntent === -1;
        const right = keysPressed.has('KeyD') || keysPressed.has('ArrowRight') || steerIntent === 1;
        const wantNitro = keysPressed.has('ShiftLeft') || keysPressed.has('ShiftRight') || keysPressed.has('KeyN') || nitroIntent;

        isNitroActive = wantNitro && nitroMeter > 5 && !isVoiceCheckpointActive;

        // Baseline speed starts at 200 km/h
        let targetSpeed = 200 * (selectedCar.acceleration / 1.25);
        if (up) targetSpeed = 250 * (selectedCar.acceleration / 1.25);
        if (down) targetSpeed = 110;

        if (isVoiceCheckpointActive) {
          // Slow down smoothly for the voice radar checkpoint
          targetSpeed = 50;
        } else if (isNitroActive) {
          targetSpeed = selectedCar.topSpeed;
          nitroMeter = Math.max(0, nitroMeter - 16 * dt);
          soundEngine.playNitroBoost();

          // Spawn nitro flames
          spawnParticle(
            playerX - 0.05 + (Math.random() - 0.5) * 0.04,
            0,
            playerPos - 50,
            (Math.random() - 0.5) * 0.2,
            Math.random() * 0.3,
            0.25
          );
          spawnParticle(
            playerX + 0.05 + (Math.random() - 0.5) * 0.04,
            0,
            playerPos - 50,
            (Math.random() - 0.5) * 0.2,
            Math.random() * 0.3,
            0.25
          );
        } else {
          // Passive nitro refill
          nitroMeter = Math.min(100, nitroMeter + 6 * dt);
        }

        // Balanced arcade speed ramp
        const accelRate = isNitroActive ? 210 : 105 * selectedCar.acceleration;
        if (currentSpeed < targetSpeed) {
          currentSpeed = Math.min(targetSpeed, currentSpeed + accelRate * dt);
        } else {
          currentSpeed = Math.max(targetSpeed, currentSpeed - 75 * dt);
        }

        if (currentSpeed > maxSpeedReached) {
          maxSpeedReached = currentSpeed;
        }

        // Steer calculation (smooth and responsive for lane changes)
        const steerSpeed = Math.max(2.1, (currentSpeed / 180) * 2.8 * selectedCar.handling) * dt;
        if (left) playerX = Math.max(-1.15, playerX - steerSpeed);
        if (right) playerX = Math.min(1.15, playerX + steerSpeed);

        // Off-road penalty
        if (Math.abs(playerX) > 1.0) {
          currentSpeed = Math.max(120, currentSpeed - 95 * dt);
          cameraShake = Math.max(cameraShake, 5);
        }

        // Scan upcoming gates
        const currentSegIndex = Math.floor(playerPos / segmentLength) % totalSegments;
        let upcomingGate: QuestionGate | null = null;
        let distanceToGate = 99999;
        let nearestGateSeg = -1;

        for (let offset = 0; offset < 100; offset++) {
          const segIdx = (currentSegIndex + offset) % totalSegments;
          const seg = segments[segIdx];
          if (seg.gate) {
            upcomingGate = seg.gate;
            distanceToGate = offset * segmentLength;
            nearestGateSeg = segIdx;
            break;
          }
        }

        // UNTIMED GATE HOLDING:
        // When approaching a question gate within 400 distance, hold position smoothly right before the gate!
        // The car glides at a gentle idle crawl so the road and engine stay responsive, but the car will
        // NEVER skip or pass the question until the student selects an answer (Spur A, B, or C).
        const advanceDistance = (currentSpeed * 1000 / 3600) * 24 * dt;
        if (upcomingGate && distanceToGate <= 400) {
          const targetHoldPos = nearestGateSeg * segmentLength - 220;
          if (playerPos < targetHoldPos) {
            playerPos = Math.min(targetHoldPos, playerPos + advanceDistance);
          } else {
            playerPos = targetHoldPos;
          }

          // Direct keyboard shortcuts to answer without rushing:
          // 1 = Spur A, 2 = Spur B, 3 = Spur C, or Enter = confirm current lane
          if (keysPressed.has('Digit1') || keysPressed.has('Numpad1')) {
            keysPressed.delete('Digit1');
            keysPressed.delete('Numpad1');
            submitGateAnswer(0);
          } else if (keysPressed.has('Digit2') || keysPressed.has('Numpad2')) {
            keysPressed.delete('Digit2');
            keysPressed.delete('Numpad2');
            submitGateAnswer(1);
          } else if (keysPressed.has('Digit3') || keysPressed.has('Numpad3')) {
            keysPressed.delete('Digit3');
            keysPressed.delete('Numpad3');
            submitGateAnswer(2);
          } else if (keysPressed.has('Enter')) {
            keysPressed.delete('Enter');
            const playerLane: 0 | 1 | 2 = playerX < -0.3 ? 0 : playerX > 0.3 ? 2 : 1;
            submitGateAnswer(playerLane);
          }
        } else {
          playerPos += advanceDistance;
        }

        // Sound pitch
        soundEngine.updateEnginePitch(currentSpeed);

        // Notify HUD
        const distancePct = Math.min(100, (playerPos / trackLength) * 100);
        onSpeedUpdate(Math.round(currentSpeed), Math.round(nitroMeter), distancePct);

        // Update Rivals
        for (const rival of rivals) {
          rival.pos += (rival.speed * 1000 / 3600) * 24 * dt;
          if (rival.pos > trackLength) rival.pos %= trackLength;
        }

        // Voice Checkpoint Trigger
        for (let offset = 0; offset < 20; offset++) {
          const seg = segments[(currentSegIndex + offset) % totalSegments];
          if (seg.isVoiceCheckpoint && offset <= 1 && !isVoiceCheckpointActive) {
            seg.isVoiceCheckpoint = false;
            onTriggerVoiceCheckpoint();
            break;
          }
        }

        onGateUpcoming(upcomingGate, distanceToGate);

        // Check race completion
        if (playerPos >= trackLength && !lapFinished) {
          lapFinished = true;
          soundEngine.playVictoryFanfare();
          const elapsedSec = (performance.now() - startTime) / 1000;
          onRaceFinish({
            timeSeconds: elapsedSec,
            maxSpeed: maxSpeedReached,
            gatesHit: gatesHitCount
          });
        }
      }

      // Camera shake decay
      if (cameraShake > 0) {
        cameraShake = Math.max(0, cameraShake - dt * 18);
      }
      const shakeX = (Math.random() - 0.5) * cameraShake * 1.5;
      const shakeY = (Math.random() - 0.5) * cameraShake * 1.5;

      // ----------------------------------------------------
      // DRAWING
      // ----------------------------------------------------
      const width = canvas!.width;
      const height = canvas!.height;

      ctx!.save();
      ctx!.translate(shakeX, shakeY);

      // Sky Gradient
      const skyGrad = ctx!.createLinearGradient(0, 0, 0, height / 2);
      skyGrad.addColorStop(0, level.trackStyle.skyColorTop);
      skyGrad.addColorStop(1, level.trackStyle.skyColorBottom);
      ctx!.fillStyle = skyGrad;
      ctx!.fillRect(0, 0, width, height / 2);

      // Distant mountains / horizon silhouette
      ctx!.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx!.beginPath();
      ctx!.moveTo(0, height / 2);
      for (let x = 0; x <= width; x += 60) {
        const mh = Math.sin((x + playerPos * 0.02) / 80) * 45 + Math.cos(x / 40) * 20;
        ctx!.lineTo(x, height / 2 - 30 - mh);
      }
      ctx!.lineTo(width, height / 2);
      ctx!.closePath();
      ctx!.fill();

      // Weather effects: Rain
      if (level.trackStyle.weather === 'rain') {
        ctx!.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        for (let r = 0; r < 45; r++) {
          const rx = (Math.sin(now * 0.005 + r * 99) * 0.5 + 0.5) * width;
          const ry = ((now * 0.8 + r * 45) % height);
          ctx!.moveTo(rx, ry);
          ctx!.lineTo(rx - 8, ry + 22);
        }
        ctx!.stroke();
      }

      // Rainbow arc for Level 2
      if (level.trackStyle.weather === 'rainbow') {
        const rainbowColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
        rainbowColors.forEach((color, idx) => {
          ctx!.strokeStyle = color;
          ctx!.lineWidth = 4;
          ctx!.beginPath();
          ctx!.arc(width * 0.5, height * 0.7, 320 - idx * 4, Math.PI * 1.1, Math.PI * 1.9);
          ctx!.stroke();
        });
      }

      // Render 3D Highway Road Segments
      const baseSegmentIndex = Math.floor(playerPos / segmentLength);
      const camZ = playerPos;
      const camY = cameraHeight + segments[baseSegmentIndex % totalSegments].y;
      const camX = playerX * roadWidth;

      let maxy = height;
      const drawDistance = 240;

      for (let n = 0; n < drawDistance; n++) {
        const segment = segments[(baseSegmentIndex + n) % totalSegments];
        const loopVal = Math.floor((baseSegmentIndex + n) / totalSegments);
        const zOffset = loopVal * trackLength;

        project(segment.p1, camX, camY, camZ - zOffset, width, height);
        project(segment.p2, camX, camY, camZ - zOffset, width, height);

        if (segment.p1.screen.y >= maxy || segment.p2.screen.scale <= 0) continue;

        // Render Grass
        renderPolygon(
          0,
          segment.p1.screen.y,
          width,
          segment.p1.screen.y,
          width,
          segment.p2.screen.y,
          0,
          segment.p2.screen.y,
          segment.color.grass
        );

        // Render Rumble Strips
        const rumbleW1 = segment.p1.screen.w * 1.18;
        const rumbleW2 = segment.p2.screen.w * 1.18;
        renderPolygon(
          segment.p1.screen.x - rumbleW1,
          segment.p1.screen.y,
          segment.p1.screen.x + rumbleW1,
          segment.p1.screen.y,
          segment.p2.screen.x + rumbleW2,
          segment.p2.screen.y,
          segment.p2.screen.x - rumbleW2,
          segment.p2.screen.y,
          segment.color.rumble
        );

        // Render Road Surface
        renderPolygon(
          segment.p1.screen.x - segment.p1.screen.w,
          segment.p1.screen.y,
          segment.p1.screen.x + segment.p1.screen.w,
          segment.p1.screen.y,
          segment.p2.screen.x + segment.p2.screen.w,
          segment.p2.screen.y,
          segment.p2.screen.x - segment.p2.screen.w,
          segment.p2.screen.y,
          segment.color.road
        );

        // Lane divider stripes (3 lanes)
        if (segment.color.lane !== 'transparent') {
          const laneW1 = segment.p1.screen.w * 0.035;
          const laneW2 = segment.p2.screen.w * 0.035;

          // Left-center lane divider
          const div1_x1 = segment.p1.screen.x - segment.p1.screen.w * 0.33;
          const div1_x2 = segment.p2.screen.x - segment.p2.screen.w * 0.33;
          renderPolygon(
            div1_x1 - laneW1,
            segment.p1.screen.y,
            div1_x1 + laneW1,
            segment.p1.screen.y,
            div1_x2 + laneW2,
            segment.p2.screen.y,
            div1_x2 - laneW2,
            segment.p2.screen.y,
            segment.color.lane
          );

          // Center-right lane divider
          const div2_x1 = segment.p1.screen.x + segment.p1.screen.w * 0.33;
          const div2_x2 = segment.p2.screen.x + segment.p2.screen.w * 0.33;
          renderPolygon(
            div2_x1 - laneW1,
            segment.p1.screen.y,
            div2_x1 + laneW1,
            segment.p1.screen.y,
            div2_x2 + laneW2,
            segment.p2.screen.y,
            div2_x2 - laneW2,
            segment.p2.screen.y,
            segment.color.lane
          );
        }

        maxy = segment.p1.screen.y;

        // Render Question Gate Gantry if present on this segment
        if (segment.gate) {
          const gantryScale = segment.p1.screen.scale;
          const gantryX = segment.p1.screen.x;
          const gantryY = segment.p1.screen.y;
          const gantryW = segment.p1.screen.w * 2.2;
          const gantryH = 140 * gantryScale * (width / 400);

          if (gantryH > 10) {
            // Draw Overhead Highway Gantry Structure
            ctx!.fillStyle = '#0f172a';
            ctx!.strokeStyle = '#06b6d4';
            ctx!.lineWidth = Math.max(1, 3 * gantryScale);

            const archTop = gantryY - gantryH * 2.2;
            const archBottom = gantryY - gantryH * 0.3;

            // Gantry Pillars
            ctx!.fillRect(gantryX - gantryW * 0.52, archTop, 16 * gantryScale, archBottom - archTop);
            ctx!.fillRect(gantryX + gantryW * 0.52 - 16 * gantryScale, archTop, 16 * gantryScale, archBottom - archTop);

            // Overhead Banner Box
            ctx!.fillStyle = '#090d16';
            ctx!.fillRect(gantryX - gantryW * 0.5, archTop, gantryW, gantryH * 1.5);
            ctx!.strokeRect(gantryX - gantryW * 0.5, archTop, gantryW, gantryH * 1.5);

            // 3 Lane Boards
            const laneNames = ['A', 'B', 'C'];
            const laneBoardW = gantryW * 0.31;
            const laneOffsets = [-gantryW * 0.34, 0, gantryW * 0.34];

            segment.gate.options.forEach((optText, optIdx) => {
              const bx = gantryX + laneOffsets[optIdx] - laneBoardW / 2;
              const by = archTop + gantryH * 0.15;
              const bh = gantryH * 1.2;

              ctx!.fillStyle = '#1e293b';
              ctx!.strokeStyle = optIdx === 1 ? '#38bdf8' : optIdx === 0 ? '#f59e0b' : '#10b981';
              ctx!.lineWidth = Math.max(1, 2 * gantryScale);
              ctx!.fillRect(bx, by, laneBoardW, bh);
              ctx!.strokeRect(bx, by, laneBoardW, bh);

              // Text on lane board
              const fontSize = Math.max(9, Math.round(18 * gantryScale * (width / 500)));
              ctx!.font = `bold ${fontSize}px "Chakra Petch", sans-serif`;
              ctx!.fillStyle = '#ffffff';
              ctx!.textAlign = 'center';
              ctx!.textBaseline = 'middle';

              const truncated = optText.length > 22 ? optText.slice(0, 20) + '..' : optText;
              ctx!.fillText(`[Spur ${laneNames[optIdx]}] ${truncated}`, bx + laneBoardW / 2, by + bh / 2);
            });
          }
        }

        // Render Voice Radar Checkpoint Banner
        if (segment.isVoiceCheckpoint) {
          const vScale = segment.p1.screen.scale;
          const vx = segment.p1.screen.x;
          const vy = segment.p1.screen.y;
          const vw = segment.p1.screen.w * 2.1;
          const vh = 100 * vScale * (width / 400);

          if (vh > 12) {
            ctx!.fillStyle = 'rgba(234, 88, 12, 0.9)';
            ctx!.strokeStyle = '#fef08a';
            ctx!.lineWidth = 3;
            ctx!.fillRect(vx - vw / 2, vy - vh * 2.2, vw, vh * 1.3);
            ctx!.strokeRect(vx - vw / 2, vy - vh * 2.2, vw, vh * 1.3);

            ctx!.fillStyle = '#ffffff';
            ctx!.font = `bold ${Math.max(10, Math.round(20 * vScale * (width / 450)))}px "Orbitron", sans-serif`;
            ctx!.textAlign = 'center';
            ctx!.textBaseline = 'middle';
            ctx!.fillText('🎙️ SPRACH-RADAR CHECKPOINT 🎙️', vx, vy - vh * 1.55);
          }
        }
      }

      // Render Rival Cars
      for (const rival of rivals) {
        const relPos = rival.pos - playerPos;
        if (relPos > 50 && relPos < drawDistance * segmentLength) {
          const segIdx = Math.floor(rival.pos / segmentLength) % totalSegments;
          const rSeg = segments[segIdx];
          const rScale = cameraDepth / (relPos);
          const rx = Math.round(width / 2 + (rScale * (rival.x * roadWidth - camX) * width) / 2);
          const ry = Math.round(height / 2 - (rScale * (rSeg.y - camY) * height) / 2);
          const rw = Math.round(rScale * 350 * width);
          const rh = Math.round(rw * 0.55);

          if (rw > 6) {
            // Shadow
            ctx!.fillStyle = 'rgba(0,0,0,0.45)';
            ctx!.beginPath();
            ctx!.ellipse(rx, ry + rh * 0.35, rw * 0.6, rh * 0.2, 0, 0, Math.PI * 2);
            ctx!.fill();

            // Body
            ctx!.fillStyle = rival.color;
            ctx!.fillRect(rx - rw / 2, ry - rh / 2, rw, rh);
            // Spoiler
            ctx!.fillStyle = '#0f172a';
            ctx!.fillRect(rx - rw * 0.55, ry - rh * 0.65, rw * 1.1, rh * 0.18);
            // Label
            ctx!.font = `bold ${Math.max(8, Math.round(10 * rScale * 250))}px sans-serif`;
            ctx!.fillStyle = '#ffffff';
            ctx!.textAlign = 'center';
            ctx!.fillText(rival.name, rx, ry - rh * 0.8);
          }
        }
      }

      // Render Active Particles (Nitro exhaust & speed lines)
      for (let p = 0; p < MAX_PARTICLES; p++) {
        const pIdx = p * 6;
        if (particles[pIdx + 5] > 0) {
          particles[pIdx + 5] -= dt;
          particles[pIdx] += particles[pIdx + 3] * dt;
          particles[pIdx + 1] += particles[pIdx + 4] * dt;

          const pScreenX = width / 2 + (particles[pIdx] - playerX) * width * 0.8;
          const pScreenY = height * 0.88 - particles[pIdx + 1] * 200;
          const pRadius = (particles[pIdx + 5] / 0.25) * 12;

          ctx!.fillStyle = Math.random() > 0.4 ? '#38bdf8' : '#f97316';
          ctx!.beginPath();
          ctx!.arc(pScreenX, pScreenY, Math.max(1, pRadius), 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Render Player's Racecar (Cockpit / Chase Cam)
      const carW = Math.min(320, width * 0.32);
      const carH = carW * 0.55;
      const carX = width / 2;
      const carY = height * 0.85;

      // Road Shadow
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx!.beginPath();
      ctx!.ellipse(carX, carY + carH * 0.35, carW * 0.65, carH * 0.22, 0, 0, Math.PI * 2);
      ctx!.fill();

      // Car Chassis
      ctx!.save();
      // Slight steer tilt
      const steerRoll = (keysPressed.has('KeyA') || steerIntent === -1 ? -0.06 : 0) +
                        (keysPressed.has('KeyD') || steerIntent === 1 ? 0.06 : 0);
      ctx!.translate(carX, carY);
      ctx!.rotate(steerRoll);

      // Headlights projection forward onto road
      const beamGrad = ctx!.createLinearGradient(0, -carH * 0.4, 0, -carH * 2.8);
      beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
      beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0.0)');
      ctx!.fillStyle = beamGrad;
      ctx!.beginPath();
      ctx!.moveTo(-carW * 0.35, -carH * 0.3);
      ctx!.lineTo(-carW * 0.85, -carH * 2.8);
      ctx!.lineTo(carW * 0.85, -carH * 2.8);
      ctx!.lineTo(carW * 0.35, -carH * 0.3);
      ctx!.closePath();
      ctx!.fill();

      // Diffuser / Exhaust
      ctx!.fillStyle = '#0f172a';
      ctx!.fillRect(-carW * 0.45, carH * 0.1, carW * 0.9, carH * 0.25);

      // Main Body
      const bodyGrad = ctx!.createLinearGradient(-carW / 2, -carH / 2, carW / 2, carH / 2);
      bodyGrad.addColorStop(0, selectedCar.color);
      bodyGrad.addColorStop(1, selectedCar.accentColor);
      ctx!.fillStyle = bodyGrad;

      ctx!.beginPath();
      ctx!.roundRect(-carW * 0.44, -carH * 0.36, carW * 0.88, carH * 0.62, [14, 14, 6, 6]);
      ctx!.fill();

      // Rear Windshield / Cockpit Canopy with metallic reflection
      const canopyGrad = ctx!.createLinearGradient(0, -carH * 0.48, 0, -carH * 0.1);
      canopyGrad.addColorStop(0, '#090d16');
      canopyGrad.addColorStop(0.5, '#1e293b');
      canopyGrad.addColorStop(1, '#020617');
      ctx!.fillStyle = canopyGrad;
      ctx!.beginPath();
      ctx!.roundRect(-carW * 0.3, -carH * 0.48, carW * 0.6, carH * 0.36, [10, 10, 2, 2]);
      ctx!.fill();

      // Racing Stripes
      ctx!.fillStyle = selectedCar.accentColor;
      ctx!.fillRect(-carW * 0.07, -carH * 0.48, carW * 0.14, carH * 0.74);

      // Rear Wing / Spoiler
      ctx!.fillStyle = '#090d16';
      ctx!.fillRect(-carW * 0.5, -carH * 0.42, carW * 1.0, carH * 0.12);
      ctx!.fillStyle = selectedCar.accentColor;
      ctx!.fillRect(-carW * 0.5, -carH * 0.46, carW * 1.0, carH * 0.04);

      // Tail Lights (Neon red with braking glow)
      const isBraking = keysPressed.has('KeyS') || keysPressed.has('ArrowDown');
      ctx!.fillStyle = isBraking ? '#ff1e56' : '#dc2626';
      ctx!.shadowColor = '#ef4444';
      ctx!.shadowBlur = isBraking ? 25 : 12;
      ctx!.fillRect(-carW * 0.42, carH * 0.05, carW * 0.24, carH * 0.09);
      ctx!.fillRect(carW * 0.18, carH * 0.05, carW * 0.24, carH * 0.09);
      ctx!.shadowBlur = 0; // reset

      // Wheels
      ctx!.fillStyle = '#020617';
      ctx!.fillRect(-carW * 0.49, carH * 0.06, carW * 0.11, carH * 0.28);
      ctx!.fillRect(carW * 0.38, carH * 0.06, carW * 0.11, carH * 0.28);

      // Exhaust Pipes
      ctx!.fillStyle = '#64748b';
      ctx!.beginPath();
      ctx!.arc(-carW * 0.25, carH * 0.28, carW * 0.05, 0, Math.PI * 2);
      ctx!.arc(carW * 0.25, carH * 0.28, carW * 0.05, 0, Math.PI * 2);
      ctx!.fill();

      // Nitro Flames when Nitro is active
      if (isNitroActive) {
        const flameLen = carH * (0.8 + Math.random() * 0.5);
        const flameGrad = ctx!.createLinearGradient(0, carH * 0.3, 0, carH * 0.3 + flameLen);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#38bdf8');
        flameGrad.addColorStop(0.7, '#f59e0b');
        flameGrad.addColorStop(1, 'transparent');

        ctx!.fillStyle = flameGrad;
        // Left exhaust flame
        ctx!.beginPath();
        ctx!.moveTo(-carW * 0.28, carH * 0.3);
        ctx!.lineTo(-carW * 0.22, carH * 0.3);
        ctx!.lineTo(-carW * 0.25, carH * 0.3 + flameLen);
        ctx!.closePath();
        ctx!.fill();

        // Right exhaust flame
        ctx!.beginPath();
        ctx!.moveTo(carW * 0.22, carH * 0.3);
        ctx!.lineTo(carW * 0.28, carH * 0.3);
        ctx!.lineTo(carW * 0.25, carH * 0.3 + flameLen);
        ctx!.closePath();
        ctx!.fill();
      }

      ctx!.restore();

      // High-speed edge motion warp lines
      if (currentSpeed > 195 || isNitroActive) {
        const speedRatio = Math.min(1.0, (currentSpeed - 195) / 95);
        const streakAlpha = (isNitroActive ? 0.38 : 0.2) * (0.6 + speedRatio * 0.4);
        ctx!.strokeStyle = isNitroActive ? 'rgba(56, 189, 248, 0.45)' : `rgba(255, 255, 255, ${streakAlpha})`;
        ctx!.lineWidth = isNitroActive ? 2.5 : 1.5;
        ctx!.beginPath();
        const streakCount = isNitroActive ? 24 : 14;
        for (let s = 0; s < streakCount; s++) {
          const side = s % 2 === 0 ? -1 : 1;
          const sx = width / 2 + side * (width * 0.35 + Math.random() * width * 0.15);
          const sy = height * 0.45 + Math.random() * height * 0.55;
          const len = 35 + Math.random() * 85 * (1 + speedRatio);
          ctx!.moveTo(sx, sy);
          ctx!.lineTo(sx + side * 15, sy + len);
        }
        ctx!.stroke();
      }

      ctx!.restore();

      animId = requestAnimationFrame(loop);
    }

    // Auto-resize canvas to parent
    function resize() {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    soundEngine.startEngine();
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      soundEngine.stopEngine();
    };
  }, [level.id, selectedCar.id]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950">
      <canvas
        ref={canvasRef}
        data-testid="racing-canvas"
        className="w-full h-full block"
      />
    </div>
  );
};
