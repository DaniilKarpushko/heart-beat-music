document.addEventListener('DOMContentLoaded', async () => {
  const links = document.querySelectorAll('nav .nav-page-ref'); // Все ссылки меню
  const currentUrl = window.location.pathname.split('/').pop(); // Текущий файл

  links.forEach((link) => {
    if (link.getAttribute('href') === currentUrl) {
      link.classList.add('active');
    }
  });

  const logoutRef = document.getElementById('logoutRef');
  logoutRef.addEventListener('click', async (e) => {
    e.preventDefault();
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    if (response.ok) {
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    } else {
      alert('Ошибка выхода');
    }
  });

  // const user = JSON.parse(localStorage.getItem('user'));
  // const adminBtn = document.getElementById('admin-panel-btn');
  //
  // if (user && user.role === 'ADMIN') {
  //   document.getElementById('admin-footer-link').style.display = 'block';
  //
  //   adminBtn.addEventListener('click', async function () {
  //     try {
  //       const response = await fetch('/admin', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(user),
  //       });
  //
  //       if (response.ok) {
  //         window.location.href = '/admin';
  //       }
  //     } catch (error) {
  //       console.error('Ошибка:', error);
  //       alert('Не удалось подключиться к серверу');
  //     }
  //   });
  // }
});
