var React = require('react');
var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

// Jquery
global.jQuery = $ = require('jquery');
require('../local-js/jquery.pagescroll.js');
require('../local-js/jquery.tentachart.js');

var ResultView = require('./ResultView.jsx');

var Results = React.createClass({
  getInitialState: function() {
    return {
      visible: false
    };
  },
  componentWillUpdate: function() {
    if (this.state.visible)
      $('.view').pagescroll({
        disable: true
      });
  },
  componentDidUpdate: function() {
    if (this.state.visible) {
      $('.circle').tentachart({
        reset: true
      });

      $('.view').pagescroll({
        start: 1
      }, function(index) {
        $('.circle').tentachart();
      });
    }
  },
  componentDidMount: function() {
    // Bind method to changes in store
    TentaStore.bind(APP.EVENT_NEW_DATA, this.setResult);
    TentaStore.bind(APP.STATUS_FETCHING, this.hideResult);
  },
  componentWillUnmount: function() {
    // Bind method to changes in store
    TentaStore.unbind(APP.EVENT_NEW_DATA, this.setResult);
    TentaStore.unbind(APP.STATUS_FETCHING, this.hideResult);
  },
  render: function() {
    if (this.state.visible) {

      return (
        <ResultView
          course="Vektoranalys"
          hp="6"
          difficulty="hard"
          gradeU="55"
          grade3="20"
          grade4="15"
          grade5="10" />
      );

    }
    return false;
  },

  setResult: function() {
    this.setState({
      visible: true
    });
  },
  hideResult: function() {
    this.setState({
      visible: false
    })
  },
});

module.exports = Results;
