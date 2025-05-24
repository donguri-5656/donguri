// solitaire.js
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let deck = [];
let score = 0;

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard(card) {
  const div = document.createElement('div');
  div.className = 'card';
  if (card.suit === '♥' || card.suit === '♦') div.classList.add('red');
  div.textContent = `${card.value}${card.suit}`;
  div.onclick = () => playCard(div, card);
  return div;
}

function renderGame() {
  const area = document.getElementById('gameArea');
  area.innerHTML = '';
  for (let card of deck.slice(0, 7)) {
    area.appendChild(drawCard(card));
  }
  updateScore(0);
}

function playCard(el, card) {
  score += 10;
  el.classList.add('hidden-card');
  updateScore();
  checkWin();
}

function updateScore(diff = 0) {
  score += diff;
  document.getElementById('score').textContent = `スコア: ${score}`;
}

function resetGame() {
  createDeck();
  shuffleDeck();
  renderGame();
  score = 0;
  document.getElementById('winMessage').classList.add('hidden');
  updateScore();
}

function showHint() {
  alert('ヒント：どれかをクリックしてスコアを稼ごう！');
  score -= 5;
  updateScore();
}

function toggleRules() {
  document.getElementById('rulesBox').classList.toggle('hidden');
}

function checkWin() {
  const remaining = document.querySelectorAll('.card:not(.hidden-card)');
  if (remaining.length === 0) {
    document.getElementById('winMessage').classList.remove('hidden');
  }
}

document.getElementById('shuffleBtn').onclick = resetGame;
document.getElementById('hintBtn').onclick = showHint;
document.getElementById('rulesBtn').onclick = toggleRules;

window.onload = resetGame;
