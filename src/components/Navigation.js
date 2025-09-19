import React from 'react';
import { Users, Trophy, BarChart3 } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'teams', name: 'Teams', icon: Users },
        { id: 'matches', name: 'Matches', icon: Trophy },
        { id: 'summary', name: 'Summary', icon: BarChart3 }
    ];

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon size={20} />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;