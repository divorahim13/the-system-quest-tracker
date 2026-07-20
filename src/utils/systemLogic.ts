import { SystemData, TitleItem, ExamGates } from '../types/system';
import { INITIAL_DAILY_QUESTS, INITIAL_INSTANT_DUNGEON_TASKS } from '../config/questConfig';

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

export const STORAGE_KEY = 'the-system-data';

export function getNextLevelXP(level: number): number {
  return Math.round(500 * Math.pow(1.15, level - 1));
}

export function getRankForLevel(level: number, examGates?: ExamGates): string {
  let levelRankIdx = 1;
  if (level <= 10) levelRankIdx = 1;
  else if (level <= 15) levelRankIdx = 2;
  else if (level <= 25) levelRankIdx = 3;
  else if (level <= 40) levelRankIdx = 4;
  else if (level <= 60) levelRankIdx = 5;
  else levelRankIdx = 6;

  let gateMaxRankIdx = 6;
  if (examGates) {
    if (!examGates.passedB1) gateMaxRankIdx = 2;
    else if (!examGates.passedB2) gateMaxRankIdx = 4;
    else if (!examGates.passedC1) gateMaxRankIdx = 5;
    else gateMaxRankIdx = 6;
  }

  const finalRankIdx = Math.min(levelRankIdx, gateMaxRankIdx);

  switch (finalRankIdx) {
    case 1:
      return 'E-RANK';
    case 2:
      return 'D-RANK';
    case 3:
      return 'C-RANK';
    case 4:
      return 'B-RANK';
    case 5:
      return 'A-RANK';
    case 6:
      return 'S-RANK';
    default:
      return 'E-RANK';
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getCurrentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getDaysRemaining(targetDateStr: string): number {
  if (!targetDateStr) return 0;
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
  const currentMonth = getCurrentMonthString();

  const defaultTarget = new Date();
  defaultTarget.setDate(defaultTarget.getDate() + 45);
  const targetDateStr = defaultTarget.toISOString().split('T')[0];

  const initialGates: ExamGates = {
    passedB1: false,
    passedB2: false,
    passedC1: false,
  };

  const initialData: SystemData = {
    playerName: 'DIVO',
    level: 12,
    currentXP: 1240,
    rank: getRankForLevel(12, initialGates),
    streakDays: 14,
    graceTokens: 1,
    lastGraceRefillMonth: currentMonth,
    streakProtectedToday: false,
    totalNewVerbs: 0,
    examGates: initialGates,
    lastActiveDate: today,
    quests: INITIAL_DAILY_QUESTS,
    instantDungeonTasks: INITIAL_INSTANT_DUNGEON_TASKS,
    dailyHistory: [],
    unlockedTitles: ['awakened-hunter', 'consistent-hunter', 'perfectionist'],
    bossFight: {
      examName: 'GOETHE B1 EXAM',
      targetDate: targetDateStr,
    },
  };

  return initialData;
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
    const currentMonth = getCurrentMonthString();

    if (!parsed.examGates) {
      parsed.examGates = { passedB1: false, passedB2: false, passedC1: false };
    }
    if (parsed.totalNewVerbs === undefined) parsed.totalNewVerbs = 0;
    if (!parsed.instantDungeonTasks || parsed.instantDungeonTasks.length === 0) {
      parsed.instantDungeonTasks = INITIAL_INSTANT_DUNGEON_TASKS;
    }
    if (!parsed.lastGraceRefillMonth) parsed.lastGraceRefillMonth = currentMonth;

    if (parsed.lastGraceRefillMonth !== currentMonth) {
      parsed.graceTokens = 1;
      parsed.lastGraceRefillMonth = currentMonth;
    }

    if (parsed.lastActiveDate !== today) {
      const mandatoryQuests = parsed.quests.filter((q) => q.isMandatory);
      const allMandatoryCompleted = mandatoryQuests.every((q) => q.completed);

      if (allMandatoryCompleted || parsed.streakProtectedToday) {
        parsed.streakDays += 1;
      } else {
        parsed.streakDays = 0;
      }

      parsed.streakProtectedToday = false;

      parsed.quests = parsed.quests.map((q) => ({
        ...q,
        completed: q.id === 'quest-kelas-magna',
      }));

      parsed.instantDungeonTasks = parsed.instantDungeonTasks.map((t) => ({
        ...t,
        completed: false,
      }));

      parsed.lastActiveDate = today;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    if (parsed.totalNewVerbs >= 100 && !parsed.unlockedTitles.includes('polyglot-grinder')) {
      parsed.unlockedTitles.push('polyglot-grinder');
    }
    if (parsed.level >= 20 && !parsed.unlockedTitles.includes('shadow-monarch')) {
      parsed.unlockedTitles.push('shadow-monarch');
    }

    parsed.rank = getRankForLevel(parsed.level, parsed.examGates);

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