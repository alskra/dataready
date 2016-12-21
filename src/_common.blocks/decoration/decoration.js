$(function () {
    $(window).on('resize.correctDec2', function () {
        var item = $('.decoration_type_2');
        var title = item.closest('.service-item').find('.service-item__title');
        var d = title.offset().top
            - item.closest('.service-item').offset().top
            + parseFloat(title.css('line-height'))/2 + 7;
        item.css('margin-top', -99999 + Math.abs(d));
    });

    setTimeout(function () {
        $(window).trigger('resize.correctDec2');
    }, 100);

    $(window).on('resize.correctDec5', function () {
        var item = $('.decoration_type_5');
        var title = item.closest('.service-item').find('.service-item__title');
        var d = title.offset().top
            - item.closest('.service-item').offset().top
            + parseFloat(title.css('line-height'))/2 + 7;
        item.css('margin-top', -14 + Math.abs(d));
    });

    setTimeout(function () {
        $(window).trigger('resize.correctDec5');
    }, 100);
});