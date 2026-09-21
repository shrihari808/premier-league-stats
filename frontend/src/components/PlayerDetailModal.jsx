import React from 'react';
import { X, GitCompare, Edit3, Shield, Award, Zap } from 'lucide-react';

export default function PlayerDetailModal({ player, isOpen, onClose, onCompare, onEdit }) {
  if (!isOpen || !player) return null;

  const per90 = (val) => {
    const minutes = player.min || 0;
    if (minutes === 0) return '0.00';
    return ((val / minutes) * 90).toFixed(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#121628] border border-slate-700 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {player.team?.replace(/-/g, ' ')}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400 font-semibold">{player.nation}</span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">{player.name}</h3>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60">
              {player.pos}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-5 space-y-4">
          {/* Main Highlights */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-center">
              <span className="text-xs font-semibold text-emerald-400 uppercase">Goals Scored</span>
              <div className="text-3xl font-black text-emerald-300 mt-1">{player.gls || 0}</div>
              <span className="text-[11px] text-emerald-400/80">{per90(player.gls || 0)} per 90</span>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-center">
              <span className="text-xs font-semibold text-cyan-400 uppercase">Assists Provided</span>
              <div className="text-3xl font-black text-cyan-300 mt-1">{player.ast || 0}</div>
              <span className="text-[11px] text-cyan-400/80">{per90(player.ast || 0)} per 90</span>
            </div>
          </div>

          {/* Underlying Metrics */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Expected Goals (xG)</span>
              <span className="font-mono font-bold text-slate-200">{player.xg?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Expected Assists (xAG)</span>
              <span className="font-mono font-bold text-slate-200">{player.xag?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Minutes Played</span>
              <span className="font-mono font-bold text-slate-200">{Math.round(player.min || 0)}'</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Matches (Starts)</span>
              <span className="font-mono font-bold text-slate-200">{player.mp} ({player.starts})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Penalties Converted</span>
              <span className="font-mono font-bold text-slate-200">{player.pk || 0}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Discipline</span>
              <span className="font-mono font-bold text-slate-200">
                {player.crdy || 0} Yellow · {player.crdr || 0} Red
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onCompare(player.name);
            }}
            className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            <GitCompare className="w-4 h-4 text-emerald-400" />
            <span>Compare in Radar</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(player);
            }}
            className="flex items-center space-x-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Stats</span>
          </button>
        </div>
      </div>
    </div>
  );
}
