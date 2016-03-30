var React = require('react');
var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

var SearchBox = require('./SearchBox.jsx');

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
  },
  render: function() {
    if (this.state.isLoading)
      return (<img id="loading" src="images/ring.svg" alt="Loading" />);
    else
      return (<SearchBox university="LiU" />);
  },
});

module.exports = SearchView;
