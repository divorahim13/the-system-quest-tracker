import { SkillStats, StatKey, RankRequirement } from '../types/system';

export const RANK_REQUIREMENTS_LIST: RankRequirement[] = [
  {
    rankCode: 'E',
    rankOrder: 1,
    chapterReq: 'Kapitel 1-4 Complete (Starting Rank)',
    minStatValue: 0,
    unlocksDescription: 'Baseline Unlocked',
  },
  {
    rankCode: 'D',
    rankOrder: 2,
    chapterReq: 'Kapitel 5-8 Complete',
    minStatValue: 40,
    unlocksDescription: 'Mini-boss Quests per Chapter Test',
  },
  {
    rankCode: 'C',
    rankOrder: 3,
    chapterReq: 'Kapitel 12 Complete (~Sept 11)',
    minStatValue: 55,
    unlocksDescription: 'B1 Boss Fight Full Simulation',
  },
  {
    rankCode: 'B',
    rankOrder: 4,
    chapterReq: 'B2 Phase Midpoint (~Mid Oct)',
    minStatValue: 65,
    unlocksDescription: 'B2 Midpoint Checkpoint',
  },
  {
    rankCode: 'A',
    rankOrder: 5,
    chapterReq: 'B2 Phase Complete (~End Oct)',
    minStatValue: 75,
    unlocksDescription: 'B2 Boss Fight Full Simulation',
  },
  {
    rankCode: 'S',
    rankOrder: 6,
    chapterReq: 'C1 Phase Checkpoint (~Mid Dec)',
    minStatValue: 85,
    unlocksDescription: 'FINAL RAID BOSS: Goethe C1 Exam',
  },
];

export function calculateLevelFromXP(totalXP: number): { level: number; currentXP: number; nextLevelXP: number } {
  const level = Math.floor(totalXP / 500) + 1;
  const currentXP = totalXP % 500;
  return { level, currentXP, nextLevelXP: 500 };
}

export function applyStatDecay(
  currentStats: SkillStats,
  lastFedAt: Record<StatKey, string>,
  todayStr: string
): { updatedStats: SkillStats; decayedStats: Array<{ key: StatKey; lostPoints: number }> } {
  const today = new Date(todayStr);
  const updated = { ...currentStats };
  const decayedStats: Array<{ key: StatKey; lostPoints: number }> = [];

  const keys: StatKey[] = ['gra', 'wor', 'hor', 'les', 'sch', 'spr'];

  for (const key of keys) {
    const lastDateStr = lastFedAt[key] || todayStr;
    const lastDate = new Date(lastDateStr);
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 10) {
      const neglectDays = diffDays - 10;
      const lostPoints = Math.min(updated[key], neglectDays);
      updated[key] = Math.max(0, updated[key] - lostPoints);
      if (lostPoints > 0) {
        decayedStats.push({ key, lostPoints });
      }
    }
  }

  return { updatedStats: updated, decayedStats };
}

export function calculateDualGateRank(
  stats: SkillStats,
  curriculumCompletedChapters: number
): {
  rankCode: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  targetRankCode: 'D' | 'C' | 'B' | 'A' | 'S' | null;
  bottleneckStat: StatKey | null;
  bottleneckValue: number;
  requiredValue: number;
  isCurriculumReadyButStatBlocked: boolean;
  message: string;
} {
  const keys: StatKey[] = ['gra', 'wor', 'hor', 'les', 'sch', 'spr'];

  let currentRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' = 'E';
  let targetRank: 'D' | 'C' | 'B' | 'A' | 'S' | null = 'D';

  let isStatBlocked = false;
  let bottleneckStat: StatKey | null = null;
  let bottleneckVal = 100;
  let reqVal = 0;

  for (let i = 1; i < RANK_REQUIREMENTS_LIST.length; i++) {
    const req = RANK_REQUIREMENTS_LIST[i];
    const minStatReq = req.minStatValue;

    let chapterMet = false;
    if (req.rankCode === 'D' && curriculumCompletedChapters >= 8) chapterMet = true;
    if (req.rankCode === 'C' && curriculumCompletedChapters >= 12) chapterMet = true;
    if (req.rankCode === 'B' && curriculumCompletedChapters >= 16) chapterMet = true;
    if (req.rankCode === 'A' && curriculumCompletedChapters >= 20) chapterMet = true;
    if (req.rankCode === 'S' && curriculumCompletedChapters >= 24) chapterMet = true;

    let lowestVal = 100;
    let lowestKey: StatKey = 'spr';

    for (const key of keys) {
      if (stats[key] < lowestVal) {
        lowestVal = stats[key];
        lowestKey = key;
      }
    }

    const statMet = lowestVal >= minStatReq;

    if (chapterMet && statMet) {
      currentRank = req.rankCode as any;
      targetRank = i + 1 < RANK_REQUIREMENTS_LIST.length ? (RANK_REQUIREMENTS_LIST[i + 1].rankCode as any) : null;
    } else if (chapterMet && !statMet) {
      isStatBlocked = true;
      bottleneckStat = lowestKey;
      bottleneckVal = lowestVal;
      reqVal = minStatReq;
      targetRank = req.rankCode as any;
      break;
    } else {
      targetRank = req.rankCode as any;
      break;
    }
  }

  const statNames: Record<StatKey, string> = {
    gra: 'Grammatik',
    wor: 'Wortschatz',
    hor: 'Hören',
    les: 'Lesen',
    sch: 'Schreiben',
    spr: 'Sprechen',
  };

  let message = `Rank ${currentRank}-RANK Active`;
  if (isStatBlocked && bottleneckStat) {
    message = `Rank ${targetRank} ready by curriculum, but ${statNames[bottleneckStat]} (${bottleneckVal}/${reqVal}) is holding you back — curriculum-ready but not skill-ready!`;
  }

  return {
    rankCode: currentRank,
    targetRankCode: targetRank,
    bottleneckStat,
    bottleneckValue: bottleneckVal,
    requiredValue: reqVal,
    isCurriculumReadyButStatBlocked: isStatBlocked,
    message,
  };
}