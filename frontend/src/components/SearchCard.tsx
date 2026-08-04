import React from 'react';
import { Search, Loader2, Dumbbell, Activity, Layers, Sparkles } from 'lucide-react';
import { SearchType } from '../types';

interface SearchCardProps {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SearchCard: React.FC<SearchCardProps> = ({
  searchType,
  setSearchType,
  keyword,
  setKeyword,
  onSearch,
  isLoading,
}) => {
  const getSamplesForType = (): string[] => {
    switch (searchType) {
      case 'equipment':
        return ['dumbbell', 'barbell', 'cable', 'kettlebell', 'body weight'];
      case 'muscle':
        return ['biceps', 'chest', 'quadriceps', 'latissimus dorsi', 'triceps'];
      case 'bodyPart':
        return ['upper arms', 'back', 'waist', 'legs', 'shoulders'];
      default:
        return ['dumbbell', 'biceps', 'chest'];
    }
  };

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 dark:border-slate-700/50 relative overflow-hidden transition-all duration-300">
      
      {/* Decorative ambient background glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        
        {/* Card Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-wide">
              Find Exercises
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select category and enter target keyword for structured exercise summaries.
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={onSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Type Dropdown */}
            <div className="md:col-span-4 relative">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Search Category
              </label>
              <div className="relative">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                  className="w-full h-12 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="equipment">By Equipment</option>
                  <option value="muscle">By Muscle</option>
                  <option value="bodyPart">By Body Part</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {searchType === 'equipment' && <Dumbbell className="w-5 h-5" />}
                  {searchType === 'muscle' && <Activity className="w-5 h-5" />}
                  {searchType === 'bodyPart' && <Layers className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {/* Keyword Input */}
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={`Enter ${searchType === 'bodyPart' ? 'body part' : searchType}... (e.g., ${getSamplesForType()[0]})`}
                  className="w-full h-12 pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

          </div>

          {/* Quick Example Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium mr-1">Quick Try:</span>
            {getSamplesForType().map((sample) => (
              <button
                type="button"
                key={sample}
                onClick={() => setKeyword(sample)}
                className={`text-xs px-3 py-1.5 rounded-xl transition-all border ${
                  keyword.toLowerCase() === sample
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Large Action Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !keyword.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading Exercises...</span>
                </>
              ) : (
                <>
                  <Dumbbell className="w-5 h-5 stroke-[2.5]" />
                  <span>Get Exercises</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
