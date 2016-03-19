var React = require('react');
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
