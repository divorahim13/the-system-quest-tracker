import { createClient } from '@supabase/supabase-js';
import { SystemData } from '../types/system';
import { STORAGE_KEY, getTodayDateString } from './systemLogic';

const SUPABASE_URL = 'https://orgeczsahiqqoadacxpb.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ2VjenNhaGlxcW9hZGFjeHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1MzgwNzksImV4cCI6MjEwMDExNDA3OX0.tuHfzPnyvxtRufXayQ_irbDEkWDL1CooK2HMvxPVXW0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const RECORD_ID = 'the_system_player_divo';

export async function fetchSupabaseData(): Promise<SystemData | null> {
  try {
    const { data, error } = await supabase
      .from('system_data')
      .select('data')
      .eq('id', RECORD_ID)
      .single();

    if (error || !data || !data.data) {
      return null;
    }

    const fetched = data.data as SystemData;
    const today = getTodayDateString();

    if (!fetched.skillStats) {
      fetched.skillStats = { gra: 30, wor: 30, hor: 30, les: 30, sch: 30, spr: 30 };
    }
    if (!fetched.lastFedAt) {
      fetched.lastFedAt = { gra: today, wor: today, hor: today, les: today, sch: today, spr: today };
    }

    return fetched;
  } catch (err) {
    console.warn('Failed to fetch progress from Supabase cloud:', err);
    return null;
  }
}

export async function syncSupabaseData(systemData: SystemData): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(systemData));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }

  try {
    await supabase.from('system_data').upsert(
      {
        id: RECORD_ID,
        data: systemData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch (err) {
    console.warn('Background Supabase cloud sync error:', err);
  }
}

export function subscribeToCloudChanges(onUpdate: (newData: SystemData) => void) {
  const channel = supabase
    .channel('system_data_changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'system_data',
        filter: `id=eq.${RECORD_ID}`,
      },
      (payload) => {
        if (payload.new && payload.new.data) {
          const newData = payload.new.data as SystemData;
          const today = getTodayDateString();
          if (!newData.skillStats) {
            newData.skillStats = { gra: 30, wor: 30, hor: 30, les: 30, sch: 30, spr: 30 };
          }
          if (!newData.lastFedAt) {
            newData.lastFedAt = { gra: today, wor: today, hor: today, les: today, sch: today, spr: today };
          }
          onUpdate(newData);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}