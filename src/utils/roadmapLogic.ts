import { LearningPhase, QuestTemplate, Quest, SleepDebuffState, SeparatedStreaks, UsedVerb } from '../types/system';

export const PHASES: LearningPhase[] = [
  {
    id: 1,
    name: 'Phase 1: B1 Intensiv',
    title: 'B1 Lehrling',
    startDate: '2026-07-21',
    endDate: '2026-08-31',
  },
  {
    id: 2,
    name: 'Phase 2: B2 Aufstieg',
    title: 'B2 Geselle',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
  },
  {
    id: 3,
    name: 'Phase 3: C1 Meisterschaft',
    title: 'C1 Meister',
    startDate: '2026-11-01',
    endDate: '2026-12-31',
  },
];

export const DEFAULT_QUEST_TEMPLATES: QuestTemplate[] = [
  {
    id: 'q-morgenroutine',
    title: 'Morgenroutine & Tagebuch',
    description: 'Wake up 06:00 & write Präteritum Tagebuch with novel verbs',
    category: 'SPRACHE',
    timeSlot: '06:00–06:30',
    recurrence: 'daily',
    xpValue: 25,
    isMandatory: true,
  },
  {
    id: 'q-commute-am',
    title: 'Unterwegs lernen (Commute AM)',
    description: 'Listen to German podcast/audio on motorcycle commute',
    category: 'SPRACHE',
    timeSlot: '07:00–08:00',
    recurrence: 'daily',
    xpValue: 15,
    isMandatory: true,
  },
  {
    id: 'q-commute-pm',
    title: 'Unterwegs lernen (Commute PM)',
    description: 'Listen to German audio on return commute',
    category: 'SPRACHE',
    timeSlot: '12:30–13:30',
    recurrence: 'daily',
    xpValue: 15,
    isMandatory: true,
  },
  {
    id: 'q-aktives-lernen',
    title: 'Aktives Lernen (Flashcards/Drills)',
    description: 'Active recall: flashcards, writing exercises, grammar drills',
    category: 'SPRACHE',
    timeSlot: '15:00–17:00',
    recurrence: 'daily',
    xpValue: 35,
    isMandatory: true,
  },
  {
    id: 'q-nachtruhe',
    title: 'Nachtruhe (Sleep Discipline)',
    description: 'Lights out 00:00, wake 06:00 (Phone charged outside bedroom)',
    category: 'DISCIPLINE',
    timeSlot: '23:30–00:00',
    recurrence: 'daily',
    xpValue: 20,
    isMandatory: true,
  },
  {
    id: 'q-saturday-review',
    title: 'Wiederholung (Spaced Repetition)',
    description: 'Spaced repetition review of ALL vocabulary & grammar from previous weeks',
    category: 'REVISION',
    timeSlot: 'Saturday',
    recurrence: 'saturday',
    xpValue: 60,
    isMandatory: true,
  },
  {
    id: 'q-sunday-simulation',
    title: 'Simulation (Past Exam Practice)',
    description: 'Full past-exam practice rotation (Lesen, Hören, Schreiben, Sprechen)',
    category: 'EXAM',
    timeSlot: 'Sunday',
    recurrence: 'sunday',
    xpValue: 80,
    isMandatory: true,
  },
  {
    id: 'q-kt-boss',
    title: 'Magna Kapiteltest (KT) Boss Fight',
    description: 'Log Magna Kapiteltest exam result (Target 25/25 per module)',
    category: 'EXAM',
    timeSlot: 'KT Dates',
    recurrence: 'boss_fight',
    xpValue: 150,
    isMandatory: true,
  },
  {
    id: 'q-c1-raid-boss',
    title: 'Goethe-Zertifikat C1 Raid Boss',
    description: 'Final C1 Certification Exam Raid Boss Fight',
    category: 'EXAM',
    timeSlot: 'Dec 2026',
    recurrence: 'raid_boss',
    activePhase: 3,
    xpValue: 500,
    isMandatory: true,
  },
];

export function getActivePhaseForDate(dateStr: string): LearningPhase {
  const targetDate = new Date(dateStr);

  for (const phase of PHASES) {
    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    if (targetDate >= start && targetDate <= end) {
      return phase;
    }
  }

  if (targetDate < new Date(PHASES[0].startDate)) return PHASES[0];
  return PHASES[2];
}

export function generateQuestsForDate(dateStr: string, completedLogIds: string[] = []): Quest[] {
  const dateObj = new Date(dateStr);
  const dayOfWeek = dateObj.getDay();
  const activePhase = getActivePhaseForDate(dateStr);

  const quests: Quest[] = [];

  for (const tpl of DEFAULT_QUEST_TEMPLATES) {
    if (tpl.activePhase && tpl.activePhase !== activePhase.id) {
      continue;
    }

    let include = false;
    if (tpl.recurrence === 'daily') {
      include = true;
    } else if (tpl.recurrence === 'saturday' && dayOfWeek === 6) {
      include = true;
    } else if (tpl.recurrence === 'sunday' && dayOfWeek === 0) {
      include = true;
    } else if (tpl.recurrence === 'boss_fight' || tpl.recurrence === 'raid_boss') {
      include = true;
    }

    if (include) {
      const isCompleted = completedLogIds.includes(tpl.id);
      quests.push({
        id: `quest-${tpl.id}`,
        templateId: tpl.id,
        name: tpl.title,
        timeSlot: tpl.timeSlot,
        category: tpl.category,
        xp: tpl.xpValue,
        completed: isCompleted,
        isMandatory: tpl.isMandatory,
      });
    }
  }

  return quests;
}

export function validateNovelVerbs(inputVerbs: string[], existingList: UsedVerb[]): { newVerbs: string[]; duplicateVerbs: string[] } {
  const existingSet = new Set(existingList.map((v) => v.verb.toLowerCase().trim()));
  const newVerbs: string[] = [];
  const duplicateVerbs: string[] = [];

  for (const verbRaw of inputVerbs) {
    const clean = verbRaw.toLowerCase().trim();
    if (!clean) continue;
    if (existingSet.has(clean)) {
      duplicateVerbs.push(clean);
    } else {
      newVerbs.push(clean);
    }
  }

  return { newVerbs, duplicateVerbs };
}