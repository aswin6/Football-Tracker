import React from 'react';
import { Shield, Target, User, AlertTriangle } from 'lucide-react';
import { useFootball } from '../context/FootballContext';
import { EVENT_TYPES } from '../constants/eventTypes';

const Summary = () => {
    const { state } = useFootball();

    const getAllPlayers = () => {
        return state.teams.flatMap(team => team.players);
    };

    const getAllEvents = () => {
        return state.matches.flatMap(match => match.events || []);
    };

    const getPlayerStats = () => {
        const players = getAllPlayers();
        const events = getAllEvents();
        const matches = state.matches;

        return players.map(player => {
            const playerAssists = events.filter(event =>
                (event.playerId !== player.id) && (event.assistPlayerId === player.id) && event.type === EVENT_TYPES.GOAL).length
            const playerEvents = events.filter(event => event.playerId === player.id);
            const playerMatches = matches.filter(match =>
                match.events?.some(event => event.playerId === player.id)
            );

            return {
                ...player,
                matchesPlayed: playerMatches.length,
                assists: playerAssists,
                goals: playerEvents.filter(e => e.type === EVENT_TYPES.GOAL).length,
                yellowCards: playerEvents.filter(e => e.type === EVENT_TYPES.YELLOW_CARD).length,
                redCards: playerEvents.filter(e => e.type === EVENT_TYPES.RED_CARD).length,
                cleanSheets: playerEvents.filter(e => e.type === EVENT_TYPES.CLEAN_SHEET).length,
                teamName: state.teams.find(t => t.id === player.teamId)?.name || 'Unknown'
            };
        });
    };

    const playerStats = getPlayerStats();

    const getTopGoalkeepers = () => {
        return playerStats
            .filter((player) => player.cleanSheets)
            .sort((a, b) => b.cleanSheets - a.cleanSheets)
            .slice(0, 10);
    };

    const getTopGoalScorers = () => {
        return playerStats
            .filter((player) => player.goals)
            .sort((a, b) => b.goals - a.goals)
            .slice(0, 10);
    };

    const getTopAssists = () => {
        return playerStats
            .filter((player) => player.assists)
            .sort((a, b) => b.assists - a.assists)
            .slice(0, 10);
    };

    const getMostBookedPlayers = () => {
        return playerStats
            .sort((a, b) => b.yellowCards - a.yellowCards)
            .slice(0, 10);
    };

    const StatCard = ({ title, icon: Icon, players, statKey, statLabel }) => (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
                <Icon size={24} className="text-blue-600" />
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="space-y-3">
                {players.length === 0 ? (
                    <p className="text-gray-500 text-sm">No data available</p>
                ) : (
                    players.map((player, index) => (
                        <div key={player.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-sm">{player.name}</p>
                                <p className="text-xs text-gray-500">{player.teamName} • {player.matchesPlayed} matches</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-blue-600">{player[statKey]}</p>
                                <p className="text-xs text-gray-500">{statLabel}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Summary & Stats</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <StatCard
                    title="Top Goalkeepers (Clean Sheets)"
                    icon={Shield}
                    players={getTopGoalkeepers()}
                    statKey="cleanSheets"
                    statLabel="clean sheets"
                />

                <StatCard
                    title="Top Goal Scorers"
                    icon={Target}
                    players={getTopGoalScorers()}
                    statKey="goals"
                    statLabel="goals"
                />

                <StatCard
                    title="Top Assists"
                    icon={User}
                    players={getTopAssists()}
                    statKey="assists"
                    statLabel="assists"
                />

                <StatCard
                    title="Most Booked Players"
                    icon={AlertTriangle}
                    players={getMostBookedPlayers()}
                    statKey="yellowCards"
                    statLabel="yellow cards"
                />
            </div>
        </div>
    );
};

export default Summary;