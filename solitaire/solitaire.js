const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let deck = [];
let waste = [];
let foundations = [[], [], [], []];
let tableau = [[], [], [], [], [], [], []];
let drawCount = 1;
let score = 0;
let selected = null;

function startGame(count) {
  drawCount = count;
  resetGame();
}

function resetGame() {
  deck = createDeck();
  shuffle(deck);
  waste = [];
  foundations = [[], [], [], []];
  tableau = [[], [], [], [], [], [], []];
  score = 0;
  selected = null;
  dealCards();
  draw();
  document.getElementById('score').innerText = score;
}

function toggleRules() {
  const rules = document.getElementById('rules');
  rules.classList.toggle('hidden');
}

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const colors = ['black', 'red', 'red', 'black'];
  let cards = [];
  for (let s = 0; s < 4; s++) {
    for (let v = 1; v <= 13; v++) {
      cards.push({
        suit: suits[s],
        color: colors[s],
        value: v,
        faceUp: false,
        x: 0,
        y: 0,
        pile: null,
      });
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

function dealCards() {
  let index = 0;
  for (let i = 0; i < tableau.length; i++) {
    for (let j = 0; j <= i; j++) {
      let card = deck[index++];
      card.pile = 'tableau';
      card.faceUp = j === i;
      tableau[i].push(card);
    }
  }
  deck = deck.slice(index);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFoundations();
  drawTableau();
  drawWaste();
  drawDeck();
}

function drawCard(card, x, y) {
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x, y, 80, 100);
  if (card.faceUp) {
    ctx.fillStyle = card.color === 'red' ? '#fdd' : '#fff';
    ctx.fillRect(x, y, 80, 100);
    ctx.fillStyle = card.color;
    ctx.font = '18px sans-serif';
    const label = card.value === 11 ? 'J' : card.value === 12 ? 'Q' : card.value === 13 ? 'K' : card.value;
    ctx.fillText(`${label}${card.suit}`, x + 10, y + 25);
  } else {
    ctx.fillStyle = '#888';
    ctx.fillRect(x, y, 80, 100);
  }
}

function drawDeck() {
  if (deck.length > 0) {
    drawCard({ faceUp: false }, 20, 20);
  } else {
    ctx.clearRect(20, 20, 80, 100);
  }
}

function drawWaste() {
  if (waste.length > 0) {
    const card = waste[waste.length - 1];
    drawCard(card, 120, 20);
  }
}

function drawFoundations() {
  for (let i = 0; i < foundations.length; i++) {
    const x = 400 + i * 100;
    const y = 20;
    if (foundations[i].length > 0) {
      drawCard(foundations[i][foundations[i].length - 1], x, y);
    } else {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x, y, 80, 100);
    }
  }
}

function drawTableau() {
  for (let i = 0; i < tableau.length; i++) {
    const x = 20 + i * 140;
    let y = 150;
    for (let j = 0; j < tableau[i].length; j++) {
      const card = tableau[i][j];
      drawCard(card, x, y);
      y += 30; // 縦にずらして重ね描画
    }
  }
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // デッキの範囲クリックで山札から drawCount 枚引いて waste に追加
  if (x >= 20 && x <= 100 && y >= 20 && y <= 120 && deck.length > 0) {
    for (let i = 0; i < drawCount && deck.length > 0; i++) {
      const card = deck.shift();
      card.faceUp = true;
      waste.push(card);
      score += 5;
    }
    document.getElementById('score').innerText = score;
    draw();
  }
});

// 初期化
startGame(drawCount);
