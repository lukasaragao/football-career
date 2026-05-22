import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getCareerWindows, getTitleDifficulty } from '../utils/gameLogic';
import ClubLogo from '../components/ClubLogo';
import './PeriodTitlesScreen.css';

function Confetti() {
  const colors = ['#C9A84C','#E8C97A','#fff','#2ECC71','#3498DB','#E74C3C'];
  return (
    <div className="confetti-layer" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${5 + Math.random() * 90}%`,
          top:  `${Math.random() * 80}%`,
          background: colors[i % colors.length],
          animationDelay: `${Math.random() * 0.5}s`,
          animationDuration: `${0.7 + Math.random() * 0.7}s`,
        }} />
      ))}
    </div>
  );
}

export default function PeriodTitlesScreen() {
  const { state, dispatch } = useGame();
  const { player, career, currentPeriod } = state;

  const period    = career[career.length - 1];
  const club      = period?.club;
  const titles    = period?.titles || [];
  const periodIdx = period?.periodIndex ?? 0;
  const isLast    = currentPeriod >= 9;

  const windows = getCareerWindows(player.birthYear);
  const win     = windows[periodIdx];

  const [revealed, setRevealed]       = useState([]);
  const [done, setDone]               = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!titles.length) { setDone(true); return; }
    titles.forEach((t, i) => {
      setTimeout(() => {
        setRevealed(prev => [...prev, i]);
        if (t.won > 0 && (t.id === 'bola' || t.id === 'mundial' || t.id === 'champ')) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1400);
        }
        if (i === titles.length - 1) setTimeout(() => setDone(true), 500);
      }, 300 + i * 650);
    });
  }, []);

  const wonCount = titles.filter(t => t.won > 0).length;
  const diff     = getTitleDifficulty(club);

  function advance() {
    dispatch({ type: 'SET_SCREEN', payload: isLast ? 'retirement' : 'roulette' });
  }

  return (
    <div className="pt-wrap">
      {showConfetti && <Confetti />}

      {/* Topbar */}
      <div className="pt-topbar">
        <div className="pt-period-label">Período {periodIdx + 1} de 9</div>
        <div className="pt-age-badge">{win?.ageStart}–{win?.ageEnd} anos</div>
      </div>

      {/* Period bar */}
      <div className="period-bar">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className={`period-seg ${i < career.length ? 'done' : ''}`} />
        ))}
      </div>

      {/* Club header */}
      <div className="pt-club-header fade-up">
        <div className="pt-club-emoji"><ClubLogo club={club} size={42} /></div>
        <div className="pt-club-info">
          <div className="pt-club-name">{club?.name || '—'}</div>
          <div className="pt-club-meta">{club?.league?.name} · {club?.country}</div>
          <div className="pt-diff-badge" style={{ background: diff.color + '22', border: `1px solid ${diff.color}55`, color: diff.color }}>
            {diff.label}
          </div>
        </div>
      </div>

      <div className="pt-section-label">Roleta de títulos</div>

      {/* Title slots */}
      <div className="pt-titles-list">
        {titles.map((t, i) => {
          const isRevealed = revealed.includes(i);
          const won        = t.won > 0;
          return (
            <div key={t.id} className={`pt-slot ${!isRevealed ? 'pending' : won ? 'won' : 'lost'}`}>
              <div className="pt-slot-icon">{!isRevealed ? '⬜' : t.icon}</div>
              <div className="pt-slot-info">
                <div className="pt-slot-name">{t.name}</div>
                <div className="pt-slot-detail">{t.detail}</div>
              </div>
              <div className="pt-slot-count">
                {!isRevealed ? '?' : won ? <span className="pt-won-check">✓</span> : <span className="pt-lost-x">✗</span>}
              </div>
              {won && isRevealed && <div className="pt-shine" />}
            </div>
          );
        })}
      </div>

      {/* Summary badge */}
      {done && (
        <div className="pt-summary pop-in">
          {wonCount > 0
            ? <><span className="pt-summary-num">{wonCount}</span> título{wonCount > 1 ? 's' : ''} conquistado{wonCount > 1 ? 's' : ''} no {club?.name}</>
            : <>Nenhum título conquistado neste período</>
          }
        </div>
      )}

      {done && (
        <button className="pt-advance-btn pop-in" onClick={advance}>
          <i className={`ti ${isLast ? 'ti-trophy' : 'ti-arrow-right'}`} />
          {isLast ? 'Ver aposentadoria' : 'Próximo período'}
        </button>
      )}
    </div>
  );
}
