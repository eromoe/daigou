var Config = {
    Validation_Enabled: true,
    loadingPicUrl: '/media/img/loading.gif'
};


function setCommonFilterActiveByName(name) {
    var v = $.getParameterByName(name);
    if (!v)
        return;
    var filter = $('.filter-' + name);
    var cur = filter.find('li[' + name + '="' + v + '"]').addClass('active');
    filter.find('h4').text(cur.text())
}

function setAreaFilterActive() {
    var lid = $.getParameterByName('lid'),
        aid = $.getParameterByName('aid'),
        cur_area;
    if (lid) {
        var fl, fa;
        fl = $('.loc-btn[lid="' + lid + '"]');
        fl.addClass('active');
        var submenu = $('.filter-area .sub-menu');
        submenu.empty().append(fl.find('.areas').clone());
        if (aid) {
            fa = submenu.find('.area-btn[aid="' + aid + '"]').addClass('active');
        }
        cur_area = fa ? fa.text() : fl.find('span').text();
        $('.filter-area >h4').text(cur_area);
    }
}


function initSelectList() {
    var sl = $('.select-list'),
        sbtn = $('.sel-btn');
    sl.on('click', 'li', function (e) {
        $(this).toggleClass('checked');
    });
    sbtn.on('click', function (e) {
        var values = [];
        sl.find('li.checked').each(function (i) {
            values.push($(this).attr('value'));
        });
        if (values.length == 0) {
            swal('请至少选择一项。');
            return;
        }

        $.ajax({
            url: sbtn.attr('url'),
            type: 'post',
            data: {
                tid: sbtn.attr('tid'),
                values: values.join(',')
            },
            success: function (r) {
                switch (r.status) {
                    case 'OK':
                        swal({
                            title: "操作成功!",
                            type: 'success'
                        }, function () {
                            sl.find('li.checked').remove();
                            if (r.result.redirect)
                                window.location.href = r.result.redirect;
                        });
                        break;
                    case 'MaximumLimit':
                        swal("您已经拥有50个客户了，无法继续录入。");
                        break;
                    case 'AlreadyExit':
                        swal("此客户已在盘中！");
                        break;
                    case 'Error':
                        swal("提交失败！", r.msg);
                        break;
                    case 'InternalError':
                        swal("系统错误!", "", "error");
                        break;
                }
            },
            error: function () {
                swal('网络错误，请稍后再试。');
            }
        });
    });
}


$(function () {
    ClickEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

    $(document).on(ClickEvent, '.nav a').click(function(e){
        var that = $(this);
        if (that.hasClass('current')) {
            return;
        } else {
            that.parent().find('.current').removeClass('current');
            that.addClass('current');
            $('.main').children().hide();
            $(that.attr('for')).show();
        }
    })


    $(document).on(ClickEvent, '.form-line-input .seltab', function (e) {

        var that = $(this);
        var elem = that.parent();
        var ids = [];
        var input = elem.parent().find('input');
        var multiple = !!elem.attr('multiple');
        var limit = elem.attr('limit');
        limit = limit ? parseInt(limit) : 1;
        var active_tabs = elem.find('.active');

        if (multiple) {
            if (that.hasClass('active')) {
                active_tabs = active_tabs.not('[data-id="' + that.attr('data-id') + '"]');
            } else {
                active_tabs.push(that);
                if (active_tabs.length > limit) {
                    alert('不能超过' + limit + '个');
                    return;
                }
            }

            that.toggleClass('active');

            active_tabs.each(function (i) {
                ids.push(multiple ? $(this).text() : $(this).attr('data-id'));
            });

            input.val(ids.join(','));

        } else {
            var value;
            if (!that.hasClass('active')) {
                active_tabs.removeClass('active');
                value = that.attr('data-id');
            } else {
                value = '';
            }

            that.toggleClass('active');

            input.val(value);
        }

    });

    var on = $('.ap-apply').on('click', function (e) {
        var that = $(this);
        var item = that.closest('li');
        $.SimPost({
            url: that.attr('url'),
            success: function (r) {
                if (r.status == 'OK') {
                    swal({
                        title: "申请成功!",
                        type: 'success'
                    }, function () {
                        window.location.reload();
                    });
                } else if (r.status =='NotAllow') {
                    $.swcf('您还没有绑定银行卡，点击确定前往绑定。',function(){
                        window.location.href = '/bankcard/edit/';
                    });
                }
            }
        });
    });


    $('.ap-cancel').on('click', function (e) {
        e.stopPropagation();
        var that = $(this);
        var item = that.closest('li');
        $.swcf('确定要取消吗？', function () {
            $.SimPost({
                url: that.attr('url'),
                success: function (r) {
                    if (r.status == 'OK') {
                        swal({
                            title: "取消成功!",
                            type: 'success'
                        }, function () {
                            window.location.reload();
                        });
                    }
                }
            });
        });
    });


    function hideMask(){
        $('.filter-cover .mask').hide();
        $('html, body').attr('overflow', 'auto');
        $('.filter-cover').height('auto');
    }

    function showMask(){
        $('html, body').attr('overflow', 'hidden');
        $('.filter-cover').height(($(window).height() - 36 - 30) + 'px');
        $('.filter-cover .mask').show();
    }


    $(document).on(ClickEvent, '.filter-top .filter', function (e) {
        var $filter = $(this);
        var $pre_filer = $filter.parent().find('.filter.active');

        if ($pre_filer) {
            $pre_filer.removeClass('active');
            $pre_filer.find('.content').hide();
            hideMask();
        }

        if (!$pre_filer.is($filter)) {
            $filter.addClass('active');
            $filter.find('.content').show();
            showMask();
        }

    });


    $(document).on(ClickEvent, '.filter-cover .mask', function (e) {
        e.stopPropagation();
        $('.filter>.content').hide();
        $('.filter').removeClass('active');
        hideMask();
    });

    // mask
    $(document).on(ClickEvent, '.filter', function (e) {

    });

    $(document).on(ClickEvent, '.filter-area .main-menu li', function (e) {
        // 防止传到上层导致 filter menu被关闭
        e.stopPropagation()
        var that = $(this);
        var submenu = $('.filter-area .sub-menu');
        that.parent().children('li').removeClass('active');
        that.addClass('active');
        submenu.empty().append(that.find('.areas').clone());
    });

    $(document).on(ClickEvent, '.filter-area .area-btn', function (e) {
        var that = $(this);
        var lid = that.attr('lid');
        var aid = that.attr('aid');
        lid = lid ? lid : '';
        aid = aid ? aid : '';

        // url = window.location.href.replace(/\?[\W\w]*?$/,"")
        // url = window.location.origin + window.location.pathname;
        // url = url + '?lid=' + lid + '&aid=' + aid;
        url = $.updateQueryStrings({
            lid: lid,
            aid: aid
        });
        window.location.href = url;
    });


    $(document).on(ClickEvent, '.filter-common .fbtn', function (e) {
        var that = $(this);
        var tag = that.closest('.filter-common').attr('tag');
        // url = window.location.href.replace(/\?[\W\w]*?$/,"")
        // url = window.location.origin + window.location.pathname;
        // url = url + '?lid=' + lid + '&aid=' + aid;
        data = {};
        data[tag] = that.attr(tag) ? that.attr(tag) : '';
        url = $.updateQueryStrings(data);
        window.location.href = url;
    });


});
