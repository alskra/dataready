function correctDec2() {
    var item = $('.decoration_type_2');
    var col = $('.service-item__col_2').eq(0);
    var d = col.offset().top
        - item.closest('.content-section').offset().top
        + (Modernizr.mq('(min-width: ' + $screenSm + 'px)') ? 17 : 11) + 7;
    item.css('margin-top', -99999 + Math.abs(d));
    setTimeout(function () {
        correctDec2();
    }, 100);
}
function correctDec5() {
    var item = $('.decoration_type_5');
    var col = $('.service-item__col_2').eq(3);
    var d = col.offset().top
        - item.closest('.content-section').offset().top
        + (Modernizr.mq('(min-width: ' + $screenSm + 'px)') ? 17 : 11) + 7;
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