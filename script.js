function checkPassword() {
  const input = document.getElementById('passwordInput').value;
  if (input === 'asdf1234') {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('passwordInput').style.display = 'none';
    document.querySelector('button').style.display = 'none';
    document.querySelector('h2').textContent = "メニューを選んでください";
  } else {
    alert('パスワードが違います');
  }
}
