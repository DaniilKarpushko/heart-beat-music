const limit = 1;
let playing = '';
let cursor = 0;
let currentPlayingButton = null;

let audio = new Audio();

const trackButtons = Array.from(document.getElementsByClassName('track-btn'));

trackButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const trackItemList = btn
      .closest('.collection-list')
      .querySelector('.tracks-list');
    await loadTracks(trackItemList, parseInt(btn.dataset.id));
  });
});

const loadMoreBtn = document.getElementById('loadMoreBtn');
loadMoreBtn.addEventListener('click', async () => {
  const collectionList = document.getElementById('collectionList');
  cursor = parseInt(loadMoreBtn.dataset.cursor);
  try {
    const response = await fetch(
      `/api/collections?cursor=${cursor}&limit=${limit}`,
    );

    const collections = await response.json();
    collections.forEach((collection) => {
      if(collection.id === cursor) {
        return;
      }
      const listItem = document.createElement('div');
      listItem.classList.add('list-group-item');
      listItem.classList.add('border-black');
      listItem.classList.add('border-1');
      listItem.classList.add('collection-list');

      const itemData = document.createElement('div');
      itemData.classList.add('d-flex');
      itemData.classList.add('w-100');
      itemData.classList.add('justify-content-between');

      const header = document.createElement('h5');
      header.classList.add('mb-1');
      header.classList.add('default-font-size');
      header.textContent = collection.name;

      const trackBtn = document.createElement('button');
      trackBtn.classList.add('styled-btn', 'default-font-size', 'track-btn');
      trackBtn.style.padding = '1%';
      trackBtn.dataset.id = collection.id.toString();
      trackBtn.textContent = 'TRACKS';

      const trackListItem = document.createElement('ul');
      trackListItem.classList.add('list-group');
      trackListItem.classList.add('border-0');
      trackListItem.classList.add('tracks-list');
      trackListItem.style.display = 'none';

      trackBtn.addEventListener('click', async () => {
        await loadTracks(trackListItem, collection.id);
      });

      itemData.appendChild(header);
      itemData.appendChild(trackBtn);
      listItem.appendChild(itemData);
      listItem.appendChild(trackListItem);
      collectionList.appendChild(listItem);

      cursor = collection.id;
      loadMoreBtn.dataset.cursor = cursor.toString();
    });
  } catch (error) {
    console.error('Error loading collections:', error);
  }
});

async function loadTracks(trackListItem, id) {
  try {
    if (trackListItem.style.display === 'none') {
      trackListItem.textContent = '';
      const response = await fetch(`/api/collections/${id}/songs`);
      const tracks = await response.json();

      tracks.forEach((track) => {
        const trackItem = document.createElement('li');
        trackItem.classList.add('list-group-item');
        trackItem.classList.add('d-flex');
        trackItem.classList.add('justify-content-between');
        trackItem.classList.add('align-items-center');
        trackItem.classList.add('border-0');
        trackItem.classList.add('default-font-size');
        trackItem.textContent = track.song.title;

        const span = document.createElement('span');

        const playBtn = document.createElement('button');
        playBtn.classList.add('styled-btn', 'default-font-size');
        playBtn.textContent = 'Play';

        playBtn.addEventListener('click', () => {
          if (playing !== track.song.path) {
            if (Math.floor(audio.currentTime) === 0) {
              fetch(`/api/songs/${track.song.id}/listen`, {
                method: 'PATCH',
              }).catch(err => console.error('Ошибка при увеличении listens:', err));
            }
            playing = track.song.path;
            audio.src = track.song.path;
            audio.play();
            if (currentPlayingButton) {
              currentPlayingButton.textContent = 'Play';
            }
            currentPlayingButton = playBtn;
            playBtn.textContent = 'Pause';
          } else if (audio.paused) {
            audio.play();
            playBtn.textContent = 'Pause';
          } else {
            audio.pause();
            playBtn.textContent = 'Play';
          }

          audio.onended = () => {
            playBtn.textContent = 'Play';
          };
        });

        span.appendChild(playBtn);
        trackItem.appendChild(span);
        trackListItem.appendChild(trackItem);
      });

      trackListItem.style.display = 'block';
    } else {
      trackListItem.style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading tracks:', error);
  }
}
