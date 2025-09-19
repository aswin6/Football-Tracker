import React, { createContext, useContext } from 'react';

const FootballContext = createContext();

export const useFootball = () => {
    const context = useContext(FootballContext);
    if (!context) {
        throw new Error('useFootball must be used within FootballProvider');
    }
    return context;
};

export default FootballContext;