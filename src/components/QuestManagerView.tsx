import React, { useState } from 'react';
import { QuestTemplate, StatKey, SkillStats } from '../types/system';
import { DEFAULT_QUEST_TEMPLATES } from '../utils/roadmapLogic';
import { HudPanel, DiamondDivider } from './HudPanel';
import { Plus, Edit, Trash2, Check, X, Shield, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface QuestManagerViewProps {
  templates?: QuestTemplate[];
  onSaveTemplate?: (template: QuestTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
}

export const QuestManagerView: React.FC<QuestManagerViewProps> = ({
  templates = DEFAULT_QUEST_TEMPLATES,
  onSaveTemplate,
  onDeleteTemplate,
}) => {
  const [editingTpl, setEditingTpl] = useState<QuestTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [titleInput, setTitleInput] = useState('');
  const [timeStartInput, setTimeStartInput] = useState('06:00');
  const [timeEndInput, setTimeEndInput] = useState('06:30');
  const [categoryInput, setCategoryInput] = useState('SPRACHE');
  const [xpInput, setXpInput] = useState(25);
  const [isWajibInput, setIsWajibInput] = useState(true);
  const [activePhaseInput, setActivePhaseInput] = useState<number | undefined>(undefined);
  const [statImpactInput, setStatImpactInput] = useState<Partial<Record<StatKey, number>>>({});

  const handleOpenEdit = (tpl: QuestTemplate) => {
    setEditingTpl(tpl);
    setIsCreating(false);
    setTitleInput(tpl.title);
    setTimeStartInput(tpl.timeSlot?.split(/–|-/)[0] || '06:00');
    setTimeEndInput(tpl.timeSlot?.split(/–|-/)[1] || '06:30');
    setCategoryInput(tpl.category);
    setXpInput(tpl.xpValue);
    setIsWajibInput(tpl.isMandatory);
    setActivePhaseInput(tpl.activePhase);
    setStatImpactInput(tpl.statImpact || {});
  };

  const handleOpenCreate = () => {
    setEditingTpl(null);
    setIsCreating(true);
    setTitleInput('');
    setTimeStartInput('08:00');
    setTimeEndInput('09:00');
    setCategoryInput('SPRACHE');
    setXpInput(20);
    setIsWajibInput(true);
    setActivePhaseInput(undefined);
    setStatImpactInput({});
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const newTpl: QuestTemplate = {
      id: editingTpl ? editingTpl.id : `tpl-${Date.now()}`,
      title: titleInput,
      category: categoryInput as any,
      timeSlot: `${timeStartInput}–${timeEndInput}`,
      recurrence: 'daily',
      xpValue: xpInput,
      isMandatory: isWajibInput,
      activePhase: activePhaseInput,
      statImpact: statImpactInput,
    };

    if (onSaveTemplate) {
      onSaveTemplate(newTpl);
    }

    setEditingTpl(null);
    setIsCreating(false);
  };

  const handleStatBoostChange = (key: StatKey, value: number) => {
    setStatImpactInput((prev) => ({
      ...prev,
      [key]: value > 0 ? value : undefined,
    }));
  };

  const statKeys: StatKey[] = ['gra', 'wor', 'hor', 'les', 'sch', 'spr'];

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-md mx-auto font-hud">
      <HudPanel variant="cyan" notchSize="md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="tracking-widest text-[#4FC3F7] text-lg sm:text-xl font-bold uppercase">
              QUEST MANAGER (CRUD)
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Kelola template quest harian, stat impact, & alokasi fase belajar:
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-3 py-1.5 bg-[#4FC3F7] text-slate-950 font-bold text-xs rounded flex items-center gap-1 hover:bg-[#00E5FF] shadow-[0_0_10px_#4FC3F7]"
          >
            <Plus className="w-4 h-4" /> NEW TEMPLATE
          </button>
        </div>

        <DiamondDivider count={1} variant="cyan" />

        <div className="space-y-2.5">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-3 bg-slate-900/60 border border-slate-800 rounded flex items-center justify-between gap-2 hover:border-[#4FC3F7]/50 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-[#4FC3F7] font-bold">[{tpl.timeSlot || '06:00-06:30'}]</span>
                  <span className="text-sm font-bold text-white truncate">{tpl.title}</span>
                </div>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {tpl.category}
                  </span>
                  <span className="text-[9px] font-bold text-yellow-300">
                    {tpl.isMandatory ? '(Wajib)' : '(Bonus)'}
                  </span>
                  {tpl.activePhase && (
                    <span className="text-[9px] font-bold text-purple-300 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800">
                      Phase {tpl.activePhase}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-xs font-bold text-[#4FC3F7]">{tpl.xpValue} XP</div>
                <button
                  onClick={() => handleOpenEdit(tpl)}
                  className="p-1 text-gray-400 hover:text-[#4FC3F7]"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {onDeleteTemplate && (
                  <button
                    onClick={() => onDeleteTemplate(tpl.id)}
                    className="p-1 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </HudPanel>

      {(isCreating || editingTpl) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#0C1A30] border-2 border-[#4FC3F7] p-5 rounded-md font-hud space-y-3 shadow-[0_0_30px_rgba(79,195,247,0.4)] overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#4FC3F7]/30 pb-2">
              <h3 className="text-base font-bold text-[#4FC3F7] uppercase tracking-wider">
                {isCreating ? 'CREATE QUEST TEMPLATE' : 'EDIT QUEST TEMPLATE'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingTpl(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">QUEST TITLE:</label>
                <input
                  type="text"
                  required
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full p-2 bg-black/60 border border-[#4FC3F7]/60 text-white rounded focus:outline-none focus:border-[#4FC3F7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">START TIME:</label>
                  <input
                    type="time"
                    required
                    value={timeStartInput}
                    onChange={(e) => setTimeStartInput(e.target.value)}
                    className="w-full p-2 bg-black/60 border border-[#4FC3F7]/60 text-white rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">END TIME:</label>
                  <input
                    type="time"
                    required
                    value={timeEndInput}
                    onChange={(e) => setTimeEndInput(e.target.value)}
                    className="w-full p-2 bg-black/60 border border-[#4FC3F7]/60 text-white rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">CATEGORY:</label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full p-2 bg-black/60 border border-[#4FC3F7]/60 text-white rounded focus:outline-none"
                  >
                    <option value="SPRACHE">SPRACHE</option>
                    <option value="DISCIPLINE">DISCIPLINE</option>
                    <option value="REVISION">REVISION</option>
                    <option value="EXAM">EXAM</option>
                    <option value="KÖRPER">KÖRPER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">XP VALUE:</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={xpInput}
                    onChange={(e) => setXpInput(parseInt(e.target.value, 10) || 20)}
                    className="w-full p-2 bg-black/60 border border-[#4FC3F7]/60 text-white rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="block text-[#4FC3F7] font-bold mb-1.5 uppercase">
                  STAT IMPACT (BONUS POINTS):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {statKeys.map((key) => (
                    <div key={key} className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase text-gray-400 w-8">{key}:</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={statImpactInput[key] || 0}
                        onChange={(e) => handleStatBoostChange(key, parseInt(e.target.value, 10) || 0)}
                        className="w-full p-1 text-center bg-black/60 border border-slate-700 text-white rounded focus:outline-none text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4FC3F7] text-slate-950 font-bold rounded hover:bg-[#00E5FF] w-full"
                >
                  SAVE TEMPLATE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};