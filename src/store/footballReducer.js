export const footballReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TEAM':
            return {
                ...state,
                teams: [...state.teams, { ...action.payload, players: [] }]
            };

        case 'ADD_PLAYER':
            return {
                ...state,
                teams: state.teams.map(team =>
                    team.id === action.payload.teamId
                        ? { ...team, players: [...team.players, action.payload] }
                        : team
                )
            };

        case 'CREATE_MATCH':
            return {
                ...state,
                matches: [...state.matches, action.payload]
            };

        case 'ADD_MATCH_EVENT':
            return {
                ...state,
                matches: state.matches.map(match =>
                    match.id === action.payload.matchId
                        ? { ...match, events: [...(match.events || []), action.payload] }
                        : match
                )
            };

        case 'COMPLETE_MATCH':
            return {
                ...state,
                matches: state.matches.map(match =>
                    match.id === action.payload.matchId
                        ? { ...match, status: 'completed' }
                        : match
                )
            };

        default:
            return state;
    }
};