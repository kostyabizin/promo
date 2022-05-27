function processSuccess(response, callback, $form) {
    if ($form.attr('id') && response.result === 'success') {
        yaCounter.reachGoal($form.attr('id'));
        gtag('event', $form.attr('id'));
    }
    if (callback) {
        callback({clearForm: response.result === 'success', unlockSubmitButton: true});
    }
    var delay = 1500;
    if (response.delay) {
        delay = response.delay;
    }
    if (response.text) {
        Popup.message(response.text);
    }
    if (response.errors) {
        $.each(response.errors, function (i, el) {
            // if (i === '__all__') {
            ValidateForm.customFormErrorTip($form[0], el[0]);
            // } else {
                // ValidateForm.customErrorTip($form.find('[name=' + i + ']').get(0), el[0]);
            // }
        });
    }
    if (response.redirect_to) {
        setTimeout(function () {
            if (response.redirect_to == 'self') {
                window.location.reload();
            } else {
                window.location.href = response.redirect_to;
            }
        }, delay);
    }
}

function processError(callback) {
    if (callback){
        callback({clearForm: false, unlockSubmitButton: true});
    }
    Popup.message('Возникла ошибка. Попробуйте позже.');
}


$(function() {

    // popup
    Popup.init('.js-popup-open');

    // mobile nav
    MobNav.init({
        openBtn: '.js-open-menu',
        headerId: 'header',
        closeLink: 'a.js-anchor, a.js-popup-open'
    });
   
    // form
    Form.init('.form');

    try {
        Anchor.init('.js-anchor', 800, 100);
    } catch (error) {
        console.log(error);
    }


    $('input[data-type="tel"]').each(function () {
        new Maskinput(this, 'tel');
    });

    $('#form-login').submit(function(event, callback){
        event.preventDefault();
        var form = $(this)[0];
        if (!ValidateForm.validate(form)) {
            return;
        }

        var files = CustomFile.getFiles(form);
        var formDate = new FormData(form);
        var _popup_id = $(form).parents('.popup__window').attr('id');

        $.each(files, function (i, el) {
            formDate.append('avatar', el, el.filename)
        })
       
        $.ajax({
            url: form.action,
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: formDate,
            success: function (response) {
                if (response.errors) {
                    if (_popup_id) {
                        Popup.open('#' + _popup_id);
                    }
                    
                }
            },
            error: function () {
                processError(callback);
            }
        });

    })

  

    $('.js-scroll-block').mCustomScrollbar({
        documentTouchScroll: true,
        contentTouchScroll: .5,
        scrollbarPosition: 'outside'
    });


    $('body')
        .on('click', '.js-faq-header', function() {
            var _faqHeade = $(this);
            var _faqItem = _faqHeade.parents('.js-faq-item');
            var _faqBody = _faqItem.find('.js-faq-body');

            var openedBlocks = $('.js-faq-item.opened');
            var openedBlocksBody = openedBlocks.find('.js-faq-body');

            if (_faqItem.hasClass('opened')) {
                _faqItem.removeClass('opened')
                _faqBody.slideUp(200)
                return
            } else {
                if (openedBlocks.length) {
                    openedBlocks.removeClass('opened')
                    openedBlocksBody.slideUp(200)
                }

                _faqItem.addClass('opened')
                _faqBody.slideDown(200)
            }
        })
        .on('click', '.js-shop-btn-open', function() {
            var openBtn = $(this);
            var shopList = $('.js-shop-list');

            if (openBtn.hasClass('opened')) {
                openBtn.removeClass('opened')
                shopList.fadeOut(200)
            } else {
                openBtn.addClass('opened')
                shopList.fadeIn(200).css({'display':'flex'})
            }
        })
        .on('click', '.js-shop-card', function(event) {
            event.preventDefault();
            
            var shopCard = $(this)
            var imageSrc;
            var shopLink = shopCard.data('shop-link')
            var shopCurrentImage = $('.js-shop-current-image')
            var shopCurrentLink = $('.js-shop-current-link')


            window.innerWidth > 800 ? imageSrc = shopCard.data('desc-src') : imageSrc = shopCard.data('mobile-src')

            shopCurrentImage.attr('src', imageSrc)
            shopCurrentLink.attr('href', shopLink)

            $('.js-shop-btn-open').click()
        })
        .on('click', '.js-account-form-btn', function() {
            var formBtn = $(this);
            var form = formBtn.parents('form');
            var inputs = form.find('input:disabled');

            inputs.each((idx, elem) => $(elem).attr('disabled', false))
            formBtn.html('Сохранить')
            setTimeout(() => { formBtn.attr('type', 'submit') }, 0)
            
        })


        
})


