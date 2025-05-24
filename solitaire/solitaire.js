// script.js
const canvas = document.getElementById("solitaire-canvas");
const ctx = canvas.getContext("2d");
const CARD_WIDTH = 80;
const CARD_HEIGHT = 120;
const CARD_SPACING = 20;
const STACK_OFFSET_Y = 30;
const FOUNDATION_X = [500, 600, 700, 800];
const FOUNDATION_Y = 20;
const COLORS = ["#d32f2f", "#1565c0"];

let deck = [];
let piles = [[], [], [], [], [], [], []];
let foundation = [[], [], [], []];
let drawPile = [];
let drawIndex = 0;
let difficulty = "easy";
let score = 0;
let dragging = null;
let offsetX = 0, offsetY = 0;

function createDeck() {
  const suits = ["♥", "♦", "♣", "♠"];
  const deck = [];
  for (let s = 0; s < 4; s++) {
    for (let v = 1; v <= 13; v++) {
      deck.push({
        suit: suits[s],
        value: v,
        color: (suits[s] === "♥" || suits[s] === "♦") ? "red" : "black",
        faceUp: false
      });
    }
  }
  return shuffle(deck);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame(mode) {
  difficulty = mode;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  document.getElementById("rules-popup").classList.add("hidden");
  restartGame();
}

function restartGame() {
  deck = createDeck();
  piles = [[], [], [], [], [], [], []];
  foundation = [[], [], [], []];
  drawPile = [];
  drawIndex = 0;
  score = 0;
  document.getElementById("score").textContent = `スコア: ${score}`;

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
      const card = deck.pop();
      card.faceUp = (j === i);
      piles[i].push(card);
    }
  }

  while (deck.length) {
    const card = deck.pop();
    drawPile.push(card);
  }

  drawIndex = 0;
  drawFromDeck();
  drawGame();
}

function drawFromDeck() {
  const drawCount = difficulty === "hard" ? 3 : 1;
  const cards = [];
  for (let i = 0; i < drawCount && drawPile.length > 0; i++) {
    cards.push(drawPile.pop());
  }
  cards.forEach(c => c.faceUp = true);
  piles[0].push(...cards);
}

function drawCardValue(value) {
  if (value === 1) return "A";
  if (value === 11) return "J";
  if (value === 12) return "Q";
  if (value === 13) return "K";
  return value;
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 7; i++) {
    const stack = piles[i];
    for (let j = 0; j < stack.length; j++) {
      const card = stack[j];
      const x = 50 + i * (CARD_WIDTH + CARD_SPACING);
      const y = 150 + j * STACK_OFFSET_Y;
      drawCard(card, x, y);
    }
  }

  for (let i = 0; i < 4; i++) {
    if (foundation[i].length > 0) {
      const card = foundation[i][foundation[i].length - 1];
      drawCard(card, FOUNDATION_X[i], FOUNDATION_Y);
    } else {
      ctx.strokeStyle = "#aaa";
      ctx.strokeRect(FOUNDATION_X[i], FOUNDATION_Y, CARD_WIDTH, CARD_HEIGHT);
    }
  }
}

function drawCard(card, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = card.faceUp ? "white" : "#777";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.strokeRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  if (card.faceUp) {
    ctx.fillStyle = card.color;
    ctx.font = "20px sans-serif";
    ctx.fillText(`${drawCardValue(card.value)}${card.suit}`, 8, 25);
  }

  ctx.restore();
}

document.getElementById("show-rules").addEventListener("click", () => {
  const popup = document.getElementById("rules-popup");
  popup.classList.toggle("hidden");
});

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (x >= 10 && x <= 10 + CARD_WIDTH && y >= 20 && y <= 20 + CARD_HEIGHT) {
    drawFromDeck();
    drawGame();
  }
});
