import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-slate-800 animate-pulse space-y-5">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 shrink-0" />
          <div className="space-y-2">
            <div className="w-48 h-6 rounded-lg bg-slate-800" />
            <div className="flex space-x-2">
              <div className="w-20 h-5 rounded-md bg-slate-800/80" />
              <div className="w-24 h-5 rounded-md bg-slate-800/80" />
            </div>
          </div>
        </div>
        <div className="w-20 h-9 rounded-xl bg-slate-800" />
      </div>

      {/* Grid Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="h-16 rounded-2xl bg-slate-800/60" />
        <div className="h-16 rounded-2xl bg-slate-800/60" />
        <div className="h-16 rounded-2xl bg-slate-800/60" />
      </div>

      {/* Content Lines */}
      <div className="space-y-3">
        <div className="w-full h-12 rounded-2xl bg-slate-800/40" />
        <div className="w-full h-24 rounded-2xl bg-slate-800/40" />
      </div>
    </div>
  );
};
