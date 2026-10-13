import React, { useRef } from 'react';
import { LayoutDashboard, CheckCircle2, PenTool, Sun, Moon, LogOut, Compass, Sprout, Image, Download, Upload } from 'lucide-react';
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

  const menuItems: { id: ViewState; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'planner', label: 'Daily Plan', icon: LayoutDashboard }, 
    { id: 'wellness', label: 'Journal', icon: PenTool },
    { id: 'habits', label: 'Habits', icon: CheckCircle2 },
    { id: 'growth', label: 'Growth', icon: Sprout },
  ];

  const handleExport = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `balance-journal-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
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
            // Basic validation check
            if (parsedData.tasks && parsedData.user) {
              onImportData(parsedData);
              alert("Journal restored successfully!");
            } else {
              alert("Invalid file format.");
            }
          }
        } catch (error) {
          console.error(error);
          alert("Error parsing backup file.");
        }
      };
    }
  };

  return (
    <div className="flex flex-col h-full p-6 md:p-8 relative">
      {/* Hand-drawn Header */}
      <div className="mb-10 relative">
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-400/50 rounded-full"></div>
        <div className="pl-4">
          <h1 className="font-handwriting text-4xl text-zinc-800 dark:text-zinc-100 transform -rotate-2">
            {userName || 'My'}
          </h1>
          <h2 className="font-serif text-sm font-bold tracking-widest uppercase text-blue-500 mt-1 ml-1">
            Balance Journal
          </h2>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-6">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full text-left group flex items-center gap-4 p-2 transition-all duration-300 relative
                ${isActive ? 'pl-4' : 'pl-0 hover:pl-2'}
              `}
            >
              {/* Highlight effect for active state */}
              {isActive && (
                <div className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/20 transform -skew-x-6 rounded-md -z-10"></div>
              )}
              
              <div className={`
                w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors shadow-sm
                ${isActive 
                  ? 'border-blue-500 bg-white dark:bg-zinc-800 text-blue-500' 
                  : 'border-zinc-300 dark:border-zinc-600 text-zinc-400 group-hover:border-blue-300 group-hover:text-blue-400'}
              `}>
                <item.icon className="w-5 h-5" />
              </div>
              
              <span className={`font-handwriting text-2xl transition-colors ${isActive ? 'text-zinc-800 dark:text-zinc-100 font-bold' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto space-y-3 pt-6 border-t-2 border-dashed border-zinc-200 dark:border-zinc-700">
        
        {/* Backup Controls */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button 
            onClick={handleExport}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-600 dark:text-zinc-300"
            title="Download Backup"
          >
            <Download className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Backup</span>
          </button>
          
          <button 
            onClick={handleImportClick}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-600 dark:text-zinc-300"
            title="Restore Backup"
          >
            <Upload className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Restore</span>
          </button>
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden" 
          />
        </div>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors font-marker text-lg w-full px-2"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          onClick={onCycleTheme}
          className="flex items-center gap-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors font-marker text-lg w-full px-2"
        >
          <Image className="w-5 h-5" />
          <span>Switch Vibe</span>
        </button>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-500 transition-colors font-marker text-lg w-full px-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Close Journal</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;