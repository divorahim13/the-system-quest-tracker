import { SystemData, TitleItem, ExamGates } from '../types/system';
import { INITIAL_DAILY_QUESTS, INITIAL_INSTANT_DUNGEON_TASKS } from '../config/questConfig';
import { PHASES } from './roadmapLogic';

export const TITLES_LIST: TitleItem[] = [
  {
    id: 'awakened-hunter',
    name: 'Awakened Hunter',
    condition: 'Unlocked Day 1',
    icon: 'zap',
  },
  {
    id: 'b1-lehrling',
    name: 'B1 Lehrling',
    condition: 'Phase 1 Active',
    icon: 'book',
  },
  {
    id: 'b2-geselle',
    name: 'B2 Geselle',
    condition: 'Phase 2 Active',
    icon: 'swords',
  },
  {
    id: 'c1-meister',
    name: 'C1 Meister',
    condition: 'Phase 3 Active',
    icon: 'crown',
  },
  {
    id: 'iron-will',
    name: 'Iron Will',
    condition: '30-day streak',
    icon: 'shield-check',
  },
  {
    id: 'polyglot-grinder',
    name: 'Polyglot Grinder',
    condition: '100 new verbs logged',
    icon: 'book',
  },
  {
    id: 'kt-champion',
    name: 'KT Champion',
    condition: '25/25 on Kapiteltest',
    icon: 'star',
  },
  {
    id: 'c1-conqueror',
    name: 'C1 Conqueror',
    condition: 'Pass Goethe C1 Exam',
    icon: 'flame',
  },
];

export const STORAGE_KEY = 'the-system-data';

export function getNextLevelXP(level: number): number {
  return 500;
}

export function getRankForLevel(level: number, examGates?: ExamGates): string {
  if (level <= 10) return 'E-RANK';
  if (level <= 15) return 'D-RANK';
  if (level <= 25) return 'C-RANK';
  if (level <= 40) return 'B-RANK';
  if (level <= 60) return 'A-RANK';
  return 'S-RANK';
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

  const initialGates: ExamGates = {
    passedB1: false,
    passedB2: false,
    passedC1: false,
  };

  const initialData: SystemData = {
    playerName: 'DIVO',
    level: 1,
    currentXP: 0,
    rank: 'E-RANK',
    streakDays: 0,
    graceTokens: 1,
    lastGraceRefillMonth: currentMonth,
    streakProtectedToday: false,
    totalNewVerbs: 0,
    usedVerbsList: [],
    examGates: initialGates,
    lastActiveDate: today,
    currentPhase: PHASES[0],
    sleepDebuff: { active: false, consecutiveFailures: 0 },
    streaks: { morgenroutine: 0, aktivesLernen: 0, nachtruhe: 0, commute: 0 },
    skillStats: { gra: 30, wor: 30, hor: 30, les: 30, sch: 30, spr: 30 },
    lastFedAt: { gra: today, wor: today, hor: today, les: today, sch: today, spr: today },
    quests: INITIAL_DAILY_QUESTS,
    instantDungeonTasks: INITIAL_INSTANT_DUNGEON_TASKS,
    dailyHistory: [],
    unlockedTitles: ['awakened-hunter', 'b1-lehrling'],
    bossFight: {
      examName: 'GOETHE C1 EXAM (DEC 2026)',
      targetDate: '2026-12-15',
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

    if (!parsed.examGates) {
      parsed.examGates = { passedB1: false, passedB2: false, passedC1: false };
    }
    if (!parsed.currentPhase) parsed.currentPhase = PHASES[0];
    if (!parsed.sleepDebuff) parsed.sleepDebuff = { active: false, consecutiveFailures: 0 };
    if (!parsed.streaks) parsed.streaks = { morgenroutine: 0, aktivesLernen: 0, nachtruhe: 0, commute: 0 };
    if (!parsed.usedVerbsList) parsed.usedVerbsList = [];
    if (!parsed.skillStats) parsed.skillStats = { gra: 30, wor: 30, hor: 30, les: 30, sch: 30, spr: 30 };
    if (!parsed.lastFedAt) parsed.lastFedAt = { gra: today, wor: today, hor: today, les: today, sch: today, spr: today };

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