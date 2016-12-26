$(function () {
    $(window).on('resize.replaceMenu', function () {
        if (Modernizr.mq('(min-width: ' + $screenMd + 'px)')){
            $('.menu').appendTo('.menu-wrap');
        }
        else{
            $('.menu').appendTo('body');
        }
    }).triggerHandler('resize.replaceMenu');

    $('body').on('click', '.toggle-menu', function (e) {
        e.preventDefault();
        $('.menu').toggleClass('menu_opened').fadeToggle(150);
    });
});