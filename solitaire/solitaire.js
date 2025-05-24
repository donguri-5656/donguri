const canvas = document.getElementById("solitaireCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
const scoreElem = document.getElementById("score");
const rulesBtn = document.getElementById("scoreRuleBtn");
const rulePopup = document.getElementById("rules");
const diffPopup = document.getElementById("difficultySelect");
const easyBtn = document.getElementById("easyBtn");
const hardBtn = document.getElementById("hardBtn");

let score = 0;
let cards = [];
let drawCount = 1;

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck() {
  let deck = [];
  for (let suit of suits) {
    for (let i = 0; i < values.length; i++) {
      deck.push({
        suit,
        value: values[i],
        index: i + 1,
        x: 0,
        y: 0,
        faceUp: false,
        dragging: false,
      });
    }
  }
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCards() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let startX = 50;
  let startY = 100;

  cards.forEach((card, i) => {
    const x = startX + (i % 13) * 70;
    const y = startY + Math.floor(i / 13) * 100;
    drawCard(card, x, y);
    card.x = x;
    card.y = y;
  });
}

function drawCard(card, x, y) {
  ctx.fillStyle = card.faceUp ? "#fff" : "#888";
  ctx.fillRect(x, y, 60, 90);
  ctx.strokeRect(x, y, 60, 90);
  if (card.faceUp) {
    ctx.fillStyle = (card.suit === "♥" || card.suit === "♦") ? "red" : "black";
    ctx.font = "16px sans-serif";
    ctx.fillText(card.value + card.suit, x + 5, y + 20);
  }
}

function updateScore(change) {
  score += change;
  if (score < 0) score = 0;
  scoreElem.textContent = score;
}

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (let card of cards) {
    if (
      mx >= card.x &&
      mx <= card.x + 60 &&
      my >= card.y &&
      my <= card.y + 90 &&
      card.faceUp
    ) {
      card.dragging = true;
      canvas.addEventListener("mousemove", dragCard);
      canvas.addEventListener("mouseup", dropCard);
      break;
    }
  }
});

function dragCard(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (let card of cards) {
    if (card.dragging) {
      card.x = mx - 30;
      card.y = my - 45;
    }
  }
  drawCards();
}

function dropCard() {
  for (let card of cards) {
    if (card.dragging) {
      card.dragging = false;
      updateScore(5);
    }
  }
  canvas.removeEventListener("mousemove", dragCard);
  canvas.removeEventListener("mouseup", dropCard);
  drawCards();
}

function startGame() {
  cards = createDeck();
  shuffle(cards);
  cards.forEach((c, i) => {
    c.faceUp = i >= 24; // 最初の24枚は裏、以降は表に
  });
  score = 0;
  updateScore(0);
  drawCards();
}

restartBtn.addEventListener("click", () => {
  diffPopup.classList.remove("hidden");
});

easyBtn.addEventListener("click", () => {
  drawCount = 1;
  diffPopup.classList.add("hidden");
  startGame();
});

hardBtn.addEventListener("click", () => {
  drawCount = 3;
  diffPopup.classList.add("hidden");
  startGame();
});

rulesBtn.addEventListener("click", () => {
  rulePopup.classList.toggle("hidden");
});

startGame();
