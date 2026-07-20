import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BarChart3, Plus, RotateCcw, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { Quest } from '../types/system';

interface NavbarProps {
  activeTab: 'dashboard' | 'stats';
  onTabChange: (tab: 'dashboard' | 'stats') => void;
  onSaveQuest: (questData: Partial<Quest>, editId?: string) => void;
  editingQuest: Quest | null;
  onCloseEditQuest: () => void;
  onQuickXP: (amount: number) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onSaveQuest,
  editingQuest,
  onCloseEditQuest,
  onQuickXP,
  onResetData,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [timeSlotInput, setTimeSlotInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [durationInput, setDurationInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<'KÖRPER' | 'SPRACHE' | 'CONTENT' | 'OTHER'>('SPRACHE');
  const [xpInput, setXpInput] = useState('25');
  const [isMandatoryInput, setIsMandatoryInput] = useState(true);

  useEffect(() => {
    if (editingQuest) {
      setTimeSlotInput(editingQuest.timeSlot || '');
      setNameInput(editingQuest.name);
      setDurationInput(editingQuest.duration || '');
      setCategoryInput(editingQuest.category);
      setXpInput(String(editingQuest.xp));
      setIsMandatoryInput(editingQuest.isMandatory);
      setShowAddModal(true);
    }
  }, [editingQuest]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    onSaveQuest(
      {
        timeSlot: timeSlotInput.trim() || undefined,
        name: nameInput.trim(),
        duration: durationInput.trim() || undefined,
        category: categoryInput,
        xp: parseInt(xpInput, 10) || 20,
        isMandatory: isMandatoryInput,
      },
      editingQuest ? editingQuest.id : undefined
    );

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    onCloseEditQuest();
    setTimeSlotInput('');
    setNameInput('');
    setDurationInput('');
    setCategoryInput('SPRACHE');
    setXpInput('25');
    setIsMandatoryInput(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full max-w-md mx-auto mb-4 backdrop-blur-md bg-[#060913]/80 border-b border-[#4FC3F7]/30 py-2.5 px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-hud font-black text-base sm:text-lg text-white tracking-widest uppercase">
            <span className="text-[#4FC3F7] animate-pulse">❖</span>
            <span className="glow-text-cyan">THE SYSTEM</span>
          </div>

          <div className="flex items-center gap-1.5 font-hud">
            <button
              onClick={() => onQuickXP(100)}
              className="px-2 py-1 bg-cyan-950/60 border border-[#4FC3F7]/50 text-[#4FC3F7] rounded text-[11px] font-bold hover:bg-[#4FC3F7]/20 transition-all flex items-center gap-1"
              title="Add +100 XP Test"
            >
              <Zap className="w-3 h-3" /> +100 XP
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="p-1.5 bg-[#4FC3F7]/10 border border-[#4FC3F7]/50 text-[#4FC3F7] rounded hover:bg-[#4FC3F7]/20 transition-all"
              title="Add Custom Quest"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              onClick={onResetData}
              className="p-1.5 bg-slate-900 border border-slate-700 text-gray-400 hover:text-red-400 hover:border-red-500/50 rounded transition-all"
              title="Reset System Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2.5">
          <button
            onClick={() => onTabChange('dashboard')}
            className={clsx(
              'py-2 px-3 font-hud font-bold text-xs sm:text-sm tracking-widest uppercase rounded transition-all duration-200 flex items-center justify-center gap-2 border',
              activeTab === 'dashboard'
                ? 'bg-[#0A1A33] border-[#4FC3F7] text-white shadow-[0_0_12px_rgba(79,195,247,0.3)]'
                : 'bg-black/40 border-slate-800 text-gray-400 hover:text-gray-200 hover:border-slate-700'
            )}
          >
            <LayoutDashboard className="w-4 h-4 text-[#4FC3F7]" />
            <span>DASHBOARD</span>
          </button>

          <button
            onClick={() => onTabChange('stats')}
            className={clsx(
              'py-2 px-3 font-hud font-bold text-xs sm:text-sm tracking-widest uppercase rounded transition-all duration-200 flex items-center justify-center gap-2 border',
              activeTab === 'stats'
                ? 'bg-[#0A1A33] border-[#4FC3F7] text-white shadow-[0_0_12px_rgba(79,195,247,0.3)]'
                : 'bg-black/40 border-slate-800 text-gray-400 hover:text-gray-200 hover:border-slate-700'
            )}
          >
            <BarChart3 className="w-4 h-4 text-[#4FC3F7]" />
            <span>STATS & TITLES</span>
          </button>
        </div>
      </header>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs sm:max-w-sm bg-[#0B1528] border-2 border-[#4FC3F7] p-5 rounded-md shadow-[0_0_30px_rgba(79,195,247,0.4)] font-hud">
            <h3 className="text-lg font-bold text-[#4FC3F7] tracking-widest uppercase mb-4">
              {editingQuest ? 'EDIT QUEST' : 'ADD NEW QUEST'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">TIME SLOT (OPTIONAL):</label>
                <input
                  type="text"
                  placeholder="e.g. 07:00–08:00"
                  value={timeSlotInput}
                  onChange={(e) => setTimeSlotInput(e.target.value)}
                  className="w-full p-2 bg-black/60 border border-[#4FC3F7]/50 rounded text-white focus:outline-none focus:border-[#4FC3F7]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">QUEST NAME:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 Vocab Cards"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2 bg-black/60 border border-[#4FC3F7]/50 rounded text-white focus:outline-none focus:border-[#4FC3F7]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">DURATION (OPTIONAL):</label>
                <input
                  type="text"
                  placeholder="e.g. 30 min"
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  className="w-full p-2 bg-black/60 border border-[#4FC3F7]/50 rounded text-white focus:outline-none focus:border-[#4FC3F7]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">CATEGORY:</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value as any)}
                  className="w-full p-2 bg-black/60 border border-[#4FC3F7]/50 rounded text-white focus:outline-none focus:border-[#4FC3F7]"
                >
                  <option value="SPRACHE">SPRACHE (Language)</option>
                  <option value="KÖRPER">KÖRPER (Exercise)</option>
                  <option value="CONTENT">CONTENT (Creation)</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">XP REWARD:</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={xpInput}
                  onChange={(e) => setXpInput(e.target.value)}
                  className="w-full p-2 bg-black/60 border border-[#4FC3F7]/50 rounded text-[#4FC3F7] font-bold focus:outline-none focus:border-[#4FC3F7]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mandatoryCheck"
                  checked={isMandatoryInput}
                  onChange={(e) => setIsMandatoryInput(e.target.checked)}
                  className="w-4 h-4 accent-[#4FC3F7] cursor-pointer"
                />
                <label htmlFor="mandatoryCheck" className="text-gray-300 font-semibold cursor-pointer">
                  Quest Wajib (Block Streak jika terlewat)
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#4FC3F7] text-slate-950 font-bold rounded hover:bg-[#00E5FF] transition-all shadow-[0_0_10px_#4FC3F7]"
                >
                  {editingQuest ? 'SIMPAN PERUBAHAN' : 'ADD QUEST'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-800 text-gray-300 font-bold rounded hover:bg-slate-700"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};