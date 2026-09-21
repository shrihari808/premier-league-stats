import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const CLUBS = [
  "Arsenal", "Aston-Villa", "Bournemouth", "Brentford", "Brighton-and-Hove-Albion",
  "Chelsea", "Crystal-Palace", "Everton", "Fulham", "Leeds-United",
  "Leicester-City", "Liverpool", "Manchester-City", "Manchester-United", "Newcastle-United",
  "Nottingham-Forest", "Southampton", "Tottenham-Hotspur", "West-Ham-United", "Wolverhampton-Wanderers"
];

export default function PlayerModal({ isOpen, onClose, onSave, playerToEdit }) {
  const isEditing = !!playerToEdit;

  const initialForm = {
    name: '',
    team: 'Arsenal',
    pos: 'FW',
    nation: 'ENG',
    age: 24,
    mp: 10,
    starts: 8,
    min: 750.0,
    gls: 3.0,
    ast: 2.0,
    pk: 0.0,
    crdy: 1.0,
    crdr: 0.0,
    xg: 2.8,
    xag: 1.5,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (playerToEdit) {
      setFormData({
        name: playerToEdit.name || '',
        team: playerToEdit.team || 'Arsenal',
        pos: playerToEdit.pos || 'FW',
        nation: playerToEdit.nation || 'ENG',
        age: playerToEdit.age ?? 24,
        mp: playerToEdit.mp ?? 0,
        starts: playerToEdit.starts ?? 0,
        min: playerToEdit.min ?? 0.0,
        gls: playerToEdit.gls ?? 0.0,
        ast: playerToEdit.ast ?? 0.0,
        pk: playerToEdit.pk ?? 0.0,
        crdy: playerToEdit.crdy ?? 0.0,
        crdr: playerToEdit.crdr ?? 0.0,
        xg: playerToEdit.xg ?? 0.0,
        xag: playerToEdit.xag ?? 0.0,
      });
    } else {
      setFormData(initialForm);
    }
  }, [playerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Player Name is required.");
    onSave(formData, isEditing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#121628] border border-slate-700 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">
              {isEditing ? `Edit Stats: ${playerToEdit.name}` : 'Add New Player Record'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in player details and seasonal metrics
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Player Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Player Name *</label>
              <input
                type="text"
                name="name"
                disabled={isEditing} // Primary key in backend
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Bukayo Saka"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
            </div>

            {/* Club / Team */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Club / Team *</label>
              <select
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {CLUBS.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Position *</label>
              <input
                type="text"
                name="pos"
                value={formData.pos}
                onChange={handleChange}
                placeholder="FW, MF, DF, GK"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nationality</label>
              <input
                type="text"
                name="nation"
                value={formData.nation}
                onChange={handleChange}
                placeholder="ENG, BRA, FRA"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Numerical Stats Grid */}
          <div className="pt-2 border-t border-slate-800">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Performance Statistics
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Matches (MP)</label>
                <input
                  type="number"
                  name="mp"
                  value={formData.mp}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Starts</label>
                <input
                  type="number"
                  name="starts"
                  value={formData.starts}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Minutes (Min)</label>
                <input
                  type="number"
                  step="0.1"
                  name="min"
                  value={formData.min}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-emerald-400 font-bold mb-1">Goals (Gls)</label>
                <input
                  type="number"
                  step="0.1"
                  name="gls"
                  value={formData.gls}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/50 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-cyan-400 font-bold mb-1">Assists (Ast)</label>
                <input
                  type="number"
                  step="0.1"
                  name="ast"
                  value={formData.ast}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/50 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Exp Goals (xG)</label>
                <input
                  type="number"
                  step="0.1"
                  name="xg"
                  value={formData.xg}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Exp Assists (xAG)</label>
                <input
                  type="number"
                  step="0.1"
                  name="xag"
                  value={formData.xag}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-amber-400 mb-1">Yellow Cards</label>
                <input
                  type="number"
                  name="crdy"
                  value={formData.crdy}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-rose-400 mb-1">Red Cards</label>
                <input
                  type="number"
                  name="crdr"
                  value={formData.crdr}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Penalties (PK)</label>
                <input
                  type="number"
                  step="0.1"
                  name="pk"
                  value={formData.pk}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Player'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
