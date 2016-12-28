function serviceItem() {
    $('.service-item__img').each(function () {
        $(this).css('max-height', $(this).closest('.service-item__col_1').height());
    });
    $('.service-item__col_2').each(function () {
        $(this).trigger('destroy').dotdotdot();
    });
    setTimeout(function () {
        serviceItem();
    }, 100);
}
$(function () {
    $(window).on('resize.serviceItem', function () {
        $('.service-item__img').each(function () {
            $(this).css('max-height', '').css('max-height', $(this).closest('.service-item__col_1').height());
        });
        $('.service-item__col_2').each(function () {
            $(this).trigger('destroy').dotdotdot();
        });
    }).triggerHandler('resize.serviceItem');

    setTimeout(function () {
        $(window).triggerHandler('resize.serviceItem');
    }, 500);
});