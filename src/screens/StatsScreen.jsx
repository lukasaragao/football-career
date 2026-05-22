import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import PlayerPill from '../components/PlayerPill';
import {
  generatePeriodStats, generatePeriodRatings,
  generateHighlights, getCareerWindows,
  simulateRemainingPeriods, rollPeriodTitles,
} from '../utils/gameLogic';
import ClubLogo from '../components/ClubLogo';
import clubsData from '../data/clubs.json';
import './StatsScreen.css';

function useCountUp(target, duration = 1200, delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return ref;
}

function AnimBar({ value, delay, color }) {
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) ref.current.style.width = `${Math.min(value, 100)}%`;
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div className="rating-bar-wrap">
      <div ref={ref} className="rating-bar" style={{ background: color }} />
    </div>
  );
}

export default function StatsScreen() {
  const { state, dispatch } = useGame();
  const { player, currentPeriod, currentClub, totals, career } = state;

  const windows = getCareerWindows(player.birthYear);
  const win     = windows[currentPeriod];

  // Gera stats para este período
  const stats    = generatePeriodStats(player.position, currentPeriod, player.potential);
  const ratings  = generatePeriodRatings(stats, player.position);
  const highlights = generateHighlights(stats, ratings, player.position, currentClub?.name || '—', currentPeriod);

  // Novos totais após o período
  const newTotals = {
    jogos:    totals.jogos    + stats.jogos,
    gols:     totals.gols     + stats.gols,
    assist:   totals.assist   + stats.assist,
    defesas:  totals.defesas  + stats.defesas,
    amarelo:  totals.amarelo  + stats.amarelo,
    vermelho: totals.vermelho + stats.vermelho,
  };

  const rJ = useCountUp(stats.jogos,    1000, 300);
  const rG = useCountUp(stats.gols,     1100, 450);
  const rA = useCountUp(stats.assist,   1000, 600);
  const rD = useCountUp(stats.defesas,  1000, 700);
  const rY = useCountUp(stats.amarelo,  800,  800);
  const rR = useCountUp(stats.vermelho, 600,  900);

  const isLastPeriod = currentPeriod >= 8;

  function advance() {
    const titles = rollPeriodTitles(currentClub, player.potential, currentPeriod);
    dispatch({
      type: 'ADD_PERIOD',
      payload: { periodIndex: currentPeriod, club: currentClub, stats, ratings, titles },
    });
    dispatch({ type: 'SET_SCREEN', payload: 'period-titles' });
  }

  function simulateRest() {
    const clubs = clubsData?.clubs || [];
    const titles = rollPeriodTitles(currentClub, player.potential, currentPeriod);
    const remaining = currentPeriod < 8
      ? simulateRemainingPeriods({ fromPeriod: currentPeriod + 1, player, currentClub, clubs })
      : [];
    dispatch({
      type: 'SIMULATE_REMAINING',
      payload: {
        periods: [
          { periodIndex: currentPeriod, club: currentClub, stats, ratings, titles },
          ...remaining,
        ],
      },
    });
  }

  const ratingsConfig = [
    { label: 'Finalização',   val: ratings.fin, color: 'var(--gold)',   delay: 1000 },
    { label: 'Movimentação',  val: ratings.mov, color: 'var(--gold)',   delay: 1150 },
    { label: 'Defesa/Jogo',   val: ratings.def, color: 'var(--green)',  delay: 1300 },
    { label: 'Disciplina',    val: ratings.dis, color: 'var(--blue)',   delay: 1450 },
    { label: 'Nota geral',    val: ratings.ger, color: 'var(--gold-light)', delay: 1600 },
  ];

  return (
    <div className="stats-wrap">
      <div className="stats-topbar">
        <PlayerPill />
        <div className="stats-topbar-right">
          {!isLastPeriod && (
            <button className="skip-btn-top" onClick={simulateRest}>
              <i className="ti ti-fast-forward" />
              Simular
            </button>
          )}
          <div className="stats-age-badge">{win?.ageEnd} ANOS</div>
        </div>
      </div>

      {/* Period bar */}
      <div className="period-bar">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className={`period-seg ${i < currentPeriod ? 'done' : i === currentPeriod ? 'cur' : ''}`} />
        ))}
      </div>

      {/* Club banner */}
      <div className="club-banner fade-up">
        <div className="cb-left">
          <div className="cb-emoji"><ClubLogo club={currentClub} size={42} /></div>
          <div className="cb-info">
            <div className="cb-name">{currentClub?.name || '—'}</div>
            <div className="cb-league">{currentClub?.country} · {currentClub?.league?.name}</div>
            <div className="cb-period">Período {currentPeriod + 1} · {win?.label} anos</div>
          </div>
        </div>
        <div className="cb-right">
          <div className="cb-season-badge">{win?.ageStart}/{String(win?.ageEnd).slice(-2)}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid fade-up">
        {[
          { ref: rJ, val: stats.jogos,    label: 'Jogos',      icon: '🎮', cls: '' },
          { ref: rG, val: stats.gols,     label: 'Gols',       icon: '⚽', cls: 'gold' },
          { ref: rA, val: stats.assist,   label: 'Assistências',icon: '🎯', cls: 'blue' },
          { ref: rD, val: stats.defesas,  label: 'Defesas',    icon: '🛡️', cls: '' },
          { ref: rY, val: stats.amarelo,  label: 'Cart. Amarelos', icon: '🟨', cls: 'yellow' },
          { ref: rR, val: stats.vermelho, label: 'Cart. Vermelhos',icon: '🟥', cls: 'red' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className={`stat-num ${s.cls}`} ref={s.ref}>0</div>
            <div className="stat-label">{s.label}</div>
            {i === 1 && stats.jogos > 0 && (
              <div className="stat-sub">{(stats.gols / stats.jogos).toFixed(2)}/jogo</div>
            )}
          </div>
        ))}
      </div>

      {/* Avaliações */}
      <div className="ratings-card fade-up">
        <div className="ratings-title">Avaliação do período</div>
        {ratingsConfig.map(r => (
          <div className="rating-row" key={r.label}>
            <span className="rating-name">{r.label}</span>
            <AnimBar value={r.val} delay={r.delay} color={r.color} />
            <span className="rating-val">{r.val}</span>
          </div>
        ))}
      </div>

      {/* Highlights */}
      <div className="highlights-card fade-up">
        <div className="highlights-title">Destaques</div>
        {highlights.map((h, i) => (
          <div className="highlight-item" key={i}>
            <span className="hi-icon">{h.icon}</span>
            <span className="hi-text" dangerouslySetInnerHTML={{ __html: h.text }} />
          </div>
        ))}
      </div>

      {/* Totais de carreira */}
      <div className="career-totals fade-up">
        {[
          { label: 'Jogos',    val: newTotals.jogos },
          { label: 'Gols',     val: newTotals.gols },
          { label: 'Assist.',  val: newTotals.assist },
          { label: 'Clubes',   val: career.length + 1 },
        ].map(t => (
          <div className="ct-item" key={t.label}>
            <div className="ct-num">{t.val}</div>
            <div className="ct-label">{t.label} carreira</div>
          </div>
        ))}
      </div>

      <button className="advance-btn" onClick={advance}>
        <i className={`ti ${isLastPeriod ? 'ti-trophy' : 'ti-arrow-right'}`} />
        {isLastPeriod ? 'Encerrar carreira' : `Avançar para os ${(player.birthYear + 20 + currentPeriod * 2)} anos`}
      </button>

    </div>
  );
}
