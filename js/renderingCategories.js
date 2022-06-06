const optionsForCategories = {
   method: 'GET',
   redirect: 'follow'
};
 
async function getCategories() {
   const response = await fetch("http://45.8.249.57/bookstore-api/books/categories", optionsForCategories);
   const categories = await response.json();
   renderCategories(categories);
}

const booksCategories = document.querySelector('.books__dropdown-menu');

getCategories();

function renderCategories(categories) {
   categories.forEach(category => {
   categoryHTML = `<div class="books__category" data-category="${category.id}">${category.name}</div>`;
   booksCategories.innerHTML += categoryHTML;
   });
};