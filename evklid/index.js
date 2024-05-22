let burger = document.querySelector('.burger');
let menu = document.querySelector('.header-nav');
let menuLinks = menu.querySelectorAll('.header-nav__link');

burger.addEventListener('click',

  function () {

    burger.classList.toggle('burger--active');

    menu.classList.toggle('header-nav--active');

    document.body.classList.toggle('stop-scroll');
  })

menuLinks.forEach(function (el) {
  el.addEventListener('click', function () {

    burger.classList.remove('burger--active');

    menu.classList.remove('header-nav--active');

    document.body.classList.remove('stop-scroll');
  })
})

const swiper = new Swiper('.swiper-container', {

  allowTouchMove: false,

  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  },

  a11y: {
    paginationBulletMessage: 'Перейти на слайд {{index}}',
  },
})

document.querySelectorAll('.tabs-nav__btn').forEach(function (tabsBtn) {
  tabsBtn.addEventListener('click', function (e) {
    const path = e.currentTarget.dataset.path;

    document.querySelectorAll('.tabs-nav__btn').forEach(function (btn) {
      btn.classList.remove('tabs-nav__btn--active')
    });
    e.currentTarget.classList.add('tabs-nav__btn--active');

    document.querySelectorAll('.tabs-item').forEach(function (tabsBtn) {
      tabsBtn.classList.remove('tabs-item--active')
    });

    document.querySelector(`[data-target="${path}"]`).classList.add('tabs-item--active');
  });
});

new Accordion('.accordion-container', {
  triggerClass: 'ac-control'
});

let search = document.querySelector('.header__search');
let searchForm = document.querySelector('.search-form');
let closeBtn = document.querySelector('.form-search__close');

search.addEventListener('click',

  function () {

    searchForm.classList.add('search-form--active');
})

closeBtn.addEventListener('click',

  function () {

    searchForm.classList.remove('search-form--active');
})
