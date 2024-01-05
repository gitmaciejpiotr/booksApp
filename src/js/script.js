const templates = {
  book: Handlebars.compile(document.querySelector('#template-book').innerHTML)
};

class BooksList {
  constructor() {
    const thisBooksList = this;

    thisBooksList.favoriteBooks = [];
    thisBooksList.filters = [];

    thisBooksList.getElements();

    for (let book of dataSource.books) {
      thisBooksList.renderInMenu(book);
    }

    thisBooksList.initActions();
  }

  getElements() {
    const thisBooksList = this;

    thisBooksList.dom = {};

    thisBooksList.dom.bookContainer = document.querySelector('.books-list');
    thisBooksList.dom.booksList = document.querySelector('.books-list');
    thisBooksList.dom.filtersContainer = document.querySelector('.filters div');
  }

  styleRating(element, book) {
    const thisBooksList = this;
    thisBooksList.dom.ratingElement = element.querySelector('.book__rating__fill');
    thisBooksList.dom.ratingElement.style.width = String(book.rating * 10) + '%';

    if (book.rating < 6) {
      thisBooksList.dom.ratingElement.style.background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if (6 <= book.rating && book.rating < 8) {
      thisBooksList.dom.ratingElement.style.background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (8 <= book.rating && book.rating < 9) {
      thisBooksList.dom.ratingElement.style.background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if (9 <= book.rating) {
      thisBooksList.dom.ratingElement.style.background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
  }

  renderInMenu(book) {
    const thisBooksList = this;

    /* Generate HTML code of book element using Handlebars templates */
    const generatedHTML = templates.book(book);

    /* Create element using utils.createElementFromHTML */
    const element = utils.createDOMFromHTML(generatedHTML);

    thisBooksList.styleRating(element, book);

    /* Add element to .books-list */
    thisBooksList.dom.bookContainer.appendChild(element);
  }

  filterBooks(filters) {
    const thisBooksList = this;

    for (const book of dataSource.books) {
      const details = book.details;
      thisBooksList.dom.bookInHTML = document.querySelector('a[data-id = "' + book.id + '"]');
      thisBooksList.dom.bookInHTML.classList.remove('hidden');

      for (const filter of filters) {
        if (details[filter] === true) {
          thisBooksList.dom.bookInHTML.classList.add('hidden');
        }
      }
    }
  }

  addToFavorite(event) {
    const thisBooksList = this;

    /* Find book image in clicked element */
    const bookImage = event.target.offsetParent;
    /* Get data-id attribute from book image */
    const bookId = bookImage.getAttribute('data-id');
    if (thisBooksList.favoriteBooks.indexOf(bookId) === -1) {
      /* Add class 'favorite' to book image */
      bookImage.classList.add('favorite');
      /* Add book id to favoriteBooks array */
      thisBooksList.favoriteBooks.push(bookId);
    } else {
      /* Remove class 'favorite' from book image' */
      bookImage.classList.remove('favorite');
      /* Remove book id from favoriteBook */
      thisBooksList.favoriteBooks.splice(thisBooksList.favoriteBooks.indexOf(bookId), 1);
    }
  }

  addFilterCategory(event) {
    const thisBooksList = this;

    const conditions = event.target.tagName === 'INPUT'
      && event.target.getAttribute('type') === 'checkbox'
      && event.target.getAttribute('name') === 'filter';

    if (conditions) {
      if (event.target.checked) {
        thisBooksList.filters.push(event.target.getAttribute('value'));
      } else {
        thisBooksList.filters.splice(thisBooksList.filters.indexOf(event.target.getAttribute('value')), 1);
      }
    }

    thisBooksList.filterBooks(thisBooksList.filters);
  }

  initActions() {
    const thisBooksList = this;

    thisBooksList.dom.booksList.addEventListener('dblclick', function (event) {
      event.preventDefault();
      if (event.target.offsetParent.classList.contains('book__image')) {
        thisBooksList.addToFavorite(event);
      }
    });

    thisBooksList.dom.filtersContainer.addEventListener('click', function (event) {
      thisBooksList.addFilterCategory(event);
    });
  }
}

new BooksList();


