var React = require('react');
var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

// Jquery
global.jQuery = $ = require('jquery');
require('../local-js/jquery.pagescroll.js');
require('../local-js/jquery.tentachart.js');

var ResultView = require('./ResultView.jsx');

var Results = React.createClass({
  getInitialState: function() {
    return {
      visible: false
    };
  },
  componentWillUpdate: function() {
    if (this.state.visible)
      $('.view').pagescroll({
        disable: true
      });
  },
  componentDidUpdate: function() {
    if (this.state.visible) {
      $('.circle').tentachart({
        reset: true
      });

      $('.view').pagescroll({
        start: 1
      }, function(index) {
        if (index == 1)
          $('.circle').tentachart();

        if (index == 1 && !localStorage.UIExplained) {
          $.makeToast('<strong>Förklaring:</strong> Siffrorna gäller snittresultat respektive resultat från den senaste tentan', {
            delay: 10000
          });
          localStorage.UIExplained = true;
        }

      });
    }
  },
  componentDidMount: function() {
    // Bind method to changes in store
    TentaStore.bind(APP.EVENT_NEW_DATA, this.setResult);
    TentaStore.bind(APP.STATUS_FETCHING, this.hideResult);
  },
  componentWillUnmount: function() {
    // Bind method to changes in store
    TentaStore.unbind(APP.EVENT_NEW_DATA, this.setResult);
    TentaStore.unbind(APP.STATUS_FETCHING, this.hideResult);
  },
  render: function() {
    if (this.state.visible) {

      var courseCode = TentaStore.getCourseCode();
      var courseName = TentaStore.getCourseName();
      var courseHP = TentaStore.getCourseHP();
      var courseGradeData = TentaStore.getCourseGradeData();
      var lastCourseGradeData = TentaStore.getLastCourseGradeData();
      var updated = TentaStore.getLastUpdateString();

      return (
        <ResultView
          courseCode={courseCode}
          courseName={courseName}
          courseHP={courseHP}
          difficulty={courseGradeData.difficulty}
          gradeU={courseGradeData.U}
          grade3={courseGradeData.g3}
          grade4={courseGradeData.g4}
          grade5={courseGradeData.g5}
          lastGradeU={lastCourseGradeData.U}
          lastGrade3={lastCourseGradeData.g3}
          lastGrade4={lastCourseGradeData.g4}
          lastGrade5={lastCourseGradeData.g5}
          updated={updated} />
      );

    }
    return false;
  },

  setResult: function() {
    this.setState({
      visible: true
    });

    var uri = '/' + TentaStore.getCourseCode();
    console.log(uri);
    //ga('send', 'pageview', );
  },
  hideResult: function() {
    this.setState({
      visible: false
    })
  },
});

module.exports = Results;
