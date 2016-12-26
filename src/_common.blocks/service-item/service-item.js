function correctImg() {
    $('.service-item__img').each(function () {
        $(this).css('max-height', '').css('max-height', $(this).closest('.service-item__img-wrap').height());
    });
    setTimeout(function () {
        correctImg();
    }, 100);
}
$(function () {
    $(window).on('resize.serviceItem', function () {
        $('.service-item__img').each(function () {
            $(this).css('max-height', '').css('max-height', $(this).closest('.service-item__col_1').height());
        });
        $('.service-item__col_2').each(function () {
            var height = $(this).closest('.service-item').height();
            $(this).trigger('destroy');
            $(this).dotdotdot({
                height: height
            });
        });
    }).triggerHandler('resize.serviceItem');
});