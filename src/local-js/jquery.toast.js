/* Plugin by Jacob Andersson (http://jacob-andersson.com) */

(function ($) {

  var toastTimeout;

  $.makeToast = function (text, options) {

    var settings = $.extend({
      delay: 3500
    }, options);

    $('#toast').hide();
    clearTimeout(toastTimeout);

    $('#toast_message').html(text);
    $('#toast').fadeIn('slow');

    toastTimeout = setTimeout(function() {
      $('#toast').fadeOut('slow', function() {
        $(this).hide();
        $(this).find('#toast_message').text('');
      });
    }, settings.delay);

  }

}(jQuery));
