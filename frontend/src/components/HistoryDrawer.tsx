import React from 'react';
import { X, Trash2, History, Bookmark, ArrowRight, Dumbbell } from 'lucide-react';
import { SearchHistoryItem, Exercise } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'history' | 'favorites';
  historyItems: SearchHistoryItem[];
  favoritesItems: Exercise[];
  onSelectHistory: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  onRemoveFavorite: (exercise: Exercise) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  mode,
  historyItems,
  favoritesItems,
  onSelectHistory,
  onClearHistory,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm transition-opacity animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b0f17] border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                {mode === 'history' ? <History className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </div>
              <h3 className="text-lg font-bold text-white capitalize">
                {mode === 'history' ? 'Search History' : 'Saved Favorites'}
              </h3>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {mode === 'history' ? (
              historyItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <History className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm font-medium">No recent searches yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Recent Queries
                    </span>
                    <button
                      onClick={onClearHistory}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectHistory(item);
                        onClose();
                      }}
                      className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-bold text-white capitalize flex items-center space-x-2">
                          <span>{item.keyword}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                            {item.searchType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {item.timestamp}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  ))}
                </div>
              )
            ) : (
              favoritesItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Bookmark className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm font-medium">No saved favorite exercises.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoritesItems.map((ex, idx) => (
                    <div
                      key={ex.id || idx}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0 flex items-center justify-center">
                          {ex.gifUrl ? (
                            <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Dumbbell className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white capitalize">
                            {ex.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 capitalize">
                            {ex.target} • {ex.equipment}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveFavorite(ex)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
