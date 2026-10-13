import { AppData, Task, Habit, DayLog, JournalEntry, UserProfile } from '../types';

const STORAGE_KEY = 'find-your-balance-data-v3';
const USERS_KEY = 'find-your-balance-users';
const SESSION_KEY = 'find-your-balance-session';

export interface UserAccount {
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface UserSession {
  email: string;
  name: string;
  isGuest?: boolean;
}

const DEFAULT_DATA: AppData = {
  tasks: [
    {
      id: 'task-1',
      title: 'Morning stretch & deep breathing',
      completed: true,
      date: new Date().toISOString().slice(0, 10),
      category: 'self-care',
      priority: 'high',
    },
    {
      id: 'task-2',
      title: 'Complete focused work sprint',
      completed: false,
      date: new Date().toISOString().slice(0, 10),
      category: 'work',
      priority: 'high',
    },
    {
      id: 'task-3',
      title: 'Cook a healthy dinner with family',
      completed: false,
      date: new Date().toISOString().slice(0, 10),
      category: 'family',
      priority: 'medium',
    }
  ],
  habits: [
    { id: 'h1', name: 'Drink Water', icon: 'droplet', history: { [new Date().toISOString().slice(0, 10)]: true } },
    { id: 'h2', name: '10k Steps', icon: 'footprints', history: {} },
    { id: 'h3', name: 'Deep Breath', icon: 'wind', history: { [new Date().toISOString().slice(0, 10)]: true } },
    { id: 'h4', name: 'Skincare', icon: 'sparkles', history: {} },
    { id: 'h5', name: 'Journal', icon: 'book', history: { [new Date().toISOString().slice(0, 10)]: true } },
    { id: 'h6', name: 'Snack Healthy', icon: 'apple', history: {} },
  ],
  days: [
    {
      date: new Date().toISOString().slice(0, 10),
      intention: 'Cultivate balance and present mindfulness throughout today.',
      affirmation: 'I am grounded, capable, and at peace with my rhythm.',
      wins: 'Started the morning with intentional gratitude.',
      challenges: '',
      improvement: '',
      balance: { mind: 8, body: 7, work: 8, self: 9 },
      ratings: { work: 4, family: 5, selfCare: 5 }
    }
  ],
  moods: [
    {
      date: new Date().toISOString().slice(0, 10),
      rating: 5,
      note: 'Feeling refreshed and centered.',
      needs: 'A moment of stillness'
    }
  ],
  journal: [
    {
      id: 'j-today',
      date: new Date().toISOString().slice(0, 10),
      gratitude: 'Grateful for a quiet morning, a warm cup of tea, and clear thoughts.',
      highlights: 'Making time for self-reflection before starting tasks.',
      thoughts: 'Balance is not something we stumble upon; it is something we mindfully shape every hour.',
      tags: ['peace', 'mindfulness', 'gratitude']
    }
  ],
  goals: [
    {
      id: 'g-1',
      text: 'Maintain consistent daily morning routine',
      type: 'personal',
      year: new Date().getFullYear()
    }
  ],
  timeline: [],
  weeklyReflections: [],
  monthlyReflections: [],
  user: {
    name: 'Mindful User',
    theme: 'light',
  },
};

// --- USER SESSION MANAGEMENT ---

export const saveSession = (session: UserSession): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session', e);
  }
};

export const loadSession = (): UserSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load session', e);
    return null;
  }
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
};

// --- USER ACCOUNTS MANAGEMENT ---

export const loadUsers = (): Record<string, UserAccount> => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      // Seed default demo user for instant login
      const defaultUsers: Record<string, UserAccount> = {
        'demo@balance.app': {
          email: 'demo@balance.app',
          name: 'Mindful Traveler',
          password: 'balance123',
          createdAt: new Date().toISOString()
        }
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load users', e);
    return {};
  }
};

export const saveUsers = (users: Record<string, UserAccount>): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
};

// Helper for user-specific data storage key
const getUserDataKey = (email?: string): string => {
  if (!email || email === 'guest@balance.local') return STORAGE_KEY;
  return `${STORAGE_KEY}_${email.trim().toLowerCase()}`;
};

// --- AUTHENTICATION ACTIONS ---

export const localSignup = (
  email: string,
  pass: string,
  name: string,
  currentData?: AppData
): { success: boolean; message?: string; data: AppData } => {
  const cleanEmail = email.trim().toLowerCase();
  const users = loadUsers();

  if (users[cleanEmail]) {
    return {
      success: false,
      message: 'An account with this email already exists. Please sign in instead.',
      data: currentData || DEFAULT_DATA
    };
  }

  const displayName = name.trim() || cleanEmail.split('@')[0] || 'Mindful Soul';

  const newAccount: UserAccount = {
    email: cleanEmail,
    name: displayName,
    password: pass,
    createdAt: new Date().toISOString()
  };

  users[cleanEmail] = newAccount;
  saveUsers(users);

  // Initialize user's personal app data
  const userAppData: AppData = {
    ...(currentData || DEFAULT_DATA),
    user: {
      name: displayName,
      theme: currentData?.user?.theme || 'light'
    }
  };

  // Save under user-specific key and global active key
  saveData(userAppData, cleanEmail);

  // Save session
  saveSession({ email: cleanEmail, name: displayName });

  return { success: true, data: userAppData };
};

export const localLogin = (
  email: string,
  pass: string
): { success: boolean; message?: string; data?: AppData; name?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const users = loadUsers();

  const user = users[cleanEmail];
  if (!user) {
    return {
      success: false,
      message: 'No account found with this email. Switch to "Create Profile" to get started!'
    };
  }

  if (user.password !== pass) {
    return {
      success: false,
      message: 'Incorrect password. Please verify and try again.'
    };
  }

  // Load this user's data
  const userData = loadData(cleanEmail);
  const updatedData: AppData = {
    ...userData,
    user: {
      ...userData.user,
      name: user.name || userData.user.name
    }
  };

  // Save session
  saveSession({ email: cleanEmail, name: user.name });

  return {
    success: true,
    data: updatedData,
    name: user.name
  };
};

export const localGuestLogin = (currentData?: AppData): { success: boolean; data: AppData; name: string } => {
  const guestName = 'Mindful Guest';
  const guestData: AppData = {
    ...(currentData || loadData()),
    user: {
      name: guestName,
      theme: 'light'
    }
  };

  saveSession({
    email: 'guest@balance.local',
    name: guestName,
    isGuest: true
  });

  saveData(guestData);

  return {
    success: true,
    data: guestData,
    name: guestName
  };
};

// --- DATA PERSISTENCE ---

export const loadData = (userEmail?: string): AppData => {
  try {
    const key = getUserDataKey(userEmail);
    let data = localStorage.getItem(key);
    
    // If user-specific key is not found, fallback to main STORAGE_KEY
    if (!data && key !== STORAGE_KEY) {
      data = localStorage.getItem(STORAGE_KEY);
    }
    
    if (!data) return DEFAULT_DATA;
    
    const parsed = JSON.parse(data);
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
      user: {
        ...DEFAULT_DATA.user,
        ...(parsed.user || {})
      }
    };
  } catch (e) {
    console.error('Failed to load data', e);
    return DEFAULT_DATA;
  }
};

export const saveData = (data: AppData, userEmail?: string) => {
  try {
    const key = getUserDataKey(userEmail);
    localStorage.setItem(key, JSON.stringify(data));
    // Also keep main key in sync for offline/guest continuity
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
    return {
      intention: '',
      wins: '',
      challenges: '',
      improvement: '',
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