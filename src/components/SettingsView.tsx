import React, { useState } from 'react';
import { SystemData, ExamGates } from '../types/system';
import { HudPanel, DiamondDivider } from './HudPanel';
import { Settings, Save, Shield, Clock, Award, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface SettingsViewProps {
  data: SystemData;
  onUpdateSettings?: (updated: Partial<SystemData>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ data, onUpdateSettings }) => {
  const [playerNameInput, setPlayerNameInput] = useState(data.playerName || 'DIVO');
  const [graceTokensInput, setGraceTokensInput] = useState(data.graceTokens || 1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [magnaWindow, setMagnaWindow] = useState('08:00–12:30');
  const [streamWindow, setStreamWindow] = useState('19:00–23:00');
  const [commuteAMWindow, setCommuteAMWindow] = useState('07:00–08:00');
  const [commutePMWindow, setCommutePMWindow] = useState('12:30–13:30');

  const [thresholdD, setThresholdD] = useState(40);
  const [thresholdC, setThresholdC] = useState(55);
  const [thresholdB, setThresholdB] = useState(65);
  const [thresholdA, setThresholdA] = useState(75);
  const [thresholdS, setThresholdS] = useState(85);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSettings) {
      onUpdateSettings({
        playerName: playerNameInput,
        graceTokens: graceTokensInput,
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-md mx-auto font-hud">
      <HudPanel variant="cyan" notchSize="md">
        <div className="flex items-center justify-between">
          <h2 className="tracking-widest text-[#4FC3F7] text-lg sm:text-xl font-bold uppercase">
            SETTINGS & SCHEDULE CONFIG
          </h2>
          <Settings className="w-5 h-5 text-[#4FC3F7]" />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Konfigurasi jadwal kegiatan, token streak, dan ambang batas kualifikasi Rank:
        </p>

        <DiamondDivider count={1} variant="cyan" />

        <form onSubmit={handleSaveAll} className="space-y-4 text-xs">
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm border-b border-gray-800 pb-1">
              PLAYER PROFILE
            </h3>
            <div>
              <label className="block text-gray-400 mb-1">PLAYER NAME:</label>
              <input
                type="text"
                value={playerNameInput}
                onChange={(e) => setPlayerNameInput(e.target.value)}
                className="w-full p-2 bg-black/60 border border-[#4FC3F7]/60 text-white rounded font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm border-b border-gray-800 pb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#4FC3F7]" /> SCHEDULE TIME WINDOWS
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-400 mb-1">MAGNA GERMAN CLASS:</label>
                <input
                  type="text"
                  value={magnaWindow}
                  onChange={(e) => setMagnaWindow(e.target.value)}
                  className="w-full p-1.5 bg-black/60 border border-slate-800 text-white rounded"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">LIVE STREAMING:</label>
                <input
                  type="text"
                  value={streamWindow}
                  onChange={(e) => setStreamWindow(e.target.value)}
                  className="w-full p-1.5 bg-black/60 border border-slate-800 text-white rounded"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">COMMUTE AM:</label>
                <input
                  type="text"
                  value={commuteAMWindow}
                  onChange={(e) => setCommuteAMWindow(e.target.value)}
                  className="w-full p-1.5 bg-black/60 border border-slate-800 text-white rounded"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">COMMUTE PM:</label>
                <input
                  type="text"
                  value={commutePMWindow}
                  onChange={(e) => setCommutePMWindow(e.target.value)}
                  className="w-full p-1.5 bg-black/60 border border-slate-800 text-white rounded"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm border-b border-gray-800 pb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-yellow-400" /> GRACE TOKEN & REFILL
            </h3>

            <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <span className="text-gray-300 font-bold">GRACE TOKENS REMAINING:</span>
              <input
                type="number"
                min="0"
                max="10"
                value={graceTokensInput}
                onChange={(e) => setGraceTokensInput(parseInt(e.target.value, 10) || 0)}
                className="w-20 p-1 text-center bg-black/60 border border-yellow-400/60 text-yellow-300 font-bold rounded"
              />
            </div>
            <p className="text-[10px] text-gray-500">
              Aturan isi ulang: +1 Grace Token setiap 2 minggu (Refill otomatis berikutnya: 1 Agustus 2026).
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm border-b border-gray-800 pb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#4FC3F7]" /> RANK MINIMUM STAT THRESHOLDS
            </h3>

            <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
              <div className="p-2 bg-slate-900/60 border border-slate-800 rounded">
                <div className="text-[10px] text-gray-400 font-bold">D-RANK</div>
                <input
                  type="number"
                  value={thresholdD}
                  onChange={(e) => setThresholdD(parseInt(e.target.value, 10) || 40)}
                  className="w-full text-center bg-black/60 border border-slate-700 text-cyan-300 font-bold text-xs py-1 mt-1 rounded"
                />
              </div>

              <div className="p-2 bg-slate-900/60 border border-slate-800 rounded">
                <div className="text-[10px] text-gray-400 font-bold">C-RANK</div>
                <input
                  type="number"
                  value={thresholdC}
                  onChange={(e) => setThresholdC(parseInt(e.target.value, 10) || 55)}
                  className="w-full text-center bg-black/60 border border-slate-700 text-cyan-300 font-bold text-xs py-1 mt-1 rounded"
                />
              </div>

              <div className="p-2 bg-slate-900/60 border border-slate-800 rounded">
                <div className="text-[10px] text-gray-400 font-bold">B-RANK</div>
                <input
                  type="number"
                  value={thresholdB}
                  onChange={(e) => setThresholdB(parseInt(e.target.value, 10) || 65)}
                  className="w-full text-center bg-black/60 border border-slate-700 text-cyan-300 font-bold text-xs py-1 mt-1 rounded"
                />
              </div>

              <div className="p-2 bg-slate-900/60 border border-slate-800 rounded">
                <div className="text-[10px] text-gray-400 font-bold">A-RANK</div>
                <input
                  type="number"
                  value={thresholdA}
                  onChange={(e) => setThresholdA(parseInt(e.target.value, 10) || 75)}
                  className="w-full text-center bg-black/60 border border-slate-700 text-cyan-300 font-bold text-xs py-1 mt-1 rounded"
                />
              </div>

              <div className="p-2 bg-slate-900/60 border border-slate-800 rounded">
                <div className="text-[10px] text-gray-400 font-bold">S-RANK</div>
                <input
                  type="number"
                  value={thresholdS}
                  onChange={(e) => setThresholdS(parseInt(e.target.value, 10) || 85)}
                  className="w-full text-center bg-black/60 border border-slate-700 text-cyan-300 font-bold text-xs py-1 mt-1 rounded"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#4FC3F7] text-slate-950 font-bold rounded flex items-center justify-center gap-1.5 hover:bg-[#00E5FF] transition-all shadow-[0_0_12px_#4FC3F7]"
            >
              <Save className="w-4 h-4" /> SAVE ALL SETTINGS
            </button>
            {savedSuccess && (
              <div className="text-center text-[#00E5FF] font-bold text-xs mt-2 flex items-center justify-center gap-1 animate-pulse">
                <Check className="w-4 h-4" /> Settings updated successfully!
              </div>
            )}
          </div>
        </form>
      </HudPanel>
    </div>
  );
};