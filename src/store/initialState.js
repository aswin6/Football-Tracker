import { EVENT_TYPES } from '../constants/eventTypes';

export const initialState = {
    teams: [
        {
            id: '1',
            name: 'Manchester United',
            players: [
                { id: '1', name: 'Marcus Rashford', teamId: '1' },
                { id: '2', name: 'Bruno Fernandes', teamId: '1' },
                { id: '3', name: 'David de Gea', teamId: '1' }
            ]
        },
        {
            id: '2',
            name: 'Liverpool FC',
            players: [
                { id: '4', name: 'Mohamed Salah', teamId: '2' },
                { id: '5', name: 'Virgil van Dijk', teamId: '2' },
                { id: '6', name: 'Alisson Becker', teamId: '2' }
            ]
        }
    ],
    matches: [
        {
            id: '1',
            team1Id: '1',
            team2Id: '2',
            status: 'completed',
            events: [
                { id: '1', playerId: '1', type: EVENT_TYPES.GOAL, assistPlayerId: '2', time: '25', matchId: '1' },
                { id: '2', playerId: '4', type: EVENT_TYPES.GOAL, assistPlayerId: '5', time: '67', matchId: '1' },
                { id: '3', playerId: '2', type: EVENT_TYPES.YELLOW_CARD, time: '45', matchId: '1' },
                { id: '4', playerId: '2', type: EVENT_TYPES.CLEAN_SHEET, time: '50', matchId: '1' },
            ]
        }
    ],
    events: []
};