var Config = {
    Validation_Enabled: true,
    loadingPicUrl: '/media/img/loading.gif'
};


$(function () {
    ClickEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

    $('.nav a').click(function(e){
        var that = $(this);
        if (that.hasClass('current')) {
            return;
        } else {
            that.parent().find('.current').removeClass('current');
            that.addClass('current');
            $('.main').children().hide();
            $(that.attr('for')).show();
            $('.btm-btn .cname').text(that.text());
            $('.btm-btn .tp').attr(that.attr('tp'));
        }
    });

    // 表单页是新的页面
    // $('.apply-btn').click(function(e){
    //     var tp = $(this).attr('tp');
    //     $('.form').show();
    //     $('.top-container').hide();
    //     $('.form input[tp]').val(tp);
    // });


    $('.help-msg').click(function(e){
        $('.front').hide();
        $('.top-container').show();
    });


});
