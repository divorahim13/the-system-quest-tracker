import React from 'react';
import { SkillStats } from '../types/system';

interface RadarChartProps {
  stats: SkillStats;
  targetThreshold?: number;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  stats,
  targetThreshold,
  size = 260,
}) => {
  const center = size / 2;
  const radius = center - 35;

  const keys: Array<{ key: keyof SkillStats; label: string }> = [
    { key: 'gra', label: 'GRA' },
    { key: 'wor', label: 'WOR' },
    { key: 'hor', label: 'HOR' },
    { key: 'les', label: 'LES' },
    { key: 'sch', label: 'SCH' },
    { key: 'spr', label: 'SPR' },
  ];

  const totalAxes = keys.length;

  const getCoordinates = (index: number, ratio: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const r = radius * ratio;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = keys
    .map((item, idx) => {
      const val = Math.min(100, Math.max(0, stats[item.key] || 0));
      const { x, y } = getCoordinates(idx, val / 100);
      return `${x},${y}`;
    })
    .join(' ');

  const targetPoints = targetThreshold
    ? keys
        .map((_, idx) => {
          const { x, y } = getCoordinates(idx, targetThreshold / 100);
          return `${x},${y}`;
        })
        .join(' ')
    : null;

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="relative flex flex-col items-center justify-center font-hud select-none my-1">
      <svg width={size} height={size} className="overflow-visible">
        {gridLevels.map((level, i) => {
          const levelPoints = keys
            .map((_, idx) => {
              const { x, y } = getCoordinates(idx, level);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={i}
              points={levelPoints}
              fill="none"
              stroke="rgba(79, 195, 247, 0.15)"
              strokeWidth="1"
              strokeDasharray={i === 4 ? 'none' : '2 2'}
            />
          );
        })}

        {keys.map((_, idx) => {
          const { x, y } = getCoordinates(idx, 1.0);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(79, 195, 247, 0.2)"
              strokeWidth="1"
            />
          );
        })}

        {targetPoints && (
          <polygon
            points={targetPoints}
            fill="none"
            stroke="#FF5252"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-70"
          />
        )}

        <polygon
          points={polygonPoints}
          fill="rgba(79, 195, 247, 0.35)"
          stroke="#00E5FF"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_12px_#00E5FF] transition-all duration-500 ease-out"
        />

        {keys.map((item, idx) => {
          const val = Math.min(100, Math.max(0, stats[item.key] || 0));
          const pt = getCoordinates(idx, val / 100);
          const labelPt = getCoordinates(idx, 1.18);

          const isLowest = targetThreshold && val < targetThreshold;

          return (
            <g key={item.key}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={4}
                fill={isLowest ? '#FF5252' : '#00E5FF'}
                stroke="#060913"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_6px_#00E5FF]"
              />

              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[10px] font-bold tracking-wider ${
                  isLowest ? 'fill-red-400 font-black animate-pulse' : 'fill-cyan-300'
                }`}
              >
                {item.label} {val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};