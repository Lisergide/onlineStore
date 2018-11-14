$(document).ready(() => {

  // Слайдер товара и отзывов
  let owl = $('.owl-carousel');

  owl.owlCarousel({
    center: true,
    items: 1,
    loop: true,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true

  });

  $('.customNextBtn').click(function () {
    owl.trigger('next.owl.carousel');
  });

  $('.customPrevBtn').click(function () {
    // With optional speed parameter
    // Parameters has to be in square bracket '[]'
    owl.trigger('prev.owl.carousel', [300]);
  });

  owl.on('mousewheel', '.owl-stage', function (e) {
    if (e.deltaY > 0) {
      owl.trigger('next.owl');
    } else {
      owl.trigger('prev.owl');
    }
    e.preventDefault();
  });

  // Рейтинг товара
  $('#stars').barrating({
    theme: 'fontawesome-stars'
  });

});