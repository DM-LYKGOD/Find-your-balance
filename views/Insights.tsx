import React, { useState } from 'react';
import { AppData } from '../types';
import { Sparkles, Brain, BarChart3, Loader2 } from 'lucide-react';
import { getWellnessInsight } from '../services/gemini';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InsightsProps {
  data: AppData;
}

const Insights: React.FC<InsightsProps> = ({ data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const chartData = data.moods.slice(-14).map(m => ({
    date: m.date.slice(5),
    rating: m.rating
  }));

  const handleGenerateInsight = async () => {
    setLoading(true);
    const result = await getWellnessInsight(data);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 pb-24 md:pb-10 animate-fade-in font-marker">
      <h2 className="text-5xl font-handwriting font-bold text-zinc-800 dark:text-zinc-100">Insights</h2>

      {/* AI Coach Section */}
      <div className="glass-card p-1 rounded-[2.5rem] bg-gradient-to-br from-lavender-50 via-white to-mint-50 dark:from-zinc-900 dark:to-zinc-800 border-0 shadow-xl shadow-lavender-500/10 transform rotate-[0.5deg]">
        <div className="bg-white/60 dark:bg-zinc-900/60 rounded-[2.3rem] p-8 md:p-12 relative overflow-hidden backdrop-blur-xl">
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Brain className="w-64 h-64 text-zinc-900 dark:text-white" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-gradient-to-br from-lavender-400 to-rose-400 rounded-2xl text-white shadow-lg shadow-lavender-500/30 transform -rotate-3">
                   <Sparkles className="w-6 h-6" />
                 </div>
                 <h3 className="font-handwriting font-bold text-4xl text-zinc-800 dark:text-zinc-100">AI Wellness Coach</h3>
              </div>
              
              {!insight && !loading && (
                 <div className="text-center py-10">
                   <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-lg mx-auto text-2xl leading-relaxed">
                     Ready for your weekly check-in? I can analyze your mood trends and habits to provide personalized encouragement.
                   </p>
                   <button
                     onClick={handleGenerateInsight}
                     className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl shadow-zinc-500/20 font-handwriting"
                   >
                     Analyze & Reflect
                   </button>
                 </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-12 text-lavender-500">
                   <Loader2 className="w-12 h-12 animate-spin mb-4" />
                   <p className="font-bold text-xl animate-pulse">Connecting to your inner balance...</p>
                </div>
              )}

              {insight && (
                <div className="animate-fade-in">
                  <div className="prose prose-zinc dark:prose-invert max-w-none">
                     <div className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed font-marker text-2xl">
                       {insight}
                     </div>
                  </div>
                  <button 
                    onClick={() => setInsight(null)}
                    className="mt-8 text-base font-bold text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors uppercase tracking-widest font-handwriting"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="glass-card p-8 rounded-[2rem]">
         <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-6 h-6 text-zinc-400" />
            <h3 className="font-bold text-3xl text-zinc-800 dark:text-zinc-100 font-handwriting">Mood Trends</h3>
         </div>
         
         <div className="h-72 w-full">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#fb7185" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161, 161, 170, 0.2)" />
                  <XAxis dataKey="date" stroke="#a1a1aa" fontSize={14} tickLine={false} axisLine={false} dy={10} fontFamily="Patrick Hand" />
                  <YAxis domain={[1, 5]} stroke="#a1a1aa" fontSize={14} tickLine={false} axisLine={false} ticks={[1,2,3,4,5]} fontFamily="Patrick Hand" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Patrick Hand', fontSize: '18px' }}
                    itemStyle={{ color: '#52525b', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="url(#lineColor)" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#fb7185' }} 
                    activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <p className="text-xl italic">Log a few more days to see your trend line.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Insights;