import React, { useState, useRef, useEffect } from 'react';
import { AppState, ChatMessage, Friend } from './types';
import NeonButton from './components/NeonButton';
import RetroWindow from './components/RetroWindow';
import SparkleBackground from './components/SparkleBackground';
import ScrapbookView from './components/ScrapbookView';
import { generateFairyStatus, chatWithFairyGodmother } from './services/geminiService';

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppState>(AppState.DASHBOARD);
  
  // Profile Image State
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem('profileImage') || "https://picsum.photos/200/200?grayscale";
  });
  const [profileEffect, setProfileEffect] = useState<string>(() => {
    return localStorage.getItem('profileEffect') || 'none';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // About Me State
  const [aboutMe, setAboutMe] = useState<string>(() => {
    return localStorage.getItem('aboutMe') || "";
  });
  const [aboutMeSaveStatus, setAboutMeSaveStatus] = useState('💾 Save');

  // Friends State
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('friends');
    return saved ? JSON.parse(saved) : [];
  });
  const [friendNameInput, setFriendNameInput] = useState('');

  // Bio Generator State
  const [mood, setMood] = useState('');
  const [generatedBio, setGeneratedBio] = useState('');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  // Chat / Diary State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi princess! ✨ How can I help you sparkle today? 💖" }
  ]);
  const [isChatting, setIsChatting] = useState(false);
  const [saveStatus, setSaveStatus] = useState('💾 Save Entry');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleGenerateBio = async () => {
    if (!mood.trim()) return;
    setIsGeneratingBio(true);
    const result = await generateFairyStatus(mood);
    setGeneratedBio(result);
    setIsGeneratingBio(false);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    // Format history for API
    const apiHistory = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));
    apiHistory.push({ role: 'user', parts: [{ text: userMsg }] });

    const response = await chatWithFairyGodmother(userMsg, apiHistory);
    
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setIsChatting(false);
  };

  const handleSaveEntry = () => {
    if (!chatInput.trim()) return;

    const entry = {
      id: Date.now(),
      text: chatInput,
      date: new Date().toLocaleString()
    };

    const existingEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    const updatedEntries = [entry, ...existingEntries];
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));

    setSaveStatus('✅ Saved!');
    setTimeout(() => setSaveStatus('💾 Save Entry'), 2000);
  };

  const handleSaveAboutMe = () => {
    localStorage.setItem('aboutMe', aboutMe);
    setAboutMeSaveStatus('✅ Saved!');
    setTimeout(() => setAboutMeSaveStatus('💾 Save'), 2000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        localStorage.setItem('profileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEffectChange = (effect: string) => {
    setProfileEffect(effect);
    localStorage.setItem('profileEffect', effect);
  };

  const addFriend = () => {
    if (!friendNameInput.trim()) return;
    // Simple duplicate check
    if (friends.some(f => f.name.toLowerCase() === friendNameInput.trim().toLowerCase())) {
       setFriendNameInput(''); 
       return; 
    }
    
    const newFriend: Friend = {
      id: Date.now(),
      name: friendNameInput.trim(),
      avatar: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${friendNameInput.trim()}`
    };
    
    const updated = [newFriend, ...friends];
    setFriends(updated);
    localStorage.setItem('friends', JSON.stringify(updated));
    setFriendNameInput('');
  };

  const removeFriend = (id: number) => {
    const updated = friends.filter(f => f.id !== id);
    setFriends(updated);
    localStorage.setItem('friends', JSON.stringify(updated));
  };

  const effectClasses: Record<string, string> = {
    none: '',
    sepia: 'sepia',
    emo: 'grayscale contrast-125',
    rainbow: 'animate-hue-rotate',
    dreamy: 'blur-[0.5px] brightness-110 saturate-150',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative font-cute text-slate-700 selection:bg-neon-pink selection:text-white overflow-hidden">
      <SparkleBackground />

      {/* Main Layout */}
      <div className="relative z-10 container mx-auto p-4 h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-8 p-4 border-b-4 border-double border-white/50 bg-white/20 backdrop-blur-sm rounded-xl">
          <div>
            <h1 className="text-5xl md:text-7xl font-pixel text-transparent bg-clip-text bg-[linear-gradient(to_right,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] bg-[length:200%_auto] animate-rainbow drop-shadow-neon-pink">
              Piczo Princess
            </h1>
            <p className="text-neon-purple font-bold tracking-widest text-sm mt-2 uppercase">
              Build your digital dream world ✨
            </p>
          </div>
          <div className="hidden md:flex gap-2">
             <div className="w-4 h-4 bg-neon-pink rounded-full animate-bounce delay-75"></div>
             <div className="w-4 h-4 bg-neon-blue rounded-full animate-bounce delay-150"></div>
             <div className="w-4 h-4 bg-neon-green rounded-full animate-bounce delay-300"></div>
          </div>
        </header>

        {/* Navigation / Tabs */}
        <nav className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <NeonButton 
            variant={currentApp === AppState.DASHBOARD ? 'pink' : 'purple'}
            onClick={() => setCurrentApp(AppState.DASHBOARD)}
          >
            🏠 Home
          </NeonButton>
          <NeonButton 
            variant={currentApp === AppState.BIO_GENERATOR ? 'pink' : 'purple'}
            onClick={() => setCurrentApp(AppState.BIO_GENERATOR)}
          >
            ✨ Status Maker
          </NeonButton>
          <NeonButton 
            variant={currentApp === AppState.DIARY ? 'pink' : 'purple'}
            onClick={() => setCurrentApp(AppState.DIARY)}
          >
            📖 Secret Diary
          </NeonButton>
          <NeonButton 
            variant={currentApp === AppState.SCRAPBOOK ? 'pink' : 'purple'}
            onClick={() => setCurrentApp(AppState.SCRAPBOOK)}
          >
            🎨 Scrapbook
          </NeonButton>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pb-20">
          
          {/* Left Column: Profile Card (Always visible on large screens) */}
          <div className={`lg:col-span-4 ${currentApp === AppState.DASHBOARD ? 'block' : 'hidden lg:block'}`}>
            <RetroWindow title="My Profile" className="h-full min-h-[400px]">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-neon-pink to-neon-blue p-1 shadow-neon-pink mb-2 animate-profile-float">
                   <img 
                     src={profileImage} 
                     alt="Profile" 
                     className={`w-full h-full rounded-full object-cover border-4 border-white ${effectClasses[profileEffect]}`}
                   />
                </div>
                
                {/* Image Controls */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-pink-500 bg-pink-100 hover:bg-pink-200 px-3 py-1 rounded-full border border-pink-300 transition-colors shadow-sm"
                  >
                      📷 Update Pic
                  </button>
                  <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                  />
                  
                  {/* FX Selection */}
                  <div className="flex gap-1 mt-1">
                    {['none', 'sepia', 'emo', 'rainbow', 'dreamy'].map(effect => (
                      <button
                        key={effect}
                        onClick={() => handleEffectChange(effect)}
                        className={`w-6 h-6 rounded-full border-2 text-[10px] flex items-center justify-center transition-all ${
                          profileEffect === effect 
                            ? 'border-neon-blue scale-110 shadow-neon-blue bg-white' 
                            : 'border-gray-300 hover:scale-110 bg-white/50'
                        }`}
                        title={effect.charAt(0).toUpperCase() + effect.slice(1)}
                      >
                        {effect === 'none' ? '🚫' : 
                         effect === 'sepia' ? '📜' : 
                         effect === 'emo' ? '🖤' : 
                         effect === 'rainbow' ? '🌈' : '☁️'}
                      </button>
                    ))}
                  </div>
                </div>

                <h2 className="text-2xl font-pixel text-neon-purple mb-1">SparkleQueen_99</h2>
                <p className="text-sm text-gray-500 mb-4">~ Living in a digital dream ~</p>
                
                <div className="w-full bg-white/50 p-3 rounded border border-pink-200 mb-4 text-left text-sm space-y-1">
                  <p><strong>Mood:</strong> {mood || "Dreamy ☁️"}</p>
                  <p><strong>Song:</strong> Britney - Toxic 🎵</p>
                  <p><strong>Time:</strong> {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>

                {/* About Me Section */}
                <div className="w-full mb-4 relative group">
                    <div className="flex justify-between items-center mb-1 px-1">
                        <label className="text-xs font-bold text-pink-500 uppercase tracking-wider">About Me</label>
                    </div>
                    <textarea
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        placeholder="I love glitter, pizza, and coding! <3"
                        className="w-full h-24 p-2 text-xs rounded-lg border-2 border-pink-200 bg-pink-50/50 focus:bg-white focus:border-neon-pink focus:outline-none transition-all resize-none font-cute text-gray-600 shadow-inner"
                    />
                    <div className="flex justify-end mt-1">
                         <button 
                            onClick={handleSaveAboutMe} 
                            className="text-[10px] bg-pink-400 text-white px-2 py-1 rounded hover:bg-pink-500 transition-colors font-pixel tracking-wide shadow-sm"
                        >
                            {aboutMeSaveStatus}
                         </button>
                    </div>
                </div>

                {/* Friends Section */}
                <div className="w-full mb-4">
                    <div className="flex justify-between items-center mb-1 px-1 border-b border-pink-200 pb-1">
                        <label className="text-xs font-bold text-pink-500 uppercase tracking-wider">
                            My Friends ({friends.length})
                        </label>
                    </div>
                    
                    {/* Input Area */}
                    <div className="flex gap-2 mb-3 mt-2">
                        <input 
                            type="text" 
                            value={friendNameInput}
                            onChange={(e) => setFriendNameInput(e.target.value)}
                            placeholder="Username..."
                            className="flex-1 p-1 px-2 text-xs rounded border border-pink-300 focus:outline-none focus:border-neon-pink bg-white/80"
                            onKeyDown={(e) => e.key === 'Enter' && addFriend()}
                        />
                        <button 
                            onClick={addFriend}
                            className="text-[10px] bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500 font-pixel shadow-sm"
                        >
                            + ADD
                        </button>
                    </div>

                    {/* Friends Grid */}
                    {friends.length === 0 ? (
                        <p className="text-xs text-center text-gray-400 italic py-2">No friends yet... lonely? 🥺</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {friends.map(friend => (
                                <div key={friend.id} className="group relative flex flex-col items-center p-1 bg-white/40 rounded border border-pink-100 hover:bg-white/80 transition-colors">
                                    <button 
                                        onClick={() => removeFriend(friend.id)}
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-300 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Unfriend"
                                    >
                                        ×
                                    </button>
                                    <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded mb-1 bg-white" />
                                    <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center">{friend.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <span className="bg-pink-200 px-2 py-1 rounded text-xs text-pink-700 border border-pink-300">#Y2K</span>
                  <span className="bg-blue-200 px-2 py-1 rounded text-xs text-blue-700 border border-blue-300">#HTML</span>
                  <span className="bg-purple-200 px-2 py-1 rounded text-xs text-purple-700 border border-purple-300">#Glitter</span>
                </div>
              </div>
            </RetroWindow>
          </div>

          {/* Center/Right Column: Dynamic Apps */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Scrapbook App */}
            {currentApp === AppState.SCRAPBOOK && (
              <ScrapbookView />
            )}

            {/* Status/Bio Generator App */}
            {(currentApp === AppState.BIO_GENERATOR || currentApp === AppState.DASHBOARD) && (
               <RetroWindow title="Magic Status Generator" icon="🪄" headerColor="bg-gradient-to-r from-blue-400 to-cyan-400">
                 <div className="space-y-4">
                   <p className="text-gray-600">Tell the magic mirror how you feel, and it will write a glittery status for you!</p>
                   <div className="flex gap-2">
                     <input 
                        type="text" 
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        placeholder="e.g., happy, sleepy, excited for concert..."
                        className="flex-1 p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-neon-blue bg-white/80 font-mono text-sm"
                     />
                     <NeonButton variant="blue" onClick={handleGenerateBio} disabled={isGeneratingBio}>
                       {isGeneratingBio ? '✨ Casting...' : '✨ Generate'}
                     </NeonButton>
                   </div>

                   {generatedBio && (
                     <div className="mt-4 p-4 bg-white/60 border-2 border-dashed border-blue-300 rounded-lg relative group">
                       <p className="font-pixel text-lg text-blue-600">{generatedBio}</p>
                       <button 
                        onClick={() => navigator.clipboard.writeText(generatedBio)}
                        className="absolute top-2 right-2 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         Copy
                       </button>
                     </div>
                   )}
                 </div>
               </RetroWindow>
            )}

            {/* Diary/Chat App */}
            {(currentApp === AppState.DIARY || currentApp === AppState.DASHBOARD) && (
              <RetroWindow title="Secret Diary & Chat" icon="🧚‍♀️" className="flex-1 min-h-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto space-y-4 p-2">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.role === 'user' 
                            ? 'bg-neon-pink/10 border border-neon-pink/30 text-pink-900 rounded-tr-none' 
                            : 'bg-white/70 border border-purple-200 text-purple-900 rounded-tl-none'
                        }`}>
                           <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                     {isChatting && (
                        <div className="flex justify-start">
                          <div className="bg-white/70 p-3 rounded-2xl rounded-tl-none border border-purple-200">
                            <span className="animate-pulse">✨ Thinking...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                  </div>
                  
                  {/* Enhanced Diary Input Area */}
                  <div className="mt-4 border-t border-white/30 pt-4">
                    <div className="relative mb-2">
                      <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleChatSend();
                          }
                        }}
                        placeholder="Dear Diary... (Type here to chat with Fairy Godmother or save an entry)"
                        className="w-full p-3 rounded-lg bg-white/50 border-2 border-purple-200 focus:border-neon-purple focus:outline-none font-mono text-sm h-24 resize-none custom-scrollbar transition-colors focus:bg-white/80"
                      />
                      <span className="absolute bottom-2 right-2 text-xs text-purple-400 font-bold bg-white/80 px-1 rounded pointer-events-none border border-purple-100">
                        {chatInput.length} chars
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                         <div className="text-xs text-purple-500 italic opacity-60">
                            Shift+Enter for new line
                         </div>
                         <div className="flex gap-2">
                            <NeonButton 
                                variant="blue" 
                                onClick={handleSaveEntry} 
                                disabled={!chatInput.trim()}
                                className="!px-4 !py-1 text-xs"
                            >
                                {saveStatus}
                            </NeonButton>
                            <NeonButton 
                                variant="purple" 
                                onClick={handleChatSend} 
                                disabled={isChatting || !chatInput.trim()} 
                                className="!px-4 !py-1 text-xs"
                            >
                                Send to Fairy
                            </NeonButton>
                         </div>
                    </div>
                  </div>
                </div>
              </RetroWindow>
            )}

            {/* Widgets Area (Decorative) */}
            <div className="grid grid-cols-2 gap-4">
                <div 
                    onClick={() => setCurrentApp(AppState.SCRAPBOOK)}
                    className="bg-white/30 border-2 border-dashed border-pink-300 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-white/40 transition-colors cursor-pointer"
                >
                   <span className="text-3xl mb-2">💌</span>
                   <span className="font-pixel text-pink-600">Guestbook</span>
                   <span className="text-xs text-pink-400">12 New Messages</span>
                </div>
                <div className="bg-white/30 border-2 border-dashed border-green-300 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-white/40 transition-colors cursor-pointer">
                   <span className="text-3xl mb-2">📸</span>
                   <span className="font-pixel text-green-600">Gallery</span>
                   <span className="text-xs text-green-500">View Snaps</span>
                </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default App;