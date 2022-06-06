let savedCart = [];

const cart = document.querySelector('.cart__items');
const redNotification = document.querySelector('.cart__purchaseIsNotOkay');
const greenNotification = document.querySelector('.cart__purchaseIsOkay');
const grayNotification = document.querySelector('.cart__empty');
const userBalance = document.querySelector('.header__balance span');

//Проверяем была ли обновлена страница, и если была, то "восстанавливаем" корзину и баланс юзера
if (localStorage.getItem("is_reloaded")) {
   const userSavedBalance = localStorage.getItem('userBalance');
   if (userSavedBalance !== null) {
      userBalance.innerText = userSavedBalance;
   }
   const userSavedCart = JSON.parse( localStorage.getItem('userCart'));
   if (userSavedCart !== null && userSavedCart.length !== 0) {
      userSavedCart.forEach(book => {
         const cartSavedItemHTML = `<div data-id=${book.id} class="cart__item item">
         <div class="item__cover">
            <img src="${book.pic}" alt="">
         </div>
         <div class="item__info">
            <div class="item__title">${book.title}</div>
            <div class="item__author">${book.author}</div>
            <div class="item__amount"><span>${book.amount}</span> шт.</div>
            <div class="item__details">
               <div class="item__price"><span>${book.price}</span> руб.</div>
               <button data-action="delete" type="button" class="item__delete"></button>
            </div>
         </div>
         </div>`;
         cart.innerHTML += cartSavedItemHTML;
      }) 
      savedCart.length = 0;
      getTotalPrice();
   }
};
localStorage.setItem("is_reloaded", true);

window.addEventListener('click', (event) => {
   //Проверяем есть ли в корзине уведомления о покупке/нехватке денег и скрываем их
   if (!greenNotification.classList.contains('block-none')) {
      greenNotification.classList.add('block-none');
      grayNotification.classList.remove('block-none');
   }
   if (!redNotification.classList.contains('block-none')) {
      redNotification.classList.add('block-none');
   }
   //Добавление книги в корзину
   if (event.target.dataset.action === 'add') {
      //Берем инф-ию о книге, которую пользователь хочет добавить в корзину      
      const book = event.target.closest('.book');
      const bookInfo = {
         id: book.dataset.id,
         pic: book.querySelector('.book__cover img').getAttribute('src'),
         title: book.querySelector('.book__title').innerText,
         author: book.querySelector('.book__author').innerText,
         price: +book.querySelector('.book__price span').innerText,
      }
      
      //Проверяем, есть ли такая книга уже в корзине
      //Если да, то увеличивам ее кол-во, если нет, то добавляем в корзину новую книгу
      const isBookInCart = cart.querySelector(`[data-id="${bookInfo.id}"]`);
      if ( isBookInCart) {
         const counter =  isBookInCart.querySelector('.item__amount span');
			counter.innerText = +counter.innerText + 1;
      } else {
         const cartItemHTML = `<div data-id=${bookInfo.id} class="cart__item item">
         <div class="item__cover">
            <img src="${bookInfo.pic}" alt="">
         </div>
         <div class="item__info">
            <div class="item__title">${bookInfo.title}</div>
            <div class="item__author">${bookInfo.author}</div>
            <div class="item__amount"><span>1</span> шт.</div>
            <div class="item__details">
               <div class="item__price"><span>${bookInfo.price}</span> руб.</div>
               <button data-action="delete" type="button" class="item__delete"></button>
            </div>
         </div>
         </div>`;
         cart.innerHTML += cartItemHTML;
      }
      //Пересчитываем общую стоимость товаров в корзине
      getTotalPrice();     
   };
   //Удаление книги из корзины
   if (event.target.dataset.action === 'delete') {
      event.target.closest('.cart__item').remove();
      //Пересчитываем общую стоимость товаров в корзине
      getTotalPrice();
   }
   //Покупка товаров из корзины
   if (event.target.dataset.action === 'buy') {
      const userBalance = document.querySelector('.header__balance span');
      const purchasePrice = document.querySelector('.cart__total-price span');
      const cartItems = document.querySelectorAll('.cart__item');
      if (+userBalance.innerText >= +purchasePrice.innerText) {
         let userBalanceInt = +userBalance.innerText - +purchasePrice.innerText;
         userBalance.innerText = userBalanceInt;
         localStorage.setItem('userBalance', userBalanceInt);
         cartItems.forEach(item => item.remove());
         localStorage.removeItem('userCart');
         greenNotification.classList.remove('block-none');
         document.querySelector('.cart__buy').classList.add('block-none');
      } else {
         redNotification.classList.remove('block-none');
      }
   }
});

function getTotalPrice() {
   const totalPriceEl = document.querySelector('.cart__total-price span');
   const cartItems = document.querySelectorAll('.cart__item');
   const buyBlock = document.querySelector('.cart__buy');
   let total = 0;
   savedCart.length = 0;
   //Считаем сумму товаров в корзине и записываем инф-ию о книгах, к-ые есть в корзине
   cartItems.forEach(item => {
      const price = item.querySelector('.item__price span');
      const amount = item.querySelector('.item__amount span');
      total += +price.innerText * +amount.innerText; 

      let itemInfo = {
         id: item.getAttribute('data-id'),
         pic: item.querySelector('.item__cover img').getAttribute('src'),
         title: item.querySelector('.item__info .item__title').innerText,
         author: item.querySelector('.item__info .item__author').innerText,
         amount: +item.querySelector('.item__info .item__amount span').innerText,
         price: +item.querySelector('.item__info .item__price span').innerText,
      }
      savedCart.push(itemInfo);
   });
   totalPriceEl.innerText = total;
   //Удаляем ранее записанную инф-ию о корзине и записываем новую
   localStorage.removeItem('userCart');
   if (savedCart.length !== 0) {
      localStorage.setItem('userCart', JSON.stringify(savedCart));
   }
   //Если в корзине товаров больше чем на 0 руб, то скрываем уведомление о том, 
   //что корзина пуста и показываем блок для покупки и наоборот
   if (total > 0) {
      grayNotification.classList.add('block-none');
      buyBlock.classList.remove('block-none');
   } else {
      grayNotification.classList.remove('block-none');
      buyBlock.classList.add('block-none');
   }
};

