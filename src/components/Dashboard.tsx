import React, { useState } from 'react';
import { SystemData, Quest } from '../types/system';
import { HudPanel, DiamondDivider } from './HudPanel';
import { getDaysRemaining } from '../utils/systemLogic';
import { Flame, Check, Zap, Edit2, Trash2, Edit, ShieldAlert, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface DashboardProps {
  data: SystemData;
  nextLevelXP: number;
  onToggleQuest: (questId: string, payload?: { addedVerbs?: number; subPhoneOutside?: boolean; userNote?: string; ktScore?: number }) => void;
  onToggleInstantTask: (taskId: string) => void;
  onUseGraceToken: () => void;
  onUpdateBossFight: (examName: string, targetDate: string) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (questId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  nextLevelXP,
  onToggleQuest,
  onToggleInstantTask,
  onUseGraceToken,
  onUpdateBossFight,
  onEditQuest,
  onDeleteQuest,
}) => {
  const [showGraceModal, setShowGraceModal] = useState(false);
  const [showVerbModal, setShowVerbModal] = useState(false);
  const [verbInput, setVerbInput] = useState('5');
  const [activeTagebuchQuestId, setActiveTagebuchQuestId] = useState<string | null>(null);

  const [showCommuteModal, setShowCommuteModal] = useState(false);
  const [podcastNote, setPodcastNote] = useState('');
  const [activeCommuteQuestId, setActiveCommuteQuestId] = useState<string | null>(null);

  const [showKTModal, setShowKTModal] = useState(false);
  const [ktScoreInput, setKtScoreInput] = useState('25');
  const [activeKTQuestId, setActiveKTQuestId] = useState<string | null>(null);

  const [isEditingBoss, setIsEditingBoss] = useState(false);
  const [bossNameInput, setBossNameInput] = useState(data.bossFight.examName);
  const [bossDateInput, setBossDateInput] = useState(data.bossFight.targetDate);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const xpPercentage = Math.min(100, Math.max(0, (data.currentXP / nextLevelXP) * 100));
  const daysRemaining = getDaysRemaining(data.bossFight.targetDate);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'KÖRPER':
        return 'border-emerald-400/60 text-emerald-300 bg-emerald-950/40';
      case 'SPRACHE':
        return 'border-[#4FC3F7]/60 text-[#4FC3F7] bg-cyan-950/40';
      case 'CONTENT':
        return 'border-purple-400/60 text-purple-300 bg-purple-950/40';
      case 'DISCIPLINE':
        return 'border-yellow-400/60 text-yellow-300 bg-yellow-950/40';
      case 'REVISION':
        return 'border-indigo-400/60 text-indigo-300 bg-indigo-950/40';
      case 'EXAM':
        return 'border-red-400/60 text-red-300 bg-red-950/40';
      default:
        return 'border-gray-400/60 text-gray-300 bg-gray-900/40';
    }
  };

  const handleQuestClick = (quest: Quest) => {
    if (!quest.completed) {
      if (quest.name.toLowerCase().includes('tagebuch') || quest.id.includes('morgenroutine')) {
        setActiveTagebuchQuestId(quest.id);
        setShowVerbModal(true);
        return;
      }
      if (quest.name.toLowerCase().includes('commute') || quest.name.toLowerCase().includes('unterwegs')) {
        setActiveCommuteQuestId(quest.id);
        setShowCommuteModal(true);
        return;
      }
      if (quest.name.toLowerCase().includes('kapiteltest') || quest.id.includes('kt-boss')) {
        setActiveKTQuestId(quest.id);
        setShowKTModal(true);
        return;
      }
    }

    onToggleQuest(quest.id);
  };

  const handleConfirmVerbs = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(verbInput, 10) || 0;
    if (activeTagebuchQuestId) {
      onToggleQuest(activeTagebuchQuestId, { addedVerbs: count });
    }
    setShowVerbModal(false);
    setActiveTagebuchQuestId(null);
  };

  const handleConfirmCommute = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCommuteQuestId) {
      onToggleQuest(activeCommuteQuestId, { userNote: podcastNote });
    }
    setShowCommuteModal(false);
    setActiveCommuteQuestId(null);
    setPodcastNote('');
  };

  const handleConfirmKT = (e: React.FormEvent) => {
    e.preventDefault();
    const score = parseInt(ktScoreInput, 10) || 25;
    if (activeKTQuestId) {
      onToggleQuest(activeKTQuestId, { ktScore: score });
    }
    setShowKTModal(false);
    setActiveKTQuestId(null);
  };

  const handleSaveBoss = () => {
    onUpdateBossFight(bossNameInput, bossDateInput);
    setIsEditingBoss(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-md mx-auto">
      <div className="p-2.5 rounded border border-[#4FC3F7]/40 bg-[#0A1830]/80 font-hud text-xs flex items-center justify-between shadow-[0_0_12px_rgba(79,195,247,0.2)]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#4FC3F7] animate-pulse" />
          <div>
            <span className="font-bold text-gray-300 uppercase">{data.currentPhase?.name || 'Phase 1: B1 Intensiv'}</span>
            <div className="text-[10px] text-[#4FC3F7] font-semibold">TITLE: {data.currentPhase?.title || 'B1 Lehrling'}</div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-gray-800">
          C1 Exam Dec 2026
        </span>
      </div>

      {data.sleepDebuff?.active && (
        <div className="p-3 rounded border border-red-500 bg-red-950/70 font-hud text-xs flex items-center gap-3 animate-pulse shadow-[0_0_20px_rgba(255,82,82,0.5)]">
          <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <h4 className="font-bold text-red-200 uppercase tracking-wider">BRAIN FOG DEBUFF ACTIVE!</h4>
            <p className="text-[11px] text-red-300 leading-tight mt-0.5">
              Gagal tidur disiplin (Nachtruhe) 2 hari berturut-turut. XP belajar hari ini berkurang <strong>0.8x</strong> (memory consolidation terganggu).
            </p>
          </div>
        </div>
      )}

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
          <div className="relative w-full h-3.5 bg-black/60 rounded-sm overflow-hidden border border-[#4FC3F7]/30 p-[1px]">
            <div
              className="relative h-full bg-gradient-to-r from-cyan-600 via-[#4FC3F7] to-[#00E5FF] transition-all duration-500 ease-out rounded-sm shadow-[0_0_12px_#00E5FF] overflow-hidden"
              style={{ width: `${xpPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-sweep pointer-events-none" />
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

        <div className="space-y-2.5">
          {data.quests.map((quest) => (
            <div
              key={quest.id}
              className={clsx(
                'group relative flex flex-col p-2.5 sm:p-3 rounded border transition-all duration-200 select-none space-y-2',
                quest.completed
                  ? 'bg-[#4FC3F7]/10 border-[#4FC3F7]/60 shadow-[0_0_10px_rgba(79,195,247,0.15)] animate-quest-pulse'
                  : 'bg-slate-900/40 border-slate-800 hover:border-[#4FC3F7]/40 hover:bg-slate-900/70'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                  <div
                    onClick={() => handleQuestClick(quest)}
                    className={clsx(
                      'w-6 h-6 rounded-sm border-2 flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0',
                      quest.completed
                        ? 'border-[#4FC3F7] bg-[#4FC3F7] text-slate-950 shadow-[0_0_10px_#4FC3F7]'
                        : 'border-[#4FC3F7]/50 bg-black/40 group-hover:border-[#4FC3F7]'
                    )}
                  >
                    {quest.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0" onClick={() => handleQuestClick(quest)}>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {quest.timeSlot && (
                        <span className="font-hud text-[10px] sm:text-xs text-[#4FC3F7] font-semibold">
                          [{quest.timeSlot}]
                        </span>
                      )}
                      <span
                        className={clsx(
                          'font-hud font-semibold text-sm sm:text-base tracking-wide truncate',
                          quest.completed ? 'text-gray-300 line-through opacity-80' : 'text-white'
                        )}
                      >
                        {quest.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={clsx(
                          'inline-block text-[9px] sm:text-[10px] font-hud font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider',
                          getCategoryColor(quest.category)
                        )}
                      >
                        {quest.category}
                      </span>
                      {quest.isMandatory ? (
                        <span className="text-[9px] font-hud text-red-400 font-bold uppercase">
                          (Wajib)
                        </span>
                      ) : (
                        <span className="text-[9px] font-hud text-yellow-300 font-bold uppercase">
                          (Bonus)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="font-hud font-bold text-xs sm:text-sm text-[#4FC3F7] tracking-wider drop-shadow-[0_0_6px_rgba(79,195,247,0.5)]">
                    +{data.sleepDebuff?.active ? Math.round(quest.xp * 0.8) : quest.xp} XP
                  </div>

                  <div className="flex items-center gap-1 pl-1 border-l border-gray-800">
                    <button
                      onClick={() => onEditQuest(quest)}
                      className="p-1 text-gray-500 hover:text-[#4FC3F7] transition-colors"
                      title="Edit Quest"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(quest.id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete Quest"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {quest.name.toLowerCase().includes('nachtruhe') && (
                <div className="pt-1.5 border-t border-slate-800/80 flex items-center gap-2 font-hud text-xs text-yellow-300/90 pl-9">
                  <input
                    type="checkbox"
                    id="subPhoneOutside"
                    checked={quest.subPhoneOutside || false}
                    onChange={(e) => onToggleQuest(quest.id, { subPhoneOutside: e.target.checked })}
                    className="w-3.5 h-3.5 accent-yellow-400 cursor-pointer"
                  />
                  <label htmlFor="subPhoneOutside" className="cursor-pointer select-none">
                    📱 Phone charged outside bedroom
                  </label>
                </div>
              )}

              {quest.userNote && (
                <div className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 p-1 rounded border border-cyan-800/40 ml-9">
                  🎧 Audio: "{quest.userNote}"
                </div>
              )}
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 my-1">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 shadow-[0_0_12px_rgba(79,195,247,0.3)]">
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-[#4FC3F7] fill-[#4FC3F7]/30" />
            </div>

            <div>
              <div className="font-hud font-extrabold text-xl sm:text-2xl text-white tracking-wider">
                STREAK: <span className="glow-text-cyan">{data.streakDays} DAYS</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-hud text-gray-300">
                <span>🔥 Grace Token:</span>
                <strong className="text-[#4FC3F7] font-bold">{data.graceTokens} remaining</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowGraceModal(true)}
            disabled={data.graceTokens <= 0 || data.streakProtectedToday}
            className={clsx(
              'w-full sm:w-auto px-3.5 py-1.5 rounded font-hud font-bold text-xs tracking-wider uppercase transition-all border',
              data.streakProtectedToday
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 opacity-80'
                : data.graceTokens > 0
                ? 'bg-[#4FC3F7]/15 border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7]/30 shadow-[0_0_10px_rgba(79,195,247,0.3)]'
                : 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
            )}
          >
            {data.streakProtectedToday ? 'STREAK PROTECTED' : 'PAKAI GRACE TOKEN'}
          </button>
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
          <strong className="text-[#9C27B0]">BONUS CHALLENGES:</strong> Opsional (+10 XP masing-masing). Selesaikan kapan saja tanpa mempengaruhi streak.
        </p>

        <div className="mt-3 space-y-2">
          {data.instantDungeonTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleInstantTask(task.id)}
              className={clsx(
                'flex items-center justify-between p-2.5 rounded border transition-all cursor-pointer select-none',
                task.completed
                  ? 'bg-[#7C4DFF]/20 border-[#7C4DFF] shadow-[0_0_10px_rgba(124,77,255,0.3)]'
                  : 'bg-[#120826]/80 border-[#7C4DFF]/40 hover:border-[#7C4DFF] hover:bg-[#1A0C38]'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={clsx(
                    'w-5 h-5 rounded-sm border flex items-center justify-center transition-colors',
                    task.completed
                      ? 'border-[#7C4DFF] bg-[#7C4DFF] text-white'
                      : 'border-[#7C4DFF]/60 bg-black/40'
                  )}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span
                  className={clsx(
                    'font-hud text-xs font-semibold tracking-wide',
                    task.completed ? 'text-gray-300 line-through opacity-80' : 'text-white'
                  )}
                >
                  {task.name}
                </span>
              </div>
              <span className="font-hud font-bold text-xs text-[#B388FF]">
                +{task.xp} XP
              </span>
            </div>
          ))}
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
                value={bossNameInput}
                onChange={(e) => setBossNameInput(e.target.value)}
                className="w-full px-2 py-1 bg-black/60 border border-[#FF5252]/60 text-white rounded focus:outline-none focus:border-[#FF5252]"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">TARGET DATE:</label>
              <input
                type="date"
                value={bossDateInput}
                onChange={(e) => setBossDateInput(e.target.value)}
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
                <div className="font-hud font-black text-4xl sm:text-5xl text-[#FF5252] glow-text-red tracking-wider">
                  D-{daysRemaining}
                </div>
              </div>
            </div>
          </div>
        )}
      </HudPanel>

      {showCommuteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-[#0C1A30] border-2 border-[#4FC3F7] p-5 rounded-md font-hud text-center space-y-3 shadow-[0_0_30px_rgba(79,195,247,0.4)]">
            <h3 className="text-base font-bold text-[#4FC3F7] uppercase tracking-wider">
              UNTERWEGS LERNEN
            </h3>
            <p className="text-xs text-gray-300">
              Judul podcast / audio Jerman yang didengarkan saat perjalanan motor:
            </p>
            <form onSubmit={handleConfirmCommute} className="space-y-3">
              <input
                type="text"
                required
                placeholder="e.g. Easy German Podcast Ep. 45"
                value={podcastNote}
                onChange={(e) => setPodcastNote(e.target.value)}
                className="w-full p-2 bg-black/60 border border-[#4FC3F7] text-white text-xs rounded focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-[#4FC3F7] text-slate-950 font-bold text-xs rounded hover:bg-[#00E5FF]"
              >
                LOG & CLAIM XP
              </button>
            </form>
          </div>
        </div>
      )}

      {showVerbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-[#0C1A30] border-2 border-[#4FC3F7] p-5 rounded-md font-hud text-center space-y-3 shadow-[0_0_30px_rgba(79,195,247,0.4)]">
            <h3 className="text-base font-bold text-[#4FC3F7] uppercase tracking-wider">
              TAGEBUCH PRÄTERITUM
            </h3>
            <p className="text-xs text-gray-300">
              Berapa verba baru yang Anda pelajari pada sesi ini?
            </p>
            <form onSubmit={handleConfirmVerbs} className="space-y-3">
              <input
                type="number"
                min="0"
                max="50"
                value={verbInput}
                onChange={(e) => setVerbInput(e.target.value)}
                className="w-24 text-center py-1.5 px-2 bg-black/60 border border-[#4FC3F7] text-white font-bold text-lg rounded focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#4FC3F7] text-slate-950 font-bold text-xs rounded hover:bg-[#00E5FF]"
                >
                  SIMPAN & CLAIM XP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showKTModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-[#1D080D] border-2 border-[#FF5252] p-5 rounded-md font-hud text-center space-y-3 shadow-[0_0_30px_rgba(255,82,82,0.4)]">
            <h3 className="text-base font-bold text-[#FF5252] uppercase tracking-wider glow-text-red">
              MAGNA KAPITELTEST (KT)
            </h3>
            <p className="text-xs text-gray-300">
              Input skor Kapiteltest yang diraih (Target: 25/25 per modul):
            </p>
            <form onSubmit={handleConfirmKT} className="space-y-3">
              <input
                type="number"
                min="0"
                max="100"
                value={ktScoreInput}
                onChange={(e) => setKtScoreInput(e.target.value)}
                className="w-24 text-center py-1.5 px-2 bg-black/60 border border-[#FF5252] text-white font-bold text-lg rounded focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-[#FF5252] text-white font-bold text-xs rounded hover:bg-[#D50000]"
              >
                LOG SCORE & CLAIM +150 XP
              </button>
            </form>
          </div>
        </div>
      )}

      {showGraceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs sm:max-w-sm bg-[#0C1A30] border-2 border-[#4FC3F7] p-5 rounded-md text-center font-hud space-y-4 shadow-[0_0_30px_rgba(79,195,247,0.4)]">
            <Flame className="w-10 h-10 text-[#4FC3F7] mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              PAKAI GRACE TOKEN?
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Menggunakan 1 Grace Token akan melindungi streak Anda hari ini meskipun ada quest wajib yang belum selesai.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onUseGraceToken();
                  setShowGraceModal(false);
                }}
                className="flex-1 py-2 bg-[#4FC3F7] text-slate-950 font-bold text-xs rounded hover:bg-[#00E5FF] transition-all"
              >
                KONFIRMASI
              </button>
              <button
                onClick={() => setShowGraceModal(false)}
                className="px-4 py-2 bg-slate-800 text-gray-300 font-bold text-xs rounded hover:bg-slate-700"
              >
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-[#1A0C0E] border-2 border-red-500 p-4 rounded-md font-hud text-center space-y-3">
            <h3 className="text-sm font-bold text-red-400 uppercase">HAPUS QUEST INI?</h3>
            <div className="flex gap-2 justify-center pt-1">
              <button
                onClick={() => {
                  onDeleteQuest(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-1.5 bg-red-600 text-white font-bold text-xs rounded hover:bg-red-700"
              >
                HAPUS
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-1.5 bg-slate-800 text-gray-300 font-bold text-xs rounded"
              >
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};