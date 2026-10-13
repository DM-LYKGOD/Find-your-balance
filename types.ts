export type Priority = 'low' | 'medium' | 'high';
export type TaskCategory = 'work' | 'family' | 'self-care';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO Date string YYYY-MM-DD
  category: TaskCategory;
  priority?: Priority;
  timeBlock?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon?: string; // e.g., 'water', 'steps'
  history: Record<string, boolean>; // date string key -> completed boolean
}

export interface DayLog {
  date: string;
  intention: string; // "Today's intention"
  affirmation: string;
  wins: string; // "What went well"
  challenges: string; // "What didn't go well"
  improvement: string; // "What can be improved"
  balance: {
    mind: number;
    body: number;
    work: number;
    self: number;
  };
  ratings: {
    work: number;
    family: number;
    selfCare: number;
  };
}

export interface MoodEntry {
  date: string;
  rating: number; // 1-5
  note?: string;
  needs?: string; // "What do I need right now?"
}

export interface JournalEntry {
  id: string;
  date: string;
  gratitude: string;
  highlights: string;
  thoughts: string;
  tags: string[];
}

export interface WeeklyReflection {
  id: string;
  weekStartDate: string;
  wins: string;
  challenges: string;
  lessons: string;
}

export interface MonthlyReflection {
  id: string;
  month: string; // YYYY-MM
  moodSummary: string;
  habitSuccess: string;
  growth: string;
  intention: string; // Monthly intention
  goals: {
    text: string;
    completed: boolean;
  }[];
}

export interface Goal {
  id: string;
  text: string;
  type: 'work' | 'family' | 'personal' | 'social';
  year: number;
}

export interface TimelineEntry {
  period: '10y' | '5y' | '1y' | '6m' | '1m';
  text: string;
}

export type ViewState = 'overview' | 'planner' | 'habits' | 'wellness' | 'growth';

export interface UserProfile {
  name: string;
  theme: 'light' | 'dark';
}

export interface AppData {
  tasks: Task[];
  habits: Habit[];
  days: DayLog[];
  moods: MoodEntry[];
  journal: JournalEntry[];
  goals: Goal[];
  timeline: TimelineEntry[];
  weeklyReflections: WeeklyReflection[];
  monthlyReflections: MonthlyReflection[];
  user: UserProfile;
}