const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let deck = [], waste = [], foundations = [[], [], [], []], tableau = [[], [], [], [], [], [], []];
let drawCount = 1, score = 0, selected = null;
let dragOffsetX = 0, dragOffsetY = 0;

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
  document.getElementById('winMessage').classList.add('hidden');
}

function toggleRules() {
  document.getElementById('rules').classList.toggle('hidden');
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
        pile: null,
        x: 0,
        y: 0
      });
    }
  }
  return cards;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function dealCards() {
  let index = 0;
  for (let i = 0; i < tableau.length; i++) {
    for (let j = 0; j <= i; j++) {
      const card = deck[index++];
      card.faceUp = j === i;
      tableau[i].push(card);
    }
  }
  deck = deck.slice(index);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDeck();
  drawWaste();
  drawFoundations();
  drawTableau();
}

function drawCard(card, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = card.faceUp ? (card.color === 'red' ? '#fdd' : '#fff') : '#888';
  ctx.fillRect(0, 0, 80, 100);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(0, 0, 80, 100);

  if (card.faceUp) {
    ctx.fillStyle = card.color;
    ctx.font = '18px sans-serif';
    const label = card.value === 11 ? 'J' : card.value === 12 ? 'Q' : card.value === 13 ? 'K' : card.value;
    ctx.fillText(`${label}${card.suit}`, 10, 25);
  }
  ctx.restore();
}

function drawDeck() {
  if (deck.length > 0) drawCard({ faceUp: false }, 20, 20);
}

function drawWaste() {
  if (waste.length > 0) drawCard(waste[waste.length - 1], 120, 20);
}

function drawFoundations() {
  for (let i = 0; i < 4; i++) {
    const x = 400 + i * 100;
    if (foundations[i].length > 0) {
      drawCard(foundations[i][foundations[i].length - 1], x, 20);
    } else {
      ctx.strokeRect(x, 20, 80, 100);
    }
  }
}

function drawTableau() {
  for (let i = 0; i < 7; i++) {
    let y = 150;
    const x = 20 + i * 130;
    for (let j = 0; j < tableau[i].length; j++) {
      const card = tableau[i][j];
      card.x = x;
      card.y = y;
      drawCard(card, x, y);
      y += card.faceUp ? 30 : 10;
    }
  }
}

canvas.addEventListener('mousedown', (e) => {
  const { offsetX, offsetY } = e;
  for (let col = 0; col < 7; col++) {
    const stack = tableau[col];
    for (let i = 0; i < stack.length; i++) {
      const card = stack[i];
      if (card.faceUp && offsetX > card.x && offsetX < card.x + 80 && offsetY > card.y && offsetY < card.y + 100) {
        selected = { cards: stack.slice(i), from: col };
        dragOffsetX = offsetX - card.x;
        dragOffsetY = offsetY - card.y;
        return;
      }
    }
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (!selected) return;
  const { offsetX, offsetY } = e;
  for (let col = 0; col < 7; col++) {
    const stack = tableau[col];
    if (stack.length === 0 || (offsetX > 20 + col * 130 && offsetX < 100 + col * 130)) {
      const target = stack[stack.length - 1];
      const top = selected.cards[0];
      if (
        stack.length === 0 && top.value === 13 ||
        (target && target.faceUp &&
         top.color !== target.color &&
         top.value === target.value - 1)
      ) {
        tableau[selected.from] = tableau[selected.from].slice(0, -selected.cards.length);
        tableau[col] = tableau[col].concat(selected.cards);
        if (tableau[selected.from].length > 0) tableau[selected.from].at(-1).faceUp = true;
        score += 5;
        break;
      }
    }
  }
  selected = null;
  draw();
  document.getElementById('score').innerText = score;
  checkWin();
});

canvas.addEventListener('click', (e) => {
  const { offsetX, offsetY } = e;
  if (offsetX > 20 && offsetX < 100 && offsetY > 20 && offsetY < 120 && deck.length > 0) {
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

function checkWin() {
  if (foundations.every(f => f.length === 13)) {
    document.getElementById('winMessage').classList.remove('hidden');
  }
}

function showHint() {
  // とりあえず tableau の移動可能なカードを黄色でハイライト（簡易実装）
  draw();
  for (let i = 0; i < 7; i++) {
    const stack = tableau[i];
    const top = stack.at(-1);
    if (top && top.faceUp) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 4;
      ctx.strokeRect(top.x, top.y, 80, 100);
      break;
    }
  }
}
