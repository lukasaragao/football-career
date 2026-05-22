import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { buildLegend, getCareerWindows, getFlagUrl } from '../utils/gameLogic';
import { TITLE_DEFS } from '../data/constants';
import ClubLogo from '../components/ClubLogo';

function FlagImg({ code, size = 22 }) {
  if (!code) return null;
  return (
    <img src={getFlagUrl(code, 32)} alt="" width={size} height={size}
      style={{ objectFit:'contain', verticalAlign:'middle', borderRadius:2, display:'inline-block' }}
      onError={e => { e.target.style.display='none'; }} />
  );
}
import './RetirementScreen.css';

function Confetti() {
  const colors = ['#C9A84C','#E8C97A','#fff','#2ECC71','#3498DB','#E74C3C'];
  return (
    <div className="confetti-layer" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${5 + Math.random() * 90}%`,
          top:  `${Math.random() * 80}%`,
          background: colors[i % colors.length],
          animationDelay: `${Math.random() * 0.6}s`,
          animationDuration: `${0.8 + Math.random() * 0.8}s`,
        }} />
      ))}
    </div>
  );
}

function AnimBar({ value, max, color, delay }) {
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) ref.current.style.width = `${Math.min(100, Math.round(value / max * 100))}%`;
    }, delay);
    return () => clearTimeout(t);
  }, [value, max, delay]);
  return (
    <div className="ls-bar-wrap">
      <div ref={ref} className="ls-bar" style={{ background: color }} />
    </div>
  );
}

export default function RetirementScreen() {
  const { state, dispatch } = useGame();
  const { player, totals, career } = state;
  const [showConfetti, setShowConfetti] = useState(false);

  const windows = getCareerWindows(player.birthYear);
  const clubs   = [...new Set(career.map(p => p.club?.name).filter(Boolean))];

  // ── Aggregate titles from all periods ──────────────────────────────────────
  // wonByType: { id → { icon, name, detail, instances: [{ club, periodIndex }] } }
  const wonByType = {};
  career.forEach(p => {
    (p.titles || []).forEach(t => {
      if (t.won > 0) {
        if (!wonByType[t.id]) wonByType[t.id] = { id: t.id, icon: t.icon, name: t.name, detail: t.detail, instances: [] };
        wonByType[t.id].instances.push({ club: p.club, periodIndex: p.periodIndex });
      }
    });
  });

  // Summary list ordered by TITLE_DEFS
  const titlesSummary = TITLE_DEFS
    .filter(td => wonByType[td.id])
    .map(td => ({ ...wonByType[td.id], count: wonByType[td.id].instances.length }));

  const totalTitles = titlesSummary.reduce((s, t) => s + t.count, 0);

  // For legend calculation (same shape as old rollTitles output)
  const titlesForLegend = TITLE_DEFS.map(td => ({
    ...td, won: wonByType[td.id]?.instances.length || 0,
  }));
  const legend = buildLegend(titlesForLegend, totals, player.potential);

  useEffect(() => {
    const hasBig = wonByType['bola'] || wonByType['mundial'] || wonByType['champ'];
    if (hasBig) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, []);

  // ── Career stints ───────────────────────────────────────────────────────────
  const stints = career.reduce((acc, period) => {
    const last = acc[acc.length - 1];
    if (last && last.club?.name === period.club?.name) {
      last.periods.push(period);
    } else {
      acc.push({ club: period.club, periods: [period] });
    }
    return acc;
  }, []);

  return (
    <div className="ret-wrap">
      {showConfetti && <Confetti />}

      {/* Hero */}
      <div className="ret-hero fade-up">
        <div className="ret-eyebrow">Aposentadoria · {player.birthYear + 35} anos</div>
        <div className="ret-name">{player.name} <span>{player.nationality && <FlagImg code={player.countryCode} size={32} />}</span></div>
        <div className="ret-years">
          {player.birthYear + 18} — {player.birthYear + 35} · {player.positionLabel} · <FlagImg code={player.countryCode} size={16} /> {player.nationality}
        </div>
        <div className="ret-clubs">
          {clubs.map(c => <span className="ret-club-chip" key={c}>{c}</span>)}
        </div>
      </div>

      {/* Totais */}
      <div className="ret-totals fade-up">
        {[
          { label: 'Jogos',   val: totals.jogos },
          { label: 'Gols',    val: totals.gols },
          { label: 'Assist.', val: totals.assist },
          { label: 'Títulos', val: totalTitles },
        ].map(t => (
          <div className="ret-total-item" key={t.label}>
            <div className="ret-total-num">{t.val}</div>
            <div className="ret-total-label">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Palmarés */}
      <div className="ret-section-label">Palmarés</div>
      {titlesSummary.length === 0 ? (
        <div className="ret-no-titles">Nenhum título conquistado na carreira.</div>
      ) : (
        <div className="palmares-list">
          {titlesSummary.map(t => {
            // Deduplicate clubs — show each club once with count
            const clubCount = {};
            t.instances.forEach(inst => {
              const name = inst.club?.name || '—';
              clubCount[name] = { club: inst.club, count: (clubCount[name]?.count || 0) + 1 };
            });
            return (
              <div className="palmares-row" key={t.id}>
                <div className="palmares-left">
                  <span className="palmares-icon">{t.icon}</span>
                  <div className="palmares-info">
                    <div className="palmares-name">{t.name}</div>
                    <div className="palmares-detail">{t.detail}</div>
                  </div>
                </div>
                <div className="palmares-right">
                  <div className="palmares-count">{t.count}×</div>
                  <div className="palmares-clubs">
                    {Object.values(clubCount).map(({ club, count }) => (
                      <span className="palmares-club-chip" key={club?.name}>
                        {club?.emoji} {club?.name}{count > 1 ? ` ×${count}` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Histórico por clube */}
      <div className="ret-section-label">Histórico da carreira</div>
      <div className="career-history">
        {stints.map((stint, si) => {
          const aggStats = stint.periods.reduce((acc, p) => ({
            jogos:    acc.jogos    + (p.stats?.jogos    || 0),
            gols:     acc.gols     + (p.stats?.gols     || 0),
            assist:   acc.assist   + (p.stats?.assist   || 0),
            defesas:  acc.defesas  + (p.stats?.defesas  || 0),
            amarelo:  acc.amarelo  + (p.stats?.amarelo  || 0),
            vermelho: acc.vermelho + (p.stats?.vermelho || 0),
          }), { jogos:0, gols:0, assist:0, defesas:0, amarelo:0, vermelho:0 });

          const n = stint.periods.length;
          const avgRatings = {
            fin: Math.round(stint.periods.reduce((s, p) => s + (p.ratings?.fin || 0), 0) / n),
            mov: Math.round(stint.periods.reduce((s, p) => s + (p.ratings?.mov || 0), 0) / n),
            def: Math.round(stint.periods.reduce((s, p) => s + (p.ratings?.def || 0), 0) / n),
            dis: Math.round(stint.periods.reduce((s, p) => s + (p.ratings?.dis || 0), 0) / n),
            ger: Math.round(stint.periods.reduce((s, p) => s + (p.ratings?.ger || 0), 0) / n),
          };

          // Titles won at this club
          const stintTitles = stint.periods.flatMap(p => (p.titles || []).filter(t => t.won > 0));
          const firstWin = windows[stint.periods[0].periodIndex];
          const lastWin  = windows[stint.periods[n - 1].periodIndex];
          const ageRange = `${firstWin?.ageStart}–${lastWin?.ageEnd} anos`;
          const isGK     = player.position === 'GOL';

          return (
            <div className="ch-card" key={si}>
              <div className="ch-club-header">
                <ClubLogo club={stint.club} size={36} />
                <div className="ch-club-info">
                  <div className="ch-club-name">{stint.club?.name || '—'}</div>
                  <div className="ch-club-meta">
                    {[stint.club?.league?.name, stint.club?.country, ageRange].filter(Boolean).join(' · ')}
                  </div>
                  {stintTitles.length > 0 && (
                    <div className="ch-title-chips">
                      {stintTitles.map((t, ti) => (
                        <span className="ch-title-chip" key={ti}>{t.icon} {t.name}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ch-ger">{avgRatings.ger || '—'}</div>
              </div>

              <div className="ch-stats">
                <div className="ch-stat"><span className="ch-stat-val">{aggStats.jogos}</span><span className="ch-stat-lbl">Jogos</span></div>
                {isGK
                  ? <div className="ch-stat"><span className="ch-stat-val">{aggStats.defesas}</span><span className="ch-stat-lbl">Defesas</span></div>
                  : <div className="ch-stat"><span className="ch-stat-val">{aggStats.gols}</span><span className="ch-stat-lbl">Gols</span></div>
                }
                <div className="ch-stat"><span className="ch-stat-val">{aggStats.assist}</span><span className="ch-stat-lbl">Assist.</span></div>
                {!isGK && aggStats.defesas > 0 && (
                  <div className="ch-stat"><span className="ch-stat-val">{aggStats.defesas}</span><span className="ch-stat-lbl">Defesas</span></div>
                )}
                <div className="ch-stat"><span className="ch-stat-val yellow">{aggStats.amarelo}</span><span className="ch-stat-lbl">🟨</span></div>
                <div className="ch-stat"><span className="ch-stat-val red">{aggStats.vermelho}</span><span className="ch-stat-lbl">🟥</span></div>
              </div>

              <div className="ch-ratings">
                {[
                  { lbl: 'FIN', val: avgRatings.fin, color: 'var(--gold)' },
                  { lbl: 'MOV', val: avgRatings.mov, color: 'var(--gold)' },
                  { lbl: 'DEF', val: avgRatings.def, color: 'var(--green)' },
                  { lbl: 'DIS', val: avgRatings.dis, color: 'var(--blue)' },
                ].map(r => (
                  <div className="ch-rating-row" key={r.lbl}>
                    <span className="ch-rating-lbl">{r.lbl}</span>
                    <div className="ch-rating-bar-wrap">
                      <div className="ch-rating-bar" style={{ width: `${r.val}%`, background: r.color }} />
                    </div>
                    <span className="ch-rating-val">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legado */}
      <div className="legend-card">
        <div className="legend-header">
          <div className="legend-trophy">{legend.trophy}</div>
          <div className="legend-info">
            <div className="legend-rank">{legend.rank}</div>
            <div className="legend-title">{legend.title}</div>
            <div className="legend-sub">{legend.sub}</div>
          </div>
        </div>
        <div className="legend-bars">
          {[
            { label: 'Gols na carreira', val: totals.gols,   max: 400, color: 'var(--gold)' },
            { label: 'Assistências',     val: totals.assist, max: 200, color: 'var(--blue)' },
            { label: 'Jogos',            val: totals.jogos,  max: 800, color: 'var(--green)' },
            { label: 'Títulos',          val: totalTitles,   max: 20,  color: '#9B59B6' },
          ].map((b, i) => (
            <div className="ls-row" key={b.label}>
              <span className="ls-label">{b.label}</span>
              <AnimBar value={b.val} max={b.max} color={b.color} delay={300 + i * 150} />
              <span className="ls-val">{b.val}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="restart-btn" onClick={() => dispatch({ type: 'RESET' })}>
        <i className="ti ti-refresh" />
        Nova carreira
      </button>
    </div>
  );
}
