import axios from 'axios';
import { MOCK_PLAYERS } from '../data/mockPlayers';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/player';

export const checkBackendHealth = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}?size=1`, { timeout: 2500 });
    return { online: true, data: res.data };
  } catch (err) {
    return { online: false, error: err.message };
  }
};

export const getPlayers = async (params = {}) => {
  try {
    const response = await axios.get(API_BASE_URL, { params, timeout: 4000 });
    return {
      content: response.data.content || [],
      totalPages: response.data.totalPages || 1,
      totalElements: response.data.totalElements || 0,
      number: response.data.number || 0,
      size: response.data.size || 20,
      isLive: true,
    };
  } catch (err) {
    console.warn("Backend not reachable, falling back to local dataset:", err.message);

    // Fallback client-side filtering on mock data
    let filtered = [...MOCK_PLAYERS];

    if (params.name) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(params.name.toLowerCase()));
    }
    if (params.team) {
      filtered = filtered.filter(p => p.team.toLowerCase().includes(params.team.toLowerCase()));
    }
    if (params.position) {
      filtered = filtered.filter(p => p.pos.toLowerCase().includes(params.position.toLowerCase()));
    }
    if (params.nation) {
      filtered = filtered.filter(p => p.nation.toLowerCase().includes(params.nation.toLowerCase()));
    }
    if (params.minGoals != null) {
      filtered = filtered.filter(p => p.gls >= Number(params.minGoals));
    }
    if (params.minAssists != null) {
      filtered = filtered.filter(p => p.ast >= Number(params.minAssists));
    }

    // Sorting
    if (params.sort) {
      const [field, dir] = params.sort.split(',');
      const isAsc = dir === 'asc';
      filtered.sort((a, b) => {
        const valA = a[field] ?? '';
        const valB = b[field] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return isAsc ? valA - valB : valB - valA;
        }
        return isAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
      });
    }

    // Pagination
    const page = params.page || 0;
    const size = params.size || 20;
    const startIndex = page * size;
    const paginated = filtered.slice(startIndex, startIndex + size);

    return {
      content: paginated,
      totalPages: Math.ceil(filtered.length / size) || 1,
      totalElements: filtered.length,
      number: page,
      size: size,
      isLive: false,
    };
  }
};

export const getPlayerByName = async (name) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${encodeURIComponent(name)}`, { timeout: 4000 });
    return res.data;
  } catch (err) {
    const found = MOCK_PLAYERS.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (found) return found;
    throw err;
  }
};

export const createPlayer = async (player) => {
  const res = await axios.post(API_BASE_URL, player);
  return res.data;
};

export const updatePlayer = async (player) => {
  const res = await axios.put(API_BASE_URL, player);
  return res.data;
};

export const deletePlayer = async (playerName) => {
  const res = await axios.delete(`${API_BASE_URL}/${encodeURIComponent(playerName)}`);
  return res.data;
};
