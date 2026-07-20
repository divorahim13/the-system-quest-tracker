import React, { useEffect } from 'react';
import { HudPanel, DiamondDivider } from './HudPanel';

interface QuestCompleteModalProps {
  xpEarned: number;
  onClose: () => void;
}

export const QuestCompleteModal: React.FC<QuestCompleteModalProps> = ({
  xpEarned,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer select-none animate-fadeIn"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full opacity-25 bg-[conic-gradient(from_0deg_at_50%_50%,#00E5FF_0deg,#0A1226_30deg,#00E5FF_60deg,#0A1226_90deg,#00E5FF_120deg,#0A1226_150deg,#00E5FF_180deg,#0A1226_210deg,#00E5FF_240deg,#0A1226_270deg,#00E5FF_300deg,#0A1226_330deg,#00E5FF_360deg)] animate-spin-slow" />
        <div className="absolute w-[450px] h-[450px] rounded-full bg-[#00E5FF]/20 blur-[100px] animate-pulse-glow" />
      </div>

      <div className="relative z-10 w-full max-w-xs sm:max-w-sm">
        <HudPanel variant="cyan" notchSize="lg" className="text-center shadow-[0_0_40px_rgba(79,195,247,0.5)]">
          <div className="py-6 px-4 space-y-4">
            <h1 className="font-hud font-extrabold text-2xl sm:text-3xl tracking-widest text-[#E0F7FA] glow-text-cyan uppercase leading-tight">
              QUEST<br />COMPLETE
            </h1>

            <DiamondDivider count={3} variant="cyan" />

            <div className="space-y-1">
              <div className="font-hud font-extrabold text-3xl sm:text-4xl glow-text-bright tracking-wider">
                +{xpEarned} XP
              </div>
              <div className="font-hud font-bold text-sm sm:text-base text-[#4FC3F7] tracking-widest uppercase">
                ACQUIRED
              </div>
            </div>

            <div className="pt-2 text-[10px] font-hud text-gray-400 tracking-widest uppercase opacity-70">
              TAP ANYWHERE TO CONTINUE
            </div>
          </div>
        </HudPanel>
      </div>
    </div>
  );
};