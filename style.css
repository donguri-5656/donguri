const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function generateDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCardElement(card, index) {
  const el = document.createElement('div');
  el.classList.add('card');
  el.innerText = `${card.rank}${card.suit}`;
  el.style.top = `${index * 20}px`;

  // 色分け
  if (card.suit === '♥' || card.suit === '♦') {
    el.classList.add('red');
  } else {
    el.classList.add('black');
  }

  // ドラッグ
  el.setAttribute('draggable', true);
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(card));
    el.classList.add('dragging');
  });
  el.addEventListener('dragend', () => {
    el.classList.remove('dragging');
  });

  return el;
}

function initGame() {
  const container = document.getElementById('game-container');
  container.innerHTML = '';

  const deck = shuffle(generateDeck());

  for (let i = 0; i < 7; i++) {
    const stack = document.createElement('div');
    stack.classList.add('stack');
    container.appendChild(stack);

    for (let j = 0; j <= i; j++) {
      const card = deck.pop();
      const el = createCardElement(card, j);
      stack.appendChild(el);
    }

    // ドロップ
    stack.addEventListener('dragover', (e) => e.preventDefault());
    stack.addEventListener('drop', (e) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const newCard = createCardElement(data, stack.children.length);
      stack.appendChild(newCard);
    });
  }
}

initGame();
