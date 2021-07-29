window.onload = (function () {
  $('#js-buttonHamburger').click(function () {
    $('body').toggleClass('is-drawerActive');
    $("#p-header__menu").toggleClass("open");

    if ($(this).attr('aria-expanded') == 'false') {
      $(this).attr('aria-expanded', true);
    }
    
    else {
      $(this).attr('aria-expanded', false);
    }
  });
}) ();
