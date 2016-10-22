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
	width_timeline = $('.timeline-jumbotron').width();
	console.log(width_timeline);
	if(width_timeline<= 1000){
			$('.timeline-jumbotron').find('.item').addClass('itemsmall');
			$('.timeline-jumbotron').find('.timeline').addClass('groupsmall').addClass('smalltime');
			$('.timeline-jumbotron').find('.itemsmall').removeClass('item');
			$('.timeline-jumbotron').find('.smalltime').removeClass('group').removeClass('timeline');
		}
		else {
			$('.timeline-jumbotron').find('.itemsmall').addClass('item');
			$('.timeline-jumbotron').find('.smalltime').addClass('group').addClass('timeline');
			$('.timeline-jumbotron').find('.item').removeClass('itemsmall');
			$('.timeline-jumbotron').find('.timeline').removeClass('groupsmall').removeClass('smalltime');
		}
	$(window).resize(function(){
		width_timeline = $('.timeline-jumbotron').width();
		console.log(width_timeline);
		if(width_timeline<= 1000){
			$('.timeline-jumbotron').find('.item').addClass('itemsmall');
			$('.timeline-jumbotron').find('.timeline').addClass('groupsmall').addClass('smalltime');
			$('.timeline-jumbotron').find('.itemsmall').removeClass('item');
			$('.timeline-jumbotron').find('.smalltime').removeClass('group').removeClass('timeline');
		}
		else {
			$('.timeline-jumbotron').find('.itemsmall').addClass('item');
			$('.timeline-jumbotron').find('.smalltime').addClass('group').addClass('timeline');
			$('.timeline-jumbotron').find('.item').removeClass('itemsmall');
			$('.timeline-jumbotron').find('.timeline').removeClass('groupsmall').removeClass('smalltime');
		}
	});
	relativesize = $('.contact').width()*0.03;
		if (relativesize>=36) {
			relativesize = 36;
		}
	console.log(relativesize);
	$('.contact .email').css('font-size', relativesize);
	$(window).resize(function(){
		relativesize = $('.contact').width()*0.03;
		if (relativesize>=36) {
			relativesize = 36;
		}
		console.log(relativesize);
		$('.contact .email').css('font-size', relativesize);
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
		}
	});
	$('.smalltime .itemsmall').click(function(){
		if($(this).hasClass('current')){
			$('.itemsmall').removeClass('current');
			$('.smalltime .itemsmall .description').hide('200');
		}
		else{
			$('.itemsmall').removeClass('current');
			$('.smalltime .itemsmall .description').hide('200');
			$(this).addClass('current');
			$(this).children('.description').show('200');
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
		$('.menu').animate({
				left: "-285px"
		}, 400);
		$('.menu').removeClass("opened");
		$('.menu').addClass("clsd");
	});
	$('.menu .item2').click(function(){
		$('html, body').animate({
				scrollTop: $('.timeline-jumbotron').offset().top
		}, 1000);
		$('.menu').animate({
				left: "-285px"
		}, 400);
		$('.menu').removeClass("opened");
		$('.menu').addClass("clsd");
	});
	$('.menu .item3').click(function(){
		$('html, body').animate({
				scrollTop: $('.skills').offset().top
		}, 1000);
		$('.menu').animate({
				left: "-285px"
		}, 400);
		$('.menu').removeClass("opened");
		$('.menu').addClass("clsd");
	});
	$('.menu .item4').click(function(){
		$('html, body').animate({
				scrollTop: $('.contact').offset().top
		}, 1000);
		$('.menu').animate({
				left: "-285px"
		}, 400);
		$('.menu').removeClass("opened");
		$('.menu').addClass("clsd");
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
  	var cssPercent = 60 ;
	var javaPercent = 35 ;
	var htmlPercent = 75 ;
	var rubyPercent = 15 ;
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
	if ($element.hasClass('in-view') && $element.hasClass('css')){
		var progressBarWidth1 = cssPercent;
		$element.animate({ width: progressBarWidth1 +"%" }, 750);
		$('<p/>').addClass('inner-percent').appendTo($element).text(cssPercent + '%');
	}
	if ($element.hasClass('in-view') && $element.hasClass('html')){
		var progressBarWidth2 = htmlPercent;
		$element.animate({ width: progressBarWidth2 +"%" }, 750);
		$('<p/>').addClass('inner-percent').appendTo($element).text(htmlPercent + '%');
	}
	if ($element.hasClass('in-view') && $element.hasClass('javascript')){
		var progressBarWidth3 = javaPercent;
		$element.animate({ width: progressBarWidth3 +"%" }, 750);
		$('<p/>').addClass('inner-percent').appendTo($element).text(javaPercent + '%');
	}
	if ($element.hasClass('in-view') && $element.hasClass('ruby')){
		var progressBarWidth4 = rubyPercent;
		$element.animate({ width: progressBarWidth4 +"%" }, 750);
		$('<p/>').addClass('inner-percent').appendTo($element).text(rubyPercent + '%');
	}
  });
}

$(document).ready(main);