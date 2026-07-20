import React, { useState } from 'react';
import { SystemData, Quest } from '../types/system';
import { HudPanel, DiamondDivider } from './HudPanel';
import { Flame, Check, Sparkles, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface DashboardProps {
  data: SystemData;
  nextLevelXP: number;
  onToggleQuest: (questId: string) => void;
  onTriggerInstantDungeon: () => void;
  onAddQuest?: (quest: Omit<Quest, 'id' | 'completed'>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  nextLevelXP,
  onToggleQuest,
  onTriggerInstantDungeon,
}) => {
  const [showDungeonConfirm, setShowDungeonConfirm] = useState(false);

  const xpPercentage = Math.min(100, Math.max(0, (data.currentXP / nextLevelXP) * 100));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'KÖRPER':
        return 'border-emerald-400/60 text-emerald-300 bg-emerald-950/40';
      case 'SPRACHE':
        return 'border-[#4FC3F7]/60 text-[#4FC3F7] bg-cyan-950/40';
      case 'CONTENT':
        return 'border-purple-400/60 text-purple-300 bg-purple-950/40';
      default:
        return 'border-gray-400/60 text-gray-300 bg-gray-900/40';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-md mx-auto">
      <HudPanel variant="cyan" notchSize="md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-hud tracking-widest text-[#4FC3F7] text-lg sm:text-xl font-bold uppercase">
              STATUS
            </h2>
            <div className="font-hud text-gray-300 text-xs sm:text-sm font-semibold tracking-wider mt-1">
              {data.playerName}
            </div>
            <div className="font-hud text-3xl sm:text-4xl font-extrabold glow-text-cyan mt-0.5 tracking-wide">
              LV. {data.level}
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center">
            <div className="relative w-14 h-16 sm:w-16 sm:h-18 flex items-center justify-center">
              <svg
                viewBox="0 0 100 120"
                className="absolute inset-0 w-full h-full text-[#4FC3F7] drop-shadow-[0_0_8px_rgba(79,195,247,0.6)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              >
                <path d="M50 5 L90 20 V65 C90 95 50 115 50 115 C50 115 10 95 10 65 V20 Z" fill="rgba(10, 24, 48, 0.9)" />
                <path d="M50 12 L82 25 V62 C82 88 50 105 50 105 C50 105 18 88 18 62 V25 Z" fill="rgba(16, 36, 70, 0.6)" stroke="rgba(79, 195, 247, 0.4)" strokeWidth="2" />
              </svg>
              <div className="relative z-10 text-center font-hud">
                <div className="text-sm sm:text-base font-extrabold text-[#E0F7FA] tracking-wider leading-none">
                  {data.rank.includes('-') ? `${data.rank.split('-')[0]}-` : data.rank}
                </div>
                <div className="text-[9px] sm:text-[10px] tracking-widest text-[#4FC3F7] uppercase mt-0.5 font-bold">
                  RANK
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="text-right font-hud text-xs sm:text-sm text-gray-300 tracking-wider">
            <span className="font-bold text-[#E0F7FA]">{data.currentXP.toLocaleString()}</span> / {nextLevelXP.toLocaleString()} XP
          </div>
          <div className="relative w-full h-3 sm:h-3.5 bg-black/60 rounded-sm overflow-hidden border border-[#4FC3F7]/30 p-[1px]">
            <div
              className="relative h-full bg-gradient-to-r from-cyan-600 via-[#4FC3F7] to-[#00E5FF] transition-all duration-500 ease-out rounded-sm shadow-[0_0_12px_#00E5FF]"
              style={{ width: `${xpPercentage}%` }}
            >
              {xpPercentage > 2 && (
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_#FFFFFF]" />
              )}
            </div>
          </div>
        </div>
      </HudPanel>

      <HudPanel variant="cyan" notchSize="md">
        <div className="text-center">
          <h2 className="font-hud tracking-widest text-[#4FC3F7] text-lg sm:text-xl font-bold uppercase">
            DAILY QUEST
          </h2>
          <p className="font-hud text-[10px] sm:text-xs text-gray-400 tracking-widest mt-0.5 uppercase">
            COMPLETE ALL TO MAINTAIN STREAK.
          </p>
        </div>

        <DiamondDivider count={1} variant="cyan" />

        <div className="space-y-3">
          {data.quests.map((quest) => (
            <div
              key={quest.id}
              onClick={() => onToggleQuest(quest.id)}
              className={clsx(
                'group flex items-center justify-between p-2.5 sm:p-3 rounded border transition-all duration-200 cursor-pointer select-none',
                quest.completed
                  ? 'bg-[#4FC3F7]/10 border-[#4FC3F7]/60 shadow-[0_0_10px_rgba(79,195,247,0.15)]'
                  : 'bg-slate-900/40 border-slate-800 hover:border-[#4FC3F7]/40 hover:bg-slate-900/70'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    'w-6 h-6 sm:w-6 sm:h-6 rounded-sm border-2 flex items-center justify-center transition-all duration-200',
                    quest.completed
                      ? 'border-[#4FC3F7] bg-[#4FC3F7] text-slate-950 shadow-[0_0_10px_#4FC3F7]'
                      : 'border-[#4FC3F7]/50 bg-black/40 group-hover:border-[#4FC3F7]'
                  )}
                >
                  {quest.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={clsx(
                        'font-hud font-semibold text-sm sm:text-base tracking-wide',
                        quest.completed ? 'text-gray-300 line-through opacity-80' : 'text-white'
                      )}
                    >
                      {quest.name}
                    </span>
                    {quest.duration && (
                      <span className="text-xs text-gray-400 font-sans">
                        ({quest.duration})
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <span
                      className={clsx(
                        'inline-block text-[9px] sm:text-[10px] font-hud font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider',
                        getCategoryColor(quest.category)
                      )}
                    >
                      {quest.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="font-hud font-bold text-sm sm:text-base text-[#4FC3F7] tracking-wider drop-shadow-[0_0_6px_rgba(79,195,247,0.5)]">
                +{quest.xp} XP
              </div>
            </div>
          ))}
        </div>
      </HudPanel>

      <HudPanel variant="cyan" notchSize="md">
        <div className="flex items-center justify-between">
          <h2 className="font-hud tracking-widest text-[#4FC3F7] text-lg sm:text-xl font-bold uppercase">
            STREAK
          </h2>
          <Flame className="w-5 h-5 text-[#4FC3F7] animate-pulse" />
        </div>

        <DiamondDivider count={1} variant="cyan" />

        <div className="flex items-center gap-3 sm:gap-4 my-1">
          <div className="p-2 sm:p-2.5 rounded-lg bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 shadow-[0_0_12px_rgba(79,195,247,0.3)]">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-[#4FC3F7] fill-[#4FC3F7]/30" />
          </div>

          <div>
            <div className="font-hud font-extrabold text-xl sm:text-2xl text-white tracking-wider">
              STREAK: <span className="glow-text-cyan">{data.streakDays} DAYS</span>
            </div>
            <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-hud bg-slate-900/90 border border-slate-700 text-gray-300">
              <span>🔥</span>
              <span>Grace Token: <strong className="text-[#4FC3F7]">{data.graceTokens}</strong> remaining</span>
            </div>
          </div>
        </div>
      </HudPanel>

      <HudPanel variant="purple" notchSize="md">
        <div className="flex items-center justify-between">
          <h2 className="font-hud tracking-widest text-[#7C4DFF] text-lg sm:text-xl font-bold uppercase glow-text-purple">
            INSTANT DUNGEON
          </h2>
          <Zap className="w-5 h-5 text-[#7C4DFF]" />
        </div>

        <p className="font-hud text-xs text-gray-300 tracking-wide mt-2 leading-relaxed">
          <strong className="text-[#9C27B0]">BONUS CHALLENGE:</strong> Complete a difficult task for a significant XP and title reward.
        </p>

        <div className="mt-3">
          {!showDungeonConfirm ? (
            <button
              onClick={() => setShowDungeonConfirm(true)}
              className="w-full p-3 sm:p-3.5 rounded bg-[#120826]/90 border border-[#7C4DFF]/60 hover:border-[#7C4DFF] hover:shadow-[0_0_16px_rgba(124,77,255,0.4)] transition-all duration-200 text-center group"
            >
              <div className="font-hud font-bold text-sm sm:text-base text-[#D1C4E9] group-hover:text-white tracking-widest uppercase flex items-center justify-center gap-2">
                <span>CHALLENGE BOSS [REAL EXAM]</span>
                <Sparkles className="w-4 h-4 text-[#7C4DFF]" />
              </div>
              <div className="font-hud text-[11px] text-[#B388FF] tracking-wider mt-0.5">
                (-3 days to streak, requires preparation)
              </div>
            </button>
          ) : (
            <div className="p-3 bg-[#1E0E3D] border border-[#7C4DFF] rounded space-y-2 text-center animate-fadeIn">
              <div className="font-hud text-xs font-bold text-white tracking-wider uppercase">
                ENTER INSTANT DUNGEON FOR +150 XP?
              </div>
              <div className="flex gap-2 justify-center pt-1">
                <button
                  onClick={() => {
                    onTriggerInstantDungeon();
                    setShowDungeonConfirm(false);
                  }}
                  className="px-4 py-1.5 bg-[#7C4DFF] text-white font-hud font-bold text-xs rounded hover:bg-[#651FFF] transition-all shadow-[0_0_10px_#7C4DFF]"
                >
                  ACCEPT CHALLENGE
                </button>
                <button
                  onClick={() => setShowDungeonConfirm(false)}
                  className="px-4 py-1.5 bg-slate-800 text-gray-300 font-hud font-bold text-xs rounded hover:bg-slate-700 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      </HudPanel>
    </div>
  );
};