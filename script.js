// ドングリ生成
function createDonguri() {
  const container = document.getElementById('donguriContainer');
  for (let i = 0; i < 20; i++) {
    const donguri = document.createElement('div');
    donguri.className = 'donguri';
    donguri.style.top = `${Math.random() * 100}%`;
    donguri.style.left = `${Math.random() * 100}%`;
    container.appendChild(donguri);

    // アニメーション
    const duration = Math.random() * 5 + 3;
    donguri.animate([
      { transform: `translateY(0px)` },
      { transform: `translateY(-100vh)` }
    ], {
      duration: duration * 1000,
      iterations: Infinity
    });
  }
}
createDonguri();

// スクロールで非表示
window.addEventListener('scroll', () => {
  const container = document.getElementById('donguriContainer');
  if (window.scrollY > 100) {
    container.style.display = 'none';
  }
});

// パスワードチェック
function checkPassword() {
  const input = document.getElementById('passwordInput').value;
  if (input === 'asdf1234') {
    document.getElementById('menu').style.display = 'block';
  } else {
    alert('パスワードが違います');
  }
}
