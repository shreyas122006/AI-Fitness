import React from 'react';
import { LayoutGrid, Dumbbell, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const mainNav = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'exercises', icon: Dumbbell, label: 'Exercises' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-20 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-between py-6 px-3 shadow-sm transition-colors duration-200 z-30">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-8">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
          title="AI Fitness Assistant"
        >
          <Dumbbell className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-4">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={item.label}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          })}
        </nav>
      </div>

      <div />
    </aside>
  );
};
