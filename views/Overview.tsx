import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AppData, Task, Habit, ViewState } from '../types';
import { CheckCircle2, Circle, TrendingUp, Sun, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { getDailyQuote } from '../services/gemini';
import DateNavigation from '../components/DateNavigation';

interface OverviewProps {
  date: Date;
  onDateChange: (date: Date) => void;
  data: AppData;
  onUpdateTask: (task: Task) => void;
  onUpdateHabit: (habitId: string, date: string) => void;
  onChangeView: (view: ViewState) => void;
}

const Overview: React.FC<OverviewProps> = ({ date, onDateChange, data, onUpdateTask, onUpdateHabit, onChangeView }) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const [quote, setQuote] = useState<string>('Loading inspiration...');

  // Filter data based on selected date
  const dateTasks = data.tasks.filter(t => t.date === formattedDate);
  const dateTasksCompleted = dateTasks.filter(t => t.completed);
  const priorityTasks = dateTasks.filter(t => !t.completed).sort((a, b) => {
    const pMap = { high: 3, medium: 2, low: 1 };
    return (pMap[b.priority || 'low'] || 0) - (pMap[a.priority || 'low'] || 0);
  }).slice(0, 3);
  
  const moodForDate = data.moods.find(m => m.date === formattedDate);

  useEffect(() => {
    let mounted = true;
    getDailyQuote().then(q => {
      if (mounted) setQuote(q);
    });
    return () => { mounted = false; };
  }, []);

  const calculateCompletion = () => {
    if (data.habits.length === 0) return 0;
    const completed = data.habits.filter(h => h.history[formattedDate]).length;
    return Math.round((completed / data.habits.length) * 100);
  };

  return (
    <div className="space-y-8 pb-24 md:pb-10 animate-fade-in font-marker">
      
      {/* Date Navigation & Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <DateNavigation date={date} onDateChange={onDateChange} />

        <div className="glass-card px-6 py-4 rounded-2xl max-w-md transform rotate-1 border-l-4 border-lavender-300 flex-1 w-full md:w-auto">
           <div className="flex gap-2">
             <Sparkles className="w-5 h-5 text-lavender-500 flex-shrink-0 mt-1" />
             <p className="text-lg text-zinc-600 dark:text-zinc-300 italic leading-relaxed">"{quote}"</p>
           </div>
        </div>
      </header>

      {/* Day at a Glance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Task Progress */}
        <div onClick={() => onChangeView('planner')} className="glass-card p-6 rounded-3xl cursor-pointer hover:-translate-y-1 transition-transform duration-300 border-2 border-transparent hover:border-blue-200 group">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-100/50 rounded-2xl text-blue-600 dark:text-blue-400">
               <CheckCircle2 className="w-6 h-6" />
             </div>
             <span className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500 uppercase tracking-wider font-handwriting">Schedule</span>
          </div>
          <div>
            <p className="text-5xl font-bold text-zinc-800 dark:text-zinc-100">
              {dateTasksCompleted.length}
              <span className="text-2xl text-zinc-400 font-normal"> / {dateTasks.length}</span>
            </p>
            <p className="text-zinc-400 mt-2 text-sm group-hover:text-blue-500 transition-colors font-bold flex items-center gap-1">
               Go to Plan <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Habit Progress */}
        <div onClick={() => onChangeView('habits')} className="glass-card p-6 rounded-3xl cursor-pointer hover:-translate-y-1 transition-transform duration-300 border-2 border-transparent hover:border-mint-200 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-mint-100/50 rounded-2xl text-emerald-600 dark:text-mint-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500 uppercase tracking-wider font-handwriting">Habits</span>
          </div>
          <div className="flex flex-col gap-2">
             <p className="text-5xl font-bold text-zinc-800 dark:text-zinc-100">{calculateCompletion()}%</p>
             <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200">
               <div className="h-full bg-mint-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${calculateCompletion()}%` }}></div>
             </div>
          </div>
        </div>

        {/* Mood Snapshot */}
        <div className="glass-card p-6 rounded-3xl border-2 border-transparent">
           <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-100/50 rounded-2xl text-amber-500 dark:text-amber-400">
              <Sun className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500 uppercase tracking-wider font-handwriting">Mood</span>
          </div>
          <p className="text-3xl text-zinc-800 dark:text-zinc-100 italic font-handwriting truncate">
            {moodForDate ? `"${moodForDate.note || 'Recorded'}"` : 'No entry yet'}
          </p>
          <div className="flex gap-1 mt-3">
             {[1,2,3,4,5].map(i => (
                <div key={i} className={`h-2 flex-1 rounded-full ${moodForDate && moodForDate.rating >= i ? 'bg-amber-400' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Focus */}
        <div className="glass-card p-8 rounded-[2rem] relative bg-white/40 dark:bg-zinc-900/40">
          <div className="absolute -top-3 -left-3 bg-yellow-200 w-32 h-8 rotate-[-5deg] opacity-50 -z-10"></div>
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-handwriting font-bold text-3xl text-zinc-800 dark:text-zinc-100">Today's Focus</h3>
             {priorityTasks.length > 0 && <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">High Priority</span>}
          </div>
          
          {priorityTasks.length > 0 ? (
            <div className="space-y-4">
              {priorityTasks.map(task => (
                <div key={task.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                  <button
                    onClick={() => onUpdateTask({ ...task, completed: !task.completed })}
                    className="text-zinc-300 hover:text-lavender-500 transition-colors"
                  >
                    <Circle className="w-7 h-7 stroke-2" />
                  </button>
                  <div className="flex-1">
                    <p className="font-bold text-zinc-700 dark:text-zinc-200 text-xl">{task.title}</p>
                    {task.timeBlock && <p className="text-sm text-lavender-500 font-bold">{task.timeBlock}</p>}
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${task.priority === 'high' ? 'bg-rose-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-48 text-zinc-400 border-2 border-dashed border-zinc-200 rounded-2xl">
                <Calendar className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xl italic">No pending tasks for today.</p>
                <button onClick={() => onChangeView('planner')} className="mt-2 text-sm font-bold text-blue-500 uppercase tracking-wider hover:underline">Add Tasks</button>
             </div>
          )}
        </div>

        {/* Quick Habits */}
        <div className="glass-card p-8 rounded-[2rem] bg-white/40 dark:bg-zinc-900/40">
          <h3 className="font-handwriting font-bold text-3xl text-zinc-800 dark:text-zinc-100 mb-6">Quick Check-in</h3>
          <div className="grid grid-cols-1 gap-3">
            {data.habits.slice(0, 4).map(habit => (
              <button
                key={habit.id}
                onClick={() => onUpdateHabit(habit.id, formattedDate)}
                className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden
                  ${habit.history[formattedDate]
                    ? 'bg-gradient-to-r from-mint-50 to-white dark:from-mint-900/20 dark:to-zinc-800/50 border-mint-200 dark:border-mint-900/50'
                    : 'bg-white/50 dark:bg-zinc-800/50 border-transparent hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-200'
                  }`}
              >
                <div className="flex items-center gap-4 z-10">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${habit.history[formattedDate] ? 'bg-mint-400 text-white shadow-lg shadow-mint-400/30' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-300'}`}>
                      {habit.history[formattedDate] ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                   </div>
                   <span className={`font-bold text-xl ${habit.history[formattedDate] ? 'text-zinc-800 dark:text-zinc-100 decoration-wavy line-through decoration-mint-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {habit.name}
                  </span>
                </div>
              </button>
            ))}
             <button onClick={() => onChangeView('habits')} className="w-full py-2 text-center text-zinc-400 hover:text-zinc-600 font-bold text-sm uppercase tracking-widest transition-colors">View All Habits</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;