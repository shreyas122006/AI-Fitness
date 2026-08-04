import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './components/AuthPage';
import { SettingsView } from './components/SettingsView';
import { SearchCard } from './components/SearchCard';
import { ExerciseCard } from './components/ExerciseCard';
import { SkeletonCard } from './components/SkeletonCard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Toast } from './components/Toast';
import { searchExercises, checkHealthStatus } from './api';
import { SearchType, Exercise, SearchHistoryItem, UserSession } from './types';
import { Dumbbell, Filter, History, Bookmark, Search, User, LogOut, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  // Auth state
  const [user, setUser] = useState<UserSession | null>(null);

  // Navigation & Theme state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Search state
  const [searchType, setSearchType] = useState<SearchType>('equipment');
  const [keyword, setKeyword] = useState<string>('dumbbell');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Stats & connection
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [favoritesItems, setFavoritesItems] = useState<Exercise[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<'history' | 'favorites'>('history');

  // Filter state
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Check saved user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('fitness_user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial check & load persisted history/favorites
  useEffect(() => {
    checkHealthStatus().then((status) => {
      setIsBackendConnected(status);
    });

    const savedHistory = localStorage.getItem('fitness_search_history');
    if (savedHistory) {
      try {
        setHistoryItems(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }

    const savedFavorites = localStorage.getItem('fitness_favorites');
    if (savedFavorites) {
      try {
        setFavoritesItems(JSON.parse(savedFavorites));
      } catch (e) {
        console.error(e);
      }
    }

    // Default initial search
    handleSearchExecution('equipment', 'dumbbell', false);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fitness_user_session');
    showToast('Signed out of account', 'info');
  };

  const handleSearchExecution = async (type: SearchType, query: string, triggerConfetti: boolean = true) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await searchExercises(type, query.trim());
      setExercises(data);
      setIsLoading(false);

      if (triggerConfetti) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
        showToast(`Found ${data.length} exercise recommendations for ${query}!`, 'success');
      }

      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        searchType: type,
        keyword: query.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setHistoryItems((prev) => {
        const filtered = prev.filter((i) => !(i.keyword.toLowerCase() === query.toLowerCase() && i.searchType === type));
        const updated = [newItem, ...filtered].slice(0, 15);
        localStorage.setItem('fitness_search_history', JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'An error occurred while fetching exercises.');
      showToast(err.message || 'Search failed', 'error');
    }
  };

  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchExecution(searchType, keyword, true);
  };

  const toggleFavorite = (exercise: Exercise) => {
    const isFav = favoritesItems.some((item) => item.name === exercise.name);
    let updated: Exercise[];

    if (isFav) {
      updated = favoritesItems.filter((item) => item.name !== exercise.name);
      showToast(`Removed "${exercise.name}" from saved exercises`, 'info');
    } else {
      updated = [exercise, ...favoritesItems];
      showToast(`Saved "${exercise.name}" to favorites!`, 'success');
    }

    setFavoritesItems(updated);
    localStorage.setItem('fitness_favorites', JSON.stringify(updated));
  };

  const filteredExercises = exercises.filter((ex) => {
    if (filterDifficulty === 'all') return true;
    return ex.summary?.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
  });

  // Guard: Show Auth screen if not logged in
  if (!user) {
    return <AuthPage onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* Sidebar: Dashboard, Exercises, Settings */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Logged in as
            </span>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Welcome back, {user.name}
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDrawerMode('history');
                setDrawerOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              History ({historyItems.length})
            </button>

            <button
              onClick={() => {
                setDrawerMode('favorites');
                setDrawerOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-600 fill-current" />
              Saved ({favoritesItems.length})
            </button>

            {/* Profile Avatar Pill */}
            <div
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 p-1.5 pr-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              title="Open Settings"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-xl object-cover bg-blue-600"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* View Switching */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <SearchCard
                searchType={searchType}
                setSearchType={setSearchType}
                keyword={keyword}
                setKeyword={setKeyword}
                onSearch={handleFormSearch}
                isLoading={isLoading}
              />

              {/* Recommended Exercises Section */}
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Recommended Exercises
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tailored exercise routines with actionable form tips and precautions
                    </p>
                  </div>

                  {exercises.length > 0 && !isLoading && (
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                      <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
                      <span className="text-slate-400 font-medium">Filter:</span>
                      {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setFilterDifficulty(lvl)}
                          className={`capitalize px-2.5 py-1 rounded-lg transition-colors font-semibold ${
                            filterDifficulty === lvl
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                {isLoading && (
                  <div className="space-y-6">
                    {[1, 2, 3].map((n) => (
                      <SkeletonCard key={n} />
                    ))}
                  </div>
                )}

                {!isLoading && filteredExercises.length > 0 && (
                  <div className="space-y-6">
                    {filteredExercises.map((exercise, index) => (
                      <ExerciseCard
                        key={exercise.id || index}
                        exercise={exercise}
                        isFavorite={favoritesItems.some((item) => item.name === exercise.name)}
                        onToggleFavorite={toggleFavorite}
                        onShowToast={showToast}
                      />
                    ))}
                  </div>
                )}

                {!isLoading && filteredExercises.length === 0 && !errorMsg && (
                  <div className="p-12 text-center bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                    <Dumbbell className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-50" />
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No exercises found
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Search for a keyword above to generate targeted exercise recommendations.
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* TAB 2: EXERCISES (SAVED LIBRARY) */}
          {activeTab === 'exercises' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Exercise Library
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your saved favorite exercise routines and form guides
                </p>
              </div>

              {favoritesItems.length > 0 ? (
                <div className="space-y-6">
                  {favoritesItems.map((exercise, index) => (
                    <ExerciseCard
                      key={exercise.id || index}
                      exercise={exercise}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                      onShowToast={showToast}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                  <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
                  <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                    Your exercise library is empty
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Save exercises from the Dashboard by clicking the bookmark icon on any exercise card.
                  </p>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView
              user={user}
              onUpdateUser={setUser}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onLogout={handleLogout}
              onShowToast={showToast}
            />
          )}

        </main>
      </div>

      {/* Slide-out Drawer for History & Favorites */}
      <HistoryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        historyItems={historyItems}
        favoritesItems={favoritesItems}
        onSelectHistory={(item) => {
          setSearchType(item.searchType);
          setKeyword(item.keyword);
          setActiveTab('dashboard');
          handleSearchExecution(item.searchType, item.keyword, true);
        }}
        onClearHistory={() => {
          setHistoryItems([]);
          localStorage.removeItem('fitness_search_history');
          showToast('Cleared search history', 'info');
        }}
        onRemoveFavorite={toggleFavorite}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
