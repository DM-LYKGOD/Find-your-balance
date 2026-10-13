import React from 'react';
import { format, getDaysInMonth } from 'date-fns';
import { AppData } from '../types';
import { Droplets, Footprints, Wind, Sparkles, Book, Apple } from 'lucide-react';
import DateNavigation from '../components/DateNavigation';

interface HabitsProps {
  date: Date;
  onDateChange: (date: Date) => void;
  data: AppData;
  onUpdateHabit: (id: string, date: string) => void;
}

const Habits: React.FC<HabitsProps> = ({ date, onDateChange, data, onUpdateHabit }) => {
  // Use prop date instead of new Date()
  const daysInMonth = getDaysInMonth(date);
  const selectedDay = parseInt(format(date, 'd'));

  // Helper to get icon component
  const getIcon = (iconName?: string) => {
    switch(iconName) {
      case 'droplet': return <Droplets className="w-6 h-6" />;
      case 'footprints': return <Footprints className="w-6 h-6" />;
      case 'wind': return <Wind className="w-6 h-6" />;
      case 'sparkles': return <Sparkles className="w-6 h-6" />;
      case 'book': return <Book className="w-6 h-6" />;
      case 'apple': return <Apple className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="h-full flex flex-col pb-24 md:pb-0 font-marker animate-fade-in">
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-4xl md:text-5xl font-handwriting font-bold text-zinc-800 dark:text-zinc-100">Habit Tracker</h2>
        <DateNavigation date={date} onDateChange={onDateChange} />
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar glass-card p-4 md:p-8 rounded-[4px] border border-zinc-200 dark:border-zinc-800 relative bg-orange-50/30 dark:bg-zinc-900/50">
         {/* Decorative Header Image Effect */}
         <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-200 to-rose-200 opacity-50"></div>

         <div className="min-w-[800px] flex flex-col gap-6">
            
            {/* Header Row */}
            <div className="flex items-center">
               <div className="w-48 shrink-0"></div>
               <div className="flex-1 flex justify-between px-2">
                  {daysArray.map(day => (
                     <div key={day} className={`w-6 text-center text-xs font-bold ${day === selectedDay ? 'text-blue-500 scale-150 transition-transform' : 'text-zinc-400'}`}>
                        {day}
                        {day === selectedDay && <div className="mx-auto w-1 h-1 bg-blue-500 rounded-full mt-1"></div>}
                     </div>
                  ))}
               </div>
            </div>

            {/* Habit Rows */}
            {data.habits.map((habit, idx) => (
               <div key={habit.id} className="flex items-center group">
                  {/* Label */}
                  <div className="w-48 shrink-0 flex items-center gap-3 pr-4 border-r-2 border-dashed border-zinc-200 dark:border-zinc-700">
                     <div className="text-zinc-600 dark:text-zinc-400">
                        {getIcon(habit.icon)}
                     </div>
                     <span className="font-handwriting text-2xl text-zinc-800 dark:text-zinc-100">{habit.name}</span>
                  </div>

                  {/* Bubbles */}
                  <div className="flex-1 flex justify-between items-center px-2 relative">
                     {/* Row Line */}
                     <div className="absolute left-0 right-0 top-1/2 h-px bg-zinc-200 dark:bg-zinc-800 -z-10"></div>
                     
                     {daysArray.map(day => {
                        const dateStr = `${format(date, 'yyyy-MM')}-${String(day).padStart(2, '0')}`;
                        const isDone = !!habit.history[dateStr];
                        const isSelected = day === selectedDay;
                        
                        return (
                           <button
                             key={day}
                             onClick={() => onUpdateHabit(habit.id, dateStr)}
                             className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-125
                               ${isSelected ? 'ring-2 ring-blue-300 ring-offset-2 dark:ring-offset-zinc-900 scale-110' : ''}
                               ${isDone 
                                 ? 'bg-zinc-800 dark:bg-zinc-100 border-zinc-800 dark:border-zinc-100' 
                                 : 'bg-white dark:bg-zinc-900 border-zinc-400 hover:border-zinc-800'
                               }
                             `}
                           >
                             {isDone && (
                                <div className="w-2 h-2 bg-white dark:bg-zinc-900 rounded-full"></div>
                             )}
                           </button>
                        );
                     })}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Habits;