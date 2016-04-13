(function($) {

    $.fn.TabController = function( options ) {

        var settings = $.extend({
            text: '',
            newDom: '',
            style: ''
        }, options);

        return this.each( function() {
            $(this).append('<div id="'+settings.newDom+'" class="'+settings.style+'">'+settings.text+'</div>');
        });

    }

}(jQuery));