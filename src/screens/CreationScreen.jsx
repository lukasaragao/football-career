import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import PlayerPill from '../components/PlayerPill';
import { BASE_RATINGS, POSITIONS, getEra, getFlagUrl } from '../utils/gameLogic';
import { COUNTRIES } from '../data/constants';
import './CreationScreen.css';

const POS_GROUPS = [
  { label: 'Goleiro',     positions: ['GOL'] },
  { label: 'Defesa',      positions: ['ZAG','LAT','ALA'] },
  { label: 'Meio-campo',  positions: ['VOL','MEI'] },
  { label: 'Ataque',      positions: ['CA','PON'] },
];

const POS_ICONS = {
  GOL:'ti-shield', ZAG:'ti-wall', LAT:'ti-arrow-right',
  ALA:'ti-arrows-left-right', VOL:'ti-anchor', MEI:'ti-topology-star',
  CA:'ti-circle-dot', PON:'ti-bolt',
};

function FlagImg({ code, size = 24 }) {
  if (!code) return null;
  return (
    <img
      src={getFlagUrl(code, size <= 24 ? 32 : 64)}
      alt=""
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle', borderRadius: 2 }}
      onError={e => { e.target.style.display = 'none'; }}
    />
  );
}

function CountryPicker({ value, countryCode, onChange }) {
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState('');
  const ref                   = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cp-wrap" ref={ref}>
      <button
        type="button"
        className={`cp-trigger ${open ? 'open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {value ? (
          <>
            <FlagImg code={countryCode} size={22} />
            <span className="cp-selected-name">{value}</span>
          </>
        ) : (
          <span className="cp-placeholder">Selecione um país...</span>
        )}
        <span className="cp-chevron">▼</span>
      </button>

      {open && (
        <div className="cp-panel">
          <div className="cp-search-wrap">
            <i className="ti ti-search cp-search-icon" />
            <input
              ref={inputRef}
              className="cp-search"
              placeholder="Buscar país..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="cp-list">
            {filtered.map(c => (
              <div
                key={c.code}
                className={`cp-item ${value === c.name ? 'active' : ''}`}
                onClick={() => { onChange(c); setOpen(false); setSearch(''); }}
              >
                <FlagImg code={c.code} size={22} />
                <span className="cp-item-name">{c.name}</span>
                {value === c.name && <i className="ti ti-check cp-check" />}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="cp-empty">Nenhum país encontrado</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreationScreen() {
  const { dispatch } = useGame();
  const [form, setForm] = useState({
    name: '', position: null, positionLabel: '',
    foot: 'Esquerdo', birthYear: '', nationality: '', countryCode: '', flag: '🌍',
  });

  const isReady = form.name && form.position && form.nationality && form.birthYear &&
    parseInt(form.birthYear) >= 1930 && parseInt(form.birthYear) <= 2020;

  const era = form.birthYear && !isNaN(parseInt(form.birthYear)) && parseInt(form.birthYear) >= 1930
    ? getEra(parseInt(form.birthYear)) : null;

  const birthYear = parseInt(form.birthYear);
  const careerRange = era ? `${birthYear+18} – ${birthYear+35}` : '';

  function setField(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function selectPos(pos) {
    const rating = BASE_RATINGS[pos] + Math.floor(Math.random() * 6) - 2;
    setForm(f => ({
      ...f,
      position: pos,
      positionLabel: POSITIONS[pos].label,
      rating: Math.min(99, Math.max(60, rating)),
    }));
  }

  function selectCountry(c) {
    setForm(f => ({ ...f, nationality: c.name, countryCode: c.code, flag: c.flag }));
  }

  function handleStart() {
    if (!isReady) return;
    const potential = Math.floor(Math.random() * 40) + 60;
    dispatch({
      type: 'SET_PLAYER',
      payload: {
        ...form,
        birthYear: parseInt(form.birthYear),
        potential,
        rating: form.rating || BASE_RATINGS[form.position],
      },
    });
    dispatch({ type: 'SET_SCREEN', payload: 'base' });
  }

  const filledSteps = [true, !!form.name, !!form.position, !!form.nationality, !!form.birthYear && era].filter(Boolean).length;

  return (
    <div className="creation-wrap">
      <div className="creation-topbar">
        <PlayerPill />
        <div className="creation-era-info">
          {era && <><div className="cei-name" style={{ color: era.color }}>{era.name}</div><div className="cei-range">{careerRange}</div></>}
        </div>
      </div>

      <div className="creation-header fade-up">
        <div className="creation-eyebrow">Football Career Simulator</div>
        <div className="creation-title">Crie seu <span>jogador</span></div>
      </div>

      <div className="creation-layout">
        {/* Sticker card */}
        <div className="sticker-card">
          <div className="sticker-shine" />
          <div className="sticker-top">
            <div className="sticker-rating">{form.rating || 75}</div>
            <div className="sticker-pos">{form.position || '—'}</div>
          </div>
          <div className="sticker-silhouette">
            <svg width="78" viewBox="0 0 100 160" fill="none">
              <circle cx="50" cy="18" r="13" fill="#C9A84C" opacity=".85"/>
              <rect x="32" y="34" width="36" height="44" rx="10" fill="#C9A84C" opacity=".85"/>
              <rect x="15" y="36" width="17" height="30" rx="8" fill="#C9A84C" opacity=".7"/>
              <rect x="68" y="36" width="17" height="30" rx="8" fill="#C9A84C" opacity=".7"/>
              <rect x="35" y="76" width="13" height="46" rx="7" fill="#C9A84C" opacity=".75"/>
              <rect x="52" y="76" width="13" height="46" rx="7" fill="#C9A84C" opacity=".75"/>
              <rect x="30" y="116" width="18" height="12" rx="5" fill="#C9A84C" opacity=".6"/>
              <rect x="52" y="116" width="18" height="12" rx="5" fill="#C9A84C" opacity=".6"/>
            </svg>
            {careerRange && <div className="sticker-year-tag">{careerRange}</div>}
          </div>
          <div className="sticker-bottom">
            <div className={`sticker-name ${!form.name ? 'ph' : ''}`}>
              {form.name ? form.name.toUpperCase() : 'seu nome aqui'}
            </div>
            <div className="sticker-meta">
              {form.countryCode
                ? <FlagImg code={form.countryCode} size={18} />
                : <span style={{fontSize:14}}>🌍</span>}
              <span className="sticker-country">{form.nationality || 'País'}</span>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="creation-form">
          {/* Nome */}
          <div className="field-group">
            <div className="field-label">Nome do jogador</div>
            <input
              className="cs-input display"
              type="text"
              placeholder="Ex: Bruno Santos"
              maxLength={20}
              value={form.name}
              onChange={e => setField('name', e.target.value)}
            />
          </div>

          {/* Ano de nascimento */}
          <div className="field-group">
            <div className="field-label">Ano de nascimento</div>
            <div className="year-row">
              <input
                className="cs-input display"
                type="number"
                placeholder="1990"
                min={1930}
                max={2020}
                value={form.birthYear}
                onChange={e => setField('birthYear', e.target.value)}
              />
              <div className="era-badge">
                <div className="era-name" style={{ color: era?.color || 'var(--text3)' }}>
                  {era ? era.name : '—'}
                </div>
                <div className="era-range">
                  {era ? careerRange : 'Entre 1930 e 2020'}
                </div>
              </div>
            </div>
          </div>

          {/* Posições */}
          <div className="field-group">
            <div className="field-label">Posição</div>
            {POS_GROUPS.map(group => (
              <div key={group.label}>
                <div className="pos-group-label">{group.label}</div>
                <div className={`pos-grid cols-${group.positions.length}`}>
                  {group.positions.map(pos => (
                    <button
                      key={pos}
                      className={`pos-btn ${form.position === pos ? 'active' : ''}`}
                      onClick={() => selectPos(pos)}
                    >
                      <i className={`ti ${POS_ICONS[pos]} pos-icon`} />
                      <span className="pos-name">{POSITIONS[pos].label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pé dominante */}
          <div className="field-group">
            <div className="field-label">Pé dominante</div>
            <div className="foot-row">
              {['Esquerdo','Direito'].map(f => (
                <button
                  key={f}
                  className={`foot-btn ${form.foot === f ? 'active' : ''}`}
                  onClick={() => setField('foot', f)}
                >
                  🦶 {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nacionalidade */}
      <div className="field-group">
        <div className="field-label">Nacionalidade</div>
        <CountryPicker
          value={form.nationality}
          countryCode={form.countryCode}
          onChange={selectCountry}
        />
      </div>

      {/* Progress dots */}
      <div className="progress-dots">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={`pdot ${i < filledSteps ? 'done' : ''}`} />
        ))}
      </div>

      <button className="start-btn" disabled={!isReady} onClick={handleStart}>
        <i className="ti ti-player-play" />
        Iniciar carreira
      </button>
    </div>
  );
}
