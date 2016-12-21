function correctImg() {
    $('.service-item__img-wrap').each(function () {
        $(this).css('max-height', '').css('max-height', $(this).parent('.service-item__col_1').height());
        $(this).find('.service-item__img').css('max-height', '').css('max-height', $(this).height());
    });
    setTimeout(function () {
        correctImg();
    }, 100);
}
$(function () {
    correctImg();
});