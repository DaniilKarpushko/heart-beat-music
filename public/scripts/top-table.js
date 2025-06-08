document.addEventListener('DOMContentLoaded', async () => {
  const topContainer = document.getElementById('top-container');

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error(`Ошибка загрузки данных (${url}):`, error);
      return [];
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const [topArtists, topSongs, topAlbums] = await Promise.all([
    fetchData('/api/artists/top?amount=3'),
    fetchData('/api/songs/top?amount=3'),
    fetchData('/api/albums/top?amount=3'),
  ]);

  const categories = [
    { title: 'TOP 3 ARTISTS', items: topArtists, type: 'artist' },
    { title: 'TOP 3 SONGS', items: topSongs, type: 'song' },
    { title: 'TOP 3 ALBUMS', items: topAlbums, type: 'album' },
  ];

  categories.forEach(({ title, items, type }) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('table-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = title;
    categoryDiv.appendChild(categoryTitle);

    const table = document.createElement('div');
    table.classList.add('table');

    const headerRow = document.createElement('div');
    headerRow.classList.add('table-row', 'header');

    let headers = [];
    if (type === 'artist') {
      headers = ['Name', 'Surname', 'Nickname'];
    } else if (type === 'song') {
      headers = ['Title', 'Artist', 'Album'];
    } else if (type === 'album') {
      headers = ['Title', 'Artist', 'Drop Date'];
    }

    headers.forEach((header) => {
      const headerCell = document.createElement('div');
      headerCell.textContent = header;
      headerRow.appendChild(headerCell);
    });

    table.appendChild(headerRow);

    items.forEach((item) => {
      const row = document.createElement('div');
      row.classList.add('table-row');

      if (type === 'artist') {
        const name = item.name || '-';
        const surname = item.surname || '-';
        const nickname = item.nickname || '-';

        [name, surname, nickname].forEach((text) => {
          const cell = document.createElement('div');
          cell.textContent = text;
          row.appendChild(cell);
        });
      } else if (type === 'song') {
        const title = item.title || '-';
        const artist = item.artist?.nickname || '-';
        const album = item.album?.title || '-';

        [title, artist, album].forEach((text) => {
          const cell = document.createElement('div');
          cell.textContent = text;
          row.appendChild(cell);
        });
      } else if (type === 'album') {
        const title = item.title || '-';
        const artists = item.artist.nickname || '-';
        const dropDate = formatDate(item.dropDate) || '-';

        [title, artists, dropDate].forEach((text) => {
          const cell = document.createElement('div');
          cell.textContent = text;
          row.appendChild(cell);
        });
      }

      table.appendChild(row);
    });

    categoryDiv.appendChild(table);
    topContainer.appendChild(categoryDiv);
  });
});
