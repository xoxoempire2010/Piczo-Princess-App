import React, { useState, useEffect, useRef } from 'react';
import RetroWindow from './RetroWindow';
import NeonButton from './NeonButton';
import { ScrapbookItem } from '../types';

const ROTATIONS = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-3', '-rotate-3', 'rotate-6', '-rotate-6'];
const TAPE_COLORS = ['bg-pink-200/80', 'bg-blue-200/80', 'bg-purple-200/80', 'bg-green-200/80', 'bg-yellow-200/80'];

const ScrapbookView: React.FC = () => {
  const [memories, setMemories] = useState<ScrapbookItem[]>(() => {
    const saved = localStorage.getItem('scrapbookMemories');
    if (saved) return JSON.parse(saved);
    
    // Default data for new users
    return [
        { id: 1, img: 'https://picsum.photos/id/64/300/300', caption: 'Besties 4Ever! 👯‍♀️', rotate: '-rotate-2', tapeColor: 'bg-pink-200/80', date: new Date().toLocaleDateString() },
        { id: 2, img: 'https://picsum.photos/id/106/300/300', caption: 'Spring Vibes 🌸', rotate: 'rotate-3', tapeColor: 'bg-blue-200/80', date: new Date().toLocaleDateString() },
        { id: 3, img: 'https://picsum.photos/id/129/300/300', caption: 'So moody... 🌧️', rotate: '-rotate-1', tapeColor: 'bg-purple-200/80', date: new Date().toLocaleDateString() },
    ];
  });

  const [newCaption, setNewCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const stickers = [
    { icon: '🦋', pos: 'top-10 left-10', size: 'text-4xl', anim: 'animate-bounce' },
    { icon: '✨', pos: 'top-20 right-20', size: 'text-3xl', anim: 'animate-pulse' },
    { icon: '🌈', pos: 'bottom-32 left-8', size: 'text-5xl', anim: 'animate-float' },
    { icon: '👾', pos: 'bottom-10 right-10', size: 'text-4xl', anim: 'animate-bounce delay-75' },
    { icon: '💖', pos: 'top-1/2 left-1/2', size: 'text-6xl opacity-20', anim: 'animate-pulse' },
    { icon: '💿', pos: 'bottom-1/4 right-1/3', size: 'text-4xl', anim: 'rotate-12' },
  ];

  useEffect(() => {
    localStorage.setItem('scrapbookMemories', JSON.stringify(memories));
  }, [memories]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setIsUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            handleAddMemory(result);
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleAddMemory = (imgData: string) => {
    const newItem: ScrapbookItem = {
        id: Date.now(),
        img: imgData,
        caption: newCaption || 'Sweet Memory 💖',
        rotate: ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)],
        tapeColor: TAPE_COLORS[Math.floor(Math.random() * TAPE_COLORS.length)],
        date: new Date().toLocaleDateString()
    };

    setMemories([newItem, ...memories]);
    setNewCaption('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: number) => {
      setMemories(memories.filter(m => m.id !== id));
  };

  const triggerUpload = () => {
      fileInputRef.current?.click();
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updatedMemories = [...memories];
    const [movedItem] = updatedMemories.splice(draggedIndex, 1);
    updatedMemories.splice(targetIndex, 0, movedItem);

    setMemories(updatedMemories);
    setDraggedIndex(null);
  };

  return (
    <RetroWindow 
      title="My Digital Scrapbook" 
      icon="🎨" 
      headerColor="bg-gradient-to-r from-green-300 to-blue-300"
      className="h-full min-h-[600px]"
    >
      <div className="relative min-h-full p-6 bg-[#fff0f5] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden flex flex-col">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-4 bg-repeat-x opacity-50" 
             style={{ backgroundImage: 'linear-gradient(45deg, #ff6ec7 25%, transparent 25%, transparent 50%, #ff6ec7 50%, #ff6ec7 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }}>
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
            {stickers.map((s, i) => (
                <div key={i} className={`absolute ${s.pos} ${s.size} ${s.anim} hover:scale-125 transition-transform cursor-pointer drop-shadow-md`}>
                    {s.icon}
                </div>
            ))}
        </div>

        <h2 className="font-pixel text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 drop-shadow-sm mb-6 rotate-1 relative z-10">
            ~*~ Memories ~*~
        </h2>

        {/* Creator Station */}
        <div className="relative z-20 bg-white/60 backdrop-blur-sm border-2 border-dashed border-pink-300 rounded-xl p-4 mb-8 max-w-2xl mx-auto w-full shadow-sm">
             <div className="absolute -top-3 left-4 bg-pink-100 px-2 text-xs font-bold text-pink-500 border border-pink-200">CREATOR STATION</div>
             <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-gray-500 mb-1 block ml-1">1. Caption this moment:</label>
                    <input 
                        type="text" 
                        value={newCaption} 
                        onChange={(e) => setNewCaption(e.target.value)}
                        placeholder="E.g. Summer Fun 2005! ☀️"
                        className="w-full p-2 rounded border border-pink-200 bg-white/80 focus:outline-none focus:border-neon-pink text-sm font-cute"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                    />
                    <NeonButton 
                        variant="pink" 
                        onClick={triggerUpload}
                        className="!text-sm !py-2 whitespace-nowrap w-full md:w-auto justify-center flex"
                    >
                        {isUploading ? '✨ Sticking...' : '📸 Add Photo'}
                    </NeonButton>
                </div>
             </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 pb-10">
          {memories.map((memory, index) => (
            <div 
                key={memory.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`group relative bg-white p-3 pb-8 shadow-lg transform transition-all duration-300 hover:z-20 cursor-move ${memory.rotate} ${draggedIndex === index ? 'opacity-50 scale-95' : 'hover:scale-105'}`}
            >
              {/* Tape Effect */}
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 ${memory.tapeColor} rotate-2 backdrop-blur-sm shadow-sm z-10`}></div>
              
              {/* Delete Button */}
              <button 
                onClick={(e) => {
                    e.stopPropagation(); // Prevent drag start on delete
                    handleDelete(memory.id);
                }}
                className="absolute -top-2 -right-2 bg-red-400 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-red-500 shadow-md font-bold text-xs"
                title="Rip it out!"
              >
                  X
              </button>

              {/* Image */}
              <div className="overflow-hidden border border-gray-100 h-48 bg-gray-50 pointer-events-none">
                 <img src={memory.img} alt={memory.caption} className="w-full h-full object-cover filter contrast-110" />
              </div>
              
              {/* Caption */}
              <div className="mt-3 font-cute font-bold text-center text-gray-600 text-lg break-words leading-tight pointer-events-none">
                 {memory.caption}
              </div>
              <div className="text-[10px] text-center text-gray-400 mt-1 font-mono pointer-events-none">{memory.date}</div>

              {/* Corner Decor */}
              <div className="absolute bottom-2 right-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-pink-400 pointer-events-none">
                  xoxo
              </div>
            </div>
          ))}

          {/* Note Card Widget */}
          <div className="bg-yellow-100 p-4 shadow-md rotate-2 flex flex-col items-center min-h-[200px] border border-yellow-200 relative">
             <div className="w-3 h-3 rounded-full bg-red-400 absolute top-2 left-1/2 -translate-x-1/2 shadow-inner"></div>
             <h3 className="font-pixel text-xl text-yellow-700 mb-2 border-b-2 border-yellow-300 w-full text-center">My Stats</h3>
             <div className="w-full mt-2 space-y-2">
                 <div className="flex justify-between text-xs text-yellow-800 border-b border-yellow-200 pb-1">
                    <span>Memories:</span>
                    <span className="font-bold">{memories.length}</span>
                 </div>
                 <div className="flex justify-between text-xs text-yellow-800 border-b border-yellow-200 pb-1">
                    <span>Mood:</span>
                    <span className="font-bold">Sparkly ✨</span>
                 </div>
                 <div className="flex justify-between text-xs text-yellow-800 pb-1">
                    <span>Theme:</span>
                    <span className="font-bold">Princess</span>
                 </div>
             </div>
             <div className="mt-auto text-[10px] text-yellow-600 italic text-center">
                 "Collect moments, not things."
             </div>
          </div>
        </div>

      </div>
    </RetroWindow>
  );
};

export default ScrapbookView;