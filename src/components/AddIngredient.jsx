var React = require('react');
var AppDispatcher = require('../flux/AppDispatcher');
var APP = require('../flux/AppConstants');

var AddIngredient = React.createClass({
  render: function() {
    return (
      <button onClick={this.addItem}>Lägg till</button>
    );
  },
  addItem: function() {
    var ingredient = window.prompt("Lägg till ingrediens","");
    if (ingredient != null) {
      // Dispatch an event (handled by the store)
      AppDispatcher.dispatch({
        eventName: APP.ACTION_ADD_ITEM,
        data: {
          name: ingredient
        }
      });
    }
  }
});

module.exports = AddIngredient;
