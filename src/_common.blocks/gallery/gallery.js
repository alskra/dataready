$(function () {
    $('body').on('click', '[data-toggle="gallery"]', function(){
        var galleryItems = $('[data-gallery="' + $(this).data('gallery') + '"]');
        var initialSlide = galleryItems.index(this);
        $.arcticmodal({
            type: 'ajax',
            url: 'popups/gallery.html',
            ajax: {
                type: 'GET',
                cache: false,
                dataType: 'html',
                success: function(data, el, responce) {
                    var modal = $(responce);
                    galleryItems.each(function () {
                        $('<div class="gallery__item slick-slide"><img src="' + $(this).data('href') + '" alt class="img-object-fit scale-down" onload="objectFit(this)"></div>').appendTo(modal.find('.gallery'));
                    });
                    data.body.append(modal);
                }
            },
            afterLoadingOnShow: function(data, el) {
                $('.arcticmodal-loading').remove();
                $('.gallery').slick({
                    dots: false,
                    arrows: false,
                    infinite: false,
                    speed: 300,
                    fade: false,
                    cssEase: 'ease',
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: initialSlide,
                    mobileFirst: true,
                    prevArrow: '<button type="button" class="slick-prev"></button>',
                    nextArrow: '<button type="button" class="slick-next"></button>',
                    autoplay: false,
                    autoplaySpeed: 5000,
                    zIndex: 1,
                    lazyLoad: 'ondemand',
                    responsive: [

                    ]
                });
            }
        });
        return false;
    });
});