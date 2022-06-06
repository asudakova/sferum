const header = document.querySelector('.header');
window.onscroll = () => {
   if (window.pageYOffset > 0) {
      header.classList.add('header_active');
   } else {
      header.classList.remove('header_active');
   }
};

const cartIcon = document.querySelector('.cart__icon-menu');
const cartBlock = document.querySelector('.shopping__cart');
cartIcon.addEventListener('click', (event) => {
   cartBlock.classList.toggle('active');
   cartIcon.classList.toggle('active');
   document.body.classList.toggle('lock');
})