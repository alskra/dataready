$(function () {
    $(window).on('resize.replaceMenu', function () {
        if (Modernizr.mq('(max-width: ' + ($screenMd - 1) + 'px)')){
            $('.menu').appendTo('body');
        }
        else{
            $('.menu').appendTo('.menu-wrap');
        }
    }).trigger('resize.replaceMenu');

    $('body').on('click', '.toggle-menu', function (e) {
        e.preventDefault();
        $('.menu').toggleClass('menu_opened').fadeToggle(150);
    }).on('click', '.menu__btn', function (e) {
        $('.wrapper').moveTo($('[data-id="' + $(this).attr('href').split('#')[1] + '"]').data('index'));
        $('.menu').removeClass('menu_opened').fadeOut(800);
    });
});