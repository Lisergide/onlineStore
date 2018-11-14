'use strict';

class Cart {
  constructor(source, container = '.shop_cart') {
    this.source = source;
    this.container = container;
    this.amount = 0; // Сумма товаров в корзине
    this.basketItems = []; // Товары в корзине
    this._init(this.source);
  }

  _render() {
    let $cartItemsDiv = $('.cart_grid_container');

    let $cartTitleWrap = $('<div/>', {
      class: 'grid_col_wrapper'
    });

    $cartTitleWrap.appendTo($cartItemsDiv);

    $cartTitleWrap.append($('<div class="shop_cart_t">Product Details</div>'));
    $cartTitleWrap.append($('<div class="shop_cart_t">unite Price</div>'));
    $cartTitleWrap.append($('<div class="shop_cart_t">Quantity</div>'));
    $cartTitleWrap.append($('<div class="shop_cart_t">shipping</div>'));
    $cartTitleWrap.append($('<div class="shop_cart_t">Subtotal</div>'));
    $cartTitleWrap.append($('<div class="shop_cart_t">ACTION</div>'));

  }

  _init(source) {
    this._render();
    if (!localStorage.getItem('myitems')) {
      fetch(source)
        .then(result => result.json())
        .then(data => {
          for (let product of data.contents) {
            this.basketItems.push(product);
            this._renderItem(product);
          }
          this.amount = data.amount;
          localStorage.setItem('myitems', JSON.stringify(this.basketItems));
          localStorage.setItem('amount', JSON.stringify(this.amount));
          this._renderSum()
        });
    } else {
      this.basketItems = JSON.parse(localStorage.getItem('myitems'));
      this.amount = JSON.parse(localStorage.getItem('amount'));
      for (let product of this.basketItems) {
        this._renderItem(product);
        this._updateCart(product);
      }
      this._renderSum();
    }
  }

  _renderItem(product) {
    let $container = $('<div/>', {
      class: 'grid_col_wrapper',
      'data-product': product.id_product
    });

    let $tdImg = $('<div/>', {
      class: 'td_img'
    });

    let $prodImgLink = $('<a/>', {
      class: 'shop_cart_table_img',
      href: 'single_page.html'
    });

    let $prodImg = $(`<img src=${product.img} alt="shop_cart_img" class="shop_cart_img">`);

    let $prodName = $(`<a href="single_page.html" class="item_table_title">${product.product_name}</a><br>`);

    let $itemColor = $(`<span class="item_spec_info">Color: <span>Red</span></span><br>`);

    let $itemSize = $(`<span class="item_spec_info">Size: <span>Xll</span></span>`);

    $tdImg.appendTo($container);
    $prodImgLink.appendTo($tdImg);
    $prodImg.appendTo($prodImgLink);
    $prodName.appendTo($tdImg);
    $itemColor.appendTo($tdImg);
    $itemSize.appendTo($tdImg);

    $container.append($(`<div class="td_unite_price">$${product.price}</div>`));

    let $itemQuantity = $('<div/>', {
      class: 'td_quantity'
    });
    $itemQuantity.appendTo($container);
    $itemQuantity.append($(`<input id="quantity" type="number" name="quantity" data-id="${product.id_product}" class="td_quality_ink" value="${product.quantity}" min="1" max="100">`));
    $container.append($('<div class="td_shipping">FREE</div>'));
    $container.append($(`<div class="td_subtotal" data-id="${product.id_product}">$${product.price * product.quantity}</div>`));
    let $delBtn = $('<div/>', {
      class: 'td_action'
    });
    $container.append($delBtn);
    $delBtn.append($('<a><i class="fas fa-times-circle"></i></a>'));
    $delBtn.click(() => {
      this._remove(product.id_product);
    });
    $container.appendTo($('.cart_grid_container'));

    this._targetQuantity();
  }

  _targetQuantity() {
    $('input#quantity').on('input', (e) => {
      this._updateSubtotal($(e.target).data('id'), e.target.value);
    });
  }

  _updateSubtotal(productId, quantity) {
    let find = this.basketItems.find(product => product.id_product === productId);
    if (find) {
      if (find.quantity < quantity) {
        find.quantity++;
        this.amount += find.price;
      } else {
        find.quantity--;
        this.amount -= find.price;
      }
      this._updateCart(find);
      this._renderSum();
    }

  }

  _renderSum() {
    let $subTotal = $('.total_title');
    $subTotal.text(`Sub total $${this.amount}`);

    let $grandTotal = $('.grand_total');
    $grandTotal.text(`GRAND TOTAL `);
    $grandTotal.append(`<span>$${this.amount}</span>`);

    let $cartTotal = $('.cart-total');
    $cartTotal.text(`TOTAL `);
    $cartTotal.append(`<span>$${this.amount}</span>`);

  }

  addProduct(element) {
    let productId = +$(element).data('id');
    let find = this.basketItems.find(product => product.id_product === productId);
    if (find) {
      find.quantity++;
      this.amount += find.price;
      this._updateCart(find)
    } else {
      let product = {
        id_product: productId,
        price: +$(element).data('price'),
        product_name: $(element).data('name'),
        img: $(element).data('img'),
        quantity: 1
      };
      this.basketItems.push(product);
      console.log(this.basketItems);
      this.amount += product.price;
      this._renderItem(product);
    }
    localStorage.setItem('myitems', JSON.stringify(this.basketItems));
    localStorage.setItem('amount', JSON.stringify(this.amount));
    this._renderSum();
  }

  _updateCart(product) {
    let $container = $(`div[data-product="${product.id_product}"]`);
    $container.find('.cart-price').text(`${product.quantity} x $${product.price}`);
    $container.find('.td_subtotal').text(`$${product.price * product.quantity}`);

  }

  _remove(productId) {
    let find = this.basketItems.find(product => product.id_product === productId);
    if (find) {
      this.amount -= (find.price * find.quantity);
      let $container = $(`div[data-product="${productId}"]`);
      this.basketItems.splice(this.basketItems.indexOf(find), 1);
      $container.remove();
      localStorage.setItem('myitems', JSON.stringify(this.basketItems));
      localStorage.setItem('amount', JSON.stringify(this.amount));
      this._renderSum();
    }
  }

  clearCart(element) {
    let $container = $('div[data-product]');
    $container.remove();

    let $subTotal = $('.total_title');
    $subTotal.text(`Sub total $0`);

    let $grandTotal = $('.grand_total');
    $grandTotal.text(`GRAND TOTAL `);
    $grandTotal.append(`<span>$0</span>`);

    let $cartTotal = $('.cart-total');
    $cartTotal.text(`TOTAL `);
    $cartTotal.append(`<span>$0</span>`);

    localStorage.clear();
  }

}