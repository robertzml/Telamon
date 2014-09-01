
var telamon = function () { 
	
	
	return {
		leftNavActive: function($dom) {
					
			var parent = $dom.parent();
			parent.addClass('active');
			
			var li = $dom.closest('li.left-nav-first');
			li.addClass('active open');
			li.find('a').append('<span class="selected"></span>');
			li.find('.arrow').addClass('open');
		}
	}

}();