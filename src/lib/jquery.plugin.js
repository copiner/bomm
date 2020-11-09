/**
 * @author wdaonngg
 * 封装jquery ajax请求
 */
$.extend({
    commonAjax: function (options){
        var url = options.url;

        if (!url) {
            return false;
        }

        options.url = url + '?date='+new Date().getTime();

        var defaults = {
            type: 'POST',
            contentType:"application/json",
            dataType: 'json',
            cache: false
        };
        var settings = $.extend(defaults, options);
        settings.success =  function (re, textStatus, xhr){
            options.success(re);
        };
        settings.error = function (xhr, status, handler){
            if(options.error) {
                options.error();
            }
        };
        $.ajax(settings);
    }
});
