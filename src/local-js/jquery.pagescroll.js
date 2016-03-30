/* Plugin by Jacob Andersson (http://jacob-andersson.com) */

(function ($) {

  var pageScrollElements = [];
  var currentPageIndex = 0;

  $.fn.pagescroll = function (options, callback) {

    var settings = $.extend({
      duration: 800,
      disable: false,
      start: 0
    }, options);

    if (settings.disable) {
      return this.each(function () {
        for (i = 0; i < pageScrollElements.length; i++)
          if (pageScrollElements[i] == this) {
            pageScrollElements.splice(i, 1);
          }
      });
    }

    function animateToPage(pageIndex) {
      $('body').stop().animate({
        scrollTop: $(pageScrollElements[pageIndex]).offset().top
      }, settings.duration, function() {
        if (callback)
          callback.apply(null, [pageIndex]);
      });
    }

    $('body').on('wheel', function(e) {
      var direction = e.originalEvent.deltaY;
      var totalPages = pageScrollElements.length;

      // Scroll up
      if (direction < 0 && currentPageIndex > 0) {
        currentPageIndex--;
        animateToPage(currentPageIndex);
      // Scroll down
      } else if (direction > 0 && currentPageIndex < totalPages - 1) {
        currentPageIndex++;
        animateToPage(currentPageIndex);
      }

      return false;
    });

    return this.each(function () {
      pageScrollElements.push(this);

      currentPageIndex = settings.start;
      if (this == pageScrollElements[currentPageIndex]) {
        animateToPage(currentPageIndex);
      }
    });

  }

}(jQuery));
