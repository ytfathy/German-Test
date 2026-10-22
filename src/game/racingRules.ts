/**
 * Pure Game Rules for Autobahn Deutsch Car Racing Simulation
 */

export interface CarModel {
  id: string;
  name: string;
  description: string;
  color: string;
  accentColor: string;
  topSpeed: number; // km/h
  acceleration: number;
  handling: number;
  unlockedByDefault: boolean;
  requiredStars: number;
}

export const AVAILABLE_CARS: CarModel[] = [
  {
    id: 'silberpfeil',
    name: 'Silberpfeil GT',
    description: 'Deutscher Sportwagen-Klassiker für Höchstgeschwindigkeit auf der Autobahn.',
    color: '#e2e8f0',
    accentColor: '#3b82f6',
    topSpeed: 260,
    acceleration: 1.25,
    handling: 1.3,
    unlockedByDefault: true,
    requiredStars: 0
  },
  {
    id: 'pb3-cruiser',
    name: 'P3 Star-Speeder',
    description: 'Außerirdische Technologie vom Planeten P3 mit Anti-Gravitations-Düsen.',
    color: '#22c55e',
    accentColor: '#4ade80',
    topSpeed: 275,
    acceleration: 1.45,
    handling: 1.4,
    unlockedByDefault: false,
    requiredStars: 3
  },
  {
    id: 'petra-bot',
    name: 'Petra Turbo-Bot',
    description: 'Roboter-Racer mit Schleim-Boost-Antrieb aus PB3s Abenteuer.',
    color: '#94a3b8',
    accentColor: '#a855f7',
    topSpeed: 290,
    acceleration: 1.60,
    handling: 1.5,
    unlockedByDefault: false,
    requiredStars: 8
  },
  {
    id: 'schleim-mobil',
    name: 'Schleim-Mobil 3000',
    description: 'Der ultimative bunte Schleim-Rennwagen für Autobahn-Champions.',
    color: '#f59e0b',
    accentColor: '#ef4444',
    topSpeed: 310,
    acceleration: 1.80,
    handling: 1.6,
    unlockedByDefault: false,
    requiredStars: 15
  }
];

export interface LeaderboardEntry {
  id: string;
  name: string;
  school: string;
  score: number;
  accuracy: number;
  levelReached: number;
  carId: string;
  streakDays: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'u-1',
    name: 'Malek S.',
    school: 'SIS Cairo (salahaldinschool.schoology.com)',
    score: 9850,
    accuracy: 98,
    levelReached: 8,
    carId: 'schleim-mobil',
    streakDays: 14,
    avatar: '🏎️'
  },
  {
    id: 'u-2',
    name: 'Lena M.',
    school: 'Gymnasium Hamburg',
    score: 8900,
    accuracy: 95,
    levelReached: 7,
    carId: 'petra-bot',
    streakDays: 12,
    avatar: '⭐'
  },
  {
    id: 'u-3',
    name: 'Alex W.',
    school: 'Schiller-Schule Berlin',
    score: 8350,
    accuracy: 92,
    levelReached: 6,
    carId: 'pb3-cruiser',
    streakDays: 9,
    avatar: '🚀'
  },
  {
    id: 'u-4',
    name: 'Omar K.',
    school: 'SIS Giza',
    score: 7600,
    accuracy: 89,
    levelReached: 5,
    carId: 'silberpfeil',
    streakDays: 7,
    avatar: '⚡'
  },
  {
    id: 'u-5',
    name: 'Sara B.',
    school: 'Goethe-Institut Kairo',
    score: 6950,
    accuracy: 88,
    levelReached: 5,
    carId: 'silberpfeil',
    streakDays: 6,
    avatar: '🏆'
  },
  {
    id: 'u-6',
    name: 'Ahmed F.',
    school: 'SIS Kairo',
    score: 5800,
    accuracy: 84,
    levelReached: 4,
    carId: 'silberpfeil',
    streakDays: 4,
    avatar: '🌟'
  },
  {
    id: 'u-7',
    name: 'Max H.',
    school: 'München Nord',
    score: 4900,
    accuracy: 81,
    levelReached: 3,
    carId: 'silberpfeil',
    streakDays: 3,
    avatar: '🎯'
  }
];

export function getLaneFromX(x: number): 0 | 1 | 2 {
  // -1 to 1 road coordinates
  if (x < -0.3) return 0; // Left lane
  if (x > 0.3) return 2;  // Right lane
  return 1;              // Center lane
}

export function calculateLapStars(score: number, maxScore: number): number {
  if (maxScore <= 0) return 1;
  const ratio = score / maxScore;
  if (ratio >= 0.85) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

export function calculateNitroSpeed(
  baseSpeed: number,
  isNitro: boolean,
  nitroAmount: number,
  car: CarModel
): { speed: number; newNitro: number } {
  if (isNitro && nitroAmount > 0) {
    const boostSpeed = Math.min(car.topSpeed, baseSpeed + 45 * car.acceleration);
    const newNitro = Math.max(0, nitroAmount - 1.2);
    return { speed: boostSpeed, newNitro };
  }
  return { speed: baseSpeed, newNitro: nitroAmount };
}

export function updateStreak(lastPlayDateStr: string | null, currentStreak: number): { newStreak: number; todayStr: string } {
  const today = new Date().toISOString().split('T')[0];
  if (!lastPlayDateStr) {
    return { newStreak: 1, todayStr: today };
  }
  if (lastPlayDateStr === today) {
    return { newStreak: currentStreak, todayStr: today };
  }

  const last = new Date(lastPlayDateStr);
  const now = new Date(today);
  const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    return { newStreak: currentStreak + 1, todayStr: today };
  } else {
    // missed a day, reset to 1
    return { newStreak: 1, todayStr: today };
  }
}
