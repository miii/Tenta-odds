/* Plugin by Jacob Andersson (http://jacob-andersson.com) */

(function ($) {

  var toastTimeout;

  $.makeToast = function (text, options) {

    var settings = $.extend({
      delay: 3500
    }, options);

    $('#toast_message').hide();
    clearTimeout(toastTimeout);

    $('#toast_message').text(text).fadeIn('slow');

    toastTimeout = setTimeout(function() {
      $('#toast_message').fadeOut('slow', function() {
        $(this).text('');
      });
    }, settings.delay);

  }

}(jQuery));
