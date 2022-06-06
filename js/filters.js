const sorting = document.querySelector('.books__sorting');
sorting.addEventListener('click', (event => {
  sorting.classList.toggle('ASC');
  sorting.classList.toggle('DESC');
}));

let search = "",
    sortPrice = "ASC",
    categoryId = 0;

window.addEventListener('click', (event) => {
  if (event.target.dataset.action === 'sort') {
    sortPrice = sorting.classList[1];
  }
  if (event.target.hasAttribute("data-category")) {
    let categoriesList = document.querySelectorAll('.books__category');
    const currentCategory = document.querySelector('.books__categories label');
    if (event.target.classList.contains('active')) {
      event.target.classList.remove('active');
      currentCategory.innerText = 'Категории';
      document.querySelector('.books__categories input').checked = false;
      categoryId = 0;
    } else {
      categoriesList = document.querySelectorAll('.books__category');
      categoriesList.forEach(category => category.classList.remove('active'));
      event.target.classList.add('active');
      currentCategory.innerText = event.target.innerText;
      document.querySelector('.books__categories input').checked = false;
      categoryId = +event.target.getAttribute('data-category');
    }
  }
  if (event.target.dataset.action === 'search') {
    event.preventDefault();
    search = document.querySelector('.searching-form__text').value;
  }

  const filtredBooksHeaders = new Headers();
  filtredBooksHeaders.append("Content-Type", "application/json");

  const dataRow = JSON.stringify({
    "filters": {
      "search": search,
      "sortPrice": sortPrice,
      "categoryId": categoryId
    }
  });

  const optionsForFiltredBooks = {
    method: 'POST',
    headers: filtredBooksHeaders,
    body: dataRow,
    redirect: 'follow'
  };
  
  async function getFiltredBooks() {
    const response = await fetch("http://45.8.249.57/bookstore-api/books", optionsForFiltredBooks);
    const books = await response.json();
    renderBooks(books);
  }

  if (event.target.dataset.action === 'sort' || event.target.hasAttribute("data-category") || event.target.dataset.action === 'search') {
    const books = document.querySelectorAll('.books__card');
    books.forEach(book => book.remove());
    getFiltredBooks();
  }
});



