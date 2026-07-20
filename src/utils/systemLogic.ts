import { SystemData, TitleItem, Quest } from '../types/system';

export const TITLES_LIST: TitleItem[] = [
  {
    id: 'awakened-hunter',
    name: 'Awakened Hunter',
    condition: 'Unlocked Day 1',
    icon: 'zap',
  },
  {
    id: 'consistent-hunter',
    name: 'Consistent Hunter',
    condition: '7-day streak',
    icon: 'swords',
  },
  {
    id: 'iron-will',
    name: 'Iron Will',
    condition: '30-day streak',
    icon: 'shield-check',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    condition: '100/100 on a boss fight',
    icon: 'star',
  },
  {
    id: 'serial-perfectionist',
    name: 'Serial Perfectionist',
    condition: '3x 100/100 in a row',
    icon: 'crown',
  },
  {
    id: 'polyglot-grinder',
    name: 'Polyglot Grinder',
    condition: '100 new verbs logged',
    icon: 'book',
  },
  {
    id: 'the-one-who-shows-up',
    name: 'The One Who Shows Up',
    condition: '30-day stream streak',
    icon: 'video',
  },
  {
    id: 'shadow-monarch',
    name: 'Shadow Monarch (in training)',
    condition: 'Reach Level 20',
    icon: 'crown',
  },
  {
    id: 'national-level-hunter',
    name: 'National Level Hunter',
    condition: 'Special Achievement / Manual Unlock',
    icon: 'flame',
  },
];

export const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'quest-1',
    name: 'Morning Jog',
    duration: '20 min',
    category: 'KÖRPER',
    xp: 20,
    completed: true,
  },
  {
    id: 'quest-2',
    name: 'Tagebuch Präteritum',
    category: 'SPRACHE',
    xp: 25,
    completed: false,
  },
  {
    id: 'quest-3',
    name: 'German Class',
    category: 'SPRACHE',
    xp: 30,
    completed: false,
  },
  {
    id: 'quest-4',
    name: 'Live Stream',
    duration: '4h',
    category: 'CONTENT',
    xp: 25,
    completed: false,
  },
];

export const STORAGE_KEY = 'the-system-data';

export function getNextLevelXP(level: number): number {
  if (level === 12) return 2500;
  const raw = 500 * Math.pow(1.156, level - 1);
  return Math.round(raw / 50) * 50;
}

export function getRankForLevel(level: number): string {
  if (level <= 5) return 'E-RANK';
  if (level <= 10) return 'D-RANK';
  if (level <= 20) return 'C-RANK';
  if (level <= 35) return 'B-RANK';
  if (level <= 55) return 'A-RANK';
  return 'S-RANK';
}

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getDaysRemaining(targetDateStr: string): number {
  const target = new Date(targetDateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function getInitialData(): SystemData {
  const today = getTodayDateString();
  const defaultTarget = new Date();
  defaultTarget.setDate(defaultTarget.getDate() + 45);
  const targetDateStr = defaultTarget.toISOString().split('T')[0];

  return {
    playerName: 'DIVO',
    level: 12,
    currentXP: 1240,
    rank: 'C-RANK',
    streakDays: 14,
    graceTokens: 1,
    lastActiveDate: today,
    quests: DEFAULT_QUESTS,
    dailyHistory: [
      { date: '2026-07-14', day: 'SUN', xpEarned: 850 },
      { date: '2026-07-15', day: 'MON', xpEarned: 1850 },
      { date: '2026-07-16', day: 'TUE', xpEarned: 1200 },
      { date: '2026-07-17', day: 'WED', xpEarned: 1600 },
      { date: '2026-07-18', day: 'THU', xpEarned: 1400 },
      { date: '2026-07-19', day: 'FRI', xpEarned: 2300 },
      { date: '2026-07-20', day: 'SAT', xpEarned: 1240 },
    ],
    unlockedTitles: ['awakened-hunter', 'consistent-hunter', 'perfectionist'],
    bossFight: {
      examName: 'GOETHE B2 EXAM',
      targetDate: targetDateStr,
    },
  };
}

export function loadSystemData(): SystemData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: SystemData = JSON.parse(raw);
    const today = getTodayDateString();

    if (parsed.lastActiveDate !== today) {
      const allCompleted = parsed.quests.every((q) => q.completed);
      if (!allCompleted) {
        if (parsed.graceTokens > 0) {
          parsed.graceTokens -= 1;
        } else {
          parsed.streakDays = 0;
        }
      }
      parsed.quests = parsed.quests.map((q) => ({ ...q, completed: false }));
      parsed.lastActiveDate = today;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch (e) {
    console.error('Failed to load system data from localStorage', e);
    return getInitialData();
  }
}

export function saveSystemData(data: SystemData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save system data to localStorage', e);
  }
}