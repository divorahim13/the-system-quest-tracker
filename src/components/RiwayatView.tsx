import React, { useState } from 'react';
import { SystemData, DailyHistoryEntry } from '../types/system';
import { HudPanel, DiamondDivider } from './HudPanel';
import { CalendarHeatmap } from './CalendarHeatmap';
import { Calendar, Flame, Shield, TrendingUp, Info } from 'lucide-react';
import { clsx } from 'clsx';

interface RiwayatViewProps {
  data: SystemData;
}

export const RiwayatView: React.FC<RiwayatViewProps> = ({ data }) => {
  const [rangeFilter, setRangeFilter] = useState<'7d' | '30d' | 'all'>('7d');
  const [selectedDay, setSelectedDay] = useState<DailyHistoryEntry | null>(null);

  const history = data.dailyHistory || [];
  const streakDays = data.streakDays || 0;

  const getFilteredHistory = () => {
    if (rangeFilter === '7d') return history.slice(-7);
    if (rangeFilter === '30d') return history.slice(-30);
    return history;
  };

  const filtered = getFilteredHistory();
  const maxXP = Math.max(150, ...filtered.map((h) => h.xpEarned));

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-md mx-auto font-hud">
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-[#0A1830]/80 border border-[#4FC3F7]/40 rounded text-center shadow-[0_0_10px_rgba(79,195,247,0.15)]">
          <Flame className="w-5 h-5 text-[#4FC3F7] mx-auto mb-1 animate-pulse" />
          <div className="text-[10px] text-gray-400 uppercase font-bold">CURRENT STREAK</div>
          <div className="text-xl font-extrabold text-white glow-text-cyan">{streakDays} DAYS</div>
        </div>

        <div className="p-3 bg-[#0A1830]/80 border border-[#4FC3F7]/40 rounded text-center shadow-[0_0_10px_rgba(79,195,247,0.15)]">
          <TrendingUp className="w-5 h-5 text-[#00E5FF] mx-auto mb-1" />
          <div className="text-[10px] text-gray-400 uppercase font-bold">LONGEST STREAK</div>
          <div className="text-xl font-extrabold text-[#00E5FF]">{Math.max(streakDays, 30)} DAYS</div>
        </div>

        <div className="p-3 bg-[#0A1830]/80 border border-[#4FC3F7]/40 rounded text-center shadow-[0_0_10px_rgba(79,195,247,0.15)]">
          <Shield className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-[10px] text-gray-400 uppercase font-bold">GRACE TOKENS</div>
          <div className="text-xl font-extrabold text-yellow-300">{data.graceTokens} LEFT</div>
        </div>
      </div>

      <HudPanel variant="cyan" notchSize="md">
        <div className="flex items-center justify-between">
          <h2 className="tracking-widest text-[#4FC3F7] text-lg sm:text-xl font-bold uppercase">
            CALENDAR HEATMAP (164 DAYS)
          </h2>
          <Calendar className="w-5 h-5 text-[#4FC3F7]" />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Visualisasi konsistensi harian 21 Jul – 31 Des 2026. Klik hari untuk melihat detail:
        </p>

        <DiamondDivider count={1} variant="cyan" />

        <CalendarHeatmap history={history} startDateStr="2026-07-21" endDateStr="2026-12-31" />
      </HudPanel>

      <HudPanel variant="cyan" notchSize="md">
        <div className="flex items-center justify-between">
          <h2 className="tracking-widest text-[#4FC3F7] text-base sm:text-lg font-bold uppercase">
            XP TREND OVER TIME
          </h2>

          <div className="flex items-center gap-1 bg-black/50 p-1 rounded border border-gray-800">
            <button
              onClick={() => setRangeFilter('7d')}
              className={clsx(
                'px-2 py-0.5 text-[9px] font-bold rounded',
                rangeFilter === '7d' ? 'bg-[#4FC3F7] text-slate-950' : 'text-gray-400 hover:text-white'
              )}
            >
              7D
            </button>
            <button
              onClick={() => setRangeFilter('30d')}
              className={clsx(
                'px-2 py-0.5 text-[9px] font-bold rounded',
                rangeFilter === '30d' ? 'bg-[#4FC3F7] text-slate-950' : 'text-gray-400 hover:text-white'
              )}
            >
              30D
            </button>
            <button
              onClick={() => setRangeFilter('all')}
              className={clsx(
                'px-2 py-0.5 text-[9px] font-bold rounded',
                rangeFilter === 'all' ? 'bg-[#4FC3F7] text-slate-950' : 'text-gray-400 hover:text-white'
              )}
            >
              ALL
            </button>
          </div>
        </div>

        <DiamondDivider count={1} variant="cyan" />

        <div className="h-44 w-full flex items-end justify-between gap-1 pt-4 pb-2 px-1 border-b border-gray-800">
          {filtered.length > 0 ? (
            filtered.map((entry, idx) => {
              const heightPct = Math.min(100, Math.max(8, (entry.xpEarned / maxXP) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-900 via-[#4FC3F7] to-[#00E5FF] rounded-t-xs transition-all duration-300 group-hover:brightness-125 shadow-[0_0_8px_rgba(79,195,247,0.4)]"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[8px] text-gray-500 font-mono truncate">{entry.day || entry.date.slice(8)}</span>

                  <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center bg-black/90 border border-[#4FC3F7] px-2 py-1 rounded text-[9px] text-white z-30 pointer-events-none whitespace-nowrap shadow-[0_0_10px_#4FC3F7]">
                    <span>{entry.date}</span>
                    <strong className="text-[#4FC3F7]">{entry.xpEarned} XP</strong>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full text-center text-xs text-gray-500 py-12">
              Belum ada riwayat XP tercatat.
            </div>
          )}
        </div>
      </HudPanel>
    </div>
  );
};