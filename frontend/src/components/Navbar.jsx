import React from 'react';
import { Trophy, Users, BarChart3, Plus, Activity, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onAddPlayer, isApiOnline }) {
  const navItems = [
    { id: 'overview', label: 'Leaderboards & Overview', icon: Trophy },
    { id: 'table', label: 'Player Database', icon: Users },
    { id: 'compare', label: 'Head-to-Head Compare', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#0d101d]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-emerald-400 p-[2px] shadow-lg shadow-purple-900/30">
              <div className="w-full h-full bg-[#0e1222] rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🦁</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  PREMIER STATS
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50 uppercase tracking-widest">
                  EPL 22/23
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Analytics & Performance Hub</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action & API Status Badge */}
          <div className="flex items-center space-x-3">
            {/* Status indicator */}
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isApiOnline
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}
              title={isApiOnline ? 'Spring Boot API is Online' : 'Using Local Dataset (Start Docker for Live DB)'}
            >
              <span className={`w-2 h-2 rounded-full ${isApiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline">{isApiOnline ? 'API Connected' : 'Demo Dataset'}</span>
            </div>

            {/* Add Player Button */}
            <button
              onClick={onAddPlayer}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Player</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex border-t border-slate-800/80 py-2 space-x-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
