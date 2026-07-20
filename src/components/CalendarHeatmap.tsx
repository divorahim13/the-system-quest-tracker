import React from 'react';
import { clsx } from 'clsx';
import { DailyHistoryEntry } from '../types/system';

interface CalendarHeatmapProps {
  history: DailyHistoryEntry[];
  startDateStr?: string;
  endDateStr?: string;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  history,
  startDateStr = '2026-07-21',
  endDateStr = '2026-12-31',
}) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const daysList: Array<{ date: string; dayOfWeek: number; xp: number }> = [];

  const historyMap = new Map<string, number>();
  history.forEach((h) => historyMap.set(h.date, h.xpEarned));

  const current = new Date(start);
  while (current <= end) {
    const dateFormatted = current.toISOString().split('T')[0];
    const xp = historyMap.get(dateFormatted) || 0;
    daysList.push({
      date: dateFormatted,
      dayOfWeek: current.getDay(),
      xp,
    });
    current.setDate(current.getDate() + 1);
  }

  const weeks: Array<Array<{ date: string; dayOfWeek: number; xp: number } | null>> = [];
  let currentWeek: Array<{ date: string; dayOfWeek: number; xp: number } | null> = new Array(7).fill(null);

  daysList.forEach((d) => {
    currentWeek[d.dayOfWeek] = d;
    if (d.dayOfWeek === 6) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }
  });

  if (currentWeek.some((cell) => cell !== null)) {
    weeks.push(currentWeek);
  }

  const getCellColor = (xp: number) => {
    if (xp === 0) return 'bg-[#0B1528] border-slate-900/60';
    if (xp <= 40) return 'bg-[#0E3A60] border-cyan-900/50';
    if (xp <= 80) return 'bg-[#1565A0] border-cyan-600/60';
    if (xp <= 120) return 'bg-[#4FC3F7] border-[#4FC3F7] shadow-[0_0_6px_#4FC3F7]';
    return 'bg-[#00E5FF] border-white shadow-[0_0_10px_#00E5FF]';
  };

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="w-full space-y-2 font-hud select-none">
      <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
        <span className="text-[#4FC3F7]">JUL 21 – DEC 31, 2026</span>
        <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
          <span>Less</span>
          <span className="w-2.5 h-2.5 bg-[#0B1528] border border-slate-800 rounded-xs" />
          <span className="w-2.5 h-2.5 bg-[#0E3A60] rounded-xs" />
          <span className="w-2.5 h-2.5 bg-[#1565A0] rounded-xs" />
          <span className="w-2.5 h-2.5 bg-[#4FC3F7] rounded-xs" />
          <span className="w-2.5 h-2.5 bg-[#00E5FF] rounded-xs" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex gap-1">
          <div className="grid grid-rows-7 gap-1 text-[9px] font-mono text-gray-500 pr-1">
            {dayLabels.map((lbl, idx) => (
              <span key={idx} className="h-3 flex items-center justify-center">
                {idx % 2 === 1 ? lbl : ''}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-rows-7 gap-1">
                {week.map((day, dayIdx) => {
                  if (!day) {
                    return (
                      <div
                        key={dayIdx}
                        className="w-3 h-3 rounded-xs opacity-0"
                      />
                    );
                  }

                  return (
                    <div
                      key={day.date}
                      className={clsx(
                        'w-3 h-3 rounded-xs border transition-all duration-200 cursor-pointer hover:scale-125 hover:z-20',
                        getCellColor(day.xp)
                      )}
                      title={`${day.date}: ${day.xp} XP earned`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};