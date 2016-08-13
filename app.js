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
	$('.border').click(function(){
		$('html, body').animate({
				scrollTop: $('.about-me').offset().top
		}, 1000);
	});
	$('.menu .item1').click(function(){
		$('html, body').animate({
				scrollTop: $('.about-me').offset().top
		}, 1000);
	});
	$('.menu .item2').click(function(){
		$('html, body').animate({
				scrollTop: $('.timeline-jumbotron').offset().top
		}, 1000);
	});
	$('.menu .item3').click(function(){
		$('html, body').animate({
				scrollTop: $('.skills').offset().top
		}, 1000);
	});
	var $animation_elements = $('.skills .progress');
	var $window = $(window);
	$window.on('scroll', check_if_in_view);
	$window.on('scroll resize', check_if_in_view);
	$window.trigger('scroll');
	
	$('textarea').blur(function () {
    $('#hire textarea').each(function () {
		$this = $(this);
		if ( this.value != '' ) {
			  $this.addClass('focused');
			}
		else {
			  $this.removeClass('focused');
		}
		});
	});

	$('#hire .field:first-child input').blur(function () {
		$('#hire .field:first-child input').each(function () {
			$this = $(this);
			if ( this.value != '' ) {
			  $this.addClass('focused');
			}
			else {
			  $this.removeClass('focused');
			}
		});
	});

	$('#hire .field:nth-child(2) input').blur(function () {
		$('#hire .field:nth-child(2) input').each(function () {
			$this = $(this);
			if ( this.value != '' ) {
			  $this.addClass('focused');
			}
			else {
			  $this.removeClass('focused');
			}
		});
	});
};

function check_if_in_view() {
  var $window = $(window);
  	var cssPercent = 75
	var javaPercent = 50
  var $animation_elements = $('.skills .progress');
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = (window_top_position + window_height);

  $.each($animation_elements, function() {
    var $element = $(this);
    var element_height = $element.outerHeight();
    var element_top_position = $element.offset().top;
    var element_bottom_position = (element_top_position + element_height);

    //check to see if this current container is within viewport
    if ((element_bottom_position >= window_top_position) &&
        (element_top_position <= window_bottom_position)) {
      $element.addClass('in-view');
    } else {
      $element.removeClass('in-view');
    }
	if ($animation_elements.hasClass('in-view')){
		var progressBarWidth = cssPercent;
		$animation_elements.animate({ width: progressBarWidth +"%" }, 750);
	}
  });
}

$(document).ready(main);