import React, { useState, useEffect } from 'react';
import { SystemData, Quest, ExamGates } from './types/system';
import {
  loadSystemData,
  saveSystemData,
  getNextLevelXP,
  getRankForLevel,
  getInitialData,
  getTodayDateString,
} from './utils/systemLogic';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StatsView } from './components/StatsView';
import { QuestCompleteModal } from './components/QuestCompleteModal';
import { LevelUpModal } from './components/LevelUpModal';

export const App: React.FC = () => {
  const [data, setData] = useState<SystemData>(loadSystemData);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stats'>('dashboard');

  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  const [questCompleteXP, setQuestCompleteXP] = useState<number | null>(null);
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    oldRank: string;
    newRank: string;
    title?: string;
  } | null>(null);

  useEffect(() => {
    saveSystemData(data);
  }, [data]);

  const currentNextLevelXP = getNextLevelXP(data.level);

  const addXP = (amount: number) => {
    let newLevel = data.level;
    let newXP = data.currentXP + amount;
    let nextReq = getNextLevelXP(newLevel);
    let didLevelUp = false;
    let oldRank = data.rank;
    let newlyUnlockedTitle: string | undefined;

    const newUnlockedTitles = [...data.unlockedTitles];

    while (newXP >= nextReq) {
      newXP -= nextReq;
      newLevel += 1;
      didLevelUp = true;
      nextReq = getNextLevelXP(newLevel);
    }

    const newRank = getRankForLevel(newLevel, data.examGates);

    if (didLevelUp) {
      if (newLevel >= 20 && !newUnlockedTitles.includes('shadow-monarch')) {
        newUnlockedTitles.push('shadow-monarch');
        newlyUnlockedTitle = 'Shadow Monarch (in training)';
      } else if (!newUnlockedTitles.includes('iron-will')) {
        newUnlockedTitles.push('iron-will');
        newlyUnlockedTitle = 'IRON WILL';
      }
    }

    const today = getTodayDateString();
    const existingEntryIdx = data.dailyHistory.findIndex((h) => h.date === today);
    let updatedHistory = [...data.dailyHistory];

    const dayName = (['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][
      new Date().getDay()
    ] as any);

    if (existingEntryIdx >= 0) {
      updatedHistory[existingEntryIdx] = {
        ...updatedHistory[existingEntryIdx],
        xpEarned: updatedHistory[existingEntryIdx].xpEarned + amount,
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
      level: newLevel,
      currentXP: newXP,
      rank: newRank,
      unlockedTitles: newUnlockedTitles,
      dailyHistory: updatedHistory,
    }));

    setQuestCompleteXP(amount);

    if (didLevelUp) {
      setTimeout(() => {
        setLevelUpData({
          newLevel,
          oldRank,
          newRank,
          title: newlyUnlockedTitle || 'IRON WILL',
        });
      }, 2300);
    }
  };

  const handleToggleQuest = (questId: string, addedVerbs?: number) => {
    const target = data.quests.find((q) => q.id === questId);
    if (!target) return;

    const willComplete = !target.completed;
    let newVerbs = data.totalNewVerbs;
    const newTitles = [...data.unlockedTitles];

    if (willComplete && addedVerbs && addedVerbs > 0) {
      newVerbs += addedVerbs;
      if (newVerbs >= 100 && !newTitles.includes('polyglot-grinder')) {
        newTitles.push('polyglot-grinder');
      }
    }

    setData((prev) => ({
      ...prev,
      totalNewVerbs: newVerbs,
      unlockedTitles: newTitles,
      quests: prev.quests.map((q) =>
        q.id === questId ? { ...q, completed: willComplete } : q
      ),
    }));

    if (willComplete) {
      addXP(target.xp);
    } else {
      setData((prev) => ({
        ...prev,
        currentXP: Math.max(0, prev.currentXP - target.xp),
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
        currentXP: Math.max(0, prev.currentXP - target.xp),
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
    const newRank = getRankForLevel(data.level, updatedGates);

    setData((prev) => ({
      ...prev,
      examGates: updatedGates,
      rank: newRank,
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
        />

        {activeTab === 'dashboard' ? (
          <Dashboard
            data={data}
            nextLevelXP={currentNextLevelXP}
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