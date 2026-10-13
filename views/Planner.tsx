import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { AppData, Task, TaskCategory, DayLog } from '../types';
import { Plus, Trash2, Sun, Star, CheckSquare, Square, Target, Smile, User, Briefcase, Activity } from 'lucide-react';
import { getDayLog } from '../services/storage';
import DateNavigation from '../components/DateNavigation';

interface PlannerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  data: AppData;
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateDayLog: (log: DayLog) => void;
}

const Planner: React.FC<PlannerProps> = ({ date, onDateChange, data, onAddTask, onUpdateTask, onDeleteTask, onUpdateDayLog }) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  const [dayLog, setDayLog] = useState<DayLog>(getDayLog(data, formattedDate));
  const [newTaskInput, setNewTaskInput] = useState<{ [key in TaskCategory]: string }>({ work: '', family: '', 'self-care': '' });

  // Sync state when date/data changes
  useEffect(() => {
    setDayLog(getDayLog(data, formattedDate));
  }, [formattedDate, data]);

  const handleUpdateLog = (field: keyof DayLog, value: any) => {
    const updated = { ...dayLog, [field]: value };
    setDayLog(updated); // Optimistic update
    onUpdateDayLog(updated);
  };

  const handleUpdateBalance = (area: keyof DayLog['balance'], value: number) => {
    const updated = { ...dayLog, balance: { ...dayLog.balance, [area]: value } };
    setDayLog(updated);
    onUpdateDayLog(updated);
  };

  const addTask = (category: TaskCategory) => {
    if (!newTaskInput[category].trim()) return;
    onAddTask({
      id: Math.random().toString(36).substring(7),
      title: newTaskInput[category],
      completed: false,
      date: formattedDate,
      category: category,
    });
    setNewTaskInput({ ...newTaskInput, [category]: '' });
  };

  const renderCategoryColumn = (category: TaskCategory, colorClass: string, title: string) => {
    const tasks = data.tasks.filter(t => t.date === formattedDate && t.category === category);
    
    return (
      <div className={`flex-1 flex flex-col h-full rounded-2xl ${colorClass} border border-black/5 shadow-sm overflow-hidden`}>
         {/* Header */}
         <div className="p-4 pb-2 shrink-0">
            <h4 className="text-center font-handwriting text-2xl font-bold text-zinc-700 capitalize">{title}</h4>
         </div>

         {/* Scrollable List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex items-start gap-2 group animate-fade-in">
                   <button onClick={() => onUpdateTask({ ...task, completed: !task.completed })} className="mt-1 text-zinc-500 hover:text-zinc-800 transition-colors shrink-0">
                      {task.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                   </button>
                   <span className={`font-marker text-lg leading-tight pt-0.5 break-words ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>
                     {task.title}
                   </span>
                   <button onClick={() => onDeleteTask(task.id)} className="ml-auto opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              ))}
              {/* Spacer for comfortable scrolling */}
              <div className="h-4"></div>
            </div>
         </div>
            
         {/* Pinned Input Area */}
         <div className="p-4 pt-2 shrink-0 bg-inherit/50 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity group">
               <Plus className="w-5 h-5 text-zinc-400 group-focus-within:text-zinc-600" />
               <input 
                 type="text" 
                 value={newTaskInput[category]}
                 onChange={(e) => setNewTaskInput({...newTaskInput, [category]: e.target.value})}
                 onKeyDown={(e) => e.key === 'Enter' && addTask(category)}
                 placeholder="Add item..."
                 className="bg-transparent border-b border-zinc-300 focus:border-zinc-500 w-full font-marker text-lg outline-none placeholder-zinc-400 transition-colors"
                 autoComplete="off"
               />
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col pb-24 md:pb-0 font-marker animate-fade-in">
      
      {/* Date Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
         <div className="flex items-center gap-4">
            <Sun className="w-8 h-8 text-yellow-500 animate-spin-slow" />
            <h2 className="text-4xl font-handwriting font-bold text-zinc-800 dark:text-zinc-100">Plan your day</h2>
         </div>
         <DateNavigation date={date} onDateChange={onDateChange} />
      </div>

      {/* Intention & Affirmation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 shrink-0">
        <div className="relative glass-card p-4 rounded-xl border-l-4 border-blue-400">
           <label className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2 mb-1">
             <Target className="w-4 h-4" /> Today's Main Intention
           </label>
           <input 
             type="text" 
             value={dayLog.intention || ''}
             onChange={(e) => handleUpdateLog('intention', e.target.value)}
             placeholder="One thing to focus on..."
             className="w-full bg-transparent border-none text-xl font-handwriting text-zinc-800 dark:text-zinc-200 outline-none placeholder-zinc-400"
           />
        </div>
        <div className="relative glass-card p-4 rounded-xl border-l-4 border-yellow-400">
           <label className="text-xs font-bold text-yellow-600 uppercase tracking-widest flex items-center gap-2 mb-1">
             <Smile className="w-4 h-4" /> Affirmation
           </label>
           <input 
             type="text" 
             value={dayLog.affirmation || ''}
             onChange={(e) => handleUpdateLog('affirmation', e.target.value)}
             placeholder="I am capable of..."
             className="w-full bg-transparent border-none text-xl font-handwriting text-zinc-800 dark:text-zinc-200 outline-none placeholder-zinc-400"
           />
        </div>
      </div>

      {/* Main 3 Columns - Scrollable Area */}
      <div className="flex-1 overflow-hidden flex flex-col gap-8 min-h-[400px]">
        
        <div className="flex-1 flex flex-col md:flex-row gap-4 h-full overflow-hidden">
           {renderCategoryColumn('work', 'bg-[#fdf6e3] dark:bg-yellow-900/10', 'Work & Priorities')}
           {renderCategoryColumn('family', 'bg-[#f0f4f8] dark:bg-blue-900/10', 'Family & Life')}
           {renderCategoryColumn('self-care', 'bg-[#f1f8e9] dark:bg-green-900/10', 'Self & Wellness')}
        </div>

        {/* Daily Reflection & Balance - Pushed to bottom of scroll or in flow? 
            Since we want columns to be tall, we might want reflection to be collapsible or just below.
            Given the constraints of a "Planner", usually the list is the main thing.
            Let's keep reflection but ensure lists take priority.
        */}
        <div className="shrink-0 space-y-6">
           <h3 className="font-handwriting text-2xl font-bold text-zinc-500 divider flex items-center gap-2">
             <span className="h-px bg-zinc-200 flex-1"></span>
             Evening Reflection
             <span className="h-px bg-zinc-200 flex-1"></span>
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-green-50/50 dark:bg-green-900/10">
                 <h5 className="font-bold text-sm text-green-700 dark:text-green-400 uppercase tracking-wider mb-2">What went well?</h5>
                 <textarea 
                   value={dayLog.wins || ''}
                   onChange={(e) => handleUpdateLog('wins', e.target.value)}
                   className="w-full bg-transparent resize-none outline-none font-marker text-lg h-20 text-zinc-700 dark:text-zinc-300"
                   placeholder="Small wins..."
                 />
              </div>
              <div className="glass-card p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-rose-50/50 dark:bg-rose-900/10">
                 <h5 className="font-bold text-sm text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-2">Challenges</h5>
                 <textarea 
                   value={dayLog.challenges || ''}
                   onChange={(e) => handleUpdateLog('challenges', e.target.value)}
                   className="w-full bg-transparent resize-none outline-none font-marker text-lg h-20 text-zinc-700 dark:text-zinc-300"
                   placeholder="What was hard..."
                 />
              </div>
              <div className="glass-card p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-blue-50/50 dark:bg-blue-900/10">
                 <h5 className="font-bold text-sm text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">Improvement</h5>
                 <textarea 
                   value={dayLog.improvement || ''}
                   onChange={(e) => handleUpdateLog('improvement', e.target.value)}
                   className="w-full bg-transparent resize-none outline-none font-marker text-lg h-20 text-zinc-700 dark:text-zinc-300"
                   placeholder="One change for tomorrow..."
                 />
              </div>
           </div>

           {/* Balance Check-in */}
           <div className="glass-card p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <h5 className="font-handwriting text-xl font-bold text-zinc-600 mb-4">Daily Balance Check</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { key: 'mind', label: 'Mind', icon: Star, color: 'text-purple-400' },
                   { key: 'body', label: 'Body', icon: Activity, color: 'text-green-400' },
                   { key: 'work', label: 'Work', icon: Briefcase, color: 'text-blue-400' },
                   { key: 'self', label: 'Self', icon: User, color: 'text-rose-400' },
                 ].map((area) => (
                   <div key={area.key} className="flex flex-col items-center gap-2">
                      <div className={`flex items-center gap-2 font-bold ${area.color}`}>
                         <area.icon className="w-4 h-4" /> {area.label}
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        // @ts-ignore
                        value={dayLog.balance[area.key]}
                        // @ts-ignore
                        onChange={(e) => handleUpdateBalance(area.key, parseInt(e.target.value))}
                        className="w-full accent-zinc-800 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs font-bold text-zinc-400">{
                        // @ts-ignore
                        dayLog.balance[area.key]
                      }/10</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>

    </div>
  );
};

export default Planner;