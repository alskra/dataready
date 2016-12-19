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
        //$('.toggle-menu').toggleClass('toggle-menu_opened');
        $('.menu').toggleClass('menu_opened').fadeToggle(150);
    });

    $('body').on('click', '.menu__btn', function (e) {
        $('.onepage-pagination a[href="' + $(this).attr('href') + '"]').trigger('click');
    });
});