# ⚽ Football Career Simulator

Simulador de carreira de jogador de futebol — React + Tailwind (CSS Variables).

---

## 🚀 Como rodar

```bash
npm install
npm start
```

Acessa em: `http://localhost:3000`

---

## 📁 Estrutura do projeto

```
src/
├── App.jsx                   # Roteador de telas
├── index.js                  # Entry point
├── index.css                 # CSS global + variáveis
│
├── context/
│   └── GameContext.jsx       # Estado global do jogo (useReducer)
│
├── data/
│   ├── constants.js          # Países, posições, eras, ranges de stats
│   └── clubs.json            # ← Coloque aqui o arquivo gerado pelo fetch-clubs.js
│
├── utils/
│   └── gameLogic.js          # Lógica: stats, ratings, títulos, legado
│
├── components/
│   ├── PlayerPill.jsx        # Pill expansível com painel completo do jogador
│   └── PlayerPill.css
│
└── screens/
    ├── CreationScreen.jsx    # Tela 1: Criação do jogador
    ├── CreationScreen.css
    ├── BaseClubScreen.jsx    # Tela 2: Clube de base (envelope)
    ├── BaseClubScreen.css
    ├── RouletteScreen.jsx    # Tela 3: Roleta de clubes (por período)
    ├── RouletteScreen.css
    ├── StatsScreen.jsx       # Tela 4: Estatísticas do período
    ├── StatsScreen.css
    ├── RetirementScreen.jsx  # Tela 5: Aposentadoria + roleta de títulos
    └── RetirementScreen.css
```

---

## 🎮 Fluxo do jogo

```
Criação → Base → [Roleta → Stats] × 9 períodos → Aposentadoria + Títulos
```

- Carreira profissional: 18 → 35 anos (9 períodos de 2 anos)
- A cada período: roleta sorteia 1–3 propostas de clube
- Stats gerados automaticamente por posição e potencial oculto
- Ao final: roleta de títulos (Liga, Copa, Champions, Libertadores, Copa do Mundo, Bola de Ouro)
- Legado calculado dinamicamente (GOAT → Profissional)

---

## 🏆 Clubes (clubs.json)

O jogo funciona com um fallback de ~20 clubes sem o arquivo.  
Para usar todos os times do mundo (Série A e B de todas as federações):

1. Rode o script `fetch-clubs.js` na raiz do projeto:
   ```bash
   node fetch-clubs.js
   ```
2. Copie o `clubs.json` gerado para `src/data/clubs.json`
3. Reinicie o servidor

O script busca os dados da **API-Football** e gera o JSON automaticamente.  
Com o plano gratuito (100 req/dia), pode levar 2–3 dias para buscar todas as 700+ ligas.  
O script salva o progresso e continua de onde parou.

---

## 🎨 Design

- **Tema:** Dark mode · estilo card de figurinha
- **Fontes:** Bebas Neue (display) + DM Sans (corpo)
- **Cores:** Gold `#C9A84C` como acento principal
- **Componente central:** `PlayerPill` — expansível em qualquer tela, mostra stats completos da carreira

---

## 🗂️ Eras disponíveis

| Ano de nascimento | Era                |
|-------------------|--------------------|
| até 1960          | Era Clássica       |
| até 1975          | Era Vintage        |
| até 1985          | Era Ouro 80/90     |
| até 1995          | Era Moderna        |
| até 2005          | Era Atual          |
| até 2015          | Era Futura Próxima |
| até 2020          | Era Futura         |

---

## 📊 Stats por posição (por período de 2 anos)

| Posição       | Gols   | Assist. | Defesas | Cart. A | Cart. V |
|---------------|--------|---------|---------|---------|---------|
| Goleiro       | 0–1    | 0       | 40–120  | 3–8     | 0–1     |
| Zagueiro      | 1–5    | 1–4     | 15–50   | 5–12    | 0–2     |
| Lateral       | 2–7    | 4–12    | 10–35   | 4–10    | 0–1     |
| Ala           | 3–10   | 5–15    | 5–20    | 4–10    | 0–1     |
| Volante       | 3–10   | 4–12    | 5–20    | 6–14    | 0–2     |
| Meia          | 8–20   | 10–25   | 2–8     | 3–8     | 0–1     |
| Centroavante  | 15–40  | 4–12    | 0–2     | 3–8     | 0–2     |
| Ponta         | 10–28  | 8–20    | 0–3     | 3–7     | 0–1     |
