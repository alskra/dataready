$(function () {
    if ($('.wrapper').length){
        var historyFlag = false;
        function updatePage(hash) {
            historyFlag = true;
            var sect = $('[data-id="' + hash.split('#')[1] + '"]');
            if (hash == ''){
                history.replaceState(null, document.title, '#main');
                $('.wrapper').moveTo(1);
            }
            else if (sect.length){
                if (Modernizr.mq('(min-width: ' + ($screenMd) + 'px)') && !sect.hasClass('section')){
                    sect = $('.section_services_2');
                    history.replaceState(null, document.title, '#services-page-2');
                }
                $('.wrapper').moveTo(sect.data('index'));
            }
            historyFlag = false;
        }
        $(window).on('resize.onepage_scrollInit', function () {
            if (Modernizr.mq('(min-width: ' + $screenMd + 'px)')){
                $('.section_services_3, .section_services_4').removeClass('section').hide();
            }
            else{
                $('.section_services_3, .section_services_4').addClass('section').show();
            }
            $('.section, .section_services_3, .section_services_4').removeData('index').removeAttr('data-index');
            $('.wrapper').onepage_scroll({
                sectionContainer: ".section",     // sectionContainer accepts any kind of selector in case you don't want to use section
                easing: "ease",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",// "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
                animationTime: 500,             // AnimationTime let you define how long each section takes to animate
                pagination: true,                // You can either show or hide the pagination. Toggle true for show, false for hide.
                updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
                beforeMove: function(index) {
                    if (!historyFlag){
                        historyFlag = true;
                        history.pushState(null, document.title, '#' + $('.section').eq(index - 1).data('id'));
                    }
                    $('body').attr('data-page', $('.section').eq(index - 1).data('id'));
                },  // This option accepts a callback function. The function will be called before the page moves.
                afterMove: function(index) {
                    historyFlag = false;
                },   // This option accepts a callback function. The function will be called after the page moves.
                loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
                keyboard: true,                  // You can activate the keyboard controls
                responsiveFallback: false,        // You can fallback to normal page scroll by defining the width of the browser in which
                // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
                // the browser's width is less than 600, the fallback will kick in.
                direction: "vertical"            // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".
            });
            updatePage(window.location.hash);
        }).on('popstate', function (e) {
            if (!historyFlag){
                updatePage(window.location.hash);
            }
        }).triggerHandler('resize.onepage_scrollInit');

        $('body').on('click', '.onepage-pagination a', function (e) {
            e.preventDefault();
        });

        $('body').on('click', '.menu__btn', function (e) {
            e.preventDefault();
            $('.wrapper').moveTo($('[data-id="' + $(this).attr('href').split('#')[1] + '"]').data('index'));
            $('.menu').removeClass('menu_opened').fadeOut(500);
        });

        $('body').on('click', '.link_to-top', function (e) {
            e.preventDefault();
            $('.wrapper').moveTo(1);
        });
    }
});