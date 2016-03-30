var AppDispatcher = require('../AppDispatcher');
var MicroEvent = require('microevent');
var APP = require('../AppConstants');

///////////////////////////////////////////////

// Create new store
var TentaStore = function() {

  this.data = [];

  // Get all ingredients
  this.getGradeStats = function() {
    console.log('getGradeStats');
  }

  // Add new ingredient to list
  this.getCourseStats = function(courseName) {
    // TODO: Fetch stats
    TentaStore.trigger(APP.STATUS_FETCHING);

    setTimeout(function() {
    TentaStore.trigger(APP.STATUS_FETCHING_OFF);
      TentaStore.trigger(APP.EVENT_NEW_DATA);
    }, 1000);
  }

}

// Add pub/sub functionality
MicroEvent.mixin(TentaStore);
TentaStore = new TentaStore();

///////////////////////////////////////////////

// Dispatcher for TentaStore
AppDispatcher.register(function(payload) {

  switch(payload.eventName) {

    // Get course stats from API
    case APP.ACTION_GET_STATS:
      TentaStore.getCourseStats(payload.data.courseName);
      break;

  }

  return true;

});

///////////////////////////////////////////////

module.exports = TentaStore;
