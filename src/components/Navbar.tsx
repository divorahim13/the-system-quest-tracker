import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BarChart3, Plus, RefreshCw, Clock, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { Quest } from '../types/system';
import { getCurrentWIBTime, getNextQuestCountdown, WIBTimeInfo } from '../utils/timeUtils';

interface NavbarProps {
  activeTab: 'dashboard' | 'stats' | 'riwayat' | 'manager' | 'radar' | 'settings';
  onTabChange: (tab: 'dashboard' | 'stats' | 'riwayat' | 'manager' | 'radar' | 'settings') => void;
  onSaveQuest: (quest: Partial<Quest>, editId?: string) => void;
  editingQuest: Quest | null;
  onCloseEditQuest: () => void;
  onQuickXP: (amount: number) => void;
  onResetData: () => void;
  isCloudSynced?: boolean;
  quests?: Quest[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onSaveQuest,
  editingQuest,
  onCloseEditQuest,
  onQuickXP,
  onResetData,
  isCloudSynced = true,
  quests = [],
}) => {
  const [wibTime, setWibTime] = useState<WIBTimeInfo>(getCurrentWIBTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setWibTime(getCurrentWIBTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextQuestInfo = getNextQuestCountdown(quests, wibTime.totalMinutes);

  return (
    <header className="w-full mb-4 sm:mb-5 font-hud select-none">
      <div className="mb-2 p-2 rounded border border-[#4FC3F7]/30 bg-[#0A1428]/90 flex items-center justify-between shadow-[0_0_10px_rgba(79,195,247,0.15)]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#4FC3F7] animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-cyan-200 tracking-wider font-mono">
            {wibTime.formattedTime}
          </span>
          <span className="text-[10px] text-gray-400 hidden sm:inline border-l border-gray-800 pl-2">
            {wibTime.formattedDate}
          </span>
        </div>

        {nextQuestInfo ? (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#4FC3F7] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
            <Sparkles className="w-3 h-3 text-[#00E5FF] animate-pulse" />
            <span>Next: <strong className="text-white">{nextQuestInfo.name}</strong> ({nextQuestInfo.countdownText})</span>
          </div>
        ) : (
          <span className="text-[10px] text-gray-500 font-mono">Quests Finished</span>
        )}
      </div>

      <div className="flex items-center justify-between pb-3 border-b border-[#4FC3F7]/30">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#4FC3F7] rounded-sm rotate-45 opacity-20 animate-pulse" />
            <span className="relative text-[#4FC3F7] font-extrabold text-lg">◇</span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl tracking-widest text-white uppercase glow-text-cyan">
              THE SYSTEM
            </h1>
            <div className="text-[9px] text-gray-400 -mt-1 tracking-wider uppercase font-semibold">
              DAILY QUEST TRACKER
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuickXP(100)}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#4FC3F7]/15 border border-[#4FC3F7] text-[#4FC3F7] text-xs font-bold rounded hover:bg-[#4FC3F7]/30 transition-all shadow-[0_0_8px_rgba(79,195,247,0.3)]"
          >
            +100 XP
          </button>
          <button
            onClick={onResetData}
            className="p-1.5 text-gray-400 hover:text-[#4FC3F7] transition-colors"
            title="Reset Data to Default Spec"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1 mt-3">
        <button
          onClick={() => onTabChange('dashboard')}
          className={clsx(
            'py-1.5 px-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border text-center truncate',
            activeTab === 'dashboard'
              ? 'bg-[#4FC3F7]/20 border-[#4FC3F7] text-white shadow-[0_0_10px_rgba(79,195,247,0.3)]'
              : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700'
          )}
        >
          DASHBOARD
        </button>

        <button
          onClick={() => onTabChange('stats')}
          className={clsx(
            'py-1.5 px-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border text-center truncate',
            activeTab === 'stats'
              ? 'bg-[#4FC3F7]/20 border-[#4FC3F7] text-white shadow-[0_0_10px_rgba(79,195,247,0.3)]'
              : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700'
          )}
        >
          STATS
        </button>

        <button
          onClick={() => onTabChange('riwayat')}
          className={clsx(
            'py-1.5 px-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border text-center truncate',
            activeTab === 'riwayat'
              ? 'bg-[#4FC3F7]/20 border-[#4FC3F7] text-white shadow-[0_0_10px_rgba(79,195,247,0.3)]'
              : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700'
          )}
        >
          RIWAYAT
        </button>

        <button
          onClick={() => onTabChange('manager')}
          className={clsx(
            'py-1.5 px-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border text-center truncate',
            activeTab === 'manager'
              ? 'bg-[#4FC3F7]/20 border-[#4FC3F7] text-white shadow-[0_0_10px_rgba(79,195,247,0.3)]'
              : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700'
          )}
        >
          MANAGER
        </button>

        <button
          onClick={() => onTabChange('radar')}
          className={clsx(
            'py-1.5 px-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border text-center truncate',
            activeTab === 'radar'
              ? 'bg-[#4FC3F7]/20 border-[#4FC3F7] text-white shadow-[0_0_10px_rgba(79,195,247,0.3)]'
              : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700'
          )}
        >
          RADAR
        </button>

        <button
          onClick={() => onTabChange('settings')}
          className={clsx(
            'py-1.5 px-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border text-center truncate',
            activeTab === 'settings'
              ? 'bg-[#4FC3F7]/20 border-[#4FC3F7] text-white shadow-[0_0_10px_rgba(79,195,247,0.3)]'
              : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700'
          )}
        >
          SETTINGS
        </button>
      </div>
    </header>
  );
};