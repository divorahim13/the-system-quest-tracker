import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  newLevel: number;
  oldRank: string;
  newRank: string;
  unlockedTitle?: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  oldRank,
  newRank,
  unlockedTitle = 'IRON WILL',
  onClose,
}) => {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4FC3F7', '#00E5FF', '#FFFFFF', '#7C4DFF'],
    });
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg cursor-pointer select-none overflow-hidden animate-fadeIn"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute w-24 h-full bg-gradient-to-t from-transparent via-[#00E5FF]/25 to-transparent blur-md animate-rise-beam-1" />
        <div className="absolute w-48 h-full bg-gradient-to-t from-transparent via-[#4FC3F7]/20 to-transparent blur-lg animate-rise-beam-2" />
        <div className="absolute w-12 h-full bg-gradient-to-t from-transparent via-white/30 to-transparent blur-sm animate-rise-beam-3" />
        <div className="absolute top-1/3 w-[360px] h-[360px] rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 blur-xl animate-pulse-glow" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-6">
        <div>
          <h1 className="font-hud font-extrabold text-4xl sm:text-5xl tracking-widest text-[#E0F7FA] glow-text-bright uppercase">
            LEVEL UP
          </h1>
        </div>

        <div className="relative flex items-center justify-center w-40 h-40 my-2">
          <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF] shadow-[0_0_30px_#00E5FF,inset_0_0_20px_#00E5FF] animate-pulse" />
          <div className="absolute inset-2 rounded-full border border-[#4FC3F7]/40" />

          <span className="font-hud font-black text-6xl sm:text-7xl text-white glow-text-bright tracking-tight">
            {newLevel}
          </span>
        </div>

        <div className="w-full relative hud-notched panel-cyan p-4 shadow-[0_0_25px_rgba(79,195,247,0.4)]">
          <div className="font-hud text-xs sm:text-sm font-semibold tracking-widest text-gray-300 uppercase">
            TITLE ACQUIRED:
          </div>
          <div className="font-hud font-extrabold text-xl sm:text-2xl text-white tracking-widest uppercase mt-1 glow-text-cyan">
            {unlockedTitle}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 font-hud">
          <div className="px-3.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-700 text-gray-400 font-bold text-xs sm:text-sm tracking-widest">
            {oldRank}
          </div>

          <span className="text-[#4FC3F7] font-bold text-base">→</span>

          <div className="px-3.5 py-1.5 rounded-md bg-[#0A1A33] border border-[#4FC3F7] text-white font-extrabold text-xs sm:text-sm tracking-widest shadow-[0_0_15px_#4FC3F7]">
            {newRank}
          </div>
        </div>

        <div className="text-[10px] font-hud text-gray-400 tracking-widest uppercase pt-2 opacity-70">
          TAP ANYWHERE TO DISMISS
        </div>
      </div>
    </div>
  );
};