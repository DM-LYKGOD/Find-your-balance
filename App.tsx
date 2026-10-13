import React, { useState, useEffect, useRef } from 'react';
import { ViewState, AppData, Task, Habit, DayLog, JournalEntry, WeeklyReflection, MonthlyReflection } from './types';
import Sidebar from './components/Sidebar';
import Planner from './views/Planner';
import Habits from './views/Habits';
import Wellness from './views/Wellness';
import Overview from './views/Overview';
import Growth from './views/Growth';
import Login from './components/Login';
import { 
  loadData, 
  saveData, 
  toggleHabitForDate, 
  updateDayLog,
  loadSession,
  saveSession,
  clearSession,
  localSignup,
  localLogin,
  localGuestLogin
} from './services/storage';
import { initGoogleAuth, dbLogin, dbSignup, dbSave, isGoogleAuthorized } from './services/sheets';
import { Image, X } from 'lucide-react';

// Cool Blue & White Backgrounds
const BACKGROUNDS = {
  marble: "https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?q=80&w=1974&auto=format&fit=crop", 
  clouds: "https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?q=80&w=2071&auto=format&fit=crop", 
  ocean: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
  botanical: "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=2000&auto=format&fit=crop",
  sunset: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
  white_desk: "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=2054&auto=format&fit=crop",
  frost: "https://images.unsplash.com/photo-1486326658981-5120537042a9?q=80&w=2070&auto=format&fit=crop",
  minimal: "", 
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(loadData());
  const [currentView, setCurrentView] = useState<ViewState>('overview');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bgTheme, setBgTheme] = useState<keyof typeof BACKGROUNDS>('marble');
  
  // Cloud / Auth State
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);

  // Debounce ref for saving
  const saveTimeoutRef = useRef<number | null>(null);

  // Initialize theme
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Restore Active User Session on Mount
  useEffect(() => {
    const existingSession = loadSession();
    if (existingSession) {
      setUserEmail(existingSession.email);
      const userSavedData = loadData(existingSession.email);
      setData(userSavedData);
      setIsLoggedIn(true);
    }
  }, []);

  // Safe Google Auth check in background (non-blocking)
  useEffect(() => {
    initGoogleAuth((success, msg) => {
      if (success) {
        console.info("Google Cloud Sync connected.");
      } else {
        // Safe fallback - offline/local persistence is active
        console.info("Running in offline-first mode:", msg);
      }
    });
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Main Data Persistence Effect (Local + Optional Cloud)
  useEffect(() => {
    if (isLoggedIn) {
      // 1. Save locally with active user isolation
      saveData(data, userEmail || undefined);

      // 2. Save to Google Sheets if user connected Google OAuth
      if (userEmail && isGoogleAuthorized()) {
        if (saveTimeoutRef.current) {
          window.clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = window.setTimeout(() => {
          dbSave(userEmail, data);
        }, 2000);
      }
    }
  }, [data, isLoggedIn, userEmail]);

  // Handlers
  const handleAddTask = (task: Task) => setData(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
  const handleUpdateTask = (updatedTask: Task) => setData(prev => ({...prev, tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)}));
  const handleDeleteTask = (taskId: string) => setData(prev => ({...prev, tasks: prev.tasks.filter(t => t.id !== taskId)}));
  
  const handleUpdateHabit = (habitId: string, date: string) => setData(prev => toggleHabitForDate(prev, habitId, date));
  
  const handleUpdateDayLog = (log: DayLog) => setData(prev => updateDayLog(prev, log));

  const handleLogJournal = (entry: JournalEntry) => setData(prev => {
     const exists = prev.journal.find(j => j.date === entry.date);
     if (exists) {
       return { ...prev, journal: prev.journal.map(j => j.date === entry.date ? entry : j) };
     }
     return { ...prev, journal: [...prev.journal, entry] };
  });

  const handleUpdateWeeklyReflection = (reflection: WeeklyReflection) => {
    setData(prev => {
       const exists = prev.weeklyReflections.find(r => r.id === reflection.id);
       if (exists) {
         return { ...prev, weeklyReflections: prev.weeklyReflections.map(r => r.id === reflection.id ? reflection : r) };
       }
       return { ...prev, weeklyReflections: [...prev.weeklyReflections, reflection] };
    });
  };

  const handleUpdateMonthlyReflection = (reflection: MonthlyReflection) => {
    setData(prev => {
       const exists = prev.monthlyReflections.find(r => r.id === reflection.id);
       if (exists) {
         return { ...prev, monthlyReflections: prev.monthlyReflections.map(r => r.id === reflection.id ? reflection : r) };
       }
       return { ...prev, monthlyReflections: [...prev.monthlyReflections, reflection] };
    });
  };

  const cycleBackground = () => {
    const keys = Object.keys(BACKGROUNDS) as (keyof typeof BACKGROUNDS)[];
    const currentIndex = keys.indexOf(bgTheme);
    const nextIndex = (currentIndex + 1) % keys.length;
    setBgTheme(keys[nextIndex]);
  };

  // --- Auth Flow ---

  const handleAppLogin = async (name: string, email: string, pass: string, isSignUp: boolean) => {
    const cleanEmail = email.trim();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      setLoginError("Please enter both email and password.");
      return;
    }

    setLoginError(null);
    setIsProcessingLogin(true);

    try {
      if (isSignUp) {
        const res = localSignup(cleanEmail, cleanPass, name, data);
        if (res.success) {
          setUserEmail(cleanEmail.toLowerCase());
          setData(res.data);
          setIsLoggedIn(true);
          setLoginError(null);

          // If Google Cloud Sync is authorized, mirror in background
          if (isGoogleAuthorized()) {
            dbSignup(cleanEmail.toLowerCase(), cleanPass, name || cleanEmail, res.data).catch(console.warn);
          }
        } else {
          setLoginError(res.message || "Failed to create account. Please try again.");
        }
      } else {
        const res = localLogin(cleanEmail, cleanPass);
        if (res.success && res.data) {
          setUserEmail(cleanEmail.toLowerCase());
          setData(res.data);
          setIsLoggedIn(true);
          setLoginError(null);
        } else {
          // Fallback check against Google Sheets if authorized
          if (isGoogleAuthorized()) {
            const cloudRes = await dbLogin(cleanEmail, cleanPass);
            if (cloudRes.success && cloudRes.data) {
              setUserEmail(cleanEmail.toLowerCase());
              setData(cloudRes.data);
              setIsLoggedIn(true);
              setLoginError(null);
              saveData(cloudRes.data, cleanEmail.toLowerCase());
              saveSession({ email: cleanEmail.toLowerCase(), name: cloudRes.name || cloudRes.data.user.name });
              return;
            }
          }
          setLoginError(res.message || "Login failed. Please check your credentials.");
        }
      }
    } catch (err: any) {
      console.error("Auth error", err);
      setLoginError(err.message || "An unexpected error occurred during authentication.");
    } finally {
      setIsProcessingLogin(false);
    }
  };

  const handleGuestLogin = () => {
    const res = localGuestLogin(data);
    setUserEmail('guest@balance.local');
    setData(res.data);
    setIsLoggedIn(true);
    setLoginError(null);
  };

  const handleLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    setUserEmail(null);
    setLoginError(null);
    setCurrentView('overview');
    setSelectedDate(new Date());
  };

  const handleImportData = (newData: AppData) => {
    setData(newData);
    saveData(newData, userEmail || undefined);
  };

  const renderView = () => {
    const commonProps = {
      date: selectedDate,
      onDateChange: setSelectedDate,
      data: data
    };

    switch (currentView) {
      case 'overview': 
        return <Overview {...commonProps} onUpdateTask={handleUpdateTask} onUpdateHabit={handleUpdateHabit} onChangeView={setCurrentView} />;
      case 'planner': 
        return <Planner {...commonProps} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onUpdateDayLog={handleUpdateDayLog} />;
      case 'wellness': 
        return <Wellness {...commonProps} onLogJournal={handleLogJournal} />;
      case 'habits': 
        return <Habits {...commonProps} onUpdateHabit={handleUpdateHabit} />;
      case 'growth':
        return <Growth data={data} onUpdateWeekly={handleUpdateWeeklyReflection} onUpdateMonthly={handleUpdateMonthlyReflection} />;
      default: 
        return <Overview {...commonProps} onUpdateTask={handleUpdateTask} onUpdateHabit={handleUpdateHabit} onChangeView={setCurrentView} />;
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 font-marker transition-colors duration-500 book-perspective">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: BACKGROUNDS[bgTheme] ? `url(${BACKGROUNDS[bgTheme]})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: BACKGROUNDS[bgTheme] ? (isDark ? 0.3 : 1) : 0,
        }}
      />
      
      {/* Fallback/Overlay Gradients */}
      <div className={`absolute inset-0 z-0 pointer-events-none ${BACKGROUNDS[bgTheme] ? 'backdrop-blur-[0px]' : 'bg-blue-50 dark:bg-zinc-900'}`}></div>

      {/* Main App Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-0 md:p-6 lg:p-8">

        {!isLoggedIn ? (
           <Login 
             onLogin={handleAppLogin} 
             onGuestLogin={handleGuestLogin}
             isLoading={isProcessingLogin}
             error={loginError}
           />
        ) : (
          <div className="animate-fade-in w-full max-w-7xl h-full md:h-[90vh] flex flex-col md:flex-row relative">
            
            {/* Theme Toggle Floating Button */}
            <button 
              onClick={cycleBackground}
              className="fixed top-4 right-4 z-50 p-3 bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded-full shadow-lg hover:scale-110 transition-transform text-zinc-600 dark:text-zinc-300 md:hidden cursor-pointer"
              title="Change Background"
            >
              <Image className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
             <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded-full shadow-lg text-zinc-600 cursor-pointer"
            >
              <span className="font-handwriting font-bold text-2xl">Menu</span>
            </button>

             {/* Mobile Sidebar Drawer */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="bg-white dark:bg-zinc-900 w-72 h-full p-4 paper-texture shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                   <div className="flex justify-end mb-2">
                     <button onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                       <X className="w-5 h-5" />
                     </button>
                   </div>
                   <div className="flex-1 overflow-y-auto">
                     <Sidebar 
                        currentView={currentView} 
                        onChangeView={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }}
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                        userName={data.user.name}
                        onLogout={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                        onCycleTheme={cycleBackground}
                        data={data}
                        onImportData={handleImportData}
                      />
                   </div>
                </div>
              </div>
            )}

            {/* THE OPEN NOTEBOOK CONTAINER */}
            <div className="relative w-full h-full md:bg-white/70 md:dark:bg-black/60 md:backdrop-blur-xl md:rounded-[2rem] md:shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] flex overflow-hidden journal-shadow transition-all duration-500">
              
              {/* Left Page (Sidebar) - Desktop Only */}
              <div className="hidden md:block w-1/4 min-w-[260px] h-full relative border-r border-zinc-300/30 dark:border-zinc-700/30 paper-texture z-10 bg-white/40 dark:bg-black/40">
                 <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none"></div>
                 <Sidebar 
                    currentView={currentView} 
                    onChangeView={setCurrentView}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    userName={data.user.name}
                    onLogout={handleLogout}
                    onCycleTheme={cycleBackground}
                    data={data}
                    onImportData={handleImportData}
                  />
              </div>

              {/* Central Spiral Spine */}
              <div className="hidden md:flex flex-col items-center justify-center py-10 absolute left-[25%] top-0 bottom-0 w-14 -ml-7 z-20 pointer-events-none">
                 <div className="h-full flex flex-col justify-between py-4">
                   {[...Array(10)].map((_, i) => (
                     <div key={i} className="w-16 h-8 relative">
                       {/* The Ring */}
                       <div className="absolute left-2 top-2 w-12 h-6 rounded-[100%] border-[4px] border-zinc-400 dark:border-zinc-600 bg-transparent shadow-[1px_1px_2px_rgba(0,0,0,0.3)] transform -rotate-6 z-20"></div>
                       {/* The Holes */}
                       <div className="absolute left-0 top-3 w-3 h-3 rounded-full bg-zinc-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]"></div>
                       <div className="absolute right-0 top-4 w-3 h-3 rounded-full bg-zinc-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]"></div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Right Page (Content) */}
              <div className="flex-1 h-full relative paper-texture bg-transparent">
                 {/* Inner Page Shadow/Fold Effect */}
                 <div className="hidden md:block absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-10"></div>
                 
                 {/* Content Area */}
                 <div className="h-full overflow-y-auto custom-scrollbar p-4 pt-20 md:p-10 md:pt-10 scroll-smooth">
                    <div className="max-w-4xl mx-auto min-h-full">
                      {renderView()}
                    </div>
                 </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default App;