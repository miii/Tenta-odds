var React = require('react');
var ReactDOM = require('react-dom');

var SearchView = require('./components/SearchView.jsx');
var Results = require('./components/Results.jsx');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <div id="SearchView" className="view">
          <SearchView />
        </div>
        <Results />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
