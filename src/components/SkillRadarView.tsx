import React from 'react';
import { SystemData, SkillStats, StatKey } from '../types/system';
import { HudPanel, DiamondDivider } from './HudPanel';
import { RadarChart } from './RadarChart';
import { calculateDualGateRank } from '../utils/statLogic';
import { ShieldAlert, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface SkillRadarViewProps {
  data: SystemData;
}

export const SkillRadarView: React.FC<SkillRadarViewProps> = ({ data }) => {
  const stats = data.skillStats || { gra: 30, wor: 30, hor: 30, les: 30, sch: 30, spr: 30 };
  const lastFedAt = data.lastFedAt || {
    gra: '2026-07-20',
    wor: '2026-07-20',
    hor: '2026-07-20',
    les: '2026-07-20',
    sch: '2026-07-20',
    spr: '2026-07-20',
  };

  const rankEval = calculateDualGateRank(stats, 4);

  const statLabels: Record<StatKey, { name: string; desc: string }> = {
    gra: { name: 'Grammatik (GRA)', desc: 'Tata bahasa & struktur kalimat' },
    wor: { name: 'Wortschatz (WOR)', desc: 'Kosa kata & frasa kontekstual' },
    hor: { name: 'Hören (HOR)', desc: 'Pemahaman mendengar audio podcast' },
    les: { name: 'Lesen (LES)', desc: 'Membaca artikel DW & berita' },
    sch: { name: 'Schreiben (SCH)', desc: 'Menulis Tagebuch Präteritum' },
    spr: { name: 'Sprechen (SPR)', desc: 'Kelancaran berbicara & shadowing' },
  };

  const statKeys: StatKey[] = ['gra', 'wor', 'hor', 'les', 'sch', 'spr'];

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-md mx-auto font-hud">
      {rankEval.isCurriculumReadyButStatBlocked ? (
        <div className="p-3.5 rounded border border-yellow-500 bg-yellow-950/80 text-xs flex items-center gap-3 shadow-[0_0_20px_rgba(255,193,7,0.4)] animate-pulse">
          <AlertTriangle className="w-7 h-7 text-yellow-400 shrink-0" />
          <div>
            <h4 className="font-bold text-yellow-200 uppercase tracking-wider">SKILL BOTTLENECK DETECTED!</h4>
            <p className="text-[11px] text-yellow-300 leading-tight mt-0.5">
              {rankEval.message}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded border border-emerald-500/50 bg-emerald-950/60 text-xs flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-200 uppercase">ALL SKILL STATS BALANCED</h4>
            <p className="text-[11px] text-emerald-300">
              Seluruh stat berada di atas ambang batas minimum Rank {rankEval.rankCode}.
            </p>
          </div>
        </div>
      )}

      <HudPanel variant="cyan" notchSize="md">
        <div className="flex items-center justify-between">
          <h2 className="tracking-widest text-[#4FC3F7] text-lg sm:text-xl font-bold uppercase">
            SKILL RADAR (6 AXES)
          </h2>
          <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            {rankEval.rankCode}-RANK
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Skala 0-100 per stat (Seeded 30/100 Goethe A2 baseline + Quest impacts - Decay):
        </p>

        <DiamondDivider count={1} variant="cyan" />

        <RadarChart stats={stats} targetThreshold={rankEval.requiredValue || 40} size={250} />
      </HudPanel>

      <HudPanel variant="cyan" notchSize="md">
        <h2 className="tracking-widest text-[#4FC3F7] text-base sm:text-lg font-bold uppercase">
          STAT BREAKDOWN & DECAY TRACKER
        </h2>

        <DiamondDivider count={1} variant="cyan" />

        <div className="space-y-2 text-xs">
          {statKeys.map((key) => {
            const val = stats[key];
            const isLowest = rankEval.bottleneckStat === key;
            const lastDate = lastFedAt[key] || '2026-07-20';

            return (
              <div
                key={key}
                className={clsx(
                  'p-2.5 rounded border transition-all flex items-center justify-between',
                  isLowest
                    ? 'bg-red-950/40 border-red-500 text-red-200 shadow-[0_0_10px_rgba(255,82,82,0.3)]'
                    : 'bg-slate-900/50 border-slate-800 text-gray-300'
                )}
              >
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{statLabels[key].name}</span>
                    {isLowest && (
                      <span className="text-[9px] bg-red-600 text-white font-black px-1.5 rounded uppercase animate-pulse">
                        BOTTLENECK
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{statLabels[key].desc}</div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-base font-extrabold text-[#4FC3F7]">{val} / 100</div>
                  <div className="text-[9px] text-gray-500">Fed: {lastDate}</div>
                </div>
              </div>
            );
          })}
        </div>
      </HudPanel>
    </div>
  );
};