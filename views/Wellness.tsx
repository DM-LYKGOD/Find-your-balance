import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { AppData, JournalEntry, MoodEntry } from '../types';
import { Moon, Cloud, Heart, Coffee, Battery, Brain, Sparkles } from 'lucide-react';
import DateNavigation from '../components/DateNavigation';

interface WellnessProps {
  date: Date;
  onDateChange: (date: Date) => void;
  data: AppData;
  onLogJournal: (journal: JournalEntry) => void;
}

const MINDFULNESS_PROMPTS = [
  "What is one thing I can let go of today?",
  "How does my body feel right now?",
  "What is bringing me joy in this moment?",
  "What boundary do I need to set today?",
  "Who is someone I appreciate and why?",
  "What does 'balance' look like for me today?",
];

const Wellness: React.FC<WellnessProps> = ({ date, onDateChange, data, onLogJournal }) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const existingEntry = data.journal.find(j => j.date === formattedDate);
  const [promptIndex, setPromptIndex] = useState(0);

  const [entry, setEntry] = useState({
    gratitude: existingEntry?.gratitude || '',
    highlights: existingEntry?.highlights || '',
    thoughts: existingEntry?.thoughts || '',
  });

  // Emotional Check-in State (Local for now, could be part of mood)
  const [emotionalState, setEmotionalState] = useState<string>('');

  // Reset entry when date changes
  useEffect(() => {
    const current = data.journal.find(j => j.date === formattedDate);
    setEntry({
       gratitude: current?.gratitude || '',
       highlights: current?.highlights || '',
       thoughts: current?.thoughts || '',
    });
    // Randomize prompt on day change
    setPromptIndex(Math.floor(Math.random() * MINDFULNESS_PROMPTS.length));
  }, [formattedDate, data.journal]);

  const handleSave = (field: string, value: string) => {
    const updated = { ...entry, [field]: value };
    setEntry(updated);
    
    // Auto-save logic
    onLogJournal({
      id: existingEntry?.id || Math.random().toString(36).substring(7),
      date: formattedDate,
      gratitude: updated.gratitude,
      highlights: updated.highlights,
      thoughts: updated.thoughts,
      tags: [],
    });
  };

  return (
    <div className="h-full flex flex-col pb-24 md:pb-0 font-marker animate-fade-in relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 relative gap-4">
         <div className="flex items-center gap-2 text-zinc-400">
            <Moon className="w-6 h-6" />
            <h2 className="text-4xl font-handwriting font-bold text-zinc-800 dark:text-zinc-100 relative">
              Journal & Reflect
            </h2>
         </div>
         
         <DateNavigation date={date} onDateChange={onDateChange} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 pr-2">

        {/* Self-Awareness Check-in */}
        <div className="glass-card p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-indigo-50/30 dark:bg-indigo-900/10 relative overflow-hidden">
           {/* Subtle background decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>

           <div className="flex items-center justify-between mb-4">
              <h3 className="font-handwriting text-2xl font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                <Heart className="w-5 h-5" /> How are you, really?
              </h3>
           </div>
           
           <div className="flex flex-wrap gap-2 mb-4">
             {['Anxious', 'Calm', 'Tired', 'Energetic', 'Grateful', 'Overwhelmed', 'Content'].map(mood => (
               <button 
                 key={mood}
                 onClick={() => setEmotionalState(mood)}
                 className={`px-3 py-1 rounded-full text-sm font-bold border transition-colors ${emotionalState === mood ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/50 dark:bg-zinc-800/50 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300'}`}
               >
                 {mood}
               </button>
             ))}
           </div>

           <div className="relative">
             <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">What do I need right now?</label>
             <div className="flex gap-4 text-center">
                <div className="flex-1 p-3 bg-white/50 dark:bg-zinc-800/50 rounded-xl hover:bg-white/80 cursor-pointer transition-colors border border-transparent hover:border-indigo-200">
                   <Coffee className="w-5 h-5 mx-auto mb-1 text-zinc-400" />
                   <span className="text-sm">Rest</span>
                </div>
                <div className="flex-1 p-3 bg-white/50 dark:bg-zinc-800/50 rounded-xl hover:bg-white/80 cursor-pointer transition-colors border border-transparent hover:border-indigo-200">
                   <Battery className="w-5 h-5 mx-auto mb-1 text-zinc-400" />
                   <span className="text-sm">Recharge</span>
                </div>
                <div className="flex-1 p-3 bg-white/50 dark:bg-zinc-800/50 rounded-xl hover:bg-white/80 cursor-pointer transition-colors border border-transparent hover:border-indigo-200">
                   <Brain className="w-5 h-5 mx-auto mb-1 text-zinc-400" />
                   <span className="text-sm">Clarity</span>
                </div>
             </div>
           </div>
        </div>

        {/* Journal Paper Container */}
        <div className="border-2 border-zinc-200 dark:border-zinc-800 rounded-[4px] p-6 md:p-10 bg-white/50 dark:bg-[#18181b]/50 shadow-sm flex flex-col gap-8 relative overflow-hidden group">
           
           {/* Decorative Background Image on Paper */}
           <div 
             className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-center bg-cover transition-opacity duration-500 group-hover:opacity-[0.05] dark:group-hover:opacity-[0.08]"
             style={{
               backgroundImage: `url('https://images.unsplash.com/photo-1519681393798-2f77f37d25e6?q=80&w=1500&auto=format&fit=crop')`, // Floral line art
             }}
           ></div>

           {/* Gratitude Section - Green Header */}
           <div className="flex flex-col gap-1 z-10">
              <div className="bg-[#e8f5e9]/80 dark:bg-green-900/20 px-4 py-2 rounded-t-lg border-l-4 border-[#a5d6a7] flex justify-between items-center">
                 <h3 className="font-handwriting text-2xl font-bold text-[#2e7d32] dark:text-[#a5d6a7]">I'm grateful for...</h3>
                 <span className="text-xs font-bold text-[#2e7d32]/60 uppercase tracking-widest">List 3 things</span>
              </div>
              <div className="border border-[#e8f5e9] dark:border-zinc-700 rounded-b-lg p-4 bg-transparent min-h-[140px] relative">
                 <textarea
                   value={entry.gratitude}
                   onChange={(e) => handleSave('gratitude', e.target.value)}
                   placeholder="1. My morning coffee...&#10;2. A kind text from a friend...&#10;3. The sunshine..."
                   className="w-full h-full resize-none bg-transparent outline-none text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed font-marker placeholder-zinc-300 relative z-10"
                 />
              </div>
           </div>

           {/* Mindfulness Prompt */}
           <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2 text-amber-500 font-bold text-sm uppercase tracking-wider">
                 <Sparkles className="w-4 h-4" /> Mindfulness Prompt
              </div>
              <p className="font-serif italic text-xl text-zinc-700 dark:text-zinc-200 mb-4">"{MINDFULNESS_PROMPTS[promptIndex]}"</p>
              <textarea
                 value={entry.thoughts}
                 onChange={(e) => handleSave('thoughts', e.target.value)}
                 placeholder="Reflect here..."
                 className="w-full bg-transparent resize-none outline-none text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-marker placeholder-zinc-300 min-h-[80px]"
               />
           </div>

           {/* Free Flow Section */}
           <div className="flex flex-col gap-1 min-h-[300px] z-10">
              <div className="flex items-center justify-center gap-3 text-zinc-400 mb-2">
                 <span className="font-handwriting text-xl">Brain Dump</span> • 
                 <span className="font-handwriting text-xl">Feelings</span> • 
                 <span className="font-handwriting text-xl">Doodles</span>
              </div>
              <div className="flex-1 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 relative bg-white/30 dark:bg-zinc-800/30">
                 <textarea
                   value={entry.highlights}
                   onChange={(e) => handleSave('highlights', e.target.value)}
                   placeholder="Let it all out..."
                   className="w-full h-full resize-none bg-transparent outline-none text-xl text-zinc-700 dark:text-zinc-300 leading-9 font-marker placeholder-zinc-300"
                   style={{ backgroundImage: 'linear-gradient(transparent 35px, rgba(0,0,0,0.05) 36px)', backgroundSize: '100% 36px', lineHeight: '36px' }}
                 />
                 <Cloud className="absolute bottom-4 right-4 text-zinc-200 w-12 h-12 pointer-events-none" />
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Wellness;