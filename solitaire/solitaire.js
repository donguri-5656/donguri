let deck = [];
let tableau = [[], [], [], [], [], [], []];
let foundations = { hearts: [], diamonds: [], clubs: [], spades: [] };
let waste = [];
let stock = [];
let drawCount = 1;
let score = 0;

function startGame(mode) {
  drawCount = mode;
  document.getElementById('difficulty-selection').classList.add('hidden');
  document.getElementById('game-ui').classList.remove('hidden');
  initGame();
}

function restartGame() {
  document.getElementById('difficulty-selection').classList.remove('hidden');
  document.getElementById('game-ui').classList.add('hidden');
  clearBoard();
}

function clearBoard() {
  document.getElementById('tableau').innerHTML = '';
  document.getElementById('stock').innerHTML = '';
  document.getElementById('waste').innerHTML = '';
  document.querySelectorAll('.foundation').forEach(f => f.innerHTML = '');
  score = 0;
  updateScore();
}

function initGame() {
  deck = createDeck();
  shuffle(deck);
  dealTableau();
  stock = [...deck];
  renderStock();
  updateScore();
}

function createDeck() {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = Array.from({ length: 13 }, (_, i) => i + 1);
  let cards = [];
  for (let suit of suits) {
    for (let value of values) {
      cards.push({ suit, value, faceUp: false });
    }
  }
  return cards;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function dealTableau() {
  for (let i = 0; i < 7; i++) {
    tableau[i] = deck.splice(0, i + 1);
    tableau[i][i].faceUp = true;
  }
  renderTableau();
}

function renderTableau() {
  const container = document.getElementById('tableau');
  container.innerHTML = '';
  tableau.forEach((column, colIdx) => {
    const colDiv = document.createElement('div');
    colDiv.className = 'column';
    column.forEach((card, idx) => {
      const cardDiv = createCardElement(card);
      cardDiv.style.top = `${idx * 30}px`;
      colDiv.appendChild(cardDiv);
    });
    container.appendChild(colDiv);
  });
}

function createCardElement(card) {
  const div = document.createElement('div');
  div.className = 'card';
  if (card.faceUp) {
    div.textContent = getCardSymbol(card);
    if (card.suit === 'hearts' || card.suit === 'diamonds') {
      div.classList.add('red');
    }
  } else {
    div.style.backgroundColor = '#999';
  }
  return div;
}

function getCardSymbol(card) {
  const symbols = {
    1: 'A', 11: 'J', 12: 'Q', 13: 'K'
  };
  const value = symbols[card.value] || card.value;
  const suitSymbols = {
    hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠'
  };
  return `${value}${suitSymbols[card.suit]}`;
}

function renderStock() {
  const stockDiv = document.getElementById('stock');
  const wasteDiv = document.getElementById('waste');
  stockDiv.innerHTML = '';
  wasteDiv.innerHTML = '';

  stockDiv.onclick = () => {
    if (stock.length === 0 && waste.length > 0) {
      stock = waste.reverse().map(c => ({ ...c, faceUp: false }));
      waste = [];
      score -= 5;
      updateScore();
      renderStock();
    } else {
      const drawn = stock.splice(0, drawCount).map(c => ({ ...c, faceUp: true }));
      waste.unshift(...drawn);
      score -= drawCount;
      updateScore();
      renderStock();
    }
  };

  if (stock.length > 0) {
    const back = document.createElement('div');
    back.className = 'card';
    back.style.backgroundColor = '#555';
    stockDiv.appendChild(back);
  }

  waste.slice(0, drawCount).forEach((card, idx) => {
    const cardDiv = createCardElement(card);
    cardDiv.style.left = `${idx * 10}px`;
    wasteDiv.appendChild(cardDiv);
  });
}

function updateScore() {
  document.getElementById('score').textContent = `スコア: ${score}`;
}

function toggleRules() {
  const ruleDiv = document.getElementById('rules');
  ruleDiv.classList.toggle('hidden');
}
