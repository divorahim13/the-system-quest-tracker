import React, { useState, useEffect } from 'react';
import { SystemData, Quest, ExamGates, SkillStats } from './types/system';
import {
  loadSystemData,
  saveSystemData,
  getNextLevelXP,
  getRankForLevel,
  getInitialData,
  getTodayDateString,
} from './utils/systemLogic';
import {
  fetchSupabaseData,
  syncSupabaseData,
  subscribeToCloudChanges,
} from './utils/supabaseClient';
import { calculateLevelFromXP, applyStatDecay, calculateDualGateRank } from './utils/statLogic';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StatsView } from './components/StatsView';
import { QuestCompleteModal } from './components/QuestCompleteModal';
import { LevelUpModal } from './components/LevelUpModal';

export const App: React.FC = () => {
  const [data, setData] = useState<SystemData>(loadSystemData);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stats'>('dashboard');
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);

  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  const [questCompleteXP, setQuestCompleteXP] = useState<number | null>(null);
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    oldRank: string;
    newRank: string;
    title?: string;
  } | null>(null);

  useEffect(() => {
    async function initCloudSync() {
      const cloudData = await fetchSupabaseData();
      if (cloudData) {
        const today = getTodayDateString();
        const decayResult = applyStatDecay(
          cloudData.skillStats || { gra: 30, wor: 30, hor: 30, les: 30, sch: 30, spr: 30 },
          cloudData.lastFedAt || { gra: today, wor: today, hor: today, les: today, sch: today, spr: today },
          today
        );
        cloudData.skillStats = decayResult.updatedStats;

        setData(cloudData);
        saveSystemData(cloudData);
      } else {
        await syncSupabaseData(data);
      }
    }

    initCloudSync();

    const unsubscribe = subscribeToCloudChanges((newData) => {
      setData(newData);
      saveSystemData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    syncSupabaseData(data).then(() => setIsCloudSynced(true));
  }, [data]);

  const levelInfo = calculateLevelFromXP(data.currentXP || 0);

  const addXP = (amount: number, statImpact?: Partial<Record<keyof SkillStats, number>>) => {
    const today = getTodayDateString();
    const oldLevel = calculateLevelFromXP(data.currentXP || 0).level;
    const newTotalXP = (data.currentXP || 0) + amount;
    const newLevelInfo = calculateLevelFromXP(newTotalXP);

    const didLevelUp = newLevelInfo.level > oldLevel;
    const oldRank = data.rank;

    const updatedStats = { ...(data.skillStats || { gra: 30, wor: 30, hor: 30, les: 30, sch: 30, spr: 30 }) };
    const updatedLastFed = { ...(data.lastFedAt || { gra: today, wor: today, hor: today, les: today, sch: today, spr: today }) };

    if (statImpact) {
      (Object.keys(statImpact) as Array<keyof SkillStats>).forEach((k) => {
        const boost = statImpact[k] || 0;
        updatedStats[k] = Math.min(100, Math.max(0, updatedStats[k] + boost));
        updatedLastFed[k] = today;
      });
    }

    const rankEval = calculateDualGateRank(updatedStats, 4);

    const todayEntryIdx = data.dailyHistory.findIndex((h) => h.date === today);
    let updatedHistory = [...data.dailyHistory];
    const dayName = (['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][
      new Date().getDay()
    ] as any);

    if (todayEntryIdx >= 0) {
      updatedHistory[todayEntryIdx] = {
        ...updatedHistory[todayEntryIdx],
        xpEarned: updatedHistory[todayEntryIdx].xpEarned + amount,
      };
    } else {
      updatedHistory.push({
        date: today,
        day: dayName,
        xpEarned: amount,
      });
    }

    if (updatedHistory.length > 7) {
      updatedHistory = updatedHistory.slice(-7);
    }

    setData((prev) => ({
      ...prev,
      level: newLevelInfo.level,
      currentXP: newTotalXP,
      rank: `${rankEval.rankCode}-RANK`,
      skillStats: updatedStats,
      lastFedAt: updatedLastFed,
      dailyHistory: updatedHistory,
    }));

    setQuestCompleteXP(amount);

    if (didLevelUp) {
      setTimeout(() => {
        setLevelUpData({
          newLevel: newLevelInfo.level,
          oldRank,
          newRank: `${rankEval.rankCode}-RANK`,
          title: 'LEVEL UP!',
        });
      }, 2300);
    }
  };

  const handleToggleQuest = (
    questId: string,
    payload?: { addedVerbs?: number; subPhoneOutside?: boolean; userNote?: string; ktScore?: number }
  ) => {
    const target = data.quests.find((q) => q.id === questId);
    if (!target) return;

    const willComplete = !target.completed;
    let newVerbs = data.totalNewVerbs;
    const newUnlockedTitles = [...data.unlockedTitles];

    if (willComplete && payload?.addedVerbs && payload.addedVerbs > 0) {
      newVerbs += payload.addedVerbs;
      if (newVerbs >= 100 && !newUnlockedTitles.includes('polyglot-grinder')) {
        newUnlockedTitles.push('polyglot-grinder');
      }
    }

    let impact: Partial<Record<keyof SkillStats, number>> = {};
    if (questId.includes('morgenroutine')) impact = { sch: 2, gra: 1 };
    if (questId.includes('commute')) impact = { hor: 2 };
    if (questId.includes('aktives-lernen')) impact = { wor: 2, gra: 1 };
    if (questId.includes('saturday-review')) impact = { wor: 3, gra: 2 };
    if (questId.includes('sunday-simulation')) impact = { les: 2, hor: 2, sch: 2, spr: 2 };
    if (questId.includes('kt-boss')) impact = { gra: 3, les: 3, sch: 3 };

    setData((prev) => ({
      ...prev,
      totalNewVerbs: newVerbs,
      unlockedTitles: newUnlockedTitles,
      quests: prev.quests.map((q) =>
        q.id === questId
          ? {
              ...q,
              completed: willComplete,
              subPhoneOutside: payload?.subPhoneOutside !== undefined ? payload.subPhoneOutside : q.subPhoneOutside,
              userNote: payload?.userNote || q.userNote,
              ktScore: payload?.ktScore || q.ktScore,
            }
          : q
      ),
    }));

    if (willComplete) {
      const xpToEarn = data.sleepDebuff?.active ? Math.round(target.xp * 0.8) : target.xp;
      addXP(xpToEarn, impact);
    } else {
      setData((prev) => ({
        ...prev,
        currentXP: Math.max(0, (prev.currentXP || 0) - target.xp),
      }));
    }
  };

  const handleToggleInstantTask = (taskId: string) => {
    const target = data.instantDungeonTasks.find((t) => t.id === taskId);
    if (!target) return;

    const willComplete = !target.completed;

    setData((prev) => ({
      ...prev,
      instantDungeonTasks: prev.instantDungeonTasks.map((t) =>
        t.id === taskId ? { ...t, completed: willComplete } : t
      ),
    }));

    if (willComplete) {
      addXP(target.xp);
    } else {
      setData((prev) => ({
        ...prev,
        currentXP: Math.max(0, (prev.currentXP || 0) - target.xp),
      }));
    }
  };

  const handleUseGraceToken = () => {
    if (data.graceTokens <= 0 || data.streakProtectedToday) return;

    setData((prev) => ({
      ...prev,
      graceTokens: prev.graceTokens - 1,
      streakProtectedToday: true,
    }));
  };

  const handleToggleExamGate = (gateKey: keyof ExamGates) => {
    const updatedGates = {
      ...data.examGates,
      [gateKey]: !data.examGates[gateKey],
    };

    setData((prev) => ({
      ...prev,
      examGates: updatedGates,
    }));
  };

  const handleSaveQuest = (questData: Partial<Quest>, editId?: string) => {
    if (editId) {
      setData((prev) => ({
        ...prev,
        quests: prev.quests.map((q) =>
          q.id === editId ? { ...q, ...questData } : q
        ),
      }));
    } else {
      const newQuest: Quest = {
        id: `quest-${Date.now()}`,
        name: questData.name || 'New Quest',
        timeSlot: questData.timeSlot,
        duration: questData.duration,
        category: questData.category || 'OTHER',
        xp: questData.xp || 20,
        completed: false,
        isMandatory: questData.isMandatory !== undefined ? questData.isMandatory : true,
      };
      setData((prev) => ({
        ...prev,
        quests: [...prev.quests, newQuest],
      }));
    }
  };

  const handleDeleteQuest = (questId: string) => {
    setData((prev) => ({
      ...prev,
      quests: prev.quests.filter((q) => q.id !== questId),
    }));
  };

  const handleQuickXP = (amount: number) => {
    addXP(amount);
  };

  const handleUpdateBossFight = (examName: string, targetDate: string) => {
    setData((prev) => ({
      ...prev,
      bossFight: {
        examName,
        targetDate,
      },
    }));
  };

  const handleToggleTitleUnlock = (titleId: string) => {
    setData((prev) => {
      const exists = prev.unlockedTitles.includes(titleId);
      const updated = exists
        ? prev.unlockedTitles.filter((t) => t !== titleId)
        : [...prev.unlockedTitles, titleId];
      return {
        ...prev,
        unlockedTitles: updated,
      };
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset THE SYSTEM data to default spec?')) {
      const initial = getInitialData();
      setData(initial);
      saveSystemData(initial);
      syncSupabaseData(initial);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-3 sm:p-5 overflow-x-hidden">
      <ParticleBackground />

      <main className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col pb-12">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSaveQuest={handleSaveQuest}
          editingQuest={editingQuest}
          onCloseEditQuest={() => setEditingQuest(null)}
          onQuickXP={handleQuickXP}
          onResetData={handleResetData}
          isCloudSynced={isCloudSynced}
        />

        {activeTab === 'dashboard' ? (
          <Dashboard
            data={data}
            nextLevelXP={500}
            onToggleQuest={handleToggleQuest}
            onToggleInstantTask={handleToggleInstantTask}
            onUseGraceToken={handleUseGraceToken}
            onUpdateBossFight={handleUpdateBossFight}
            onEditQuest={(quest) => setEditingQuest(quest)}
            onDeleteQuest={handleDeleteQuest}
          />
        ) : (
          <StatsView
            data={data}
            onUpdateBossFight={handleUpdateBossFight}
            onToggleTitleUnlock={handleToggleTitleUnlock}
            onToggleExamGate={handleToggleExamGate}
          />
        )}
      </main>

      {questCompleteXP !== null && (
        <QuestCompleteModal
          xpEarned={questCompleteXP}
          onClose={() => setQuestCompleteXP(null)}
        />
      )}

      {levelUpData !== null && (
        <LevelUpModal
          newLevel={levelUpData.newLevel}
          oldRank={levelUpData.oldRank}
          newRank={levelUpData.newRank}
          unlockedTitle={levelUpData.title}
          onClose={() => setLevelUpData(null)}
        />
      )}
    </div>
  );
};