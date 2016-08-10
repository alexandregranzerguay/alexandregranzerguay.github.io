var main = function() {
	/*make menu appear*/
	$('.icon-menu span').click(function(){
		if($('.menu').hasClass("clsd")){
			$('.menu').animate({
				left: "0px"
			}, 400);
			$('.menu').removeClass("clsd");
			$('.menu').addClass("opened");
		}
		else {
			$('.menu').animate({
				left: "-285px"
			}, 400);
			$('.menu').removeClass("opened");
			$('.menu').addClass("clsd");
		}
	});
	$('.timeline .item').click(function(){
		if($(this).hasClass('current')){
			$('.item').removeClass('current');
			$('.timeline .item .description').hide('200');
		}
		else{
			$('.item').removeClass('current');
			$('.timeline .item .description').hide('200');
			$(this).addClass('current');
			$(this).children('.description').show('200');
			$('html, body').animate({
				scrollTop: $('.timeline .item .title').offset().top
			}, 1000);
		}
	});

};

$(document).ready(main);