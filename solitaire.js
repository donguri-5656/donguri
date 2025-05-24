const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const deck = [];

function createDeck() {
  deck.length = 0;
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function renderGame() {
  const game = document.getElementById('game');
  game.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const card = deck.pop();
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    if (card.suit === '♥' || card.suit === '♦') {
      cardDiv.classList.add('red');
    }
    cardDiv.textContent = `${card.value}${card.suit}`;
    game.appendChild(cardDiv);
  }
}

function startGame() {
  createDeck();
  shuffleDeck();
  renderGame();
}

window.onload = startGame;
