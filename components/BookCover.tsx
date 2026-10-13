import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BookCoverProps {
  onOpen: () => void;
  userName: string;
  setUserName: (name: string) => void;
}

const BookCover: React.FC<BookCoverProps> = ({ onOpen, userName, setUserName }) => {
  // Generate avatar URL based on name using DiceBear API
  // Using 'avataaars' style to match the cartoon vibe in the prompt
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName || 'friend'}&backgroundColor=b6e3f4,c0aede,d1d4f9&clothing=blazerAndShirt,collarAndSweater,graphicShirt,hoodie,overall,shirtCrewNeck,shirtScoopNeck,shirtVNeck&clothingColor=3c4f5c,65c9ff,262e33,ff5c5c&hairColor=2c1b18,4a312c,724133&skinColor=ae5d29,614335`;

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 relative z-20 book-perspective">
      {/* Background Blurs for Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-zinc-800 to-black opacity-80"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px]"></div>
      </div>

      {/* The Notebook */}
      <div className="relative w-full max-w-[420px] aspect-[3/4.2] bg-[#18181b] rounded-r-2xl rounded-l-lg shadow-2xl transform transition-transform duration-500 flex overflow-hidden border-r-[1px] border-zinc-700 shadow-black/50 z-10">
        
        {/* Binding Section (Left) */}
        <div className="w-14 h-full bg-zinc-200 border-r border-zinc-400 relative flex flex-col items-center justify-evenly py-4 z-20 shadow-inner">
          {[...Array(14)].map((_, i) => (
             <div key={i} className="relative w-full h-6 flex items-center justify-center">
                 {/* Spiral Ring */}
                 <div className="w-[140%] h-6 bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 absolute left-[-20%] rounded-full shadow-md transform rotate-[-5deg] z-10"></div>
                 {/* Hole Punch Shadow */}
                 <div className="w-3 h-3 bg-zinc-800 rounded-full absolute right-2 opacity-60"></div>
             </div>
          ))}
        </div>

        {/* Cover Content */}
        <div className="flex-1 bg-[#18181b] p-6 flex flex-col items-center justify-between relative overflow-hidden">
           
           {/* Composition Book Lines Texture */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ 
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 29px, #ffffff 30px)',
                  backgroundSize: '100% 30px'
                }}>
           </div>

           {/* Abstract Shapes Decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#8d6e63] rounded-bl-[100px] opacity-80 z-0"></div>
           <div className="absolute bottom-10 right-[-20px] w-40 h-40 bg-[#797486] rounded-full opacity-80 z-0"></div>

           {/* Title */}
           <div className="mt-12 text-center z-10 w-full relative">
             <h1 className="font-handwriting text-5xl text-zinc-600 mix-blend-overlay opacity-50 absolute top-1 left-1 w-full">
                My Journal
             </h1>
             <h1 className="font-handwriting text-5xl text-zinc-400/30 w-full">
               My Journal
             </h1>
           </div>

           {/* Avatar & Stickers Section */}
           <div className="relative z-10 w-full flex justify-center items-center py-6">
             
             {/* Yellow Sticker */}
             <div className="absolute top-0 right-4 bg-[#fde047] text-zinc-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-[15deg] font-marker z-20 border-2 border-white/20">
               Dream Big!
             </div>

             {/* Main Avatar */}
             <div className="w-48 h-48 rounded-full bg-[#dbeafe] border-4 border-white shadow-2xl overflow-hidden relative z-10">
               <img 
                 src={avatarUrl} 
                 alt="Personal Avatar" 
                 className="w-full h-full object-cover transform scale-110 translate-y-2"
               />
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">
                 Hola!
               </div>
             </div>

             {/* Pink Sticker */}
             <div className="absolute bottom-0 left-2 bg-[#fb7185] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg transform -rotate-[15deg] font-marker z-20 border-2 border-white/20">
               Find Balance
             </div>
           </div>

           {/* Input & Action Section */}
           <div className="w-full space-y-8 z-10 px-4 mb-8">
             <div className="relative">
               <input
                 type="text"
                 value={userName}
                 onChange={(e) => setUserName(e.target.value)}
                 placeholder="Enter your name..."
                 className="w-full bg-transparent border-b border-white/50 px-2 py-2 text-center text-xl font-handwriting outline-none transition-colors placeholder-white/30 text-white focus:border-white"
               />
             </div>
             
             <button
               onClick={onOpen}
               className="w-full bg-[#27272a] text-white py-4 rounded-lg font-serif font-bold tracking-widest uppercase shadow-xl hover:bg-[#3f3f46] transition-all flex items-center justify-center gap-2 group border border-zinc-700"
             >
               Open Journal
               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookCover;