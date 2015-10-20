(function($) {

    $.ajax({
        url: '/getFeature.json',
        //type: 'post',
        //dataType: 'json'
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
    }).done(function(result) {
        var $ol = $('ol');
        $.each(result.feature, function(index, value) {
            $ol.append('<li>' + value + '</li>');
        });
    }).fail(function(xhr) {
        console.log(xhr);
    });

})(jQuery);
