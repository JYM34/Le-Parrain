document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    const data = await res.json();
    document.getElementById('message').textContent = data.message;
  
    if (res.ok) {
      setTimeout(() => {
        window.location.href = '/'; // redirige vers la map
      }, 1000);
    }
  });
  