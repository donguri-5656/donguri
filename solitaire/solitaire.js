const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let deck = [];
let waste = [];
let foundations = [[], [], [], []];
let tableau = [[], [], [], [], [], [], []];
let drawCount = 1;
let score = 0;
let selectedCard = null;
let offsetX = 0;
let offsetY = 0;
let dragging = false;

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);

function startGame(count) {
  drawCount = count;
  resetGame();
}

function toggleRules() {
  document.getElementById('rules').classList.toggle('hidden');
}

function resetGame() {
  deck = createDeck();
  shuffle(deck);
  waste = [];
  foundations = [[], [], [], []];
  tableau = [[], [], [], [], [], [], []];
  selectedCard = null;
  score = 0;

  // Deal cards
  let index = 0;
  for (let i = 0; i < tableau.length; i++) {
    for (let j = 0; j <= i; j++) {
      const card = deck[index++];
      card.faceUp = j === i;
      tableau[i].push(card);
    }
  }
  deck = deck.slice(index);

  draw();
  updateScore(0);
}

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const colors = ['black', 'red', 'red', 'black'];
  const cards = [];

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
        index: -1,
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
function updateScore(delta) {
  score += delta;
  document.getElementById('score').innerText = score;
}

function drawCard(card, x, y) {
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x, y, 80, 100);
  if (card.faceUp) {
    ctx.fillStyle = card.color === 'red' ? '#fee' : '#fff';
    ctx.fillRect(x, y, 80, 100);
    ctx.fillStyle = card.color;
    ctx.font = '18px sans-serif';
    const label = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'][card.value - 1];
    ctx.fillText(`${label}${card.suit}`, x + 10, y + 25);
    card.x = x;
    card.y = y;
  } else {
    ctx.fillStyle = '#888';
    ctx.fillRect(x, y, 80, 100);
    card.x = x;
    card.y = y;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawDeck();
  drawWaste();
  drawFoundations();
  drawTableau();
}

function drawDeck() {
  if (deck.length > 0) {
    drawCard({ faceUp: false }, 20, 20);
  } else {
    ctx.clearRect(20, 20, 80, 100);
    ctx.strokeStyle = '#aaa';
    ctx.strokeRect(20, 20, 80, 100);
  }
}

function drawWaste() {
  if (waste.length > 0) {
    const card = waste[waste.length - 1];
    drawCard(card, 120, 20);
  } else {
    ctx.strokeStyle = '#aaa';
    ctx.strokeRect(120, 20, 80, 100);
  }
}

function drawFoundations() {
  for (let i = 0; i < 4; i++) {
    const x = 400 + i * 100;
    const y = 20;
    const pile = foundations[i];
    if (pile.length > 0) {
      drawCard(pile[pile.length - 1], x, y);
    } else {
      ctx.strokeStyle = '#aaa';
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
      y += card.faceUp ? 30 : 10;
    }
  }
}
canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // デッキクリック
  if (mouseX >= 20 && mouseX <= 100 && mouseY >= 20 && mouseY <= 120) {
    drawFromDeck();
    draw();
  }
});

function drawFromDeck() {
  if (deck.length === 0) {
    deck = waste.reverse();
    waste = [];
    deck.forEach(c => c.faceUp = false);
  } else {
    for (let i = 0; i < drawCount && deck.length > 0; i++) {
      const card = deck.pop();
      card.faceUp = true;
      waste.push(card);
    }
    updateScore(-1);
  }
}

// マウスドラッグ用イベント
function onMouseDown(e) {
  const { offsetX, offsetY } = e;
  const card = findCardAt(offsetX, offsetY);
  if (card && card.faceUp) {
    selectedCard = card;
    dragging = true;
    offsetX -= card.x;
    offsetY -= card.y;
  }
}

function onMouseMove(e) {
  if (dragging && selectedCard) {
    selectedCard.x = e.offsetX - offsetX;
    selectedCard.y = e.offsetY - offsetY;
    draw();
    drawCard(selectedCard, selectedCard.x, selectedCard.y);
  }
}

function onMouseUp(e) {
  if (dragging && selectedCard) {
    const { offsetX, offsetY } = e;
    // どの山に置いたか判定
    for (let i = 0; i < tableau.length; i++) {
      const x = 20 + i * 140;
      if (offsetX >= x && offsetX <= x + 80) {
        tableau[i].push(selectedCard);
        removeFromSource(selectedCard);
        updateScore(5);
        break;
      }
    }
    selectedCard = null;
    dragging = false;
    draw();
  }
}

function removeFromSource(card) {
  // waste or tableau から削除
  let idx = waste.indexOf(card);
  if (idx !== -1) {
    waste.splice(idx, 1);
    return;
  }

  for (let pile of tableau) {
    idx = pile.indexOf(card);
    if (idx !== -1) {
      pile.splice(idx, 1);
      if (pile.length && !pile[pile.length - 1].faceUp) {
        pile[pile.length - 1].faceUp = true;
        updateScore(5);
      }
      return;
    }
  }
}

function findCardAt(x, y) {
  // tableau優先で検索
  for (let pile of tableau) {
    for (let i = pile.length - 1; i >= 0; i--) {
      const card = pile[i];
      if (
        x >= card.x &&
        x <= card.x + 80 &&
        y >= card.y &&
        y <= card.y + 100
      ) {
        return card;
      }
    }
  }

  // waste
  if (waste.length > 0) {
    const card = waste[waste.length - 1];
    if (
      x >= card.x &&
      x <= card.x + 80 &&
      y >= card.y &&
      y <= card.y + 100
    ) {
      return card;
    }
  }

  return null;
}
