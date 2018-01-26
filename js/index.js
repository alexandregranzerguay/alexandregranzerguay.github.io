function animateScroll() {
    $.scrollify.next();
}

function animateStrikethroughON(newElem) {
    $(newElem).addClass('hover-class');
}

function animateStrikethroughOFF(oldElem) {
    oldElem.removeClass('hover-class');
}

function animateDivFadeOut($elem) {
    $elem.animate({
        opacity: 0,
    }, 1000, 'easeInOutCirc', () => {
        $elem.toggleClass('inview');
    });
}

function animateDivFadeIn($elem, opacityValue) {
    $elem.animate({
        opacity: opacityValue,
    }, 1000, 'easeInOutCirc', () => {
        $elem.toggleClass('inview');
    });
}

function animateItemOutView($allContainers) {
    $allContainers.animate({
        width: 0,
    }, 1000, 'easeInOutCirc', () => {
        $allContainers.toggleClass('inview');
    });
    animateStrikethroughOFF($('.item-text'));
}

function animateItemOnView($parentSection) {
    $childContainer = $parentSection.find('.content-box');
    animateStrikethroughON($parentSection.find('.item-text'));
    console.log($childContainer);
    $childContainer.animate({
        width: '80%',
    }, 1000, 'easeInOutCirc', () => {
        $childContainer.toggleClass('inview');
    });
}

function animateCurrentSection ($currentSection) {

}

function moveToSection($this) {
    $.scrollify.move($this)
}

function whatSectionIsInFocus($this) {
    console.log('Current Section in focus', $this)
}

$(document).ready(() => {
    $.scrollify.move('#home');
    // $(window).scroll(() => {
    //     distance = $(window).scrollTop();    
    // });
});

// Scrolling Settings
$.scrollify({
    section: '.panel',
    sectionName: "section-name",
    interstitialSection: '.top',
    easing: 'easeOutExpo',
    scrollSpeed: 1100,
    // offset : 0,
    scrollbars: true,
    standardScrollElements: '',
    // setHeights: true,
    // overflowScroll: true,
    updateHash: true,
    touchScroll: true,
    before() {
        whatSectionIsInFocus($.scrollify.current()[0]['dataset']['sectionName']=='home')
    },
    // after:function() {

    // },
    // afterResize:function() {},
    // afterRender:function() {}
});