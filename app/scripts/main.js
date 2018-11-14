'use strict';

$(document).ready(() => {

  //Создавать товары
  let pagename = window.location.pathname.split('/').pop().replace(/(\w+)\.(\w+)/, '$1');

  fetch('scripts/getProduct.json')
    .then(result => result.json())
    .then(data => {
      for (let product of data[pagename]) {
        if (pagename === 'product') {
          new Product(product.id_product, product.product_name, product.price, product.img);
        } else {
          new Goods(product.id_product, product.product_name, product.price, product.img);
        }
      }
    })
    .catch(error => {
      console.log(error);
    });

  //Корзина малая
  let myCartbox = new Cartbox('scripts/getCart.json', '.cart-box');

  // Обработчик
  $('.product').on('click', '.cart-w', e => {
    console.log(e.target);
    myCartbox.addProduct(e.target);
  });
  $('.goods').on('click', '.cart-w', e => {
    console.log(e.target);
    myCartbox.addProduct(e.target);
  });

  // Корзина
  let myCart = new Cart('scripts/getCart.json');

  // Обработчики
  $('.product').on('click', '.cart-w', e => {
    console.log(e.target);
    myCart.addProduct(e.target);
  });
  $('.goods').on('click', '.cart-w', e => {
    console.log(e.target);
    myCart.addProduct(e.target);
  });

  $('.clear_cart').on('click', e => {
    myCart.clearCart(e.target);
  });

  //Отзывы
  let myFeedback = new Feedback('scripts/feedback.json');

});