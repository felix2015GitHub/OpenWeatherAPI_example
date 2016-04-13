(function($) {

	function addNewElement(target, newDom, style, title) {
		$(target).append('<div id="'+newDom+'" class="'+style+'">'+title+'</div>');
	}

    $.fn.extend({
        TabController: function(newDom, style, title) {
             addNewElement(this, newDom, style, title);
        }
     });

})(jQuery);