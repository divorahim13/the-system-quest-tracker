export type QuestCategory = 'SPRACHE' | 'KÖRPER' | 'CONTENT' | 'DISCIPLINE' | 'REVISION' | 'EXAM' | 'OTHER';

export interface SkillStats {
  gra: number;
  wor: number;
  hor: number;
  les: number;
  sch: number;
  spr: number;
}

export type StatKey = keyof SkillStats;

export type StatImpact = Partial<Record<StatKey, number>>;

export interface LearningPhase {
  id: number;
  name: string;
  title: string;
  startDate: string;
  endDate: string;
}

export interface QuestTemplate {
  id: string;
  title: string;
  description?: string;
  category: QuestCategory;
  timeSlot?: string;
  recurrence: 'daily' | 'saturday' | 'sunday' | 'boss_fight' | 'raid_boss';
  activePhase?: number;
  xpValue: number;
  isMandatory: boolean;
  statImpact?: StatImpact;
}

export interface RankRequirement {
  rankCode: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  rankOrder: number;
  chapterReq: string;
  minStatValue: number;
  unlocksDescription: string;
}

export interface BossFightExam {
  id: string;
  name: string;
  unlockRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  xpReward: number;
  dateAttempted?: string;
  scoreAchieved?: number;
  sectionScores?: StatImpact;
  statBonusAwarded?: boolean;
}

export interface QuestLogItem {
  id?: string;
  questTemplateId: string;
  logDate: string;
  completed: boolean;
  subPhoneOutside?: boolean;
  userNote?: string;
  ktScore?: number;
}

export interface UsedVerb {
  id?: string;
  verb: string;
  meaning?: string;
  loggedDate: string;
}

export interface SleepDebuffState {
  active: boolean;
  consecutiveFailures: number;
}

export interface SeparatedStreaks {
  morgenroutine: number;
  aktivesLernen: number;
  nachtruhe: number;
  commute: number;
}

export interface Quest {
  id: string;
  name: string;
  timeSlot?: string;
  duration?: string;
  category: QuestCategory;
  xp: number;
  completed: boolean;
  isMandatory: boolean;
  templateId?: string;
  subPhoneOutside?: boolean;
  userNote?: string;
  ktScore?: number;
  statImpact?: StatImpact;
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
  usedVerbsList: UsedVerb[];
  examGates: ExamGates;
  lastActiveDate: string;
  currentPhase: LearningPhase;
  sleepDebuff: SleepDebuffState;
  streaks: SeparatedStreaks;
  skillStats: SkillStats;
  lastFedAt: Record<StatKey, string>;
  quests: Quest[];
  instantDungeonTasks: InstantDungeonTask[];
  dailyHistory: DailyHistoryEntry[];
  unlockedTitles: string[];
  bossFight: BossFight;
}