var AppDispatcher = require('../AppDispatcher');
var MicroEvent = require('microevent');
var APP = require('../AppConstants');

$ = require('jquery');

///////////////////////////////////////////////

// Create new store
var TentaStore = function() {

  this.data = [];
  this.errorCode = -1;
  this.timestamp = null;

  this.getErrorCode = function() {
    return this.errorCode;
  }

  this.getCourseCode = function() {
    return this.data.code;
  }

  this.getCourseName = function() {
    return this.data.name;
  }

  this.getCourseHP = function() {
    return this.data.hp;
  }

  this.getLastUpdateString = function() {
    var timediff = (Date.now() / 1000) - this.timestamp;
    var string = '';

    if (timediff < 30) // Recently
      string = 'nyss';
    else if (timediff < 100) // < ~1.7 minutes
      string = 'för 1 minut sedan';
    else if (timediff < 3000) // < 1 hour
      string = 'för ' + Math.round(timediff / 60) + ' minuter sedan';
    else if (timediff < 6100) // < ~1.7 hours
      string = '1 timme sedan';
    else if (timediff < 84600) // < 1 day
      string = 'för ' + Math.round(timediff / 86400) + ' timmar sedan';
    else if (timediff < 146880) // ~1.7 days
      string = 'för 1 dag sedan';
    else
      string = 'för ' + Math.round(timediff / 86400) + ' dagar sedan';

    return string;
  }

  this.getCourseGradeData = function() {
    var grades = {
      'U': 0,
      'g3': 0,
      'g4': 0,
      'g5': 0,
      'total': 0
    };

    for (i = 0; i < this.data.exams.length; i++) {
      var exam = this.data.exams[i];
      grades.U += exam.grades.U;
      grades.g3 += exam.grades[3];
      grades.g4 += exam.grades[4];
      grades.g5 += exam.grades[5];
      grades.total += exam.participants;
    }

    var data = {
      'U': Math.round(100 * grades.U / grades.total),
      'g3': Math.round(100 * grades.g3 / grades.total),
      'g4': Math.round(100 * grades.g4 / grades.total),
      'g5': Math.round(100 * grades.g5 / grades.total),
    }

    if (data.U > 50)
      data.difficulty = 'hard';
    else if (data.U > 40)
      data.difficulty = 'moderate';
    else
      data.difficulty = 'easy';

    return data;
  }

  this.getLastCourseGradeData = function() {
    var exam = this.data.exams[0];
    var grades = {
      'U': exam.grades.U,
      'g3': exam.grades[3],
      'g4': exam.grades[4],
      'g5': exam.grades[5],
      'total': exam.participants
    };

    var data = {
      'U': Math.round(100 * grades.U / grades.total),
      'g3': Math.round(100 * grades.g3 / grades.total),
      'g4': Math.round(100 * grades.g4 / grades.total),
      'g5': Math.round(100 * grades.g5 / grades.total),
    }

    return data;
  }

  // Fetch course data from API
  this.getDataFromAPI = function(courseName) {
    TentaStore.trigger(APP.STATUS_FETCHING);

    $.ajax({
      type: 'POST',
      url: 'api/exams.php',
      data: {'course': courseName},
      dataType: 'JSON',
      success: function(data) {

        TentaStore.trigger(APP.STATUS_FETCHING_OFF);

        if (!data.found) {
          TentaStore.errorCode = data.errorCode;
          TentaStore.trigger(APP.STATUS_ERROR_OCCURED);
          return;
        }

        TentaStore.data = data.result;
        TentaStore.timestamp = data.timestamp;
        TentaStore.trigger(APP.EVENT_NEW_DATA);
      },
      error: function(data) {
        console.log('Felaktig data från API: ', data.responseText);
        TentaStore.errorCode = 0;
        TentaStore.trigger(APP.STATUS_FETCHING_OFF);
        TentaStore.trigger(APP.STATUS_ERROR_OCCURED);
      }
    });
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
      TentaStore.getDataFromAPI(payload.data.courseName);
      break;

  }

  return true;

});

///////////////////////////////////////////////

module.exports = TentaStore;
