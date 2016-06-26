var React = require('react');
var ReactDOM = require('react-dom');

var AppDispatcher = require('./flux/AppDispatcher');
var TentaStore = require('./flux/stores/TentaStore');
var APP = require('./flux/AppConstants');

var SearchView = require('./components/SearchView.jsx');
var ResultView = require('./components/ResultView.jsx');

var App = React.createClass({
  getInitialState: function() {
    return {
      result: false
    };
  },
  componentDidMount: function() {
    var self = this;
    // Bind method to changes in store
    TentaStore.bind(APP.EVENT_NEW_DATA, function() {
      self.setState({ content: true });
    });
    TentaStore.bind(APP.EVENT_NO_DATA, function() {
      self.setState({ content: false });
    });

    if (window.courseCode.length > 0) {
      TentaStore.getDataFromAPI(window.courseCode);
    }
  },
  render: function() {
    if (!this.state.content) {
      return (
        <div id="app">
          <SearchView />
        </div>
      );
    } else {
      return (
        <div id="app">
          <ResultView />
        </div>
      );
    }
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
