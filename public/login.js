document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    const data = await res.json();
    const msg = document.getElementById('message');
    msg.textContent = data.message;
  
    if (res.ok) {
      msg.style.color = '#2ecc71';
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1000);
    } else {
      msg.style.color = '#e74c3c';
    }
  });
  