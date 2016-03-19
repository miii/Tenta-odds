var React = require('react');

var Ingredient = React.createClass({
  render: function() {
      return (
        <li>
          <h4>{this.props.name}</h4>
        </li>
      );
  }
});

module.exports = Ingredient;
