import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AppData, Task, Habit, MoodEntry } from '../types';
import { CheckCircle2, Circle, TrendingUp, Sun, Sparkles } from 'lucide-react';
import { getDailyQuote } from '../services/gemini';

interface DashboardProps {
  data: AppData;
  onUpdateTask: (task: Task) => void;
  onUpdateHabit: (habitId: string, date: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onUpdateTask, onUpdateHabit }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [quote, setQuote] = useState<string>('Loading inspiration...');

  const todayTasks = data.tasks.filter(t => t.date === today && !t.completed).slice(0, 3);
  const todayHabits = data.habits;
  const moodToday = data.moods.find(m => m.date === today);

  useEffect(() => {
    let mounted = true;
    getDailyQuote().then(q => {
      if (mounted) setQuote(q);
    });
    return () => { mounted = false; };
  }, []);

  const calculateCompletion = () => {
    if (data.habits.length === 0) return 0;
    const completed = data.habits.filter(h => h.history[today]).length;
    return Math.round((completed / data.habits.length) * 100);
  };

  return (
    <div className="space-y-8 pb-24 md:pb-10 animate-fade-in font-marker">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-5xl lg:text-6xl font-handwriting text-zinc-800 dark:text-zinc-100">
             Good Morning.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-bold tracking-wide text-xl transform -rotate-1">
            {format(new Date(), 'EEEE, MMMM do')}
          </p>
        </div>
        <div className="glass-card px-6 py-4 rounded-2xl max-w-md transform rotate-1 border-l-4 border-lavender-300">
           <div className="flex gap-2">
             <Sparkles className="w-5 h-5 text-lavender-500 flex-shrink-0 mt-1" />
             <p className="text-lg text-zinc-600 dark:text-zinc-300 italic leading-relaxed">"{quote}"</p>
           </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 border-2 border-transparent hover:border-zinc-200">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-100/50 rounded-2xl text-blue-600 dark:text-blue-400">
               <CheckCircle2 className="w-6 h-6" />
             </div>
             <span className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500 uppercase tracking-wider font-handwriting">Tasks</span>
          </div>
          <div>
            <p className="text-5xl font-bold text-zinc-800 dark:text-zinc-100">
              {data.tasks.filter(t => t.date === today && t.completed).length}
              <span className="text-2xl text-zinc-400 font-normal"> / {data.tasks.filter(t => t.date === today).length}</span>
            </p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 border-2 border-transparent hover:border-zinc-200">
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

        <div className="glass-card p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 border-2 border-transparent hover:border-zinc-200">
           <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-100/50 rounded-2xl text-amber-500 dark:text-amber-400">
              <Sun className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500 uppercase tracking-wider font-handwriting">Mood</span>
          </div>
          <p className="text-3xl text-zinc-800 dark:text-zinc-100 italic font-handwriting">
            {moodToday ? `"${moodToday.note?.substring(0, 30) || 'Logged'}"` : 'How are you?'}
          </p>
          <div className="flex gap-1 mt-3">
             {[1,2,3,4,5].map(i => (
                <div key={i} className={`h-2 flex-1 rounded-full ${moodToday && moodToday.rating >= i ? 'bg-amber-400' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Priorities */}
        <div className="glass-card p-8 rounded-[2rem] relative">
          <div className="absolute -top-3 -left-3 bg-yellow-200 w-32 h-8 rotate-[-5deg] opacity-50 -z-10"></div>
          <h3 className="font-handwriting font-bold text-3xl text-zinc-800 dark:text-zinc-100 mb-6">Priorities</h3>
          {todayTasks.length > 0 ? (
            <div className="space-y-4">
              {todayTasks.map(task => (
                <div key={task.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300 border-2 border-transparent hover:border-lavender-200 dark:hover:border-lavender-900/50 shadow-sm hover:shadow-md">
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
             <div className="flex flex-col items-center justify-center h-48 text-zinc-400">
                <p className="text-xl italic">All clear for now.</p>
             </div>
          )}
        </div>

        {/* Quick Habits */}
        <div className="glass-card p-8 rounded-[2rem]">
          <h3 className="font-handwriting font-bold text-3xl text-zinc-800 dark:text-zinc-100 mb-6">Habits</h3>
          <div className="grid grid-cols-1 gap-3">
            {todayHabits.map(habit => (
              <button
                key={habit.id}
                onClick={() => onUpdateHabit(habit.id, today)}
                className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden
                  ${habit.history[today]
                    ? 'bg-gradient-to-r from-mint-50 to-white dark:from-mint-900/20 dark:to-zinc-800/50 border-mint-200 dark:border-mint-900/50'
                    : 'bg-white/50 dark:bg-zinc-800/50 border-transparent hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-200'
                  }`}
              >
                <div className="flex items-center gap-4 z-10">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${habit.history[today] ? 'bg-mint-400 text-white shadow-lg shadow-mint-400/30' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-300'}`}>
                      {habit.history[today] ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                   </div>
                   <span className={`font-bold text-xl ${habit.history[today] ? 'text-zinc-800 dark:text-zinc-100 decoration-wavy line-through decoration-mint-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {habit.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;