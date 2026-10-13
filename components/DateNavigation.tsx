import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DateNavigationProps {
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ date, onDateChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-4 bg-white/50 dark:bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm backdrop-blur-sm transition-all hover:shadow-md ${className}`}>
      <button 
        onClick={() => onDateChange(subDays(date, 1))}
        className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors hover:scale-110"
        aria-label="Previous Day"
      >
        <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
      </button>
      
      <div className="flex items-center gap-3 min-w-[140px] justify-center cursor-default group">
        <Calendar className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
        <div className="flex flex-col items-center">
           <span className="font-handwriting text-2xl font-bold text-zinc-800 dark:text-zinc-100 leading-none group-hover:text-blue-500 transition-colors">
             {format(date, 'MMM do')}
           </span>
           <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
             {format(date, 'yyyy')}
           </span>
        </div>
      </div>

      <button 
        onClick={() => onDateChange(addDays(date, 1))}
        className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors hover:scale-110"
        aria-label="Next Day"
      >
        <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
      </button>
    </div>
  );
};

export default DateNavigation;