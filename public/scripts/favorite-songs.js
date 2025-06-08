const userId = localStorage.getItem('userId');
const player = document.getElementById('audio');

async function fetchFavourites() {
  try {
    const response = await fetch(`/api/user/me/favourites`, {
      credentials: 'include',
    });
    const data = await response.json();

    const container = document.getElementById('favouriteSongsContainer');

    container.textContent = '';
    data.forEach((favSong) => {
      const listItem = document.createElement('div');
      listItem.classList.add('list-group-item', 'border-black', 'border-1', 'm-0');

      const itemData = document.createElement('div');
      itemData.classList.add('d-flex', 'w-100', 'justify-content-between');

      const songTitle = document.createElement('h5');
      songTitle.classList.add('mb-1', 'text-start', 'default-font-size');
      songTitle.textContent = favSong.song.title;

      const buttonGroup = document.createElement('div');
      buttonGroup.classList.add('d-flex', 'text-end', 'justify-content-between');
      buttonGroup.style.paddingRight = '5%'

      const playPauseButton = document.createElement('button');
      playPauseButton.classList.add('styled-btn', 'play-pause-btn', 'default-font-size');
      playPauseButton.style.width = '100%'
      playPauseButton.style.marginLeft = '1%';
      playPauseButton.style.marginRight = '1%';
      playPauseButton.textContent = 'Play';
      playPauseButton.onclick = () =>
        togglePlayPause(favSong.song.id, favSong.song.path);

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('styled-btn', 'default-font-size');
      deleteButton.style.marginRight = '1%';
      deleteButton.style.marginLeft = '1%';
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteFavourite(favSong.song.id);

      buttonGroup.appendChild(playPauseButton);
      buttonGroup.appendChild(deleteButton);

      itemData.appendChild(songTitle);
      itemData.appendChild(buttonGroup);

      listItem.setAttribute('data-id', favSong.song.id);
      listItem.appendChild(itemData);
      container.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching favourites:', error);
  }
}

async function deleteFavourite(songId) {
  try {
    const response = await fetch(`/api/user/favourites/${songId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      await fetchFavourites();
    } else {
      alert('Error deleting song.');
    }
  } catch (error) {
    console.error('Error deleting song:', error);
  }
}

let playingSongId = null;
let playingSong = null;

function togglePlayPause(songId, songPath) {
  const button = document.querySelector(
    `[data-id="${songId}"] .play-pause-btn`,
  );

  if (playingSongId === songId) {
    button.textContent = 'Play';
    player.pause();
    playingSongId = null;
    playingSong = null;
  } else {
    if (Math.floor(player.currentTime) === 0) {
      fetch(`/api/songs/${songId}/listen`, {
        method: 'PATCH',
      }).catch(err => console.error('Ошибка при увеличении listens:', err));
    }
    button.textContent = 'Pause';
    player.src = songPath;
    player.play();
    playingSongId = songId;
    playingSong = songPath;
  }
}

window.onload = fetchFavourites;
