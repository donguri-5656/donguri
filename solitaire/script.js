const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let deck = [];
let waste = [];
let foundations = [[], [], [], []];
let tableau = [[], [], [], [], [], [], []];
let drawCount = 1;
let score = 0;
let selected = null;
let mouseDown = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragCards = [];

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
  dragCards = [];
  dealCards();
  draw();
  updateScore();
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
  deck = deck.slice(index); // 残りは山札
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawDeck();
  drawWaste();
  drawFoundations();
  drawTableau();
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#dff0d8");
  gradient.addColorStop(1, "#c8e5bc");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCard(card, x, y, highlight = false) {
  ctx.save();
  ctx.translate(x, y);

  if (highlight) {
    ctx.shadowColor = 'yellow';
    ctx.shadowBlur = 20;
  }

  ctx.fillStyle = card.faceUp ? (card.color === 'red' ? '#fff0f0' : '#ffffff') : '#888';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.fillRect(0, 0, 80, 100);
  ctx.strokeRect(0, 0, 80, 100);

  if (card.faceUp) {
    ctx.fillStyle = card.color;
    ctx.font = '20px sans-serif';
    let label = card.value;
    if (card.value === 1) label = 'A';
    else if (card.value === 11) label = 'J';
    else if (card.value === 12) label = 'Q';
    else if (card.value === 13) label = 'K';
    ctx.fillText(`${label}${card.suit}`, 10, 25);
  }

  ctx.restore();
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
    card.x = 120;
    card.y = 20;
  }
}

function drawFoundations() {
  for (let i = 0; i < 4; i++) {
    const x = 400 + i * 100;
    const y = 20;
    if (foundations[i].length > 0) {
      const card = foundations[i][foundations[i].length - 1];
      drawCard(card, x, y);
      card.x = x;
      card.y = y;
    } else {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x, y, 80, 100);
    }
  }
}
function drawTableau() {
  for (let i = 0; i < tableau.length; i++) {
    const col = tableau[i];
    let x = 20 + i * 140;
    let y = 150;
    for (let j = 0; j < col.length; j++) {
      const card = col[j];
      drawCard(card, x, y, selected && selected.card === card);
      card.x = x;
      card.y = y;
      y += card.faceUp ? 30 : 10;
    }
  }
}

// カードを取得（クリックされた位置のカードを特定）
function getCardAt(x, y) {
  for (let i = tableau.length - 1; i >= 0; i--) {
    const col = tableau[i];
    for (let j = col.length - 1; j >= 0; j--) {
      const card = col[j];
      const cx = card.x;
      const cy = card.y;
      const isFaceUp = card.faceUp;
      if (
        isFaceUp &&
        x >= cx &&
        x <= cx + 80 &&
        y >= cy &&
        y <= cy + 100
      ) {
        return { card, colIndex: i, rowIndex: j };
      }
    }
  }

  // Waste のトップカードか？
  if (waste.length > 0) {
    const top = waste[waste.length - 1];
    if (x >= top.x && x <= top.x + 80 && y >= top.y && y <= top.y + 100) {
      return { card: top, fromWaste: true };
    }
  }

  return null;
}

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const result = getCardAt(x, y);
  if (result) {
    selected = result;
  } else {
    selected = null;
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (!selected) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const colIndex = Math.floor((x - 20) / 140);
  if (colIndex >= 0 && colIndex < 7) {
    const destCol = tableau[colIndex];
    const srcCard = selected.card;
    const srcIndex = selected.rowIndex ?? 0;

    const isValid = validateMove(srcCard, destCol);

    if (isValid) {
      // 移動処理
      let movingCards;
      if (selected.fromWaste) {
        movingCards = [waste.pop()];
      } else {
        movingCards = tableau[selected.colIndex].splice(srcIndex);
        if (tableau[selected.colIndex].length > 0) {
          const last = tableau[selected.colIndex][tableau[selected.colIndex].length - 1];
          last.faceUp = true;
        }
      }

      movingCards.forEach((c) => destCol.push(c));
      score += 10;
    }
  }

  selected = null;
  document.getElementById('score').innerText = score;
  draw();
});
function validateMove(card, destCol) {
  if (destCol.length === 0) {
    return card.value === 13; // キングだけ置ける
  }

  const topCard = destCol[destCol.length - 1];
  const isOppositeColor = (card.color === 'red' && topCard.color === 'black') ||
                          (card.color === 'black' && topCard.color === 'red');
  const isOneLower = card.value === topCard.value - 1;

  return isOppositeColor && isOneLower;
}

function checkWin() {
  return foundations.every(f => f.length === 13);
}

function showWinMessage() {
  setTimeout(() => {
    alert("🎉 おめでとう！ソリティアをクリアしました！");
  }, 100);
}

// ヒント機能：ヒントボタンを押すと移動可能なカードをハイライト（簡易版）
function showHint() {
  for (let i = 0; i < tableau.length; i++) {
    const col = tableau[i];
    if (col.length === 0) continue;
    const card = col[col.length - 1];
    for (let j = 0; j < tableau.length; j++) {
      if (i === j) continue;
      const dest = tableau[j];
      if (validateMove(card, dest)) {
        highlightHint(card, i, j);
        return;
      }
    }
  }
  alert("ヒント：現在移動できるカードがありません");
}

function highlightHint(card, from, to) {
  ctx.save();
  ctx.strokeStyle = 'orange';
  ctx.lineWidth = 4;
  ctx.strokeRect(card.x, card.y, 80, 100);
  ctx.restore();
}

// 勝利判定を draw 後にチェック
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFoundations();
  drawTableau();
  drawWaste();
  drawDeck();
  if (checkWin()) {
    showWinMessage();
  }
}
