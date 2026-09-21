import React from 'react';
import { Trophy, Flame, Target, Zap, ShieldAlert, ArrowRight, Activity, TrendingUp } from 'lucide-react';

export default function Overview({ onSelectPlayer, onStartCompare, onNavigateTable, players = [] }) {
  // Sort players for leaderboard highlights
  const topScorers = [...players].sort((a, b) => (b.gls || 0) - (a.gls || 0)).slice(0, 5);
  const topPlaymakers = [...players].sort((a, b) => (b.ast || 0) - (a.ast || 0)).slice(0, 5);
  const topXg = [...players].sort((a, b) => (b.xg || 0) - (a.xg || 0)).slice(0, 5);
  const mostCards = [...players].sort((a, b) => ((b.crdy || 0) + (b.crdr || 0) * 2) - ((a.crdy || 0) + (a.crdr || 0) * 2)).slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1f0d3d] via-[#121630] to-[#0a232b] border border-purple-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>2022-23 Premier League Statistics Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Advanced Performance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Intelligence & Metrics
            </span>
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore deep player metrics across all 20 clubs. Analyze expected goals (xG), playmaking efficiency, and head-to-head radar comparisons.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onNavigateTable}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-950/60 transition-all active:scale-95"
            >
              <span>Explore Player Database</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStartCompare("Erling Haaland", "Harry Kane")}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
            >
              <span>Compare: Haaland vs Kane</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Stat Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#141828]/80 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Golden Boot Leader</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-xl sm:text-2xl font-black text-white">{topScorers[0]?.name || "Erling Haaland"}</div>
            <span className="text-emerald-400 font-extrabold text-xl">{topScorers[0]?.gls || 18} <span className="text-xs font-normal text-slate-400">Gls</span></span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{topScorers[0]?.team || "Manchester City"}</p>
        </div>

        <div className="p-5 rounded-xl bg-[#141828]/80 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Playmaker King</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-xl sm:text-2xl font-black text-white">{topPlaymakers[0]?.name || "Kevin De Bruyne"}</div>
            <span className="text-cyan-400 font-extrabold text-xl">{topPlaymakers[0]?.ast || 9} <span className="text-xs font-normal text-slate-400">Ast</span></span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{topPlaymakers[0]?.team || "Manchester City"}</p>
        </div>

        <div className="p-5 rounded-xl bg-[#141828]/80 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Highest xG Threat</span>
            <Flame className="w-4 h-4 text-pink-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-xl sm:text-2xl font-black text-white">{topXg[0]?.name || "Erling Haaland"}</div>
            <span className="text-pink-400 font-extrabold text-xl">{topXg[0]?.xg || 11.1} <span className="text-xs font-normal text-slate-400">xG</span></span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{topXg[0]?.team || "Manchester City"}</p>
        </div>

        <div className="p-5 rounded-xl bg-[#141828]/80 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Disciplinary Focus</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-xl sm:text-2xl font-black text-white">{mostCards[0]?.name || "Harrison Reed"}</div>
            <span className="text-amber-400 font-extrabold text-xl">{mostCards[0]?.crdy || 5} <span className="text-xs font-normal text-slate-400">YC</span></span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{mostCards[0]?.team || "Fulham"}</p>
        </div>
      </div>

      {/* Leaderboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Golden Boot Race */}
        <div className="rounded-2xl bg-[#121628]/90 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Golden Boot Race</h3>
                <p className="text-xs text-slate-400">Top Premier League Goalscorers</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">Gls / xG</span>
          </div>

          <div className="mt-4 divide-y divide-slate-800/50">
            {topScorers.map((player, idx) => (
              <div
                key={player.name}
                onClick={() => onSelectPlayer(player)}
                className="py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 text-center font-black text-sm ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500'}`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-200 group-hover:text-emerald-400 transition-colors">
                      {player.name}
                    </div>
                    <div className="text-xs text-slate-400">{player.team} · <span className="text-slate-500">{player.pos}</span></div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-base text-emerald-400">{player.gls}</div>
                  <div className="text-[11px] text-slate-400">{player.xg} xG</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playmaker Award */}
        <div className="rounded-2xl bg-[#121628]/90 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Top Playmakers</h3>
                <p className="text-xs text-slate-400">Assists & Expected Assists (xAG)</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">Ast / xAG</span>
          </div>

          <div className="mt-4 divide-y divide-slate-800/50">
            {topPlaymakers.map((player, idx) => (
              <div
                key={player.name}
                onClick={() => onSelectPlayer(player)}
                className="py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 text-center font-black text-sm ${idx === 0 ? 'text-cyan-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-cyan-600' : 'text-slate-500'}`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {player.name}
                    </div>
                    <div className="text-xs text-slate-400">{player.team} · <span className="text-slate-500">{player.pos}</span></div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-base text-cyan-400">{player.ast}</div>
                  <div className="text-[11px] text-slate-400">{player.xag} xAG</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
