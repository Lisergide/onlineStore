'use strict';

class Goods {
  constructor(id, title, price, img, container = '.goods') {
    this.id = id;
    this.title = title;
    this.price = price;
    this.img = img;
    this.container = container;
    this._render(this.container);
  }

  _render(container) {
    let $wrapper = $('<div/>', {
      class: 'parentUnit'
    });

    let $link = $('<a/>', {
      href: 'single_page.html',
      class: 'itemUnit'
    });

    let $img = $('<img>', {
      src: this.img,
      alt: this.img
    });

    let $desc = $('<div/>', {
      class: 'f-item-text'
    });

    let $name = $('<p/>', {
      class: 'f-item-name',
      text: this.title
    });

    let $price = $('<p/>', {
      class: 'f-item-price',
      text: `$${this.price}.00`
    });

    let $buyWrapper = $('<div/>', {
      class: 'f-link-flex',
    });

    let $buyBtn = $('<button/>', {
      class: 'cart-w',
      text: 'Add to Cart',
      'data-id': this.id,
      'data-name': this.title,
      'data-img': this.img,
      'data-price': this.price
    });


    // Собираем структуру html
    $link.appendTo($wrapper);
    $img.appendTo($link);
    $desc.appendTo($link);
    $name.appendTo($desc);
    $price.appendTo($desc);
    $buyWrapper.appendTo($wrapper);
    $buyBtn.appendTo($buyWrapper);

    $(container).append($wrapper)
  }

}