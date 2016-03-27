var $ = require('jquery');
global.jQuery = $;

require('./local-js/jquery.pagescroll.js');
require('./local-js/jquery.tentachart.js');

/*var React = require('react');
var ReactDOM = require('react-dom');

var List = require('./components/List.jsx');
var AddIngredient = require('./components/AddIngredient.jsx');

var App = React.createClass({
  render: function() {
    return (
      <div id="App">
        <List />
        <AddIngredient />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('container')
);

$(".circle").circliful({
  animationStep: 5,
  foregroundBorderWidth: 10,
  backgroundBorderWidth: 5,
  percent: 50,
  fontColor: '#222',
  foregroundColor: '#222',
  backgroundColor: '#FFF',
  textAdditionalCss: 'font-size: 20px; letter-spacing: 0'
});*/

$('.view').pagescroll({}, function(index) {
  $('.circle').tentachart();
});

$('.circle').tentachart({
  percent: 0
});

/*
function animateToPage(page) {
  $('body').stop().animate({
    scrollTop: $("*[data-page=" + page + "]").offset().top
  }, 800);
}

var currentPage = 1;
var totalPages = 2;
$('body').on('wheel', function(e) {
  var direction = e.originalEvent.deltaY;

  // Scroll up
  if (direction < 0 && currentPage > 1) {
    currentPage--;
    animateToPage(currentPage);
  } else if (direction > 0 && currentPage < totalPages) {
    currentPage++;
    animateToPage(currentPage);
  }

  return false;
});*/
