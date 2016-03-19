var AppDispatcher = require('../AppDispatcher');
var MicroEvent = require('microevent');
var APP = require('../AppConstants');

///////////////////////////////////////////////

// Create new store
var IngredientStore = function() {

  this.ingredients = [];

  // Get all ingredients
  this.getIngredients = function() {
    return this.ingredients;
  }

  // Add new ingredient to list
  this.addIngredient = function(ingredient) {
    // Push to array
    this.ingredients.push({
      name: ingredient,
      id: this.ingredients.length // React wants unique id
    });

    // Tell views to update
    this.trigger(APP.EVENT_LIST_CHANGED);
  }

}

// Add pub/sub functionality
MicroEvent.mixin(IngredientStore);
IngredientStore = new IngredientStore();

///////////////////////////////////////////////

// Dispatcher for IngredientStore
AppDispatcher.register(function(payload) {

  switch(payload.eventName) {

    // Add ingredient to list
    case APP.ACTION_ADD_ITEM:
      IngredientStore.addIngredient(payload.data.name);
      break;

  }

  return true;

});

///////////////////////////////////////////////

module.exports = IngredientStore;
