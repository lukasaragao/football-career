export const COUNTRIES = [
  { name: 'Alemanha', flag: '🇩🇪', code: 'DE' },
  { name: 'Angola', flag: '🇦🇴', code: 'AO' },
  { name: 'Argentina', flag: '🇦🇷', code: 'AR' },
  { name: 'Austrália', flag: '🇦🇺', code: 'AU' },
  { name: 'Áustria', flag: '🇦🇹', code: 'AT' },
  { name: 'Bélgica', flag: '🇧🇪', code: 'BE' },
  { name: 'Bolívia', flag: '🇧🇴', code: 'BO' },
  { name: 'Brasil', flag: '🇧🇷', code: 'BR' },
  { name: 'Camarões', flag: '🇨🇲', code: 'CM' },
  { name: 'Canadá', flag: '🇨🇦', code: 'CA' },
  { name: 'Chile', flag: '🇨🇱', code: 'CL' },
  { name: 'China', flag: '🇨🇳', code: 'CN' },
  { name: 'Colômbia', flag: '🇨🇴', code: 'CO' },
  { name: 'Coreia do Sul', flag: '🇰🇷', code: 'KR' },
  { name: 'Costa do Marfim', flag: '🇨🇮', code: 'CI' },
  { name: 'Croácia', flag: '🇭🇷', code: 'HR' },
  { name: 'Dinamarca', flag: '🇩🇰', code: 'DK' },
  { name: 'Egito', flag: '🇪🇬', code: 'EG' },
  { name: 'Equador', flag: '🇪🇨', code: 'EC' },
  { name: 'Espanha', flag: '🇪🇸', code: 'ES' },
  { name: 'EUA', flag: '🇺🇸', code: 'US' },
  { name: 'França', flag: '🇫🇷', code: 'FR' },
  { name: 'Gana', flag: '🇬🇭', code: 'GH' },
  { name: 'Grécia', flag: '🇬🇷', code: 'GR' },
  { name: 'Holanda', flag: '🇳🇱', code: 'NL' },
  { name: 'Honduras', flag: '🇭🇳', code: 'HN' },
  { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'GB-ENG' },
  { name: 'Irlanda', flag: '🇮🇪', code: 'IE' },
  { name: 'Itália', flag: '🇮🇹', code: 'IT' },
  { name: 'Japão', flag: '🇯🇵', code: 'JP' },
  { name: 'Marrocos', flag: '🇲🇦', code: 'MA' },
  { name: 'México', flag: '🇲🇽', code: 'MX' },
  { name: 'Nigéria', flag: '🇳🇬', code: 'NG' },
  { name: 'Noruega', flag: '🇳🇴', code: 'NO' },
  { name: 'Paraguai', flag: '🇵🇾', code: 'PY' },
  { name: 'Peru', flag: '🇵🇪', code: 'PE' },
  { name: 'Polônia', flag: '🇵🇱', code: 'PL' },
  { name: 'Portugal', flag: '🇵🇹', code: 'PT' },
  { name: 'Qatar', flag: '🇶🇦', code: 'QA' },
  { name: 'Rússia', flag: '🇷🇺', code: 'RU' },
  { name: 'Senegal', flag: '🇸🇳', code: 'SN' },
  { name: 'Sérvia', flag: '🇷🇸', code: 'RS' },
  { name: 'Suécia', flag: '🇸🇪', code: 'SE' },
  { name: 'Suíça', flag: '🇨🇭', code: 'CH' },
  { name: 'Turquia', flag: '🇹🇷', code: 'TR' },
  { name: 'Ucrânia', flag: '🇺🇦', code: 'UA' },
  { name: 'Uruguai', flag: '🇺🇾', code: 'UY' },
  { name: 'Venezuela', flag: '🇻🇪', code: 'VE' },
].sort((a, b) => a.name.localeCompare(b.name, 'pt'));

export const POSITIONS = {
  GOL: { label: 'Goleiro',      group: 'Goleiro',     icon: 'ti-shield',           emoji: '🧤', baseRating: 80 },
  ZAG: { label: 'Zagueiro',     group: 'Defesa',      icon: 'ti-wall',             emoji: '🛡️', baseRating: 78 },
  LAT: { label: 'Lateral',      group: 'Defesa',      icon: 'ti-arrow-right',      emoji: '↔️', baseRating: 77 },
  ALA: { label: 'Ala',          group: 'Defesa',      icon: 'ti-arrows-left-right',emoji: '🔁', baseRating: 79 },
  VOL: { label: 'Volante',      group: 'Meio-campo',  icon: 'ti-anchor',           emoji: '⚓', baseRating: 76 },
  MEI: { label: 'Meia',         group: 'Meio-campo',  icon: 'ti-topology-star',    emoji: '🌟', baseRating: 82 },
  CA:  { label: 'Centroavante', group: 'Ataque',      icon: 'ti-circle-dot',       emoji: '⚽', baseRating: 83 },
  PON: { label: 'Ponta',        group: 'Ataque',      icon: 'ti-bolt',             emoji: '⚡', baseRating: 81 },
};

export const ERAS = [
  { maxYear: 1960, name: 'Era Clássica',       color: '#9B59B6' },
  { maxYear: 1975, name: 'Era Vintage',         color: '#E67E22' },
  { maxYear: 1985, name: 'Era Ouro 80/90',      color: '#C9A84C' },
  { maxYear: 1995, name: 'Era Moderna',         color: '#2ECC71' },
  { maxYear: 2005, name: 'Era Atual',           color: '#3498DB' },
  { maxYear: 2015, name: 'Era Futura Próxima',  color: '#1ABC9C' },
  { maxYear: 2020, name: 'Era Futura',          color: '#E74C3C' },
];

export const TITLE_DEFS = [
  { id: 'liga',    icon: '🏆', name: 'Ligas Nacionais',  detail: 'Campeão nacional',        maxCount: 9, baseProb: 0.32 },
  { id: 'copa',    icon: '🥇', name: 'Copas Nacionais',  detail: 'Copa do país',            maxCount: 9, baseProb: 0.28 },
  { id: 'champ',   icon: '🌍', name: 'Champions League', detail: 'Europa · Clubes de elite', maxCount: 5, baseProb: 0.10 },
  { id: 'libert',  icon: '🌎', name: 'Libertadores',     detail: 'América do Sul',          maxCount: 3, baseProb: 0.14 },
  { id: 'mundial', icon: '🌐', name: 'Copa do Mundo',    detail: 'Seleção Nacional',        maxCount: 4, baseProb: 0.08 },
  { id: 'bola',    icon: '⭐', name: 'Bola de Ouro',     detail: 'Melhor do mundo',         maxCount: 1, baseProb: 0.04 },
];

// Stats ranges por posição: [min, max] para cada stat
export const STATS_RANGES = {
  GOL: { jogos: [40,70], gols: [0,1],  assist: [0,0],  defesas: [40,120], amarelo: [3,8],  vermelho: [0,1] },
  ZAG: { jogos: [40,70], gols: [1,5],  assist: [1,4],  defesas: [15,50],  amarelo: [5,12], vermelho: [0,2] },
  LAT: { jogos: [40,70], gols: [2,7],  assist: [4,12], defesas: [10,35],  amarelo: [4,10], vermelho: [0,1] },
  ALA: { jogos: [40,70], gols: [3,10], assist: [5,15], defesas: [5,20],   amarelo: [4,10], vermelho: [0,1] },
  VOL: { jogos: [40,70], gols: [3,10], assist: [4,12], defesas: [5,20],   amarelo: [6,14], vermelho: [0,2] },
  MEI: { jogos: [40,70], gols: [8,20], assist: [10,25],defesas: [2,8],    amarelo: [3,8],  vermelho: [0,1] },
  CA:  { jogos: [40,70], gols: [15,40],assist: [4,12], defesas: [0,2],    amarelo: [3,8],  vermelho: [0,2] },
  PON: { jogos: [40,70], gols: [10,28],assist: [8,20], defesas: [0,3],    amarelo: [3,7],  vermelho: [0,1] },
};

export const PRESTIGE_LABELS = {
  1: 'Elite Mundial',
  2: 'Top Liga',
  3: 'Liga Forte',
  4: 'Liga Regional',
  5: 'Liga Local',
};

export const CONTINENTAL_LABELS = {
  champions: 'Champions League',
  libertadores: 'Libertadores',
  caf: 'CAF Champions',
  afc: 'AFC Champions',
};

// Clubes de base por país (fallback enquanto clubs.json não está disponível)
export const BASE_CLUBS = {
  BR: [
    { name: 'Flamengo',     emoji: '🔴', league: 'Brasileirão Série A', base: 5 },
    { name: 'Palmeiras',    emoji: '💚', league: 'Brasileirão Série A', base: 5 },
    { name: 'Santos',       emoji: '⚫', league: 'Brasileirão Série A', base: 5 },
    { name: 'São Paulo',    emoji: '🔴', league: 'Brasileirão Série A', base: 5 },
    { name: 'Corinthians',  emoji: '⚫', league: 'Brasileirão Série A', base: 4 },
    { name: 'Grêmio',       emoji: '🔵', league: 'Brasileirão Série A', base: 5 },
    { name: 'Internacional',emoji: '🔴', league: 'Brasileirão Série A', base: 4 },
    { name: 'Atlético-MG',  emoji: '⚫', league: 'Brasileirão Série A', base: 4 },
    { name: 'Fluminense',   emoji: '🟢', league: 'Brasileirão Série A', base: 4 },
    { name: 'Cruzeiro',     emoji: '🔵', league: 'Brasileirão Série A', base: 4 },
  ],
  AR: [
    { name: 'Boca Juniors', emoji: '🔵', league: 'Primera División', base: 5 },
    { name: 'River Plate',  emoji: '🔴', league: 'Primera División', base: 5 },
    { name: 'Racing Club',  emoji: '🔵', league: 'Primera División', base: 4 },
  ],
  ES: [
    { name: 'Real Madrid B',  emoji: '⚪', league: 'La Liga', base: 5 },
    { name: 'Barcelona B',    emoji: '🔵', league: 'La Liga', base: 5 },
    { name: 'Atlético Madrid',emoji: '🔴', league: 'La Liga', base: 4 },
  ],
  DEFAULT: [
    { name: 'Clube Local',  emoji: '⚽', league: 'Liga Nacional', base: 3 },
    { name: 'Academia FC',  emoji: '🏟️', league: 'Liga Nacional', base: 2 },
  ],
};
