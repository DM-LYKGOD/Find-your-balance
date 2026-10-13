import React, { useState } from 'react';
import { AppData, MonthlyReflection, WeeklyReflection } from '../types';
import { Target, Calendar, BarChart2, BookOpen, Star, RefreshCcw } from 'lucide-react';
import { format, startOfWeek, endOfWeek, subWeeks, addWeeks, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface GrowthProps {
  data: AppData;
  onUpdateWeekly: (reflection: WeeklyReflection) => void;
  onUpdateMonthly: (reflection: MonthlyReflection) => void;
}

const Growth: React.FC<GrowthProps> = ({ data, onUpdateWeekly, onUpdateMonthly }) => {
  const [activeTab, setActiveTab] = useState<'balance' | 'monthly' | 'weekly'>('balance');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const monthKey = format(selectedMonth, 'yyyy-MM');
  const weekKey = format(startOfWeek(selectedWeek), 'yyyy-MM-dd');

  // Helper to get average balance scores from daily logs for the selected month
  const calculateBalanceStats = () => {
     const daysInMonth = data.days.filter(d => d.date.startsWith(monthKey));
     if (daysInMonth.length === 0) return [
       { subject: 'Mind', A: 5, fullMark: 10 },
       { subject: 'Body', A: 5, fullMark: 10 },
       { subject: 'Work', A: 5, fullMark: 10 },
       { subject: 'Self', A: 5, fullMark: 10 },
     ];

     const sums = daysInMonth.reduce((acc, curr) => ({
       mind: acc.mind + (curr.balance?.mind || 5),
       body: acc.body + (curr.balance?.body || 5),
       work: acc.work + (curr.balance?.work || 5),
       self: acc.self + (curr.balance?.self || 5),
     }), { mind: 0, body: 0, work: 0, self: 0 });

     return [
       { subject: 'Mind', A: Math.round(sums.mind / daysInMonth.length), fullMark: 10 },
       { subject: 'Body', A: Math.round(sums.body / daysInMonth.length), fullMark: 10 },
       { subject: 'Work', A: Math.round(sums.work / daysInMonth.length), fullMark: 10 },
       { subject: 'Self', A: Math.round(sums.self / daysInMonth.length), fullMark: 10 },
     ];
  };

  const monthlyReflection = data.monthlyReflections.find(r => r.month === monthKey) || {
    id: monthKey,
    month: monthKey,
    moodSummary: '',
    habitSuccess: '',
    growth: '',
    intention: '',
    goals: []
  };

  const weeklyReflection = data.weeklyReflections.find(r => r.weekStartDate === weekKey) || {
    id: weekKey,
    weekStartDate: weekKey,
    wins: '',
    challenges: '',
    lessons: ''
  };

  const saveMonthly = (field: keyof MonthlyReflection, value: any) => {
    onUpdateMonthly({ ...monthlyReflection, [field]: value });
  };

  const saveWeekly = (field: keyof WeeklyReflection, value: string) => {
    onUpdateWeekly({ ...weeklyReflection, [field]: value });
  };

  const updateGoal = (index: number, text: string) => {
    const newGoals = [...(monthlyReflection.goals || [])];
    if (!newGoals[index]) newGoals[index] = { text: '', completed: false };
    newGoals[index].text = text;
    saveMonthly('goals', newGoals);
  };

  const toggleGoal = (index: number) => {
    const newGoals = [...(monthlyReflection.goals || [])];
    if (newGoals[index]) {
      newGoals[index].completed = !newGoals[index].completed;
      saveMonthly('goals', newGoals);
    }
  };

  return (
    <div className="h-full flex flex-col pb-24 md:pb-0 font-marker animate-fade-in relative">
      
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl md:text-5xl font-handwriting font-bold text-zinc-800 dark:text-zinc-100">Growth & Focus</h2>
        
        {/* Tabs */}
        <div className="flex bg-white/50 dark:bg-zinc-800/50 rounded-full p-1 border border-zinc-200 dark:border-zinc-700">
           <button 
             onClick={() => setActiveTab('balance')}
             className={`px-3 md:px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'balance' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
           >
             <BarChart2 className="w-4 h-4" /> <span className="hidden md:inline">Balance</span>
           </button>
           <button 
             onClick={() => setActiveTab('monthly')}
             className={`px-3 md:px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'monthly' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
           >
             <Calendar className="w-4 h-4" /> <span className="hidden md:inline">Monthly</span>
           </button>
           <button 
             onClick={() => setActiveTab('weekly')}
             className={`px-3 md:px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'weekly' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
           >
             <RefreshCcw className="w-4 h-4" /> <span className="hidden md:inline">Weekly</span>
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar glass-card p-4 md:p-8 rounded-[4px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b]">
         
         {activeTab === 'balance' && (
           <div className="h-full flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6 bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-1">
                 <button onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))} className="p-1 hover:text-blue-500"><RefreshCcw className="w-4 h-4 rotate-180" /></button>
                 <h3 className="font-handwriting text-2xl font-bold">{format(selectedMonth, 'MMMM yyyy')}</h3>
                 <button onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))} className="p-1 hover:text-blue-500"><RefreshCcw className="w-4 h-4" /></button>
              </div>

              <div className="w-full max-w-md aspect-square relative mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={calculateBalanceStats()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontFamily: 'Patrick Hand', fontSize: 20, fill: '#71717a' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar
                      name="Balance"
                      dataKey="A"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="#a78bfa"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-center max-w-lg">
                 <h4 className="font-bold text-lg mb-2">Intentional Living Framework</h4>
                 <p className="text-zinc-500 text-lg">
                    Balance isn't about everything being equal. It's about consciously nurturing your Mind, Body, Work, and Self over time. Use this visual to see where you might need to shift focus next month.
                 </p>
              </div>
           </div>
         )}

         {activeTab === 'monthly' && (
           <div className="h-full flex flex-col max-w-3xl mx-auto space-y-8">
               <div className="flex items-center justify-between border-b-2 border-dashed border-zinc-200 dark:border-zinc-700 pb-4">
                  <button onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))} className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600">Prev</button>
                  <div className="text-center">
                     <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Planning For</span>
                     <h3 className="font-handwriting text-4xl">{format(selectedMonth, 'MMMM yyyy')}</h3>
                  </div>
                  <button onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))} className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600">Next</button>
               </div>
               
               {/* Monthly Intention */}
               <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <label className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest text-sm mb-2">
                     <Target className="w-4 h-4" /> Monthly Intention
                  </label>
                  <textarea 
                    value={monthlyReflection.intention}
                    onChange={(e) => saveMonthly('intention', e.target.value)}
                    placeholder="This month, I am focusing on..."
                    className="w-full bg-transparent resize-none outline-none font-handwriting text-3xl text-zinc-800 dark:text-zinc-100 text-center"
                    rows={2}
                  />
               </div>

               {/* Goals */}
               <div>
                  <h4 className="font-handwriting text-2xl font-bold mb-4">Top Priorities & Goals</h4>
                  <div className="space-y-3">
                     {[0, 1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                           <button 
                             onClick={() => toggleGoal(i)}
                             className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${monthlyReflection.goals?.[i]?.completed ? 'bg-green-500 border-green-500 text-white' : 'border-zinc-300 hover:border-zinc-500'}`}
                           >
                              {monthlyReflection.goals?.[i]?.completed && <Star className="w-3 h-3 fill-white" />}
                           </button>
                           <input 
                             type="text" 
                             value={monthlyReflection.goals?.[i]?.text || ''}
                             onChange={(e) => updateGoal(i, e.target.value)}
                             placeholder={`Priority #${i + 1}`}
                             className={`flex-1 bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-2 font-marker text-xl outline-none focus:border-zinc-400 ${monthlyReflection.goals?.[i]?.completed ? 'line-through text-zinc-400' : ''}`}
                           />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Reflection Section */}
               <div className="pt-8 border-t-2 border-zinc-100 dark:border-zinc-800">
                  <h4 className="font-handwriting text-2xl font-bold mb-4 text-zinc-500">End of Month Review</h4>
                  <div className="grid grid-cols-1 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">Mood Summary</label>
                        <textarea 
                          value={monthlyReflection.moodSummary}
                          onChange={(e) => saveMonthly('moodSummary', e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 resize-none outline-none font-marker text-lg"
                          placeholder="How did I generally feel?"
                          rows={3}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">Habit Success</label>
                        <textarea 
                          value={monthlyReflection.habitSuccess}
                          onChange={(e) => saveMonthly('habitSuccess', e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 resize-none outline-none font-marker text-lg"
                          placeholder="Which habits stuck? Which didn't?"
                          rows={3}
                        />
                     </div>
                  </div>
               </div>
           </div>
         )}

        {activeTab === 'weekly' && (
           <div className="h-full flex flex-col max-w-3xl mx-auto space-y-8">
              <div className="flex items-center justify-between border-b-2 border-dashed border-zinc-200 dark:border-zinc-700 pb-4">
                  <button onClick={() => setSelectedWeek(subWeeks(selectedWeek, 1))} className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600">Prev Week</button>
                  <div className="text-center">
                     <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Weekly Review</span>
                     <h3 className="font-handwriting text-2xl">Week of {format(startOfWeek(selectedWeek), 'MMM do')}</h3>
                  </div>
                  <button onClick={() => setSelectedWeek(addWeeks(selectedWeek, 1))} className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600">Next Week</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-900/30">
                     <label className="font-bold text-green-800 dark:text-green-300 uppercase tracking-widest text-sm mb-2 block">
                        Wins & Joys
                     </label>
                     <textarea 
                       value={weeklyReflection.wins}
                       onChange={(e) => saveWeekly('wins', e.target.value)}
                       className="w-full bg-transparent resize-none outline-none font-marker text-xl h-40"
                       placeholder="What went well this week?"
                     />
                  </div>

                  <div className="bg-rose-50/50 dark:bg-rose-900/10 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                     <label className="font-bold text-rose-800 dark:text-rose-300 uppercase tracking-widest text-sm mb-2 block">
                        Challenges
                     </label>
                     <textarea 
                       value={weeklyReflection.challenges}
                       onChange={(e) => saveWeekly('challenges', e.target.value)}
                       className="w-full bg-transparent resize-none outline-none font-marker text-xl h-40"
                       placeholder="What struggled?"
                     />
                  </div>
               </div>

               <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                   <label className="font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-widest text-sm mb-2 block">
                      Lessons Learned
                   </label>
                   <textarea 
                     value={weeklyReflection.lessons}
                     onChange={(e) => saveWeekly('lessons', e.target.value)}
                     className="w-full bg-transparent resize-none outline-none font-marker text-xl h-32"
                     placeholder="What did I learn about myself?"
                   />
               </div>
           </div>
         )}

      </div>
    </div>
  );
};

export default Growth;