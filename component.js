/*
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
*/

var TabController = (function(){

    return {
        addElement : function( obj ){
            $(obj.srcDom).append('<'+obj.tag+' id="'+obj.newDom+'" class="'+obj.style+'">'+obj.text+'</'+obj.tag+'>');
        }

    };
    
}());