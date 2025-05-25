// ソリティア完全版 JavaScript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let deck = [], waste = [], foundations = [[], [], [], []], tableau = [[], [], [], [], [], [], []];
let drawCount = 1, score = 0, selectedCard = null, selectedStack = null;

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
  selectedCard = null;
  selectedStack = null;
  dealCards();
  draw();
  document.getElementById('score').innerText = score;
}

function showHint() {
  for (let i = 0; i < tableau.length; i++) {
    let pile = tableau[i];
    if (pile.length === 0) continue;
    let card = pile[pile.length - 1];
    if (!card.faceUp) continue;
    for (let j = 0; j < tableau.length; j++) {
      if (i === j) continue;
      let targetPile = tableau[j];
      if (canMoveCard(card, targetPile[targetPile.length - 1])) {
        alert("ヒント: カードを列 " + (i + 1) + " から列 " + (j + 1) + " に移動できます");
        return;
      }
    }
  }
  alert("ヒントはありません");
}

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const colors = ['black', 'red', 'red', 'black'];
  let cards = [];
  for (let s = 0; s < 4; s++) {
    for (let v = 1; v <= 13; v++) {
      cards.push({ suit: suits[s], color: colors[s], value: v, faceUp: false, x: 0, y: 0 });
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
      card.faceUp = j === i;
      tableau[i].push(card);
    }
  }
  deck = deck.slice(index);
}

function drawCard(card, x, y) {
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x, y, 80, 100);
  if (card.faceUp) {
    ctx.fillStyle = card.color === 'red' ? '#fdd' : '#fff';
    ctx.fillRect(x, y, 80, 100);
    ctx.fillStyle = card.color;
    ctx.font = '18px sans-serif';
    const label = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'][card.value - 1];
    ctx.fillText(`${label}${card.suit}`, x + 10, y + 25);
  } else {
    ctx.fillStyle = '#888';
    ctx.fillRect(x, y, 80, 100);
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
  if (deck.length > 0) drawCard({ faceUp: false }, 20, 20);
  else ctx.clearRect(20, 20, 80, 100);
}

function drawWaste() {
  if (waste.length > 0) {
    let card = waste[waste.length - 1];
    card.x = 120;
    card.y = 20;
    drawCard(card, card.x, card.y);
  }
}

function drawFoundations() {
  for (let i = 0; i < foundations.length; i++) {
    let x = 400 + i * 100, y = 20;
    if (foundations[i].length > 0) {
      let card = foundations[i][foundations[i].length - 1];
      drawCard(card, x, y);
    } else {
      ctx.strokeRect(x, y, 80, 100);
    }
  }
}

function drawTableau() {
  for (let i = 0; i < tableau.length; i++) {
    let x = 20 + i * 140, y = 150;
    for (let j = 0; j < tableau[i].length; j++) {
      let card = tableau[i][j];
      card.x = x;
      card.y = y;
      drawCard(card, x, y);
      y += 30;
    }
  }
}

function canMoveCard(card, targetCard) {
  if (!targetCard) return card.value === 13;
  return card.color !== targetCard.color && card.value === targetCard.value - 1;
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left, y = e.clientY - rect.top;

  if (x >= 20 && x <= 100 && y >= 20 && y <= 120 && deck.length > 0) {
    for (let i = 0; i < drawCount && deck.length > 0; i++) {
      let card = deck.shift();
      card.faceUp = true;
      waste.push(card);
      score += 5;
    }
    document.getElementById('score').innerText = score;
    draw();
    return;
  }

  for (let i = 0; i < tableau.length; i++) {
    let pile = tableau[i];
    for (let j = pile.length - 1; j >= 0; j--) {
      let card = pile[j];
      if (card.faceUp && x >= card.x && x <= card.x + 80 && y >= card.y && y <= card.y + 100) {
        if (selectedCard && selectedCard !== card) {
          if (canMoveCard(selectedCard, card)) {
            let from = selectedStack.indexOf(selectedCard);
            let movingCards = selectedStack.splice(from);
            pile.push(...movingCards);
            score += 10;
          }
          selectedCard = null;
          selectedStack = null;
          draw();
        } else {
          selectedCard = card;
          selectedStack = pile;
        }
        return;
      }
    }
  }
});
startGame(drawCount);
