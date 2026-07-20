export type QuestLiveStatus = 'UPCOMING' | 'ACTIVE_NOW' | 'MISSED' | 'DONE';

export interface WIBTimeInfo {
  formattedTime: string;
  formattedDate: string;
  hours: number;
  minutes: number;
  seconds: number;
  totalMinutes: number;
  dateStr: string;
}

export function getCurrentWIBTime(): WIBTimeInfo {
  const now = new Date();

  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const parts = timeFormatter.formatToParts(now);
  let h = 0,
    m = 0,
    s = 0;

  parts.forEach((p) => {
    if (p.type === 'hour') h = parseInt(p.value, 10);
    if (p.type === 'minute') m = parseInt(p.value, 10);
    if (p.type === 'second') s = parseInt(p.value, 10);
  });

  const yearStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  const formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} WIB`;
  const formattedDate = dateFormatter.format(now);

  return {
    formattedTime,
    formattedDate,
    hours: h,
    minutes: m,
    seconds: s,
    totalMinutes: h * 60 + m,
    dateStr: yearStr,
  };
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim();
  const [hStr, mStr] = clean.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  return h * 60 + m;
}

export function computeQuestStatus(
  timeSlot: string | undefined,
  completed: boolean,
  currentMinutes: number
): QuestLiveStatus {
  if (completed) return 'DONE';
  if (!timeSlot) return 'UPCOMING';

  const parts = timeSlot.split(/–|-/);
  if (parts.length < 2) return 'UPCOMING';

  const startMin = parseTimeToMinutes(parts[0]);
  const endMin = parseTimeToMinutes(parts[1]);

  if (currentMinutes < startMin) return 'UPCOMING';
  if (currentMinutes >= startMin && currentMinutes <= endMin) return 'ACTIVE_NOW';
  return 'MISSED';
}

export function getNextQuestCountdown(
  quests: Array<{ name: string; timeSlot?: string; completed: boolean }>,
  currentMinutes: number
): { name: string; countdownText: string } | null {
  let upcomingQuests: Array<{ name: string; startMin: number }> = [];

  for (const q of quests) {
    if (q.completed || !q.timeSlot) continue;
    const parts = q.timeSlot.split(/–|-/);
    if (parts.length < 2) continue;
    const startMin = parseTimeToMinutes(parts[0]);

    if (startMin > currentMinutes) {
      upcomingQuests.push({ name: q.name, startMin });
    }
  }

  if (upcomingQuests.length === 0) return null;

  upcomingQuests.sort((a, b) => a.startMin - b.startMin);
  const next = upcomingQuests[0];
  const diffMinutes = next.startMin - currentMinutes;

  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;

  const countdownText =
    hours > 0 ? `in ${hours}h ${mins}m` : `in ${mins}m`;

  return { name: next.name, countdownText };
}