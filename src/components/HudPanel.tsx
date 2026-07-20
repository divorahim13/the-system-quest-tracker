import React from 'react';
import { clsx } from 'clsx';

interface HudPanelProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'red';
  className?: string;
  notchSize?: 'sm' | 'md' | 'lg';
  showCornerAccent?: boolean;
}

export const HudPanel: React.FC<HudPanelProps> = ({
  children,
  variant = 'cyan',
  className = '',
  notchSize = 'md',
  showCornerAccent = true,
}) => {
  const notchClass = {
    sm: 'hud-notched-sm',
    md: 'hud-notched',
    lg: 'hud-notched-lg',
  }[notchSize];

  const variantClass = {
    cyan: 'panel-cyan',
    purple: 'panel-[#7C4DFF] panel-purple',
    red: 'panel-red',
  }[variant];

  const starAccentColor = {
    cyan: 'text-[#4FC3F7]/50',
    purple: 'text-[#7C4DFF]/50',
    red: 'text-[#FF5252]/50',
  }[variant];

  return (
    <div className={clsx('relative p-[1.5px]', notchClass, className)}>
      <div
        className={clsx(
          'relative w-full h-full p-4 sm:p-5 hud-scanlines backdrop-blur-md',
          notchClass,
          variantClass
        )}
      >
        {children}
        {showCornerAccent && (
          <div
            className={clsx(
              'absolute bottom-2 right-2 text-xs font-mono pointer-events-none select-none',
              starAccentColor
            )}
          >
            ✦
          </div>
        )}
      </div>
    </div>
  );
};

export const DiamondDivider: React.FC<{ count?: 1 | 3; variant?: 'cyan' | 'purple' | 'red'; className?: string }> = ({
  count = 1,
  variant = 'cyan',
  className = '',
}) => {
  const lineColor = {
    cyan: 'bg-[#4FC3F7]/30',
    purple: 'bg-[#7C4DFF]/30',
    red: 'bg-[#FF5252]/30',
  }[variant];

  const diamondColor = {
    cyan: 'border-[#4FC3F7] text-[#4FC3F7]',
    purple: 'border-[#7C4DFF] text-[#7C4DFF]',
    red: 'border-[#FF5252] text-[#FF5252]',
  }[variant];

  return (
    <div className={clsx('relative flex items-center my-3.5 w-full', className)}>
      <div className={clsx('flex-1 h-[1px]', lineColor)} />
      <div className="flex items-center gap-1.5 px-3">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={clsx(
              'inline-block w-1.5 h-1.5 rotate-45 border',
              diamondColor,
              i === Math.floor(count / 2) ? 'bg-[#4FC3F7]/60' : 'bg-transparent'
            )}
          />
        ))}
      </div>
      <div className={clsx('flex-1 h-[1px]', lineColor)} />
    </div>
  );
};