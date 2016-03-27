/* Plugin by Jacob Andersson (http://jacob-andersson.com) */

(function ($) {

  $.fn.tentachart = function (options) {

    var settings = $.extend({
      percent: -1,
      radius: 70,
      delay: 1500
    }, options);

    return this.each(function () {

      var chartSVG = $(this).find('.chartSVG')[0];

      if (!chartSVG) {
        $(this).append(
          '<svg ' +
            'class="chartSVG" ' +
            'width="100%" ' +
            'height="100%" ' +
            'style="padding: 30px 0"' +
            'data-speed="' + settings.speed + '"' +
            'data-radius="' + settings.radius + '"' +
          '>' +
            '<circle cx="50%" cy="50%" r="' + settings.radius + '" class="TentaChartBackground" />' +
            '<circle ' +
              'cx="50%" ' +
              'cy="50%" ' +
              'r="' + settings.radius + '" ' +
              'class="TentaChartForeground" ' +
              'stroke-dasharray="0, 2000" ' +
              'style="transform: rotate(-90deg); transform-origin: center center"/>' +
            '<text text-anchor="middle" x="50%" y="55%" style="letter-spacing: 0" class="TentaChartText">0%</text>' +
          '</svg>'
        );
      } else {
        settings.speed =  $(chartSVG).attr('data-speed') || settings.speed;
        settings.radius = $(chartSVG).attr('data-radius') || settings.radius;
      }

      var svg = $(this);
      var circle = $(this).find('circle.TentaChartForeground');
      var text = $(this).find('text.TentaChartText');

      var percent = settings.percent < 0 ? (parseInt(svg.attr('data-percent')) || 0) : settings.percent;
      var percentFrom = parseInt(svg.attr('data-percent-atm')) || 0;
      var percentTo = settings.percent < 0 ? (parseInt(svg.attr('data-percent')) || 0) : settings.percent;
      var step = (percentTo - percentFrom) / (60 / 1000 * settings.delay);

      var percentProgress = percentFrom;
      TentaChartRender();

      function TentaChartRender() {
        if (Math.abs(percentProgress - percentTo) > Math.abs(step / 2))
          percentProgress += step;
        else
          return svg.attr('data-percent-atm', percentTo);

        requestAnimationFrame(TentaChartRender);

        var angle = (Math.PI * 2 * settings.radius) * percentProgress / 100;
        circle.attr('stroke-dasharray',  angle + ', 20000');
        svg.attr('data-percent-atm', percentProgress);
        text.text(Math.round(percentProgress) + '%');

      }
    });

  }

}(jQuery));
