import { AppData, Task, Habit, DayLog, JournalEntry, UserProfile } from '../types';

const STORAGE_KEY = 'find-your-balance-data-v3';

const DEFAULT_DATA: AppData = {
  tasks: [],
  habits: [
    { id: 'h1', name: 'Drink Water', icon: 'droplet', history: {} },
    { id: 'h2', name: '10k Steps', icon: 'footprints', history: {} },
    { id: 'h3', name: 'Deep Breath', icon: 'wind', history: {} },
    { id: 'h4', name: 'Skincare', icon: 'sparkles', history: {} },
    { id: 'h5', name: 'Journal', icon: 'book', history: {} },
    { id: 'h6', name: 'Snack Healthy', icon: 'apple', history: {} },
  ],
  days: [],
  moods: [],
  journal: [],
  goals: [],
  timeline: [],
  weeklyReflections: [],
  monthlyReflections: [],
  user: {
    name: '',
    theme: 'light',
  },
};

export const loadData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_DATA;
    
    const parsed = JSON.parse(data);
    // Migration helper: ensure new fields exist if loading old data
    return {
      ...DEFAULT_DATA,
      ...parsed,
      tasks: parsed.tasks || [],
      habits: parsed.habits || DEFAULT_DATA.habits,
      days: parsed.days || [],
      moods: parsed.moods || [],
      journal: parsed.journal || [],
      weeklyReflections: parsed.weeklyReflections || [],
      monthlyReflections: parsed.monthlyReflections || [],
    };
  } catch (e) {
    console.error('Failed to load data', e);
    return DEFAULT_DATA;
  }
};

export const saveData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
};

export const toggleHabitForDate = (data: AppData, habitId: string, date: string): AppData => {
  const habits = data.habits.map(h => {
    if (h.id === habitId) {
      const isCompleted = !!h.history[date];
      const newHistory = { ...h.history };
      if (isCompleted) {
        delete newHistory[date];
      } else {
        newHistory[date] = true;
      }
      return { ...h, history: newHistory };
    }
    return h;
  });
  return { ...data, habits };
};

export const getDayLog = (data: AppData, date: string): DayLog => {
  const existing = data.days.find(d => d.date === date);
  if (existing) {
    // Ensure all new fields exist if migrating from old version
    return {
      intention: '',
      wins: '',
      challenges: '',
      balance: { mind: 5, body: 5, work: 5, self: 5 },
      ...existing,
      ratings: existing.ratings || { work: 0, family: 0, selfCare: 0 }
    };
  }
  return {
    date,
    intention: '',
    affirmation: '',
    wins: '',
    challenges: '',
    improvement: '',
    balance: { mind: 5, body: 5, work: 5, self: 5 },
    ratings: { work: 0, family: 0, selfCare: 0 }
  };
};

export const updateDayLog = (data: AppData, log: DayLog): AppData => {
  const existingIndex = data.days.findIndex(d => d.date === log.date);
  let newDays = [...data.days];
  if (existingIndex >= 0) {
    newDays[existingIndex] = log;
  } else {
    newDays.push(log);
  }
  return { ...data, days: newDays };
};