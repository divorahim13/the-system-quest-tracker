import React, { useState } from 'react';
import { SystemData, TitleItem } from '../types/system';
import { HudPanel, DiamondDivider } from './HudPanel';
import { TITLES_LIST, getDaysRemaining } from '../utils/systemLogic';
import {
  Zap,
  Swords,
  ShieldCheck,
  Star,
  Crown,
  BookOpen,
  Video,
  Flame,
  Lock,
  Edit2,
  Check,
} from 'lucide-react';
import { clsx } from 'clsx';

interface StatsViewProps {
  data: SystemData;
  onUpdateBossFight: (examName: string, targetDate: string) => void;
  onToggleTitleUnlock?: (titleId: string) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  data,
  onUpdateBossFight,
  onToggleTitleUnlock,
}) => {
  const [isEditingBoss, setIsEditingBoss] = useState(false);
  const [examNameInput, setExamNameInput] = useState(data.bossFight.examName);
  const [targetDateInput, setTargetDateInput] = useState(data.bossFight.targetDate);

  const daysRemaining = getDaysRemaining(data.bossFight.targetDate);

  const renderTitleIcon = (iconType: TitleItem['icon'], isUnlocked: boolean) => {
    const iconClass = isUnlocked
      ? 'w-6 h-6 text-[#4FC3F7] drop-shadow-[0_0_8px_#4FC3F7]'
      : 'w-5 h-5 text-gray-600';

    switch (iconType) {
      case 'zap':
        return <Zap className={iconClass} />;
      case 'swords':
        return <Swords className={iconClass} />;
      case 'shield-check':
        return <ShieldCheck className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'crown':
        return <Crown className={iconClass} />;
      case 'book':
        return <BookOpen className={iconClass} />;
      case 'video':
        return <Video className={iconClass} />;
      case 'flame':
        return <Flame className={iconClass} />;
      default:
        return <Star className={iconClass} />;
    }
  };

  const daysOfWeek: Array<'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'> = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
  ];

  const maxHistoryXP = Math.max(
    2500,
    ...data.dailyHistory.map((d) => d.xpEarned)
  );

  const handleSaveBoss = () => {
    onUpdateBossFight(examNameInput, targetDateInput);
    setIsEditingBoss(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-md mx-auto">
      <HudPanel variant="cyan" notchSize="md">
        <div className="text-center">
          <h2 className="font-hud tracking-widest text-[#4FC3F7] text-lg sm:text-xl font-bold uppercase">
            WEEKLY XP
          </h2>
        </div>

        <DiamondDivider count={1} variant="cyan" />

        <div className="relative pt-4 pb-2 px-1">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] font-mono text-gray-500 pr-1">
            <div className="border-b border-gray-800/60 w-full flex justify-start pl-1">2500K</div>
            <div className="border-b border-gray-800/60 w-full flex justify-start pl-1">2000K</div>
            <div className="border-b border-gray-800/60 w-full flex justify-start pl-1">1500K</div>
            <div className="border-b border-gray-800/60 w-full flex justify-start pl-1">1000K</div>
            <div className="border-b border-gray-800/60 w-full flex justify-start pl-1">500K</div>
            <div className="border-b border-gray-800/60 w-full flex justify-start pl-1">0</div>
          </div>

          <div className="relative z-10 flex items-end justify-between h-40 pt-4 px-6 gap-2">
            {daysOfWeek.map((day) => {
              const entry = data.dailyHistory.find((h) => h.day === day) || {
                xpEarned: 0,
              };
              const heightPct = Math.min(100, Math.max(8, (entry.xpEarned / maxHistoryXP) * 100));

              return (
                <div key={day} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-hud text-[9px] text-[#4FC3F7] font-bold">
                    {entry.xpEarned}
                  </div>

                  <div className="w-full relative flex flex-col justify-end rounded-t-xs overflow-hidden bg-black/40 border border-[#4FC3F7]/50 shadow-[0_0_8px_rgba(79,195,247,0.2)]" style={{ height: `${heightPct}%` }}>
                    <div className="w-full h-full bg-gradient-to-t from-cyan-900 via-cyan-500 to-[#00E5FF] opacity-90 group-hover:opacity-100 transition-all" />
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_6px_#FFFFFF]" />
                  </div>

                  <span className="font-hud text-[10px] sm:text-xs font-semibold text-gray-400 mt-2">
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </HudPanel>

      <HudPanel variant="cyan" notchSize="md">
        <div className="text-center">
          <h2 className="font-hud tracking-widest text-[#4FC3F7] text-lg sm:text-xl font-bold uppercase">
            TITLES
          </h2>
        </div>

        <DiamondDivider count={1} variant="cyan" />

        <div className="grid grid-cols-3 gap-3 py-2">
          {TITLES_LIST.map((title) => {
            const isUnlocked = data.unlockedTitles.includes(title.id);

            return (
              <div
                key={title.id}
                onClick={() => onToggleTitleUnlock && onToggleTitleUnlock(title.id)}
                className={clsx(
                  'group flex flex-col items-center text-center p-2 rounded transition-all duration-200 cursor-pointer select-none',
                  isUnlocked
                    ? 'hover:bg-[#4FC3F7]/10'
                    : 'opacity-70 hover:opacity-100'
                )}
                title={`${title.name}: ${title.condition}`}
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-1.5">
                  <svg
                    viewBox="0 0 100 100"
                    className={clsx(
                      'absolute inset-0 w-full h-full transition-all duration-300',
                      isUnlocked
                        ? 'text-[#4FC3F7] drop-shadow-[0_0_10px_rgba(79,195,247,0.6)]'
                        : 'text-gray-700 opacity-60'
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      d="M30 5 L70 5 L95 30 L95 70 L70 95 L30 95 L5 70 L5 30 Z"
                      fill={isUnlocked ? 'rgba(10, 24, 48, 0.8)' : 'rgba(8, 12, 22, 0.8)'}
                    />
                    <path
                      d="M35 12 L65 12 L88 35 L88 65 L65 88 L35 88 L12 65 L12 35 Z"
                      stroke={isUnlocked ? 'rgba(79, 195, 247, 0.4)' : 'rgba(75, 85, 99, 0.4)'}
                      strokeWidth="2"
                    />
                  </svg>

                  <div className="relative z-10 flex flex-col items-center justify-center">
                    {isUnlocked ? (
                      renderTitleIcon(title.icon, true)
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-500" />
                        <div className="absolute w-8 h-0.5 bg-gray-600/80 rotate-45" />
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={clsx(
                    'font-hud text-[10px] sm:text-xs font-bold leading-tight tracking-wider uppercase max-w-[95px]',
                    isUnlocked ? 'text-white glow-text-cyan' : 'text-gray-500'
                  )}
                >
                  {title.name}
                </div>
              </div>
            );
          })}
        </div>
      </HudPanel>

      <HudPanel variant="red" notchSize="md">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center flex items-center justify-center gap-2">
            <span className="text-[#FF5252] text-sm">◇</span>
            <h2 className="font-hud tracking-widest text-[#FF5252] text-lg sm:text-xl font-bold uppercase glow-text-red">
              BOSS FIGHT
            </h2>
            <span className="text-[#FF5252] text-sm">◇</span>
          </div>

          <button
            onClick={() => setIsEditingBoss(!isEditingBoss)}
            className="text-gray-400 hover:text-[#FF5252] transition-colors p-1"
            title="Edit Boss Fight Target"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <DiamondDivider count={1} variant="red" />

        {isEditingBoss ? (
          <div className="p-3 bg-[#1D080D] border border-[#FF5252]/50 rounded space-y-2 font-hud text-xs">
            <div>
              <label className="block text-gray-400 mb-1">EXAM / BOSS NAME:</label>
              <input
                type="text"
                value={examNameInput}
                onChange={(e) => setExamNameInput(e.target.value)}
                className="w-full px-2 py-1 bg-black/60 border border-[#FF5252]/60 text-white rounded focus:outline-none focus:border-[#FF5252]"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">TARGET DATE:</label>
              <input
                type="date"
                value={targetDateInput}
                onChange={(e) => setTargetDateInput(e.target.value)}
                className="w-full px-2 py-1 bg-black/60 border border-[#FF5252]/60 text-white rounded focus:outline-none focus:border-[#FF5252]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleSaveBoss}
                className="px-3 py-1 bg-[#FF5252] text-white font-bold rounded flex items-center gap-1 hover:bg-[#D50000]"
              >
                <Check className="w-3.5 h-3.5" /> SAVE
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 my-2">
            <div className="font-hud font-extrabold text-base sm:text-lg text-white tracking-widest uppercase">
              {data.bossFight.examName}
            </div>

            <div className="relative inline-block w-full max-w-[260px] p-[6px] rounded hazard-border shadow-[0_0_20px_rgba(255,82,82,0.4)]">
              <div className="bg-[#0D0407] py-3.5 px-6 rounded-xs text-center border border-[#FF5252]/60">
                <div className="font-hud font-black text-4xl sm:text-5xl text-white glow-text-red tracking-wider">
                  D-{daysRemaining}
                </div>
              </div>
            </div>
          </div>
        )}
      </HudPanel>
    </div>
  );
};