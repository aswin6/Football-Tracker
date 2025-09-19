import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFootball } from '../context/FootballContext';
import Modal from './Modal';

const Teams = () => {
    const { state, dispatch } = useFootball();
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamName, setTeamName] = useState('');
    const [playerName, setPlayerName] = useState('');

    const handleAddTeam = (e) => {
        e.preventDefault();
        if (!teamName.trim()) return;

        const newTeam = {
            id: Date.now().toString(),
            name: teamName.trim()
        };

        dispatch({ type: 'ADD_TEAM', payload: newTeam });
        setTeamName('');
        setShowTeamModal(false);
    };

    const handleAddPlayer = (e) => {
        e.preventDefault();
        if (!playerName.trim() || !selectedTeam) return;

        const newPlayer = {
            id: Date.now().toString(),
            name: playerName.trim(),
            teamId: selectedTeam.id
        };

        dispatch({ type: 'ADD_PLAYER', payload: newPlayer });
        setPlayerName('');
        setShowPlayerModal(false);
        setSelectedTeam(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
                <button
                    onClick={() => setShowTeamModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add Team
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {state.teams.map(team => (
                    <div key={team.id} className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{team.name}</h3>
                            <button
                                onClick={() => {
                                    setSelectedTeam(team);
                                    setShowPlayerModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-600 font-medium">Players ({team.players.length})</p>
                            {team.players.length === 0 ? (
                                <p className="text-gray-400 text-sm">No players added yet</p>
                            ) : (
                                team.players.map(player => (
                                    <div key={player.id} className="flex justify-between items-center py-1">
                                        <span className="text-sm">{player.name}</span>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{player.position}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Team Modal */}
            <Modal
                isOpen={showTeamModal}
                onClose={() => setShowTeamModal(false)}
                title="Add New Team"
            >
                <form onSubmit={handleAddTeam} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Team Name
                        </label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter team name"
                            required
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowTeamModal(false)}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Add Team
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Add Player Modal */}
            <Modal
                isOpen={showPlayerModal}
                onClose={() => {
                    setShowPlayerModal(false);
                    setSelectedTeam(null);
                }}
                title={`Add Player to ${selectedTeam?.name || ''}`}
            >
                <form onSubmit={handleAddPlayer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Player Name
                        </label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter player name"
                            required
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setShowPlayerModal(false);
                                setSelectedTeam(null);
                            }}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Add Player
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Teams;