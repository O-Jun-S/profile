window.onload = (function () {
  $('#js-buttonHamburger').click(function () {
    $('body').toggleClass('is-drawerActive');

    if ($(this).attr('aria-expanded') == 'false') {
      $(this).attr('aria-expanded', true);
    }
    
    else {
      $(this).attr('aria-expanded', false);
    }
  });
}) ();
