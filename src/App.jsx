import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import CreationScreen      from './screens/CreationScreen';
import BaseClubScreen      from './screens/BaseClubScreen';
import RouletteScreen      from './screens/RouletteScreen';
import StatsScreen         from './screens/StatsScreen';
import PeriodTitlesScreen  from './screens/PeriodTitlesScreen';
import RetirementScreen    from './screens/RetirementScreen';
import './index.css';

function Router() {
  const { state } = useGame();
  switch (state.screen) {
    case 'creation':      return <CreationScreen />;
    case 'base':          return <BaseClubScreen />;
    case 'roulette':      return <RouletteScreen />;
    case 'stats':         return <StatsScreen />;
    case 'period-titles': return <PeriodTitlesScreen />;
    case 'retirement':    return <RetirementScreen />;
    default:              return <CreationScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}
