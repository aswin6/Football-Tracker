import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFootball } from '../context/FootballContext';
import { EVENT_TYPES } from '../constants/eventTypes';
import Modal from './Modal';

const Matches = () => {
  const { state, dispatch } = useFootball();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [eventType, setEventType] = useState(EVENT_TYPES.GOAL);
  const [selectedTeamId, setSelectedTeamId] = useState(''); // New state for team selection
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [assistPlayerId, setAssistPlayerId] = useState('');
  const [eventTime, setEventTime] = useState('');

  const handleCreateMatch = (e) => {
    e.preventDefault();
    if (!team1Id || !team2Id || team1Id === team2Id) return;

    const newMatch = {
      id: Date.now().toString(),
      team1Id,
      team2Id,
      status: 'active',
      events: []
    };

    dispatch({ type: 'CREATE_MATCH', payload: newMatch });
    setTeam1Id('');
    setTeam2Id('');
    setShowMatchModal(false);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!selectedPlayerId || !selectedMatch || !selectedTeamId) return;

    const newEvent = {
      id: Date.now().toString(),
      playerId: selectedPlayerId,
      teamId: selectedTeamId, // Add teamId to event
      type: eventType,
      assistPlayerId: eventType === EVENT_TYPES.GOAL ? assistPlayerId : undefined,
      time: eventTime || undefined,
      matchId: selectedMatch.id
    };

    dispatch({ type: 'ADD_MATCH_EVENT', payload: newEvent });
    setSelectedPlayerId('');
    setSelectedTeamId('');
    setAssistPlayerId('');
    setEventTime('');
    setShowEventModal(false);
  };

  // Reset dependent fields when team changes
  const handleTeamChange = (teamId) => {
    setSelectedTeamId(teamId);
    setSelectedPlayerId('');
    setAssistPlayerId('');
  };

  const getTeamPlayers = (teamId) => {
    const team = state.teams.find(t => t.id === teamId);
    return team?.players || [];
  };

  const getMatchPlayers = (match) => {
    const team1Players = getTeamPlayers(match.team1Id);
    const team2Players = getTeamPlayers(match.team2Id);
    return [...team1Players, ...team2Players];
  };

  const getTeamName = (teamId) => {
    return state.teams.find(t => t.id === teamId)?.name || 'Unknown Team';
  };

  const getPlayerName = (playerId) => {
    for (const team of state.teams) {
      const player = team.players.find(p => p.id === playerId);
      if (player) return player.name;
    }
    return 'Unknown Player';
  };

  // Calculate match score
  const getMatchScore = (match) => {
    let team1Score = 0;
    let team2Score = 0;

    if (match.events) {
      match.events.forEach(event => {
        if (event.type === EVENT_TYPES.GOAL) {
          if (event.teamId === match.team1Id) {
            team1Score++;
          } else if (event.teamId === match.team2Id) {
            team2Score++;
          }
        }
      });
    }

    return { team1Score, team2Score };
  };

  const completeMatch = (matchId) => {
    dispatch({ type: 'COMPLETE_MATCH', payload: { matchId } });
  };

  // Get available teams for the selected match
  const getMatchTeams = (match) => {
    return [
      { id: match.team1Id, name: getTeamName(match.team1Id) },
      { id: match.team2Id, name: getTeamName(match.team2Id) }
    ];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
        <button
          onClick={() => setShowMatchModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          New Match
        </button>
      </div>

      <div className="space-y-4">
        {state.matches.map(match => {
          const { team1Score, team2Score } = getMatchScore(match);
          
          return (
            <div key={match.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {getTeamName(match.team1Id)} vs {getTeamName(match.team2Id)}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {team1Score} - {team2Score}
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      match.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {match.status === 'active' ? 'Live' : 'Completed'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {match.status === 'active' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedMatch(match);
                          setShowEventModal(true);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Add Event
                      </button>
                      <button
                        onClick={() => completeMatch(match.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Complete Match
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Match Events</h4>
                {(!match.events || match.events.length === 0) ? (
                  <p className="text-gray-400 text-sm">No events recorded</p>
                ) : (
                  <div className="space-y-2">
                    {match.events.map(event => (
                      <div key={event.id} className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500 w-12">
                          {event.time ? `${event.time}'` : '--'}
                        </span>
                        <span className="font-medium">{getPlayerName(event.playerId)}</span>
                        <span className="text-gray-600 text-xs">
                          ({getTeamName(event.teamId)})
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.type === EVENT_TYPES.GOAL
                            ? 'bg-green-100 text-green-800'
                            : event.type === EVENT_TYPES.YELLOW_CARD
                            ? 'bg-yellow-100 text-yellow-800'
                            : event.type === EVENT_TYPES.RED_CARD
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {event.type.replace('_', ' ').toUpperCase()}
                        </span>
                        {event.assistPlayerId && (
                          <span className="text-gray-500">
                            (Assist: {getPlayerName(event.assistPlayerId)})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Match Modal */}
      <Modal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        title="Create New Match"
      >
        <form onSubmit={handleCreateMatch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team 1
            </label>
            <select
              value={team1Id}
              onChange={(e) => setTeam1Id(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Team 1</option>
              {state.teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team 2
            </label>
            <select
              value={team2Id}
              onChange={(e) => setTeam2Id(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Team 2</option>
              {state.teams.filter(team => team.id !== team1Id).map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowMatchModal(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Match
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedTeamId('');
          setSelectedPlayerId('');
          setAssistPlayerId('');
          setEventTime('');
        }}
        title="Add Match Event"
      >
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={EVENT_TYPES.GOAL}>Goal</option>
              <option value={EVENT_TYPES.YELLOW_CARD}>Yellow Card</option>
              <option value={EVENT_TYPES.RED_CARD}>Red Card</option>
              <option value={EVENT_TYPES.CLEAN_SHEET}>Clean Sheet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team *
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => handleTeamChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Team</option>
              {selectedMatch && getMatchTeams(selectedMatch).map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Player *
            </label>
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!selectedTeamId}
            >
              <option value="">Select Player</option>
              {selectedTeamId && getTeamPlayers(selectedTeamId).map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          {eventType === EVENT_TYPES.GOAL && selectedTeamId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assist Player
              </label>
              <select
                value={assistPlayerId}
                onChange={(e) => setAssistPlayerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Assist Player (Optional)</option>
                {getTeamPlayers(selectedTeamId)
                  .filter(player => player.id !== selectedPlayerId)
                  .map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time (Optional)
            </label>
            <input
              type="number"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minutes"
              min="1"
              max="120"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowEventModal(false);
                setSelectedTeamId('');
                setSelectedPlayerId('');
                setAssistPlayerId('');
                setEventTime('');
              }}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Matches;