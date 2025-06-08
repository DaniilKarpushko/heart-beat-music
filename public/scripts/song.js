document.addEventListener('DOMContentLoaded', async () => {
  let currentMusic = 0;
  let songs = [];
  let isLoading = false;

  const limit = 3;
  let cursor = 0;

  const music = document.getElementById('audio');
  const seekBar = document.getElementById('songTimeBar');
  const songName = document.getElementById('songName');
  const playBtn = document.getElementById('playButton');
  const prevBtn = document.getElementById('prevButton');
  const nextBtn = document.getElementById('nextButton');
  const likeBtn = document.getElementById('likeButton');

  playBtn.addEventListener('click', () => {
    if (Math.floor(music.currentTime) === 0) {
      fetch(`/api/songs/${songs[currentMusic].id}/listen`, {
        method: 'PATCH',
      }).catch(err => console.error('Ошибка при увеличении listens:', err));
    }
    if (playBtn.textContent === 'Play') {
      music.play();
      playBtn.textContent = 'Stop';
    } else {
      music.pause();
      playBtn.textContent = 'Play';
    }
  });

  prevBtn.addEventListener('click', async () => {
    if (currentMusic > 0) {
      currentMusic--;
      setMusic(currentMusic);
    } else {
      await fetchSongs(cursor - limit * 2);
      setMusic(songs.length - 1);
    }
    playBtn.textContent = 'Play';
  });

  nextBtn.addEventListener('click', async () => {
    if (currentMusic < songs.length - 1) {
      currentMusic++;
      setMusic(currentMusic);
    } else {
      await fetchSongs();
      setMusic(0);
    }
    playBtn.textContent = 'Play';
  });

  setInterval(() => {
    seekBar.value = music.currentTime;
  }, 500);

  seekBar.addEventListener('change', () => {
    music.currentTime = seekBar.value;
  });

  music.addEventListener('ended', async () => {
    if (currentMusic < songs.length - 1) {
      currentMusic++;
      setMusic(currentMusic);
    } else {
      await fetchSongs();
      if (songs.length > 0) {
        currentMusic = 0;
        setMusic(currentMusic);
      }
    }
    playBtn.textContent = 'Play';
  });

  likeBtn.addEventListener('click', async () => {
    const name = songName.textContent;
    if (!name || name === '---') {
      alert('Нет активной песни');
      return;
    }

    try {
      const res = await fetch(
        `/api/user/favourites/${songs[currentMusic].id}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      );
      console.log('Добавлено в избранное:', await res.json());
    } catch (err) {
      console.error('Ошибка добавления в избранное:', err);
    }
  });

  await fetchSongs();
  setMusic(0);
  listenForFavouriteUpdates();

  async function fetchSongs(newCursor = null) {
    if (isLoading) return;
    isLoading = true;
    try {
      const url = `/api/songs?cursor=${newCursor ?? cursor}&limit=${limit}`;
      const res = await fetch(url);
      songs = await res.json();
      if (songs.length === 0) {
        cursor = 0;
        const retry = await fetch(`/api/songs?cursor=${cursor}&limit=${limit}`);
        songs = await retry.json();
      }
      if (songs.length > 0) {
        cursor = songs[songs.length - 1].id;
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
    } finally {
      isLoading = false;
    }
  }

  function setMusic(i) {
    if (!songs.length) return;
    const song = songs[i];
    currentMusic = i;
    songName.textContent = song.title;
    music.src = song.path;
    seekBar.value = 0;
    music.onloadedmetadata = () => {
      seekBar.max = song.duration;
    };
    setTimeout(() => { seekBar.max = song.duration; }, 300);
  }

  function listenForFavouriteUpdates() {
    const evtSrc = new EventSource('/api/user/sse/favourites');
    evtSrc.onmessage = e => showToast(e.data);
    evtSrc.onerror = e => console.error('Ошибка SSE:', e);
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'green',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: '1000',
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
});

