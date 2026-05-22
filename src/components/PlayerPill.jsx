import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { POSITIONS, getCareerWindows, getFlagUrl } from '../utils/gameLogic';
import ClubLogo from './ClubLogo';
import './PlayerPill.css';

function FlagImg({ code, size = 20 }) {
  if (!code) return null;
  return (
    <img src={getFlagUrl(code, 32)} alt="" width={size} height={size}
      style={{ objectFit:'contain', verticalAlign:'middle', borderRadius:2, display:'inline-block' }}
      onError={e => { e.target.style.display='none'; }} />
  );
}

export default function PlayerPill() {
  const { state } = useGame();
  const { player, totals, career, currentPeriod, currentClub, baseClub } = state;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isReady = player.name && player.position && player.nationality && player.birthYear;
  const posInfo = POSITIONS[player.position] || {};
  const windows = player.birthYear ? getCareerWindows(player.birthYear) : [];

  const pillParts = [];
  if (player.name)     pillParts.push(player.name);
  if (player.position) pillParts.push(player.position);
  if (player.nationality) pillParts.push(player.nationality);

  return (
    <div className="pp-wrap" ref={ref}>
      <button className={`pp-pill ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className={`pp-dot ${isReady ? 'ready' : ''}`} />
        <span className="pp-text">{pillParts.length ? pillParts.join(' · ') : 'Novo jogador'}</span>
        <span className="pp-chevron">▼</span>
      </button>

      {open && (
        <div className="pp-panel">
          {/* Header */}
          <div className="pp-header">
            <div className="pp-avatar">{posInfo.emoji || '👤'}</div>
            <div className="pp-header-info">
              <div className="pp-name">{player.name || '—'}</div>
              <div className="pp-sub">
                {player.positionLabel || '—'} · <FlagImg code={player.countryCode} /> {player.nationality || '—'}
              </div>
            </div>
            <div className="pp-rating">{player.rating || '—'}</div>
          </div>

          <div className="pp-body">
            {/* Informações */}
            <div className="pp-section-label">Informações</div>
            <div className="pp-info-grid">
              <div className="pp-info-item">
                <div className="pii-label">Posição</div>
                <div className="pii-value gold">{player.positionLabel || '—'}</div>
              </div>
              <div className="pp-info-item">
                <div className="pii-label">Pé</div>
                <div className="pii-value">{player.foot || '—'}</div>
              </div>
              <div className="pp-info-item">
                <div className="pii-label">Nascimento</div>
                <div className="pii-value">{player.birthYear || '—'}</div>
              </div>
              <div className="pp-info-item">
                <div className="pii-label">Período</div>
                <div className="pii-value gold">
                  {currentPeriod > 0 ? `${currentPeriod} / 9` : 'Não iniciado'}
                </div>
              </div>
              <div className="pp-info-item full">
                <div className="pii-label">Clube atual</div>
                <div className="pii-value" style={{display:'flex',alignItems:'center',gap:5}}>
                  {currentClub
                    ? <><ClubLogo club={currentClub} size={16} /> {currentClub.name}</>
                    : baseClub ? <><span>{baseClub.emoji}</span> {baseClub.name} (base)</> : '—'}
                </div>
              </div>
            </div>

            {/* Stats de carreira */}
            <div className="pp-section-label" style={{ marginTop: 12 }}>Estatísticas da carreira</div>
            <div className="pp-stats-grid">
              {[
                { label: 'Jogos',   val: totals.jogos },
                { label: 'Gols',    val: totals.gols },
                { label: 'Assist.', val: totals.assist },
                { label: 'Defesas', val: totals.defesas },
                { label: 'Cart. A', val: totals.amarelo },
                { label: 'Cart. V', val: totals.vermelho },
              ].map(s => (
                <div className="pp-stat" key={s.label}>
                  <div className="pp-stat-num">{s.val}</div>
                  <div className="pp-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Clubes */}
            {career.length > 0 && (
              <>
                <div className="pp-section-label" style={{ marginTop: 12 }}>
                  Clubes ({career.length} / 9 períodos)
                </div>
                <div className="pp-clubs">
                  {career.map((p, i) => (
                    <div className="pp-club-item" key={i}>
                      <ClubLogo club={p.club} size={22} />
                      <div className="pp-club-info">
                        <div className="pp-club-name">{p.club?.name}</div>
                        <div className="pp-club-period">{windows[p.periodIndex]?.label}</div>
                      </div>
                      <div className="pp-club-goals">{p.stats.gols}⚽</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer com dots de período */}
          <div className="pp-footer">
            <div>
              <div className="pp-age-label">Idade atual</div>
              <div className="pp-age-val">
                {player.birthYear
                  ? `${player.birthYear + 18 + currentPeriod * 2} anos`
                  : '— anos'}
              </div>
            </div>
            <div className="pp-period-dots">
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className={`pp-pdot ${i < currentPeriod ? 'done' : i === currentPeriod ? 'cur' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
