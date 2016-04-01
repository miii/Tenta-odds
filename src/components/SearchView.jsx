var React = require('react');
var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

var SearchBox = require('./SearchBox.jsx');

// Jquery
global.jQuery = $ = require('jquery');
require('../local-js/jquery.toast.js');

var SearchView = React.createClass({
  getInitialState: function() {
    return {
      isLoading: false
    };
  },
  componentDidMount: function() {
    var self = this;
    // Bind method to changes in store
    TentaStore.bind(APP.STATUS_FETCHING, function() {
      self.setState({ isLoading: true });
    });
    TentaStore.bind(APP.STATUS_FETCHING_OFF, function() {
      self.setState({ isLoading: false });
    });
    TentaStore.bind(APP.STATUS_ERROR_OCCURED, this.onError);
  },
  render: function() {
    if (this.state.isLoading)
      return (<img id="loading" src="images/ring.svg" alt="Loading" />);
    else
      return (<SearchBox university="LiU" />);
  },

  onError: function() {
    var message;

    switch(TentaStore.getErrorCode()) {
      case 0:
        message = 'Attans! En bugg har smugit sig i koden';
        break;
      case 1:
        message = 'Ingen kurs hittad med den sökta kurskoden';
        break;
      case 2:
        message = 'Ingen tentamen hittad';
        break;
    }

    $.makeToast(message);
  }
});

module.exports = SearchView;
