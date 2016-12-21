function correctDec2() {
    var item = $('.decoration_type_2');
    var title = item.closest('.service-item').find('.service-item__title');
    var d = title.offset().top
        - item.closest('.service-item').offset().top
        + parseFloat(title.css('line-height'))/2 + 7;
    item.css('margin-top', -99999 + Math.abs(d));
    setTimeout(function () {
        correctDec2();
    }, 100);
}
function correctDec5() {
    var item = $('.decoration_type_5');
    var title = item.closest('.service-item').find('.service-item__title');
    var d = title.offset().top
        - item.closest('.service-item').offset().top
        + parseFloat(title.css('line-height'))/2 + 7;
    item.css('margin-top', -14 + Math.abs(d));
    setTimeout(function () {
        correctDec5();
    }, 100);
}

$(function () {
    if ($('.decoration').length){
        correctDec2();
        correctDec5();
    }
});