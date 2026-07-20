export type QuestCategory = 'KÖRPER' | 'SPRACHE' | 'CONTENT' | 'OTHER';

export interface Quest {
  id: string;
  name: string;
  timeSlot?: string;
  duration?: string;
  category: QuestCategory;
  xp: number;
  completed: boolean;
  isMandatory: boolean;
}

export interface InstantDungeonTask {
  id: string;
  name: string;
  xp: number;
  completed: boolean;
}

export interface DailyHistoryEntry {
  date: string;
  day: 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  xpEarned: number;
}

export interface TitleItem {
  id: string;
  name: string;
  condition: string;
  icon: 'swords' | 'shield-check' | 'lock' | 'flame' | 'crown' | 'star' | 'book' | 'video' | 'zap';
}

export interface BossFight {
  examName: string;
  targetDate: string;
}

export interface ExamGates {
  passedB1: boolean;
  passedB2: boolean;
  passedC1: boolean;
}

export interface SystemData {
  playerName: string;
  level: number;
  currentXP: number;
  rank: string;
  streakDays: number;
  graceTokens: number;
  lastGraceRefillMonth: string;
  streakProtectedToday: boolean;
  totalNewVerbs: number;
  examGates: ExamGates;
  lastActiveDate: string;
  quests: Quest[];
  instantDungeonTasks: InstantDungeonTask[];
  dailyHistory: DailyHistoryEntry[];
  unlockedTitles: string[];
  bossFight: BossFight;
}