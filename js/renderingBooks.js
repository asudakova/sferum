const catalogue = document.querySelector('.books__catalogue');

const allBooksHeaders = new Headers();
allBooksHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "filters": {}
});

const optionsForBooks = {
  method: 'POST',
  headers: allBooksHeaders,
  body: raw,
  redirect: 'follow'
};

async function getBooks() {
   const response = await fetch("http://45.8.249.57/bookstore-api/books", optionsForBooks);
   const books = await response.json();
   renderBooks(books);
}

getBooks();

//Функция для получения хэша по названию, чтобы у каждой книги был свой айди
function getHash(bookName) {
   return bookName.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0);
}

function renderBooks(books) {
   if (books.length == 0) {
      document.querySelector('.books__empty').classList.remove('block-none');
   } else {
      document.querySelector('.books__empty').classList.add('block-none');
      books.forEach(book => {
         const bookCardHTML = `<div data-id="${getHash(book.name)}" class="books__card book">
         <div class="book__cover">
            <img src="${book.coverUrl}" alt="${book.name}">
         </div>
         <div class="book__info">
            <div class="book__title">${book.name}</div>
            <div class="book__author">${book.authorName}</div>
         </div>
         <div class="book__buy">
            <div class="book__price"><span>${book.price}</span> руб.</div>
            <button data-action="add" type="button" class="book__into-cart-button button">В корзину</button>
         </div>
         </div>`;
      catalogue.innerHTML += bookCardHTML
      })
   }
};
