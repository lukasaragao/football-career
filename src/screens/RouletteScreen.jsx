import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import PlayerPill from '../components/PlayerPill';
import { pickClubOffers, getCareerWindows, simulateRemainingPeriods } from '../utils/gameLogic';
import ClubLogo from '../components/ClubLogo';
import clubsData from '../data/clubs.json';
import './RouletteScreen.css';

const PRESTIGE_LABEL = { 1:'Elite Mundial', 2:'Top Liga', 3:'Liga Forte', 4:'Liga Regional', 5:'Liga Local' };
const PRESTIGE_CLASS = { 1:'p1', 2:'p2', 3:'p3', 4:'p4', 5:'p5' };
const CONTINENTAL_LABEL = { champions:'Champions League', libertadores:'Libertadores', caf:'CAF Champions', afc:'AFC Champions' };

export default function RouletteScreen() {
  const { state, dispatch } = useGame();
  const { player, currentPeriod, currentClub, baseClub } = state;
  const [spun, setSpun] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [offers, setOffers]     = useState([]);
  const [selected, setSelected] = useState(null);
  const drumRef = useRef(null);

  const windows = getCareerWindows(player.birthYear);
  const window  = windows[currentPeriod];
  const clubs   = clubsData?.clubs || [];

  // Itens de exibição no tambor (nomes de clubes misturados)
  const drumItems = clubs.slice(0, 20).map(c => `${c.emoji || '⚽'} ${c.name}`);

  function spin() {
    if (spun || spinning) return;
    setSpinning(true);

    // Anima o tambor
    const track = drumRef.current;
    if (track) {
      let pos = 0, speed = 28;
      const itemH = 40;
      const tgt   = itemH * 20;
      const iv = setInterval(() => {
        pos += speed;
        if (pos >= tgt) pos = pos % tgt;
        track.style.transform = `translateY(-${pos}px)`;
        speed *= 0.968;
        if (speed < 1.0) {
          clearInterval(iv);
          track.style.transform = '';
          finishSpin();
        }
      }, 30);
    } else {
      setTimeout(finishSpin, 1200);
    }
  }

  function finishSpin() {
    const picked = pickClubOffers(clubs, player.potential, currentPeriod, currentClub || baseClub);
    setOffers(picked);
    setSpun(true);
    setSpinning(false);
  }

  function confirm() {
    if (selected === null) return;
    const club = selected === 'stay' ? (currentClub || baseClub) : offers[selected];
    dispatch({ type: 'SET_CURRENT_CLUB', payload: club });
    dispatch({ type: 'SET_SCREEN', payload: 'stats' });
  }

  function simulateAll() {
    const periods = simulateRemainingPeriods({
      fromPeriod: currentPeriod,
      player,
      currentClub: currentClub || baseClub,
      clubs,
    });
    dispatch({ type: 'SIMULATE_REMAINING', payload: { periods } });
  }

  return (
    <div className="roulette-wrap">
      <div className="roulette-topbar">
        <PlayerPill />
        <div className="roulette-topbar-right">
          <button className="skip-btn-top" onClick={simulateAll}>
            <i className="ti ti-fast-forward" />
            Simular
          </button>
          <div className="roulette-age-badge">{window?.ageStart} ANOS</div>
        </div>
      </div>

      {/* Period bar */}
      <div className="period-bar">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className={`period-seg ${i < currentPeriod ? 'done' : i === currentPeriod ? 'cur' : ''}`} />
        ))}
      </div>

      <div className="roulette-section-label">Período {currentPeriod + 1} de 9</div>
      <div className="roulette-title">Propostas de <span>Clube</span></div>
      <div className="roulette-period-tag">{window?.label} anos</div>

      {/* Máquina */}
      <div className="drum-machine">
        <div className="drum-machine-header">
          <span className="drum-machine-label">Roleta de destino</span>
          <span className="drum-status">
            <span className={`drum-dot ${spinning ? 'spinning' : spun ? 'done' : ''}`} />
            <span>{spinning ? 'Sorteando...' : spun ? `${offers.length} proposta${offers.length !== 1 ? 's' : ''} recebida${offers.length !== 1 ? 's' : ''}` : 'Aguardando sorteio'}</span>
          </span>
        </div>

        <div className="drum-window">
          <div className="drum-selector" />
          <div className="drum-track" ref={drumRef}>
            {[...drumItems, ...drumItems].map((item, i) => (
              <div className="drum-item" key={i}>{item}</div>
            ))}
          </div>
        </div>

        <div className="drum-machine-footer">
          <button className="spin-btn" onClick={spin} disabled={spun || spinning}>
            <i className="ti ti-refresh" />
            {spinning ? 'Girando...' : spun ? 'Sorteado' : 'Girar a roleta'}
          </button>
        </div>
      </div>

      {/* Ofertas */}
      {spun && (
        <div className="offers-section">
          <div className="offers-header">
            <span className="offers-title">Propostas recebidas</span>
            <span className="offers-count">{offers.length} oferta{offers.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="offers-list">
            {offers.map((club, i) => (
              <div
                key={club.id}
                className={`offer-card ${selected === i ? 'selected' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => setSelected(i)}
              >
                <div className="offer-shine" />
                <div className="offer-logo"><ClubLogo club={club} size={40} /></div>
                <div className="offer-info">
                  <div className="offer-name">{club.name}</div>
                  <div className="offer-league">{club.country} · {club.league?.name}</div>
                  <div className="offer-tags">
                    <span className={`tag ${PRESTIGE_CLASS[club.prestige] || 'p4'}`}>
                      {PRESTIGE_LABEL[club.prestige] || 'Liga Local'}
                    </span>
                    {club.continental?.map(c => (
                      <span className="tag continental" key={c}>{CONTINENTAL_LABEL[c] || c}</span>
                    ))}
                  </div>
                </div>
                <div className="offer-right">
                  <div className="offer-rating">{club.prestige <= 1 ? 90 : club.prestige <= 2 ? 82 : club.prestige <= 3 ? 74 : 65}</div>
                  <div className="offer-rating-label">nível</div>
                  <div className={`offer-check ${selected === i ? 'checked' : ''}`}>✓</div>
                </div>
              </div>
            ))}

            {/* Opção de ficar */}
            <div
              className={`stay-card ${selected === 'stay' ? 'selected' : ''}`}
              onClick={() => setSelected('stay')}
            >
              <div className="stay-icon">🏠</div>
              <div className="stay-text">
                <div className="stay-name">Permanecer no {currentClub?.name || baseClub?.name}</div>
                <div className="stay-sub">Continuar no clube atual por mais 2 anos</div>
              </div>
              <div className={`offer-check ${selected === 'stay' ? 'checked' : ''}`}>✓</div>
            </div>
          </div>
        </div>
      )}

      {selected !== null && (
        <button className="confirm-btn pop-in" onClick={confirm}>
          <i className="ti ti-check" />
          Confirmar escolha
        </button>
      )}

    </div>
  );
}
