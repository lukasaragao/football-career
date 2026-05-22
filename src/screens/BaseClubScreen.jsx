import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import PlayerPill from '../components/PlayerPill';
import './BaseClubScreen.css';

const BR_CLUBS = [
  {id:1,name:"Flamengo",emoji:"🔴",league:"Brasileirão Série A",base:"⭐⭐⭐⭐⭐",country:"🇧🇷",prestige:2,continental:["libertadores"],story:"um dos maiores celeiros de talentos do Brasil."},
  {id:2,name:"Palmeiras",emoji:"💚",league:"Brasileirão Série A",base:"⭐⭐⭐⭐⭐",country:"🇧🇷",prestige:2,continental:["libertadores"],story:"a Academia de Futebol, referência nacional em formação."},
  {id:3,name:"Santos",emoji:"⚫",league:"Brasileirão Série A",base:"⭐⭐⭐⭐⭐",country:"🇧🇷",prestige:2,continental:[],story:"onde Pelé e Neymar deram os primeiros passos."},
  {id:4,name:"São Paulo",emoji:"🔴",league:"Brasileirão Série A",base:"⭐⭐⭐⭐⭐",country:"🇧🇷",prestige:2,continental:[],story:"o Cotia, metodologia europeia com raízes brasileiras."},
  {id:5,name:"Corinthians",emoji:"⚫",league:"Brasileirão Série A",base:"⭐⭐⭐⭐",country:"🇧🇷",prestige:2,continental:[],story:"a pressão de uma das maiores torcidas do país desde cedo."},
  {id:6,name:"Grêmio",emoji:"🔵",league:"Brasileirão Série A",base:"⭐⭐⭐⭐⭐",country:"🇧🇷",prestige:2,continental:["libertadores"],story:"formador de jogadores técnicos e inteligentes taticamente."},
  {id:7,name:"Internacional",emoji:"🔴",league:"Brasileirão Série A",base:"⭐⭐⭐⭐",country:"🇧🇷",prestige:2,continental:[],story:"o Colorado, com a força do futebol gaúcho."},
  {id:8,name:"Atlético-MG",emoji:"⚫",league:"Brasileirão Série A",base:"⭐⭐⭐⭐",country:"🇧🇷",prestige:2,continental:["libertadores"],story:"o Galo renovado e investindo na formação de novos ídolos."},
  {id:9,name:"Cruzeiro",emoji:"🔵",league:"Brasileirão Série A",base:"⭐⭐⭐⭐",country:"🇧🇷",prestige:2,continental:[],story:"a Raposa, décadas de história na formação de craques."},
  {id:10,name:"Fluminense",emoji:"🟢",league:"Brasileirão Série A",base:"⭐⭐⭐⭐",country:"🇧🇷",prestige:2,continental:["libertadores"],story:"berço de jogadores elegantes e técnicos."},
];

const WORLD_CLUBS = [
  {id:50,name:"Ajax",emoji:"🔴",league:"Eredivisie",base:"⭐⭐⭐⭐⭐",country:"🇳🇱",prestige:2,continental:["champions"],story:"a academia mais famosa do mundo. Método total football desde a base."},
  {id:51,name:"Barcelona B",emoji:"🔵",league:"La Liga 2",base:"⭐⭐⭐⭐⭐",country:"🇪🇸",prestige:1,continental:["champions"],story:"La Masía — a fábrica de gênios do futebol mundial."},
  {id:52,name:"Benfica",emoji:"🔴",league:"Primeira Liga",base:"⭐⭐⭐⭐⭐",country:"🇵🇹",prestige:2,continental:["champions"],story:"um dos maiores exportadores de talentos da Europa."},
  {id:53,name:"Porto",emoji:"🔵",league:"Primeira Liga",base:"⭐⭐⭐⭐",country:"🇵🇹",prestige:2,continental:["champions"],story:"celeiro de craques que brilham por todo o continente."},
  {id:54,name:"River Plate",emoji:"🔴",league:"Primera División",base:"⭐⭐⭐⭐⭐",country:"🇦🇷",prestige:2,continental:["libertadores"],story:"El Millonario, com uma das melhores categorias de base da América."},
  {id:55,name:"Boca Juniors",emoji:"🟡",league:"Primera División",base:"⭐⭐⭐⭐",country:"🇦🇷",prestige:2,continental:["libertadores"],story:"La Bombonera desde cedo. A paixão portenha como combustível."},
];

function getBaseClubsForNationality(nationality) {
  const brCountries = ['Brasil'];
  const argCountries = ['Argentina'];
  const ptCountries = ['Portugal'];
  const nlCountries = ['Holanda'];
  const esCountries = ['Espanha'];

  if (brCountries.includes(nationality))  return BR_CLUBS;
  if (argCountries.includes(nationality)) return WORLD_CLUBS.filter(c => c.country === '🇦🇷');
  if (ptCountries.includes(nationality))  return WORLD_CLUBS.filter(c => c.country === '🇵🇹');
  if (nlCountries.includes(nationality))  return WORLD_CLUBS.filter(c => c.country === '🇳🇱');
  if (esCountries.includes(nationality))  return WORLD_CLUBS.filter(c => c.country === '🇪🇸');
  // Fallback: mistura de clubes internacionais
  return [...BR_CLUBS.slice(0,4), ...WORLD_CLUBS.slice(0,4)];
}

export default function BaseClubScreen() {
  const { state, dispatch } = useGame();
  const { player } = state;
  const [revealed, setRevealed]   = useState(false);
  const [club, setClub]           = useState(null);
  const [rerolls, setRerolls]     = useState(0);

  const clubs = getBaseClubsForNationality(player.nationality);

  function reveal() {
    const picked = clubs[Math.floor(Math.random() * clubs.length)];
    setClub(picked);
    setRevealed(true);
  }

  function reroll() {
    if (rerolls >= 2) return;
    setRevealed(false);
    setClub(null);
    setRerolls(r => r + 1);
    setTimeout(reveal, 100);
  }

  function advance() {
    if (!club) return;
    dispatch({ type: 'SET_BASE_CLUB', payload: club });
    dispatch({ type: 'SET_CURRENT_CLUB', payload: club });
    dispatch({ type: 'SET_SCREEN', payload: 'roulette' });
  }

  return (
    <div className="base-wrap">
      <div className="base-topbar">
        <PlayerPill />
        <div className="base-age-badge">Sub-17</div>
      </div>

      <div className="base-header fade-up">
        <div className="base-eyebrow">Football Career Simulator</div>
        <div className="base-title">Clube de <span>Base</span></div>
        <div className="base-sub">Onde tudo começa. Antes dos {player.birthYear + 18} anos.</div>
      </div>

      {!revealed ? (
        <div className="envelope-wrap fade-up">
          <button className="envelope-btn" onClick={reveal}>
            <i className="ti ti-mail-opened" style={{fontSize:52,color:'var(--gold)',opacity:.7}} />
            <span>Toque para revelar seu clube de base</span>
          </button>
        </div>
      ) : (
        <div className="club-reveal pop-in">
          <div className="base-club-card">
            <div className="bcc-top">
              <div className="bcc-emoji">{club.emoji}</div>
              <div className="bcc-name">{club.name}</div>
              <div className="bcc-league-badge">{club.league}</div>
            </div>
            <div className="bcc-body">
              <div className="bcc-row"><span className="bcc-label">País</span><span className="bcc-val">{club.country} {player.nationality}</span></div>
              <div className="bcc-row"><span className="bcc-label">Estrutura de base</span><span className="bcc-val gold">{club.base}</span></div>
              <div className="bcc-row"><span className="bcc-label">Período</span><span className="bcc-val">Sub-15 até Sub-17</span></div>
              <div className="bcc-row"><span className="bcc-label">Profissionalização</span><span className="bcc-val gold">Aos {player.birthYear + 18} anos</span></div>
            </div>
          </div>

          <div className="base-narrative fade-up">
            <span className="base-narrative-text">
              Com apenas {player.birthYear + 15} anos, <strong>{player.name}</strong> foi descoberto pelos olheiros do{' '}
              <strong>{club.name}</strong> — {club.story} Dois anos de base. A profissionalização bate à porta.
            </span>
          </div>

          <div className="base-actions">
            <button className="base-advance-btn" onClick={advance}>
              <i className="ti ti-player-play" />
              Avançar para os {player.birthYear + 18} anos
            </button>
            {rerolls < 2 && (
              <button className="base-reroll-btn" onClick={reroll}>
                ↺ Sortear outro clube ({2 - rerolls} restante{2 - rerolls !== 1 ? 's' : ''})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
