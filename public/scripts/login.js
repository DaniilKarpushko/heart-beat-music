document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('roles', JSON.stringify(data.user.roles));
        window.location.href = '/menu';
      } else {
        const error = data.status === 'WRONG_CREDENTIALS_ERROR'
          ? 'Неверные учетные данные'
          : 'Ошибка входа';
        document.getElementById('status-message').textContent = error;
      }
    } catch (error) {
      document.getElementById('status-message').textContent = 'Ошибка сети или сервера';
    }
  });
});
