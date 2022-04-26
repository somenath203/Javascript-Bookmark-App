const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');

const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');
const submitbutton = document.getElementById('submitform');

let bookmarks = [];

// MODAL

const showModal = () => {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
};

modalShow.addEventListener('click', showModal);

modalClose.addEventListener('click', () => {
  modal.classList.remove('show-modal');
});

window.addEventListener('click', (e) => {
  e.target === modal ? modal.classList.remove('show-modal') : false;
});

// FORM VALIDATION

const validate = (nameValue, urlValue) => {
  var expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  const regex = new RegExp(expression);

  if (!nameValue || !urlValue) {
    alertify.alert('Empty Input', 'Please enter something in all the fields');
    return false;
  }
  if (!urlValue.match(regex)) {
    alertify.alert('Invalid URL', 'Please enter a valid URL');
    return false;
  }

  return true;
};

// building bookmark DOM
const buildBookMarks = () => {

  bookmarksContainer.textContent = '';

  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;

    const itemdiv = document.createElement('div');
    itemdiv.classList.add('item');

    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fa-solid', 'fa-xmark');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookMark('${url}')`);

    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');

    const favicon = document.createElement('img');

    favicon.setAttribute(
      'src',
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute('alt', 'Favicon');

    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;

    linkInfo.append(favicon, link);

    itemdiv.append(closeIcon, linkInfo);

    bookmarksContainer.appendChild(itemdiv);
  });
};

// Fetch bookmarks from localstorage
const fetchBookMarks = () => {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    bookmarks = [];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  buildBookMarks();
};

// delete bookmark
const deleteBookMark = (url) => {
  bookmarks.forEach((bookmark, index) => {
    if (bookmark.url === url) {
      bookmarks.splice(index, 1);
    }
  });

  // update bookmarks array in localstorage after deleteing an item
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  fetchBookMarks();
};

const storeBookMark = (e) => {
  e.preventDefault();

  const nameValue = websiteNameEl.value;

  let urlValue = websiteUrlEl.value;

  if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
    urlValue = `https://${urlValue}`;
  }

  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);
  console.log(bookmarks);

  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  fetchBookMarks();

  bookmarkForm.reset();
  websiteNameEl.focus();

  validate(nameValue, urlValue);
};

// closing the modal when someone clicks on submit button
submitbutton.addEventListener('click', () => {
  modal.classList.remove('show-modal');
})

bookmarkForm.addEventListener('submit', storeBookMark);

fetchBookMarks();
