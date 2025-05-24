let drawCount = 1;
let score = 0;
let gameInterval;

function startGame(count) {
  drawCount = count;
  document.getElementById('difficultySelection').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';
  setupGame();
}

function setupGame() {
  // 簡略化したセットアップ
  document.getElementById('stock').innerHTML = "山札";
  document.getElementById('waste').innerHTML = "手札";
  document.getElementById('score').innerText = score = 0;

  for (let i = 0; i < 4; i++) {
    document.querySelectorAll('.foundation')[i].innerHTML = '';
  }

  // 10秒ごとにスコアを減らす
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    score -= 1;
    updateScore();
  }, 10000);

  // 今後：カード生成／表示など追加
}

function restartGame() {
  document.getElementById('difficultySelection').style.display = 'block';
  document.getElementById('gameContainer').style.display = 'none';
  clearInterval(gameInterval);
}

function toggleRules() {
  const rules = document.getElementById('rules');
  rules.classList.toggle('hidden');
}

function updateScore() {
  document.getElementById('score').innerText = score;
}
