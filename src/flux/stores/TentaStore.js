var AppDispatcher = require('../AppDispatcher');
var MicroEvent = require('microevent');
var APP = require('../AppConstants');

///////////////////////////////////////////////

// Create new store
var TentaStore = function() {

  this.data = [];
  this.errorCode = -1;
  this.timestamp = null;

  window.addEventListener('popstate', function(page) {
    if (page.state == null || page.state.data == null) {
      window.courseCode = '';
      TentaStore.trigger(APP.EVENT_NO_DATA);
    } else {
      window.courseCode = page.state.data.code;
      TentaStore.trigger(APP.EVENT_NEW_DATA);
    }
  });

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

  this.getCourseExams = function() {
    return this.data.exams;
  }

  this.getCourseExamType = function(index) {
    return this.data.examtypes[index].name;
  }

  this.getCourseExamCode = function(index) {
    return this.data.examtypes[index].code;
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
      string = 'för ' + Math.round(timediff / 3600) + ' timmar sedan';
    else if (timediff < 146880) // ~1.7 days
      string = 'för 1 dag sedan';
    else
      string = 'för ' + Math.round(timediff / 86400) + ' dagar sedan';

    return string;
  }

  this.getCourseGradePercentage = function() {
    var grades = {
      'gradeU': 0,
      'grade3': 0,
      'grade4': 0,
      'grade5': 0
    };

    for (i = 0; i < this.data.exams.length; i++) {
      var exam = this.data.exams[i];

      if (typeof exam.retry == "undefined" || exam.retry)
        continue;

      grades.gradeU += exam.grades.gradeU;
      grades.grade3 += exam.grades.grade3;
      grades.grade4 += exam.grades.grade4;
      grades.grade5 += exam.grades.grade5;
    }

    return grades;
  }

  // Fetch course data from API
  this.getDataFromAPI = function(courseCode) {
    TentaStore.trigger(APP.STATUS_FETCHING);

    $.ajax({
      type: 'POST',
      url: 'api/exams.php',
      data: {'course': courseCode},
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

        window.history.pushState({data: TentaStore.data}, 'Tentaresultat för ' + courseCode, courseCode);

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
