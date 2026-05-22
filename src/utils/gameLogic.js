import { STATS_RANGES, ERAS, TITLE_DEFS, BASE_CLUBS, POSITIONS } from '../data/constants';

export { POSITIONS };

export const BASE_RATINGS = Object.fromEntries(
  Object.entries(POSITIONS).map(([k, v]) => [k, v.baseRating])
);

/** Returns a flagsapi.com URL for a given ISO country code (e.g. "BR", "GB-ENG" → "GB") */
export function getFlagUrl(code, size = 32) {
  if (!code) return null;
  const iso2 = code.split('-')[0].toUpperCase();
  return `https://flagsapi.com/${iso2}/flat/${size}.png`;
}

export function rnd(min, max) {
  if (max < min) return min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getEra(year) {
  if (!year) return null;
  return ERAS.find(e => year <= e.maxYear) || ERAS[ERAS.length - 1];
}

export function getCareerYears(birthYear) {
  return { start: birthYear + 18, end: birthYear + 35 };
}

export function generatePeriodStats(pos, period, potential) {
  const ranges = STATS_RANGES[pos] || STATS_RANGES['MEI'];
  const bonus = Math.floor((potential - 50) / 10);
  function roll(key) {
    const [mn, mx] = ranges[key];
    const lo = Math.max(0, mn);
    const hi = Math.max(lo, Math.min(mx + bonus, mx + 10));
    return rnd(lo, hi);
  }
  const amarelo = roll('amarelo');
  const vermelho = roll('vermelho');
  const jogosBase = roll('jogos');
  return {
    jogos:    Math.max(0, jogosBase - vermelho),
    gols:     Math.max(0, roll('gols')),
    assist:   Math.max(0, roll('assist')),
    defesas:  Math.max(0, roll('defesas')),
    amarelo:  Math.max(0, amarelo),
    vermelho: Math.max(0, vermelho),
  };
}

export function generateRatings(stats, pos) {
  const isGK = pos === 'GOL';
  const isDef = ['ZAG','LAT','ALA'].includes(pos);
  const isMid = ['VOL','MEI'].includes(pos);
  let fin, mob, cont, disc;
  if (isGK) {
    fin  = Math.min(99, 40 + Math.floor(stats.defesas / 2));
    mob  = rnd(55, 78);
    cont = Math.min(99, 50 + stats.defesas);
    disc = Math.max(20, 90 - stats.amarelo * 5 - stats.vermelho * 15);
  } else if (isDef) {
    fin  = Math.min(99, 40 + stats.gols * 3);
    mob  = rnd(58, 76);
    cont = Math.min(99, 50 + stats.defesas + stats.assist * 2);
    disc = Math.max(20, 88 - stats.amarelo * 4 - stats.vermelho * 14);
  } else if (isMid) {
    fin  = Math.min(99, 45 + stats.gols * 2);
    mob  = rnd(62, 82);
    cont = Math.min(99, 45 + stats.assist * 2 + stats.gols);
    disc = Math.max(20, 88 - stats.amarelo * 4 - stats.vermelho * 12);
  } else {
    fin  = Math.min(99, 45 + stats.gols * 1.5);
    mob  = rnd(60, 80);
    cont = Math.min(99, 45 + stats.gols + stats.assist * 2);
    disc = Math.max(20, 88 - stats.amarelo * 4 - stats.vermelho * 13);
  }
  const ger = Math.round((fin + mob + cont + disc) / 4);
  return { fin: Math.round(fin), mob: Math.round(mob), cont: Math.round(cont), disc: Math.round(disc), ger };
}

export function generateHighlights(stats, ratings, pos, clubName, period) {
  const items = [];
  const age = 18 + (period - 1) * 2;
  if (stats.gols >= 30) items.push({ icon:'🔥', text:`<strong>${stats.gols} gols</strong> em ${stats.jogos} jogos — artilharia histórica no ${clubName}.` });
  else if (stats.gols >= 20) items.push({ icon:'⚽', text:`<strong>${stats.gols} gols</strong> em ${stats.jogos} jogos — temporada de destaque.` });
  else if (stats.gols >= 12) items.push({ icon:'⚽', text:`<strong>${stats.gols} gols</strong> marcados — bom aproveitamento para ${age} anos.` });
  if (stats.assist >= 15) items.push({ icon:'🎯', text:`<strong>${stats.assist} assistências</strong> — entre os melhores garçons da liga.` });
  else if (stats.assist >= 8) items.push({ icon:'🎯', text:`<strong>${stats.assist} assistências</strong> — boa visão de jogo.` });
  if (stats.defesas >= 80) items.push({ icon:'🧤', text:`<strong>${stats.defesas} defesas</strong> — muralha instransponível.` });
  if (stats.vermelho >= 2) items.push({ icon:'🟥', text:`<strong>${stats.vermelho} expulsões</strong> — temperamento custou jogos.` });
  else if (stats.amarelo >= 8) items.push({ icon:'⚠️', text:`<strong>${stats.amarelo} cartões</strong> — disciplina a melhorar.` });
  items.push({ icon:'📊', text:`Nota geral <strong>${ratings.ger}/100</strong> — ${ratings.ger >= 80 ? 'candidato aos prêmios individuais.' : 'desempenho sólido no período.'}` });
  if (period === 1) items.push({ icon:'🌱', text:`Primeiro período profissional concluído aos ${age} anos.` });
  return items.slice(0, 4);
}

export function rollTitles(clubHistory, potential) {
  return TITLE_DEFS.map(t => {
    const prestigeBonus = (clubHistory || []).reduce((acc, c) => {
      if (c.prestige === 1) return acc + 0.04;
      if (c.prestige === 2) return acc + 0.02;
      return acc;
    }, 0);
    const potBonus = (potential - 50) / 1000;
    const prob = Math.min(t.baseProb + prestigeBonus + potBonus, 0.6);
    let won = 0;
    for (let i = 0; i < t.maxCount; i++) {
      if (Math.random() < prob) won++;
    }
    return { ...t, won };
  });
}

export function getLegend(titles, stats) {
  const total = titles.reduce((s, t) => s + t.won, 0);
  const hasBola  = titles.find(t => t.id === 'bola')?.won > 0;
  const hasChamp = titles.find(t => t.id === 'champ')?.won > 0;
  const hasWorld = titles.find(t => t.id === 'mundial')?.won > 0;
  const ligas    = titles.find(t => t.id === 'liga')?.won || 0;
  if (hasBola && hasChamp && hasWorld) return { trophy:'🐐', rank:'GOAT',              title:'O Maior de Todos',    sub:'Uma carreira perfeita. Poucos chegaram tão alto.' };
  if (hasBola)                          return { trophy:'⭐', rank:'LENDA MUNDIAL',     title:'O Fenômeno',          sub:'A Bola de Ouro coroou uma geração inteira.' };
  if (hasChamp && hasWorld)             return { trophy:'🏆', rank:'LENDA CONTINENTAL', title:'O Conquistador',      sub:'Champions e Copa do Mundo — o sonho máximo.' };
  if (hasWorld)                         return { trophy:'🌐', rank:'HERÓI NACIONAL',    title:'O Campeão do Mundo',  sub:'Ergueu a taça mais pesada com a Seleção.' };
  if (hasChamp)                         return { trophy:'🌍', rank:'LENDA EUROPEIA',    title:'O Europeu',           sub:'Conquistou a Champions pelo maior clube.' };
  if (ligas >= 4)                       return { trophy:'🏆', rank:'LENDA DO CLUBE',    title:'O Ídolo',             sub:`${ligas} ligas nacionais. Um nome eterno.` };
  if (total >= 3)                       return { trophy:'🥇', rank:'VETERANO',           title:'O Guerreiro',         sub:'Troféus conquistados com suor e determinação.' };
  if (stats.gols >= 250)                return { trophy:'⚽', rank:'ARTILHEIRO',         title:'O Goleador',          sub:`${stats.gols} gols na carreira. Os goleiros tremiam.` };
  return                                       { trophy:'👏', rank:'PROFISSIONAL',       title:'O Competidor',        sub:'Uma carreira honrada, jogada com garra.' };
}

export function pickBaseClub(countryCode) {
  const list = BASE_CLUBS[countryCode] || BASE_CLUBS['DEFAULT'];
  return list[Math.floor(Math.random() * list.length)];
}

export function getClubOffers(clubs, age, potential, currentClubId) {
  if (!clubs || clubs.length === 0) return getFallbackOffers(age, potential);
  const maxPrestige = age <= 22 ? 3 : age <= 28 ? 2 : 4;
  const eligible = clubs.filter(c => c.prestige <= maxPrestige && c.id !== currentClubId);
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  const count = Math.random() < 0.25 ? 1 : Math.random() < 0.6 ? 2 : 3;
  return shuffled.slice(0, count);
}

// ─── Difficulty labels shown in the UI ───────────────────────────────────────
const PRESTIGE_DIFF = {
  1: { label: 'Favorito',    color: '#2ECC71' },
  2: { label: 'Candidato',   color: '#3498DB' },
  3: { label: 'Outsider',    color: '#E8C97A' },
  4: { label: 'Zebra',       color: '#E67E22' },
  5: { label: 'Improvável',  color: '#E74C3C' },
};

export function getTitleDifficulty(club) {
  const p = club?.prestige ?? 5;
  return PRESTIGE_DIFF[p] || PRESTIGE_DIFF[5];
}

export function rollPeriodTitles(club, potential, periodIndex) {
  // pot: 0 → 1 scale (potential 50 = 0, potential 100 = 1)
  const pot      = Math.max(0, Math.min(1, (potential - 50) / 50));
  const prestige = club?.prestige ?? 5;
  const cont     = club?.continental || [];
  const diff     = getTitleDifficulty(club);
  const roll     = (prob) => Math.random() < prob ? 1 : 0;

  // Small potential bonus: elite player extracts a bit more from any club (+0 to +8pp)
  const potBonus = pot * 0.08;

  // ── Liga Nacional ─────────────────────────────────────────────────────────
  // P1 clubs (Real Madrid, PSG…) win their league ~55% of seasons
  // P5 clubs almost never win
  const LIGA = { 1: 0.55, 2: 0.30, 3: 0.16, 4: 0.06, 5: 0.02 };
  const ligaProb = Math.min((LIGA[prestige] ?? 0.02) + potBonus, 0.70);

  // ── Copa Nacional ─────────────────────────────────────────────────────────
  // Cups are slightly more random (upsets happen), but big clubs still dominate
  const COPA = { 1: 0.42, 2: 0.26, 3: 0.15, 4: 0.07, 5: 0.03 };
  const copaProb = Math.min((COPA[prestige] ?? 0.03) + potBonus, 0.55);

  const results = [];
  results.push({ id:'liga',  icon:'🏆', name:'Liga Nacional', detail:`${diff.label} · ${Math.round(ligaProb * 100)}% chance`, won: roll(ligaProb) });
  results.push({ id:'copa',  icon:'🥇', name:'Copa Nacional', detail:`${diff.label} · ${Math.round(copaProb * 100)}% chance`, won: roll(copaProb) });

  // ── Champions League ──────────────────────────────────────────────────────
  // Realistically: P1 clubs with champ win ~20% of editions, P2 ~5%, P3 ~1%
  if (cont.includes('champions')) {
    const CHAMP = { 1: 0.20, 2: 0.05, 3: 0.01 };
    const champProb = Math.min((CHAMP[prestige] ?? 0.005) + pot * 0.06, 0.30);
    results.push({ id:'champ', icon:'🌍', name:'Champions League', detail:`${diff.label} · ${Math.round(champProb * 100)}% chance`, won: roll(champProb) });
  }

  // ── Libertadores ─────────────────────────────────────────────────────────
  if (cont.includes('libertadores')) {
    const LIBERT = { 1: 0.26, 2: 0.12, 3: 0.04 };
    const libertProb = Math.min((LIBERT[prestige] ?? 0.02) + pot * 0.06, 0.36);
    results.push({ id:'libert', icon:'🌎', name:'Libertadores', detail:`${diff.label} · ${Math.round(libertProb * 100)}% chance`, won: roll(libertProb) });
  }

  // ── CAF Champions ─────────────────────────────────────────────────────────
  if (cont.includes('caf')) {
    const CAF = { 1: 0.28, 2: 0.13, 3: 0.05 };
    const cafProb = Math.min((CAF[prestige] ?? 0.02) + pot * 0.06, 0.38);
    results.push({ id:'caf', icon:'🌍', name:'CAF Champions', detail:`${diff.label} · ${Math.round(cafProb * 100)}% chance`, won: roll(cafProb) });
  }

  // ── Copa do Mundo ─────────────────────────────────────────────────────────
  // Happens every 2 periods. Driven by PLAYER POTENTIAL (national team quality),
  // not the club. Small visibility bonus for playing at a top club.
  if (periodIndex % 2 === 0) {
    const mundialBase = pot < 0.2 ? 0.01
                      : pot < 0.4 ? 0.03
                      : pot < 0.6 ? 0.06
                      : pot < 0.8 ? 0.10
                      : 0.14;
    const visibilityBonus = prestige === 1 ? 0.03 : prestige === 2 ? 0.01 : 0;
    const mundialProb = Math.min(mundialBase + visibilityBonus, 0.18);
    results.push({ id:'mundial', icon:'🌐', name:'Copa do Mundo', detail:`Potencial ${potential} · ${Math.round(mundialProb * 100)}% chance`, won: roll(mundialProb) });
  }

  // ── Bola de Ouro ─────────────────────────────────────────────────────────
  // Only in peak years (periods 3–6). Requires elite club + elite potential.
  // Playing at P3+ clubs makes it virtually impossible regardless of talent.
  if (periodIndex >= 3 && periodIndex <= 6) {
    const bolaProb = prestige === 1 && pot > 0.8 ? 0.12
                   : prestige === 1 && pot > 0.6 ? 0.05
                   : prestige === 1 && pot > 0.4 ? 0.02
                   : prestige === 1              ? 0.008
                   : prestige === 2 && pot > 0.8 ? 0.015
                   : prestige === 2 && pot > 0.6 ? 0.004
                   : 0.001;   // P3-5: almost impossible
    results.push({ id:'bola', icon:'⭐', name:'Bola de Ouro', detail:`${prestige <= 2 ? diff.label : 'Praticamente impossível'} · ${(bolaProb * 100).toFixed(1)}% chance`, won: roll(bolaProb) });
  }

  return results;
}

export function simulateRemainingPeriods({ fromPeriod, player, currentClub, clubs }) {
  const periods = [];
  let club = currentClub;
  for (let i = fromPeriod; i <= 8; i++) {
    const age = 18 + i * 2;
    const offers = getClubOffers(clubs, age, player.potential, club?.id);
    if (offers.length > 0 && Math.random() > 0.35) {
      club = offers[Math.floor(Math.random() * offers.length)];
    }
    const stats   = generatePeriodStats(player.position, i, player.potential);
    const ratings = generatePeriodRatings(stats, player.position);
    const titles  = rollPeriodTitles(club, player.potential, i);
    periods.push({ periodIndex: i, club, stats, ratings, titles });
  }
  return periods;
}

// Returns 9 career windows (2-year blocks starting at age 18)
export function getCareerWindows(birthYear) {
  return Array.from({ length: 9 }, (_, i) => {
    const ageStart = 18 + i * 2;
    const ageEnd   = ageStart + 1;
    return {
      ageStart,
      ageEnd,
      label: `${ageStart}-${ageEnd}`,
      yearStart: birthYear + ageStart,
      yearEnd:   birthYear + ageEnd,
    };
  });
}

export function buildLegend(titles, totals, potential) {
  return getLegend(titles, totals);
}

export function pickClubOffers(clubs, potential, periodIndex, currentClub) {
  const age = 18 + periodIndex * 2;
  return getClubOffers(clubs, age, potential, currentClub?.id);
}

export function generatePeriodRatings(stats, pos) {
  const r = generateRatings(stats, pos);
  return { fin: r.fin, mov: r.mob, def: r.cont, dis: r.disc, ger: r.ger };
}

function getFallbackOffers(age, potential) {
  const pool = [
    { id:1,  name:'Porto',           emoji:'🔵', league:'Primeira Liga',    country:'🇵🇹', prestige:2, continental:['champions'],    rating:82 },
    { id:2,  name:'Benfica',         emoji:'🔴', league:'Primeira Liga',    country:'🇵🇹', prestige:2, continental:['champions'],    rating:83 },
    { id:3,  name:'Sporting CP',     emoji:'🟢', league:'Primeira Liga',    country:'🇵🇹', prestige:2, continental:['champions'],    rating:81 },
    { id:4,  name:'Ajax',            emoji:'🔴', league:'Eredivisie',       country:'🇳🇱', prestige:2, continental:['champions'],    rating:82 },
    { id:5,  name:'Feyenoord',       emoji:'🔴', league:'Eredivisie',       country:'🇳🇱', prestige:2, continental:['champions'],    rating:80 },
    { id:6,  name:'Galatasaray',     emoji:'🟡', league:'Süper Lig',        country:'🇹🇷', prestige:3, continental:['champions'],    rating:78 },
    { id:7,  name:'Celtic',          emoji:'🟢', league:'Scottish Prem.',   country:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', prestige:3, continental:['champions'],    rating:76 },
    { id:8,  name:'Sevilla',         emoji:'🔴', league:'La Liga',          country:'🇪🇸', prestige:2, continental:['champions'],    rating:80 },
    { id:9,  name:'Lyon',            emoji:'🔵', league:'Ligue 1',          country:'🇫🇷', prestige:2, continental:[],              rating:78 },
    { id:10, name:'Monaco',          emoji:'🔴', league:'Ligue 1',          country:'🇫🇷', prestige:2, continental:['champions'],    rating:79 },
    { id:11, name:'Boca Juniors',    emoji:'🔵', league:'Primera División', country:'🇦🇷', prestige:2, continental:['libertadores'], rating:83 },
    { id:12, name:'River Plate',     emoji:'🔴', league:'Primera División', country:'🇦🇷', prestige:2, continental:['libertadores'], rating:84 },
    { id:13, name:'Flamengo',        emoji:'🔴', league:'Brasileirão A',    country:'🇧🇷', prestige:2, continental:['libertadores'], rating:82 },
    { id:14, name:'Palmeiras',       emoji:'💚', league:'Brasileirão A',    country:'🇧🇷', prestige:2, continental:['libertadores'], rating:84 },
    { id:15, name:'Nottm Forest',    emoji:'🔴', league:'Premier League',   country:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', prestige:2, continental:[],              rating:76 },
    { id:16, name:'Leeds United',    emoji:'🔵', league:'Championship',     country:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', prestige:3, continental:[],              rating:74 },
    { id:17, name:'Real Sociedad',   emoji:'🔵', league:'La Liga',          country:'🇪🇸', prestige:2, continental:['champions'],    rating:79 },
    { id:18, name:'Anderlecht',      emoji:'🟣', league:'Pro League',       country:'🇧🇪', prestige:3, continental:[],              rating:74 },
    { id:19, name:'Al-Hilal',        emoji:'🔵', league:'Saudi Pro League', country:'🇸🇦', prestige:4, continental:[],              rating:72 },
    { id:20, name:'Urawa Red',       emoji:'🔴', league:'J-League',         country:'🇯🇵', prestige:4, continental:[],              rating:70 },
  ];
  const maxPrestige = age <= 22 ? 3 : age <= 28 ? 2 : 5;
  const eligible = pool.filter(c => c.prestige <= maxPrestige);
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  const count = Math.random() < 0.25 ? 1 : Math.random() < 0.6 ? 2 : 3;
  return shuffled.slice(0, count);
}
