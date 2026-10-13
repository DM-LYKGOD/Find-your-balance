import React, { useRef, useState } from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  PenTool, 
  Sun, 
  Moon, 
  LogOut, 
  Compass, 
  Sprout, 
  Image, 
  Download, 
  Upload,
  Check
} from 'lucide-react';
import { ViewState, AppData } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isDark: boolean;
  toggleTheme: () => void;
  userName: string;
  onLogout: () => void;
  onCycleTheme: () => void;
  data: AppData;
  onImportData: (data: AppData) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  isDark, 
  toggleTheme, 
  userName, 
  onLogout, 
  onCycleTheme,
  data,
  onImportData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const menuItems: { id: ViewState; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'planner', label: 'Daily Plan', icon: LayoutDashboard }, 
    { id: 'wellness', label: 'Journal', icon: PenTool },
    { id: 'habits', label: 'Habits', icon: CheckCircle2 },
    { id: 'growth', label: 'Growth', icon: Sprout },
  ];

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `balance-journal-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setNotification("Backup exported!");
    setTimeout(() => setNotification(null), 2500);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          if (event.target?.result) {
            const parsedData = JSON.parse(event.target.result as string);
            if (parsedData.tasks && parsedData.user) {
              onImportData(parsedData);
              setNotification("Journal restored successfully!");
              setTimeout(() => setNotification(null), 3000);
            } else {
              setNotification("Invalid backup format.");
              setTimeout(() => setNotification(null), 3000);
            }
          }
        } catch (error) {
          console.error(error);
          setNotification("Error parsing backup file.");
          setTimeout(() => setNotification(null), 3000);
        }
      };
    }
  };

  return (
    <aside className="flex flex-col h-full w-full p-4 md:p-5 relative overflow-y-auto custom-scrollbar select-none">
      
      {/* Hand-drawn Header */}
      <div className="mb-4 relative pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex items-start justify-between">
          <div className="relative pl-3">
            <div className="absolute -left-1 top-1 bottom-1 w-1 bg-gradient-to-b from-blue-400 to-lavender-400 rounded-full"></div>
            <h1 className="font-handwriting text-3xl md:text-4xl text-zinc-800 dark:text-zinc-100 transform -rotate-1 truncate max-w-[150px]">
              {userName || 'My'}
            </h1>
            <h2 className="font-serif text-[11px] font-bold tracking-widest uppercase text-blue-500 dark:text-blue-400 mt-0.5">
              Balance Journal
            </h2>
          </div>

          {/* Quick Dark Mode Pill Toggle in Header */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-all flex items-center gap-1.5 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="w-4 h-4 text-lavender-600 fill-lavender-600/20" />
            )}
            <span className="text-xs font-marker hidden sm:inline">
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1.5 md:space-y-2 mb-4" aria-label="Main Navigation">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full text-left group flex items-center gap-3 p-2 rounded-xl transition-all duration-200 relative cursor-pointer
                ${isActive 
                  ? 'bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold pl-3 shadow-xs' 
                  : 'hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg border flex items-center justify-center transition-colors shadow-2xs flex-shrink-0
                ${isActive 
                  ? 'border-blue-500 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400' 
                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-400 group-hover:border-blue-300 group-hover:text-blue-400'}
              `}>
                <item.icon className="w-4 h-4" />
              </div>
              
              <span className="font-handwriting text-xl truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer & Controls Area */}
      <div className="mt-auto pt-3 border-t-2 border-dashed border-zinc-200 dark:border-zinc-700/80 space-y-2">
        
        {notification && (
          <div className="p-1.5 text-xs text-center rounded-lg bg-lavender-100 dark:bg-lavender-900/40 text-lavender-700 dark:text-lavender-300 font-marker flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>{notification}</span>
          </div>
        )}

        {/* Theme Settings: Dedicated Dark Mode & Background Vibe Row */}
        <div className="space-y-1.5">
          {/* Main Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/70 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-200 transition-colors font-marker text-sm border border-zinc-200/50 dark:border-zinc-700/50 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              {isDark ? (
                <Moon className="w-4 h-4 text-lavender-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="font-semibold">Dark Mode</span>
            </div>
            
            {/* Toggle switch visual */}
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${isDark ? 'bg-lavender-600 justify-end' : 'bg-zinc-300 dark:bg-zinc-600 justify-start'}`}>
              <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
            </div>
          </button>

          {/* Switch Background Image Vibe */}
          <button
            onClick={onCycleTheme}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 transition-colors font-marker text-sm cursor-pointer"
          >
            <Image className="w-4 h-4 text-mint-500 flex-shrink-0" />
            <span>Switch Ambient Vibe</span>
          </button>
        </div>

        {/* Data Backup & Restore */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-600 dark:text-zinc-300 cursor-pointer"
            title="Download JSON Backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold font-marker uppercase">Backup</span>
          </button>
          
          <button 
            onClick={handleImportClick}
            className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-600 dark:text-zinc-300 cursor-pointer"
            title="Restore from JSON Backup"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold font-marker uppercase">Restore</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden" 
          />
        </div>

        {/* Dedicated, Prominent Log Out Button */}
        <div className="pt-1.5">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/50 transition-all font-marker text-base font-semibold shadow-2xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            title="Sign out and return to login"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Log Out</span>
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;