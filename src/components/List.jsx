var React = require('react');
var Ingredient = require('./Ingredient.jsx');
var IngredientStore = require('../flux/stores/IngredientStore');
var APP = require('../flux/AppConstants');

var List = React.createClass({
  // Define initial state
  getInitialState: function() {
    return {
      ingredients: []
    }
  },
  // Get all ingredients on load
  componentWillMount: function() {
    this.setState({
      ingredients: IngredientStore.getIngredients()
    });
  },
  componentDidMount: function() {
    // Bind method to changes in store
    IngredientStore.bind(APP.EVENT_LIST_CHANGED, this.getIngredients);
  },
  componentWillUnmount: function() {
    IngredientStore.unbind(APP.EVENT_LIST_CHANGED, this.getIngredients);
  },
  render: function() {
    // Loop through ingredients
    var ingredientsHTML = this.state.ingredients.map(function(ingredient) {
      return (
        <Ingredient name={ingredient.name} key={ingredient.id} />
      );
    });

    // Return list
    return (
      <ul>
        {ingredientsHTML}
      </ul>
    )
  },

  // Method called when the store is changed
  getIngredients: function() {
    // Update list in view
    this.setState({
      ingredients: IngredientStore.getIngredients()
    });
  }
});

module.exports = List;
