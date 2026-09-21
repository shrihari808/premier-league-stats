import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { GitCompare, Trophy, TrendingUp, ShieldAlert, Award, ArrowLeftRight } from 'lucide-react';

export default function PlayerComparison({ players = [], initialPlayerA = "", initialPlayerB = "" }) {
  const [playerAName, setPlayerAName] = useState(initialPlayerA || players[0]?.name || "Erling Haaland");
  const [playerBName, setPlayerBName] = useState(initialPlayerB || players[1]?.name || "Harry Kane");

  const playerA = players.find(p => p.name === playerAName) || players[0] || {};
  const playerB = players.find(p => p.name === playerBName) || players[1] || {};

  // Normalize data for Radar Chart
  const radarData = [
    { metric: "Goals", [playerA.name || "A"]: playerA.gls || 0, [playerB.name || "B"]: playerB.gls || 0 },
    { metric: "Assists", [playerA.name || "A"]: playerA.ast || 0, [playerB.name || "B"]: playerB.ast || 0 },
    { metric: "xG", [playerA.name || "A"]: playerA.xg || 0, [playerB.name || "B"]: playerB.xg || 0 },
    { metric: "xAG", [playerA.name || "A"]: playerA.xag || 0, [playerB.name || "B"]: playerB.xag || 0 },
    { metric: "Matches", [playerA.name || "A"]: playerA.mp || 0, [playerB.name || "B"]: playerB.mp || 0 },
  ];

  const compareStat = (valA = 0, valB = 0) => {
    if (valA > valB) return { aWinner: true, bWinner: false };
    if (valB > valA) return { aWinner: false, bWinner: true };
    return { aWinner: false, bWinner: false };
  };

  const statMetrics = [
    { label: "Goals Scored", key: "gls", unit: "" },
    { label: "Assists", key: "ast", unit: "" },
    { label: "Expected Goals (xG)", key: "xg", unit: "" },
    { label: "Expected Assists (xAG)", key: "xag", unit: "" },
    { label: "Minutes Played", key: "min", unit: "'" },
    { label: "Matches Played", key: "mp", unit: "" },
    { label: "Starts", key: "starts", unit: "" },
    { label: "Yellow Cards", key: "crdy", unit: "" },
    { label: "Red Cards", key: "crdr", unit: "" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Comparison Selector Controls */}
      <div className="p-6 rounded-2xl bg-[#121628]/90 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
          <GitCompare className="w-4 h-4 text-emerald-400" />
          <span>Head-to-Head Comparison Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Player A Selection */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Player A (Emerald)
            </label>
            <select
              value={playerAName}
              onChange={(e) => setPlayerAName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white font-semibold text-sm border border-slate-700 focus:outline-none focus:border-emerald-400"
            >
              {players.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.team?.replace(/-/g, ' ')} - {p.pos})
                </option>
              ))}
            </select>
          </div>

          {/* Player B Selection */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30">
            <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              Player B (Cyan)
            </label>
            <select
              value={playerBName}
              onChange={(e) => setPlayerBName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white font-semibold text-sm border border-slate-700 focus:outline-none focus:border-cyan-400"
            >
              {players.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.team?.replace(/-/g, ' ')} - {p.pos})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Radar & Metrics Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#121628]/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Performance Radar</h3>
            <p className="text-xs text-slate-400 mt-0.5">Multi-metric head-to-head mapping</p>
          </div>

          <div className="h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#2e3856" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} stroke="#475569" />
                <Radar
                  name={playerA.name || "Player A"}
                  dataKey={playerA.name || "A"}
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Radar
                  name={playerB.name || "Player B"}
                  dataKey={playerB.name || "B"}
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-center text-slate-400 pt-2 border-t border-slate-800">
            Metrics normalize goals, assists, expected goals (xG), and appearances.
          </div>
        </div>

        {/* Detailed Metric Cards (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#121628]/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="text-left">
              <span className="text-xs text-emerald-400 font-bold uppercase">{playerA.team?.replace(/-/g, ' ')}</span>
              <h4 className="text-lg font-black text-white">{playerA.name}</h4>
              <span className="text-xs text-slate-400">{playerA.pos} · {playerA.nation}</span>
            </div>

            <div className="p-2 rounded-full bg-slate-800 text-slate-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>

            <div className="text-right">
              <span className="text-xs text-cyan-400 font-bold uppercase">{playerB.team?.replace(/-/g, ' ')}</span>
              <h4 className="text-lg font-black text-white">{playerB.name}</h4>
              <span className="text-xs text-slate-400">{playerB.pos} · {playerB.nation}</span>
            </div>
          </div>

          {/* Metric Rows */}
          <div className="mt-4 space-y-3.5">
            {statMetrics.map(({ label, key, unit }) => {
              const valA = playerA[key] ?? 0;
              const valB = playerB[key] ?? 0;
              const { aWinner, bWinner } = compareStat(valA, valB);

              return (
                <div key={key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                    <span className={`font-mono text-sm ${aWinner ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
                      {valA}{unit}
                    </span>
                    <span className="text-slate-300 font-medium">{label}</span>
                    <span className={`font-mono text-sm ${bWinner ? 'text-cyan-400 font-bold' : 'text-slate-200'}`}>
                      {valB}{unit}
                    </span>
                  </div>

                  {/* Relative bar comparison */}
                  <div className="flex items-center h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${aWinner ? 'bg-emerald-500' : 'bg-emerald-800/60'}`}
                      style={{ width: `${(Number(valA) / (Number(valA) + Number(valB) || 1)) * 100}%` }}
                    />
                    <div
                      className={`h-full ${bWinner ? 'bg-cyan-500' : 'bg-cyan-800/60'}`}
                      style={{ width: `${(Number(valB) / (Number(valA) + Number(valB) || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
