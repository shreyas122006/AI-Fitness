import React from 'react';
import { Dumbbell, Sun, Moon, History, Bookmark, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isBackendConnected: boolean | null;
  onOpenHistory: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  isBackendConnected,
  onOpenHistory,
  onOpenFavorites,
  favoritesCount,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Title & Branding */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-xl shadow-lg shadow-emerald-500/20 text-slate-950 flex items-center justify-center">
            <Dumbbell className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                AI Fitness Assistant
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3 mr-1" /> AI Powered
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-400">
              Powered by FastAPI + LangChain + Gemini
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Health status badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium">
            <Activity className={`w-3.5 h-3.5 ${isBackendConnected === true ? 'text-emerald-400 animate-pulse' : isBackendConnected === false ? 'text-rose-500' : 'text-amber-400'}`} />
            <span className="text-slate-300">
              {isBackendConnected === true ? 'API Connected' : isBackendConnected === false ? 'API Offline (Fallback Ready)' : 'Checking API...'}
            </span>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center justify-center"
            title="Search History"
          >
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center justify-center"
            title="Saved Exercises"
          >
            <Bookmark className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300 transition-all flex items-center justify-center"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};
