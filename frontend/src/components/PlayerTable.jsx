import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Edit3, Trash2, GitCompare, RotateCcw, Eye } from 'lucide-react';

const PREM_CLUBS = [
  "Arsenal", "Aston-Villa", "Bournemouth", "Brentford", "Brighton-and-Hove-Albion",
  "Chelsea", "Crystal-Palace", "Everton", "Fulham", "Leeds-United",
  "Leicester-City", "Liverpool", "Manchester-City", "Manchester-United", "Newcastle-United",
  "Nottingham-Forest", "Southampton", "Tottenham-Hotspur", "West-Ham-United", "Wolverhampton-Wanderers"
];

const POSITIONS = ["ALL", "FW", "MF", "DF", "GK"];

export default function PlayerTable({
  players = [],
  totalElements = 0,
  page = 0,
  size = 20,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  filters,
  onFilterChange,
  onResetFilters,
  sortConfig,
  onSort,
  onViewPlayer,
  onEditPlayer,
  onDeletePlayer,
  onCompareWith,
  loading = false
}) {
  const [searchTerm, setSearchTerm] = useState(filters.name || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange('name', searchTerm);
  };

  const getPositionBadge = (pos) => {
    if (!pos) return null;
    let colorClass = "bg-slate-800 text-slate-300 border-slate-700";
    if (pos.includes("FW")) colorClass = "bg-rose-950/70 text-rose-300 border-rose-800/60";
    else if (pos.includes("MF")) colorClass = "bg-purple-950/70 text-purple-300 border-purple-800/60";
    else if (pos.includes("DF")) colorClass = "bg-emerald-950/70 text-emerald-300 border-emerald-800/60";
    else if (pos.includes("GK")) colorClass = "bg-amber-950/70 text-amber-300 border-amber-800/60";

    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${colorClass}`}>
        {pos}
      </span>
    );
  };

  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity" />;
    }
    return (
      <span className="text-emerald-400 font-bold text-xs">
        {sortConfig.dir === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121628]/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search player name (e.g. Saka, De Bruyne)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Club Filter Dropdown */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
            <select
              value={filters.team || ''}
              onChange={(e) => onFilterChange('team', e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="">All Clubs (20 Teams)</option>
              {PREM_CLUBS.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/-/g, ' ')}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSearchTerm('');
                onResetFilters();
              }}
              title="Reset all filters"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Position Pills & Min Goals Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          {/* Position Selectors */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <span className="text-xs text-slate-400 font-semibold mr-1">Position:</span>
            {POSITIONS.map((pos) => {
              const active = (filters.position === pos) || (pos === 'ALL' && !filters.position);
              return (
                <button
                  key={pos}
                  onClick={() => onFilterChange('position', pos === 'ALL' ? '' : pos)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-900'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {pos}
                </button>
              );
            })}
          </div>

          {/* Goals threshold filter */}
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <span>Min Goals:</span>
            <input
              type="number"
              min="0"
              max="30"
              value={filters.minGoals ?? ''}
              placeholder="0"
              onChange={(e) => onFilterChange('minGoals', e.target.value)}
              className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl bg-[#121628]/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e1222] text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th
                  onClick={() => onSort('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Player</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th
                  onClick={() => onSort('team')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Club</span>
                    {renderSortIcon('team')}
                  </div>
                </th>
                <th className="py-3.5 px-3">Pos</th>
                <th
                  onClick={() => onSort('mp')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>MP</span>
                    {renderSortIcon('mp')}
                  </div>
                </th>
                <th
                  onClick={() => onSort('min')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Min</span>
                    {renderSortIcon('min')}
                  </div>
                </th>
                <th
                  onClick={() => onSort('gls')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <span>Gls</span>
                    {renderSortIcon('gls')}
                  </div>
                </th>
                <th
                  onClick={() => onSort('ast')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-1.5 text-cyan-400">
                    <span>Ast</span>
                    {renderSortIcon('ast')}
                  </div>
                </th>
                <th
                  onClick={() => onSort('xg')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>xG</span>
                    {renderSortIcon('xg')}
                  </div>
                </th>
                <th
                  onClick={() => onSort('xag')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>xAG</span>
                    {renderSortIcon('xag')}
                  </div>
                </th>
                <th className="py-3.5 px-3">Cards</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="11" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading Premier League player metrics...</span>
                    </div>
                  </td>
                </tr>
              ) : players.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-12 text-center text-slate-400">
                    No players found matching your current filter criteria.
                  </td>
                </tr>
              ) : (
                players.map((p) => (
                  <tr
                    key={p.name}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Player Name & Nationality */}
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      <div
                        onClick={() => onViewPlayer(p)}
                        className="cursor-pointer hover:text-emerald-400 transition-colors flex items-center space-x-2"
                      >
                        <span>{p.name}</span>
                        {p.nation && (
                          <span className="text-[10px] font-mono text-slate-400 px-1 py-0.2 rounded bg-slate-800">
                            {p.nation}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Club */}
                    <td className="py-3 px-3 text-xs text-slate-300">
                      {p.team?.replace(/-/g, ' ')}
                    </td>

                    {/* Position */}
                    <td className="py-3 px-3">
                      {getPositionBadge(p.pos)}
                    </td>

                    {/* Matches */}
                    <td className="py-3 px-3 text-xs font-mono">{p.mp}</td>

                    {/* Minutes */}
                    <td className="py-3 px-3 text-xs font-mono text-slate-400">
                      {Math.round(p.min || 0)}'
                    </td>

                    {/* Goals */}
                    <td className="py-3 px-3 font-bold font-mono text-emerald-400 text-sm">
                      {p.gls || 0}
                    </td>

                    {/* Assists */}
                    <td className="py-3 px-3 font-bold font-mono text-cyan-400 text-sm">
                      {p.ast || 0}
                    </td>

                    {/* xG */}
                    <td className="py-3 px-3 text-xs font-mono text-slate-300">
                      {p.xg?.toFixed(1) || '0.0'}
                    </td>

                    {/* xAG */}
                    <td className="py-3 px-3 text-xs font-mono text-slate-300">
                      {p.xag?.toFixed(1) || '0.0'}
                    </td>

                    {/* Cards */}
                    <td className="py-3 px-3 text-xs">
                      <div className="flex items-center space-x-1.5 font-mono">
                        <span className="px-1 rounded bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                          {p.crdy || 0}Y
                        </span>
                        {p.crdr > 0 && (
                          <span className="px-1 rounded bg-rose-500/20 text-rose-300 text-[11px] font-bold">
                            {p.crdr}R
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onCompareWith(p.name)}
                          title="Compare Player"
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onViewPlayer(p)}
                          title="View Profile"
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditPlayer(p)}
                          title="Edit Player"
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-purple-400 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeletePlayer(p.name)}
                          title="Delete Player"
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-[#0e1222] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span>Showing</span>
            <span className="font-bold text-slate-200">
              {players.length > 0 ? page * size + 1 : 0} - {Math.min((page + 1) * size, totalElements)}
            </span>
            <span>of</span>
            <span className="font-bold text-slate-200">{totalElements}</span>
            <span>players</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Page Size Selector */}
            <div className="flex items-center space-x-1.5">
              <span>Show:</span>
              <select
                value={size}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Prev / Next buttons */}
            <div className="flex items-center space-x-1">
              <button
                disabled={page <= 0}
                onClick={() => onPageChange(page - 1)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-slate-300">
                {page + 1} / {Math.max(totalPages, 1)}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => onPageChange(page + 1)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
