// ドングリ生成
function createDonguri() {
  const container = document.getElementById('donguriContainer');
  for (let i = 0; i < 30; i++) {
    const donguri = document.createElement('div');
    donguri.className = 'donguri';
    donguri.style.top = `${Math.random() * 100}%`;
    donguri.style.left = `${Math.random() * 100}%`;
    donguri.style.animationDuration = `${3 + Math.random() * 3}s`;
    container.appendChild(donguri);
  }
}
createDonguri();

// スクロールでフェード（戻っても戻るように修正）
window.addEventListener('scroll', () => {
  const container = document.getElementById('donguriContainer');
  const opacity = 1 - Math.min(window.scrollY / window.innerHeight, 1);
  container.style.opacity = opacity;
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
