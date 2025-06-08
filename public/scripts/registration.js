document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reg-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch('http://localhost:3001/auth/registration', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('roles', JSON.stringify(data.user.roles));
        window.location.href = '/user/new';
      } else {
        const errorMsg = data.error || 'Ошибка регистрации';
        document.getElementById('status-message').innerText = errorMsg;
      }
    } catch (error) {
      document.getElementById('status-message').innerText = 'Ошибка сети или сервера';
    }
  });
});

