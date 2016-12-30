function serviceItem() {
    $('.service-item__img').each(function () {
        $(this).css('max-height', '').css('max-height', $(this).closest('.service-item__col_1').height());
    });
    $('.service-item__col_2').each(function () {
        $(this).trigger('destroy').height(Modernizr.mq('(min-width: ' + $screenSm + 'px)') ? '100%' : '').dotdotdot().height('');
});
}
$(function () {
    $(window).on('resize.serviceItem', function () {
        setTimeout(function () {
            serviceItem();
        }, 500);
    }).triggerHandler('resize.serviceItem');
});