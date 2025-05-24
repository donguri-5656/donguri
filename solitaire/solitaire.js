const canvas = document.getElementById('solitaireCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 960;
canvas.height = 600;

let game = {
  deck: [],
  waste: [],
  foundations: [[], [], [], []],
  tableau: [[], [], [], [], [], [], []],
  stockDraw: 1,
  selected: null,
  score: 0,
  lastMoveTime: Date.now(),
  dragging: null,
  offsetX: 0,
  offsetY: 0
};

const suits = ['♠', '♥', '♣', '♦'];
const colors = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };

function createDeck() {
  let deck = [];
  for (let suit of suits) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ suit, rank, faceUp: false });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function startGame(drawCount) {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');

  game.deck = createDeck();
  game.stockDraw = drawCount;
  game.foundations = [[], [], [], []];
  game.tableau = [[], [], [], [], [], [], []];
  game.waste = [];
  game.score = 0;
  game.selected = null;
  game.lastMoveTime = Date.now();

  for (let i = 0; i < 7; i++) {
    for (let j = i; j < 7; j++) {
      let card = game.deck.pop();
      card.faceUp = j === i;
      game.tableau[j].push(card);
    }
  }

  draw();
}

function restartGame() {
  if (confirm("ゲームをやり直しますか？")) {
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
  }
}

function toggleRules() {
  document.getElementById('rules').classList.toggle('hidden');
}

function showHint() {
  alert("ヒント：空の列にキングを移動してみよう！");
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawDeck();
  drawWaste();
  drawFoundations();
  drawTableau();
  drawScore();

  requestAnimationFrame(draw);
}

function drawDeck() {
  ctx.strokeStyle = 'white';
  ctx.strokeRect(20, 20, 60, 90);
  if (game.deck.length > 0) {
    ctx.fillStyle = '#3366cc';
    ctx.fillRect(20, 20, 60, 90);
    ctx.fillStyle = 'white';
    ctx.fillText('山札', 35, 70);
  }
}

function drawWaste() {
  if (game.waste.length > 0) {
    let card = game.waste[game.waste.length - 1];
    drawCard(card, 100, 20);
  } else {
    ctx.strokeRect(100, 20, 60, 90);
  }
}

function drawFoundations() {
  for (let i = 0; i < 4; i++) {
    let x = 200 + i * 80;
    if (game.foundations[i].length > 0) {
      drawCard(game.foundations[i][game.foundations[i].length - 1], x, 20);
    } else {
      ctx.strokeRect(x, 20, 60, 90);
    }
  }
}

function drawTableau() {
  for (let i = 0; i < 7; i++) {
    let y = 130;
    for (let j = 0; j < game.tableau[i].length; j++) {
      let card = game.tableau[i][j];
      drawCard(card, 20 + i * 130, y);
      y += card.faceUp ? 25 : 12;
    }
  }
}

function drawCard(card, x, y) {
  ctx.fillStyle = card.faceUp ? 'white' : '#999';
  ctx.fillRect(x, y, 60, 90);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x, y, 60, 90);
  if (card.faceUp) {
    ctx.fillStyle = colors[card.suit];
    ctx.font = '16px sans-serif';
    ctx.fillText(card.suit + card.rank, x + 5, y + 20);
  }
}

function drawScore() {
  let now = Date.now();
  if (now - game.lastMoveTime > 10000) {
    game.score = Math.max(0, game.score - 1);
    game.lastMoveTime = now;
  }
  document.getElementById('score').textContent = "スコア: " + game.score;
}

// ドロー処理
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (mx >= 20 && mx <= 80 && my >= 20 && my <= 110) {
    if (game.deck.length === 0) {
      game.deck = game.waste.reverse().map(c => { c.faceUp = false; return c; });
      game.waste = [];
      game.score = Math.max(0, game.score - 10);
    } else {
      for (let i = 0; i < game.stockDraw && game.deck.length > 0; i++) {
        let card = game.deck.pop();
        card.faceUp = true;
        game.waste.push(card);
      }
      game.score += 5;
    }
  }
});

draw();
