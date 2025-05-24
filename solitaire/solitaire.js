let deck = [];
let stacks = [];
let score = 0;
let drawCount = 1;

function startGame(drawMode = 1) {
  drawCount = drawMode;
  deck = generateDeck();
  shuffle(deck);
  stacks = createStacks(7);
  score = 0;
  document.getElementById("score").textContent = score;
  renderGame();
}

function generateDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  return suits.flatMap(suit => ranks.map(rank => ({ suit, rank, faceUp: true })));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createStacks(count) {
  const stacks = [];
  for (let i = 0; i < count; i++) {
    stacks.push(deck.splice(0, i + 1));
  }
  return stacks;
}

function renderGame() {
  const game = document.getElementById("game");
  game.innerHTML = "";

  stacks.forEach((stack, stackIndex) => {
    const stackEl = document.createElement("div");
    stackEl.className = "stack";
    stack.forEach((card, i) => {
      const cardEl = document.createElement("div");
      cardEl.className = "card in-stack";
      cardEl.textContent = `${card.suit} ${card.rank}`;
      cardEl.style.setProperty('--index', i);
      cardEl.draggable = true;
      cardEl.addEventListener("dragstart", onDragStart);
      cardEl.addEventListener("dragend", onDragEnd);
      stackEl.appendChild(cardEl);
    });
    game.appendChild(stackEl);
  });
}

let draggedCard = null;

function onDragStart(e) {
  draggedCard = e.target;
  draggedCard.classList.add("dragging");
}

function onDragEnd(e) {
  if (draggedCard) {
    draggedCard.classList.remove("dragging");
    draggedCard = null;
    score += 10;
    document.getElementById("score").textContent = score;
  }
}

// ルール表示切り替え
document.getElementById("rulesToggle").addEventListener("click", () => {
  const panel = document.getElementById("rulesPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});

// ゲーム開始
startGame(1);
