import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  // Fase atual do jogo
  screen: 'creation', // creation | base | roulette | stats | retirement | titles

  // Dados do jogador
  player: {
    name: '',
    position: null,      // GOL | ZAG | LAT | ALA | VOL | MEI | CA | PON
    positionLabel: '',
    foot: 'Esquerdo',
    birthYear: null,
    nationality: '',
    countryCode: '',
    flag: '🌍',
    rating: 75,
    potential: 0,        // 1–100, oculto do usuário
  },

  // Clube de base
  baseClub: null,

  // Carreira (array de períodos)
  career: [],
  // Cada período: { age, club, stats: { jogos, gols, assist, defesas, amarelo, vermelho }, ratings }

  // Estatísticas acumuladas
  totals: {
    jogos: 0,
    gols: 0,
    assist: 0,
    defesas: 0,
    amarelo: 0,
    vermelho: 0,
  },

  // Período atual (0-based, 0 = 18-19 anos, 8 = 34-35 anos)
  currentPeriod: 0,

  // Clube atual
  currentClub: null,

  // Títulos ao final
  titles: null,
  legend: null,
};

function gameReducer(state, action) {
  switch (action.type) {

    case 'SET_PLAYER':
      return { ...state, player: { ...state.player, ...action.payload } };

    case 'SET_SCREEN':
      return { ...state, screen: action.payload };

    case 'SET_BASE_CLUB':
      return { ...state, baseClub: action.payload };

    case 'SET_CURRENT_CLUB':
      return { ...state, currentClub: action.payload };

    case 'ADD_PERIOD': {
      const period = action.payload;
      const newTotals = {
        jogos:    state.totals.jogos    + period.stats.jogos,
        gols:     state.totals.gols     + period.stats.gols,
        assist:   state.totals.assist   + period.stats.assist,
        defesas:  state.totals.defesas  + period.stats.defesas,
        amarelo:  state.totals.amarelo  + period.stats.amarelo,
        vermelho: state.totals.vermelho + period.stats.vermelho,
      };
      return {
        ...state,
        career: [...state.career, period],
        totals: newTotals,
        currentPeriod: state.currentPeriod + 1,
      };
    }

    case 'SIMULATE_REMAINING': {
      const { periods } = action.payload;
      const newTotals = { ...state.totals };
      for (const p of periods) {
        newTotals.jogos    += p.stats.jogos;
        newTotals.gols     += p.stats.gols;
        newTotals.assist   += p.stats.assist;
        newTotals.defesas  += p.stats.defesas;
        newTotals.amarelo  += p.stats.amarelo;
        newTotals.vermelho += p.stats.vermelho;
      }
      return {
        ...state,
        career: [...state.career, ...periods],
        totals: newTotals,
        currentPeriod: 9,
        screen: 'retirement',
      };
    }

    case 'SET_TITLES':
      return { ...state, titles: action.payload.titles, legend: action.payload.legend };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
