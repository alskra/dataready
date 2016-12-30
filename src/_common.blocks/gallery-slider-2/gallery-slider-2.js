if (document.documentElement.style.mixBlendMode !== undefined){
    $('html').addClass('mixblendmode');
}
$(function () {
    $('.gallery-slider-2__item').each(function (i) {
        $(this).data('id', i);
    });
    $('.gallery-slider-2 .slick-slider').slick({
        dots: false,
        arrows: true,
        infinite: true,
        speed: 300,
        fade: false,
        cssEase: 'ease',
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        autoplay: false,
        autoplaySpeed: 5000,
        zIndex: 1,
        lazyLoad: 'ondemand',
        responsive: [
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: $screenSm - 1,
                settings: {
                    slidesToShow: 3
                }
            }
        ]
    });

    $(window).on('resize.gallerySlider2', function () {
        $('.gallery-slider-2__caption').each(function () {
            $(this).trigger('destroy').dotdotdot();
        });
    }).triggerHandler('resize.gallerySlider2');
});