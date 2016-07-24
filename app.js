var main = function() {
	/*make menu appear*/
	$('.icon-menu span').click(function(){
		$('.menu').animate({
			left: "0px"
		}, 400);
		$(this).fadeOut(100);
	});
};

$(document).ready(main);