var main = function() {
	/*make menu appear*/
	$('.icon-menu span').click(function(){
		var menuPosition = $('.menu').left;
		if(menuPosition === "-285px"){
			$('.menu').animate({
				left: "0px"
			}, 400);
		}
		else {
			$('.menu').animate({
				left: "-285px"
			}, 400);
		}
	});
	/*$('.content').click(function(){
		$(this).animate({
			
		},200);
	}); TO FIGURE OUT ONCE I HAVE INTERNET*/
};

$(document).ready(main);