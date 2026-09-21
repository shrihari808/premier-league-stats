import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Overview from './components/Overview';
import PlayerTable from './components/PlayerTable';
import PlayerComparison from './components/PlayerComparison';
import PlayerModal from './components/PlayerModal';
import PlayerDetailModal from './components/PlayerDetailModal';
import { getPlayers, createPlayer, updatePlayer, deletePlayer, checkBackendHealth } from './services/api';
import { MOCK_PLAYERS } from './data/mockPlayers';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [players, setPlayers] = useState([]);
  const [leaderboardPool, setLeaderboardPool] = useState(MOCK_PLAYERS);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [isApiOnline, setIsApiOnline] = useState(false);

  // Filters & Sorting
  const [filters, setFilters] = useState({
    name: '',
    team: '',
    position: '',
    nation: '',
    minGoals: '',
    minAssists: '',
  });

  const [sortConfig, setSortConfig] = useState({
    field: 'gls',
    dir: 'desc',
  });

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState(null);
  const [detailPlayer, setDetailPlayer] = useState(null);

  // Comparison specific players
  const [compareA, setCompareA] = useState("Erling Haaland");
  const [compareB, setCompareB] = useState("Harry Kane");

  // Fetch players from API or fallback
  const fetchPlayerData = useCallback(async () => {
    setLoading(true);
    try {
      const sortParam = `${sortConfig.field},${sortConfig.dir}`;
      const params = {
        page,
        size,
        sort: sortParam,
      };

      if (filters.name) params.name = filters.name;
      if (filters.team) params.team = filters.team;
      if (filters.position) params.position = filters.position;
      if (filters.nation) params.nation = filters.nation;
      if (filters.minGoals) params.minGoals = filters.minGoals;
      if (filters.minAssists) params.minAssists = filters.minAssists;

      const result = await getPlayers(params);
      setPlayers(result.content);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
      setIsApiOnline(result.isLive);

      if (result.content.length > 0) {
        setLeaderboardPool((prev) => (result.isLive ? result.content : prev));
      }
    } catch (err) {
      console.error("Error fetching player data:", err);
    } finally {
      setLoading(false);
    }
  }, [page, size, filters, sortConfig]);

  // Initial load & healthcheck
  useEffect(() => {
    checkBackendHealth().then(({ online }) => {
      setIsApiOnline(online);
    });
    fetchPlayerData();
  }, [fetchPlayerData]);

  // Load larger sample for comparisons if needed
  useEffect(() => {
    getPlayers({ page: 0, size: 100, sort: 'gls,desc' }).then(res => {
      if (res.content && res.content.length > 0) {
        setLeaderboardPool(res.content);
      }
    }).catch(() => {});
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      team: '',
      position: '',
      nation: '',
      minGoals: '',
      minAssists: '',
    });
    setPage(0);
  };

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      dir: prev.field === field && prev.dir === 'desc' ? 'asc' : 'desc',
    }));
    setPage(0);
  };

  const handleSavePlayer = async (playerData, isEditing) => {
    try {
      if (isEditing) {
        await updatePlayer(playerData);
      } else {
        await createPlayer(playerData);
      }
      setIsModalOpen(false);
      setPlayerToEdit(null);
      fetchPlayerData();
    } catch (err) {
      alert(`Operation failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeletePlayer = async (playerName) => {
    if (!window.confirm(`Are you sure you want to delete ${playerName}?`)) return;
    try {
      await deletePlayer(playerName);
      fetchPlayerData();
    } catch (err) {
      alert(`Failed to delete player: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleStartCompare = (nameA, nameB) => {
    if (nameA) setCompareA(nameA);
    if (nameB) setCompareB(nameB);
    setActiveTab('compare');
  };

  return (
    <div className="min-h-screen bg-[#0d0f18] text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isApiOnline={isApiOnline}
        onAddPlayer={() => {
          setPlayerToEdit(null);
          setIsModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner when in Demo Dataset Mode */}
        {!isApiOnline && (
          <div className="mb-6 p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-purple-200">
              <span className="text-base">💡</span>
              <div>
                <span className="font-bold text-white">Running on Interactive Demo Dataset: </span>
                <span>
                  The UI is fully operational with real Premier League 22/23 stats. To connect to the live PostgreSQL backend, launch Docker Desktop and run <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400 font-mono">docker compose up</code> in your terminal.
                </span>
              </div>
            </div>
            <button
              onClick={() => checkBackendHealth().then(({ online }) => {
                setIsApiOnline(online);
                if (online) fetchPlayerData();
              })}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold whitespace-nowrap"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <Overview
            players={leaderboardPool}
            onSelectPlayer={(p) => setDetailPlayer(p)}
            onStartCompare={handleStartCompare}
            onNavigateTable={() => setActiveTab('table')}
          />
        )}

        {activeTab === 'table' && (
          <PlayerTable
            players={players}
            totalElements={totalElements}
            page={page}
            size={size}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setSize(newSize);
              setPage(0);
            }}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            sortConfig={sortConfig}
            onSort={handleSort}
            loading={loading}
            onViewPlayer={(p) => setDetailPlayer(p)}
            onEditPlayer={(p) => {
              setPlayerToEdit(p);
              setIsModalOpen(true);
            }}
            onDeletePlayer={handleDeletePlayer}
            onCompareWith={(name) => handleStartCompare(name, compareB)}
          />
        )}

        {activeTab === 'compare' && (
          <PlayerComparison
            players={leaderboardPool.length > 0 ? leaderboardPool : players}
            initialPlayerA={compareA}
            initialPlayerB={compareB}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0a0c14] py-6 text-center text-xs text-slate-500">
        <p>Premier League Statistics Intelligence Engine · Powered by Spring Boot 3 & React + Vite</p>
      </footer>

      {/* Add / Edit Player Modal */}
      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPlayerToEdit(null);
        }}
        onSave={handleSavePlayer}
        playerToEdit={playerToEdit}
      />

      {/* Player Detail Modal */}
      <PlayerDetailModal
        player={detailPlayer}
        isOpen={!!detailPlayer}
        onClose={() => setDetailPlayer(null)}
        onCompare={(name) => handleStartCompare(name, compareB)}
        onEdit={(p) => {
          setPlayerToEdit(p);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}
