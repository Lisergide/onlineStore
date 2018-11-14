'use strict';

class Cartbox extends Cart {

  _render() {
    let $cartBoxWrap = $('<div/>', {
      class: 'cart-box-inside'
    });

    let $cartBoxTotal = $(`<p class="cart-total"></p>`);

    let $cartBtnCheckout = $(`<a href="checkout.html" class="button-checkout">Checkout</a>`);

    let $cartBtnGoToCart = $(`<a href="shopping_cart.html" class="button-go_to_cart">Go&nbsp;to&nbsp;cart</a>`);

    $cartBoxWrap.appendTo($(this.container));
    $cartBoxTotal.appendTo($(this.container));
    $cartBtnCheckout.appendTo($(this.container));
    $cartBtnGoToCart.appendTo($(this.container));

  }

  _renderItem(product) {
    let $container = $('<div/>', {
      class: 'cart-product',
      'data-product': product.id_product
    });

    let $prodLink = $('<a/>', {
      class: 'cart-prod-img',
      href: 'single_page.html'
    });

    let $prodImg = $(`<img src=${product.img} class="cartbox-img" alt="cart-img">`);

    let $prodTitleWrap = $('<div/>', {
      class: 'cart-product-title'
    });

    $prodTitleWrap.append($(`<p class="cart-product-name">Rebox Zane</p>`));
    $prodTitleWrap.append($('<img src="img/cart/stars.png" alt="stars">'));
    $prodTitleWrap.append($(`<p class="cart-price">${product.quantity} x $${product.price}</p>`));

    $prodLink.appendTo($container);
    $prodImg.appendTo($prodLink);
    $prodTitleWrap.appendTo($container);

    let $delBtn = $('<a/>', {
      class: 'times-circle'
    });
    $container.append($delBtn);
    $delBtn.append($('<i class="fas fa-times-circle"></i>'));
    $delBtn.click(() => {
      this._remove(product.id_product);
    });

    $container.appendTo($('.cart-box-inside'));
  }

  _remove(productId) {
    let find = this.basketItems.find(product => product.id_product === productId);
    if (find.quantity > 1) {
      find.quantity--;
      this._updateCart(find);
    } else {
      let $container = $(`div[data-product="${productId}"]`);
      this.basketItems.splice(this.basketItems.indexOf(find), 1);
      $container.remove();
    }
    //this.countGoods--;
    this.amount -= find.price;
    localStorage.setItem('myitems', JSON.stringify(this.basketItems));
    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
    localStorage.setItem('amount', JSON.stringify(this.amount));
    this._renderSum();
  }

}