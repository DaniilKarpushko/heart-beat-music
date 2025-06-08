document.addEventListener('DOMContentLoaded', async () => {
  const newsForm = document.getElementById('newsForm');
  const newsContainer = document.getElementById('newsContainer');
  const loadNewsButton = document.getElementById('loadNews');
  let cursor = 0;
  const limit = 10;

  const userId = localStorage.getItem('userId');
  const userRole = JSON.parse(localStorage.getItem('roles'));
  const userData = await fetch(`api/user/${userId}`);
  const user = await userData.json();

  async function fetchNews() {
    try {
      const response = await fetch(`/api/news?cursor=${cursor}&limit=${limit}`);
      if (!response.ok) throw new Error();
      const newsData = await response.json();

      if (!Array.isArray(newsData)) {
        throw new Error('Ошибка: сервер не вернул массив новостей!');
      }

      if (newsData.length > 0) {
        cursor = newsData[newsData.length - 1].id;
      } else {
        return;
      }

      if (cursor === 0) newsContainer.textContent = '';

      newsData.forEach((news) => addNewsToGrid(news));
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    }
  }

  loadNewsButton.addEventListener('click', async function () {
    await fetchNews();
  });

  async function addNewsToDB(news) {
    const response = await fetch(`/api/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(news),
    });
    if (!response.ok) throw new Error();
    return response.json();
  }

  async function deleteNewsFromDB(newsId) {
    const response = await fetch(`/api/news/${newsId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error();
  }

  async function updateNewsInDB(newsId, updatedData) {
    const response = await fetch(`/api/news/${newsId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error();
    return response.json();
  }

  async function fetchComments(newsId, commentCursor, commentLimit) {
    const response = await fetch(
      `/api/comments/news/${newsId}?cursor=${commentCursor}&limit=${commentLimit}`,
    );
    const data = await response.json();

    console.log('Комментарии с сервера:', data);

    if (!response.ok) throw new Error();

    if (!Array.isArray(data)) {
      throw new Error('Сервер вернул не массив комментариев!');
    }
    return data;
  }

  async function addCommentToDB(newsId, comment) {
    const response = await fetch(
      `/api/comments/news/${newsId}/users/${user.id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: comment }),
      },
    );
    if (!response.ok) throw new Error();
    return response.json();
  }

  async function updateCommentInDB(commentId, newText) {
    const response = await fetch(`/api/comments/${commentId}/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    });
    if (!response.ok) throw new Error();
  }

  async function deleteCommentFromDB(commentId) {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error();
  }

  function addNewsToGrid(news) {
    const { id, header, text, pictureUrl, writerId, comments = [] } = news;

    const newsCol = document.createElement('div');
    newsCol.classList.add('col-md-4');
    newsCol.classList.add('mb-4');

    const newsCard = document.createElement('div');
    newsCard.classList.add('card');
    newsCard.classList.add('h-100');
    newsCard.classList.add('border-radius-0');

    const newsImage = document.createElement('img');
    newsImage.classList.add('card-img-top');
    newsImage.src = pictureUrl;
    newsImage.alt = 'news image';

    const newsCardBody = document.createElement('div');
    newsCardBody.classList.add('card-body');

    const newsCardTitle = document.createElement('h5');
    newsCardTitle.classList.add('card-title');
    newsCardTitle.textContent = header;

    const newsCardText = document.createElement('p');
    newsCardText.classList.add('card-text');
    newsCardText.textContent = text;

    const newsCardSections = document.createElement('ul');
    newsCardSections.classList.add('list-group');
    newsCardSections.classList.add('list-group-flush');

    let commentCursor = 0;
    const commentLimit = 5;

    const commentSection = document.createElement('li');
    commentSection.classList.add('list-group-item');
    commentSection.style.height = '200px';
    commentSection.style.overflowY = 'auto';
    commentSection.style.border = '1px solid #ccc';
    commentSection.style.borderRadius = '0.375rem';
    commentSection.style.padding = '0.5rem';
    commentSection.style.backgroundColor = '#f9f9f9';

    const commentList = document.createElement('div');
    commentList.classList.add('mb-2');

    async function loadComments() {
      try {
        const comments = await fetchComments(id, commentCursor, commentLimit);
        console.log('comments:', comments);
        comments.forEach((comment) => {
          commentList.appendChild(createCommentElement(comment, id));
          commentCursor = comment.id;
        });

        if (comments.length < commentLimit) {
          loadMoreBtn.style.display = 'none';
        }
      } catch (e) {
        console.error('Ошибка загрузки комментариев:', e);
      }
    }

    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Load more';
    loadMoreBtn.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'mb-2', 'default-font-size');
    loadMoreBtn.addEventListener('click', loadComments);

    const commentInputContainer = document.createElement('div');
    commentInputContainer.classList.add('d-flex', 'gap-2');

    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Add a comment...';
    commentInput.classList.add('form-control');

    const commentButton = document.createElement('button');
    commentButton.textContent = 'Add';
    commentButton.classList.add('btn', 'btn-sm', 'btn-primary', 'default-font-size');

    commentButton.addEventListener('click', async () => {
      try {
        if (!commentInput.value.trim()) return;
        const newComment = await addCommentToDB(id, commentInput.value.trim());
        commentList.prepend(createCommentElement(newComment, id));
        commentInput.value = '';
      } catch (e) {
        console.error('Ошибка добавления комментария:', e);
      }
    });

    commentInputContainer.appendChild(commentInput);
    commentInputContainer.appendChild(commentButton);

    commentSection.appendChild(commentList);
    commentSection.appendChild(loadMoreBtn);
    commentSection.appendChild(commentInputContainer);

    const newsCardFooter = document.createElement('li');
    newsCardFooter.classList.add('list-group-item');
    newsCardFooter.classList.add('justify-content-between');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('styled-btn', 'default-font-size');
    editButton.style.margin = '1%';
    editButton.addEventListener('click', async () => {
      const newTitle = prompt('Edit title:', header);
      const newText = prompt('Edit description:', text);

      const updatedNews = {
        header: newTitle || header,
        text: newText || text,
      };

      try {
        await updateNewsInDB(id, updatedNews);

        newsCardTitle.textContent = updatedNews.header;
        newsCardText.textContent = updatedNews.text;
      } catch (error) {
        console.error('Ошибка при обновлении новости:', error);
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('styled-btn', 'default-font-size');
    deleteButton.style.margin = '1%';
    deleteButton.textContent = 'Remove';

    deleteButton.addEventListener('click', async () => {
      try {
        const res = await fetch(`/files?pictureUrl=${encodeURIComponent(pictureUrl)}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw Error(res.statusText);

        await deleteNewsFromDB(id);
        newsCard.remove();
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
      }
    });

    if (user.id === writerId || user.role === 'ADMIN') {
      newsCardFooter.appendChild(editButton);
      newsCardFooter.appendChild(deleteButton);
    }

    newsCardBody.appendChild(newsCardTitle);
    newsCardBody.appendChild(newsCardText);

    newsContainer.appendChild(newsCard);
    newsCard.appendChild(newsImage);
    newsCard.appendChild(newsCardBody);
    newsCard.appendChild(newsCardSections);
    newsCardSections.appendChild(commentSection);
    newsCardSections.appendChild(newsCardFooter);
  }

  function createCommentElement(comment, newsId) {
    const commentItem = document.createElement('div');
    commentItem.classList.add(
      'd-flex',
      'justify-content-between',
      'align-items-center',
      'mb-1',
      'h-5',
    );

    const leftPart = document.createElement('div');
    leftPart.textContent = `${user.nickname}: ${comment.text}`;

    const rightPart = document.createElement('div');
    rightPart.classList.add('d-flex', 'gap-1');

    if (user.id === comment.userId || user.role === 'ADMIN') {
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.className = 'btn btn-sm btn-outline-secondary';
      editButton.addEventListener('click', async () => {
        const newText = prompt('Edit your comment:', comment.text);
        if (newText !== null) {
          await updateCommentInDB(comment.id, newText);
          leftPart.textContent = `${user.nickname}: ${comment.text}`;
        }
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Remove';
      deleteButton.className = 'btn btn-sm btn-outline-danger';
      deleteButton.addEventListener('click', async () => {
        commentItem.remove();
        await deleteCommentFromDB(comment.id);
      });

      if (user.role !== 'ADMIN') {
        deleteButton.style.display = 'none';
      }

      if (comment.userId !== user.id || user.role !== 'ADMIN') {
        editButton.style.display = 'none';
      }
      rightPart.appendChild(editButton);
      rightPart.appendChild(deleteButton);
    }

    commentItem.appendChild(leftPart);
    commentItem.appendChild(rightPart);
    return commentItem;
  }

  newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!userRole.includes('writer') && !userRole.includes('admin')) {
      alert('У Вас нет прав писать новости');
      return;
    }

    const header = document.getElementById('newsTitle').value;
    const text = document.getElementById('newsTextarea').value;
    const picture = document.getElementById('newsImage').files[0];
    const formData = new FormData();
    formData.append('file', picture);

    try {
      const res = await fetch('/files', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('Файл загружен. URL:', data.url);
      const newNews = { userId: user.id, header, text, pictureUrl: data.url };
      const createdNews = await addNewsToDB(newNews);
      addNewsToGrid(createdNews);
      newsForm.reset();
    } catch (error) {
      console.log(error);
    }
  });
});
