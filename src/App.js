import React, { useReducer, useState } from 'react';
import { Trophy } from 'lucide-react';
import FootballContext from './context/FootballContext';
import { footballReducer } from './store/footballReducer';
import { initialState } from './store/initialState';
import Navigation from './components/Navigation';
import Teams from './components/Teams';
import Matches from './components/Matches';
import Summary from './components/Summary';

const App = () => {
  const [state, dispatch] = useReducer(footballReducer, initialState);
  const [activeTab, setActiveTab] = useState('teams');

  const contextValue = {
    state,
    dispatch
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'teams':
        return <Teams />;
      case 'matches':
        return <Matches />;
      case 'summary':
        return <Summary />;
      default:
        return <Teams />;
    }
  };

  return (
    <FootballContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Trophy className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Football Manager</h1>
            </div>
          </div>
        </header>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main>
          {renderActiveTab()}
        </main>
      </div>
    </FootballContext.Provider>
  );
};

export default App;