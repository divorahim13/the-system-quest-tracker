import React, { useState, useEffect } from 'react';
import { SystemData, Quest } from './types/system';
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
    let newRank = oldRank;
    let newlyUnlockedTitle: string | undefined;

    const newUnlockedTitles = [...data.unlockedTitles];

    while (newXP >= nextReq) {
      newXP -= nextReq;
      newLevel += 1;
      didLevelUp = true;
      nextReq = getNextLevelXP(newLevel);
    }

    if (didLevelUp) {
      newRank = getRankForLevel(newLevel);

      if (newLevel >= 20 && !newUnlockedTitles.includes('shadow-monarch')) {
        newUnlockedTitles.push('shadow-monarch');
        newlyUnlockedTitle = 'Shadow Monarch (in training)';
      } else if (!newUnlockedTitles.includes('iron-will')) {
        newUnlockedTitles.push('iron-will');
        newlyUnlockedTitle = 'IRON WILL';
      }
    }

    const today = getTodayDateString();
    const updatedHistory = data.dailyHistory.map((h) => {
      if (h.date === today) {
        return { ...h, xpEarned: h.xpEarned + amount };
      }
      return h;
    });

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

  const handleToggleQuest = (questId: string) => {
    const target = data.quests.find((q) => q.id === questId);
    if (!target) return;

    const willComplete = !target.completed;

    setData((prev) => ({
      ...prev,
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

  const handleTriggerInstantDungeon = () => {
    addXP(150);
  };

  const handleAddQuest = (newQuestData: Omit<Quest, 'id' | 'completed'>) => {
    const newQuest: Quest = {
      ...newQuestData,
      id: `quest-${Date.now()}`,
      completed: false,
    };
    setData((prev) => ({
      ...prev,
      quests: [...prev.quests, newQuest],
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
          onAddQuest={handleAddQuest}
          onQuickXP={handleQuickXP}
          onResetData={handleResetData}
        />

        {activeTab === 'dashboard' ? (
          <Dashboard
            data={data}
            nextLevelXP={currentNextLevelXP}
            onToggleQuest={handleToggleQuest}
            onTriggerInstantDungeon={handleTriggerInstantDungeon}
          />
        ) : (
          <StatsView
            data={data}
            onUpdateBossFight={handleUpdateBossFight}
            onToggleTitleUnlock={handleToggleTitleUnlock}
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