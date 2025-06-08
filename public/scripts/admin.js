document.addEventListener('DOMContentLoaded', () => {
  const fetchJson = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) throw await res.json();
    return res.json();
  };

  const getValue = (form, name) => form.elements[name]?.value.trim();
  const getInt = (form, name) => parseInt(getValue(form, name));
  const getFile = (form, name) => form.elements[name]?.files?.[0];

  const bindForm = (id, handler) => {
    const form = document.getElementById(id);
    if (form) form.addEventListener('submit', (e) => handler(e, form));
  };

  bindForm('createAlbumForm', async (e, form) => {
    e.preventDefault();

    const title = getValue(form, 'albumTitle');
    const artistId = getInt(form, 'artistId');
    const type = getValue(form, 'albumType');
    const dropDate = new Date(getValue(form, 'releaseDate')).toUTCString();

    if (!title || !artistId || !type || !dropDate) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      await fetchJson('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artistId, type, dropDate }),
      });
      alert('Альбом успешно создан!');
      form.reset();
    } catch (err) {
      alert(`Ошибка при создании альбома: ${err.message || 'Неизвестно'}`);
    }
  });

  bindForm('createSongForm', async (e, form) => {
    e.preventDefault();

    const title = getValue(form, 'songTitle');
    const file = getFile(form, 'songPath');
    const artistId = getInt(form, 'songArtistId');
    const albumId = getInt(form, 'songAlbumId');
    const duration = getInt(form, 'songDuration');

    if (!title || !file || !artistId || !albumId || !duration) {
      alert('Пожалуйста, заполните все поля и выберите файл.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const upload = await fetchJson('/files', {
        method: 'POST',
        body: formData,
      });
      await fetchJson('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          path: upload.url,
          artistId,
          albumId,
          duration,
        }),
      });
      alert('Песня успешно добавлена!');
      form.reset();
    } catch (err) {
      alert(`Ошибка при добавлении песни: ${err.message || 'Неизвестно'}`);
    }
  });

  bindForm('removeSongForm', async (e, form) => {
    e.preventDefault();

    const songId = getValue(form, 'songId');
    if (!songId) return alert('Введите ID песни!');

    try {
      const song = await fetchJson(`/api/songs/${songId}`);
      if (song.path) {
        await fetch(`/files?pictureUrl=${encodeURIComponent(song.path)}`, {
          method: 'DELETE',
        });
      }
      await fetch(`/api/songs/${songId}`, { method: 'DELETE' });
      alert('Песня удалена!');
      form.reset();
    } catch (err) {
      alert(`Ошибка при удалении: ${err.message || 'Неизвестно'}`);
    }
  });

  bindForm('removeAlbumForm', async (e, form) => {
    e.preventDefault();
    const id = getValue(form, 'albumId');
    if (!id) return alert('Введите ID альбома!');

    try {
      await fetch(`/api/albums/${id}`, { method: 'DELETE' });
      alert('Альбом удалён!');
      form.reset();
    } catch {
      alert('Ошибка при удалении альбома!');
    }
  });

  bindForm('createArtistForm', async (e, form) => {
    e.preventDefault();
    const name = getValue(form, 'artistName');
    const surname = getValue(form, 'artistSurname');
    const nickname = getValue(form, 'artistNickname');

    if (!name || !surname || !nickname) {
      alert('Все поля должны быть заполнены!');
      return;
    }

    try {
      await fetchJson('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, nickname }),
      });
      alert('Артист успешно создан!');
      form.reset();
    } catch {
      alert('Ошибка при создании артиста!');
    }
  });

  bindForm('removeArtistForm', async (e, form) => {
    e.preventDefault();
    const id = getValue(form, 'artistId');
    if (!id) return alert('Введите ID артиста!');

    try {
      await fetch(`/api/artists/${id}`, { method: 'DELETE' });
      alert('Артист удалён!');
      form.reset();
    } catch {
      alert('Ошибка при удалении артиста!');
    }
  });

  bindForm('removeNewsForm', async (e, form) => {
    e.preventDefault();
    const id = getValue(form, 'newsId');
    if (!id) return alert('Введите ID новости!');

    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
      alert('Новость удалена!');
      form.reset();
    } catch {
      alert('Ошибка при удалении новости!');
    }
  });

  bindForm('addUserRoleForm', async (e, form) => {
    e.preventDefault();

    const userId = getValue(form, 'userId');
    const role = getValue(form, 'roleType');
    const action = getValue(form, 'action');

    if (!userId || !role || !action) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      let method, url;

      if (action === 'add') {
        method = 'PUT';
        url = `/api/user/role/${userId}?role=${encodeURIComponent(role)}`;
      } else if (action === 'remove') {
        method = 'DELETE';
        url = `/api/user/role/${userId}?role=${encodeURIComponent(role)}`;
      } else {
        alert('Некорректное действие');
        return;
      }

      const response = await fetch(url, { method });

      if (response.ok) {
        alert(`Роль успешно ${action === 'add' ? 'добавлена' : 'удалена'}`);
        form.reset();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.message || 'Не удалось изменить роль'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка при изменении роли пользователя.');
    }
  });

  bindForm('deleteUserForm', async (e, form) => {
    e.preventDefault();
    const userId = getValue(form, 'userId');
    if (!userId) return alert('Введите ID пользователя.');

    try {
      await fetch(`/api/user/${userId}`, { method: 'DELETE' });
      alert('Пользователь удалён!');
      form.reset();
    } catch {
      alert('Ошибка при удалении пользователя!');
    }
  });

  bindForm('createCollectionForm', async (e, form) => {
    e.preventDefault();
    const name = getValue(form, 'collectionName');
    if (!name) return alert('Введите название коллекции!');

    try {
      await fetchJson('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      alert('Коллекция создана!');
      form.reset();
    } catch {
      alert('Ошибка при создании коллекции!');
    }
  });

  bindForm('addCollectionForm', async (e, form) => {
    e.preventDefault();
    const collectionId = getInt(form, 'collectionId');
    const songId = getInt(form, 'collectionSongId');
    if (!collectionId || !songId) return alert('Введите ID коллекции и песни!');

    try {
      await fetchJson(`/api/collections/${collectionId}/songs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      });
      alert('Песня добавлена в коллекцию!');
      form.reset();
    } catch {
      alert('Ошибка при добавлении в коллекцию!');
    }
  });

  bindForm('removeCollectionForm', async (e, form) => {
    e.preventDefault();
    const collectionId = getValue(form, 'removeCollectionId');

    try {
      await fetchJson(`/api/collections/${collectionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Коллекция успешно удалена!');
      form.reset();
    } catch {
      alert('Ошибка при удалении коллекции!');
    }
  });

  bindForm('addLimiterToIPForm', async (e, form) => {
    e.preventDefault();
    const ip = getValue(form, 'ip');
    if (!ip) return alert('Введите IP-адрес');

    try {
      await fetchJson(`/api-limit/block/${ip}`, { method: 'POST' });
      alert(`IP ${ip} успешно заблокирован`);
      form.reset();
    } catch (err) {
      alert(`Ошибка при блокировке IP: ${err.message || 'Неизвестно'}`);
    }
  });

  bindForm('removeLimiterFromIPForm', async (e, form) => {
    e.preventDefault();
    const ip = getValue(form, 'ip');
    if (!ip) return alert('Введите IP-адрес');

    try {
      await fetchJson(`/api-limit/unblock/${ip}`, { method: 'DELETE' });
      alert(`IP ${ip} успешно разблокирован`);
      form.reset();
    } catch (err) {
      alert(`Ошибка при разблокировке IP: ${err.message || 'Неизвестно'}`);
    }
  });

  bindForm('blockUserLimiterForm', async (e, form) => {
    e.preventDefault();
    const userId = getValue(form, 'userId');
    if (!userId) return alert('Введите userId');
    await fetchJson(`/api-limit/block/user/${userId}`, { method: 'POST' });
    alert('Пользователь заблокирован');
  });

  bindForm('unblockUserLimiterForm', async (e, form) => {
    e.preventDefault();
    const userId = getValue(form, 'userId');
    if (!userId) return alert('Введите userId');
    await fetchJson(`/api-limit/block/user/${userId}`, { method: 'Delete' });
    alert('Пользователь разблокирован');
  });
});
