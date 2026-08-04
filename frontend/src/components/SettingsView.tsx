import React, { useState } from 'react';
import { User, Sun, Moon, LogOut, Save, ShieldCheck, Mail, Camera } from 'lucide-react';
import { UserSession } from '../types';

interface SettingsViewProps {
  user: UserSession;
  onUpdateUser: (user: UserSession) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLogout: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  darkMode,
  setDarkMode,
  onLogout,
  onShowToast,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: UserSession = {
      name: name.trim(),
      email: email.trim(),
      avatar: avatar.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    };

    onUpdateUser(updated);
    localStorage.setItem('fitness_user_session', JSON.stringify(updated));
    onShowToast('Profile settings saved successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Account Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, theme preferences, and account security.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Profile Details
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="relative group">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover bg-slate-200 dark:bg-slate-800 border-2 border-blue-600 shadow-md"
              />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">{name}</h4>
              <p className="text-xs text-slate-400">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </form>
      </div>

      {/* Appearance Card */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          {darkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-blue-600" />}
          Appearance & Theme
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 block">
              Dark Theme Mode
            </span>
            <span className="text-xs text-slate-400">
              Toggle between modern light mode and sleek dark theme interface.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center ${
              darkMode ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-slate-800">
              {darkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            </div>
          </button>
        </div>
      </div>

      {/* Account Logout Card */}
      <div className="bg-red-500/5 dark:bg-red-950/20 rounded-3xl p-6 sm:p-8 border border-red-500/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-red-600 dark:text-red-400 text-base">
            Log Out of Account
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Safely sign out of your user session.
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-red-500/20 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
