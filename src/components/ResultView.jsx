var React = require('react');

var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

var ResultHighlight = require('./ResultHighlight.jsx');
var ResultExamResults = require('./ResultExamResults.jsx');
var ResultFooter = require('./ResultFooter.jsx');

var ResultView = React.createClass({
  courseData: {},
  componentWillMount: function() {
    this.courseData.name = TentaStore.getCourseName();
    this.courseData.code = TentaStore.getCourseCode();
    this.courseData.hp = TentaStore.getCourseHP();
    this.courseData.grades = TentaStore.getCourseGradePercentage();

    window.courseCode = TentaStore.getCourseCode();
    document.title = "Kursstatistik för " + this.courseData.name + " (" + this.courseData.code + ") på LiU";
    $("meta[property='og\\:title']").attr("content", document.title);
  },
  render: function () {
    return (
      <section id="ResultView">
        <ResultHighlight
          courseName={this.courseData.name}
          courseCode={this.courseData.code}
          courseHP={this.courseData.hp}
          gradeU={this.courseData.grades.gradeU}
          grade3={this.courseData.grades.grade3}
          grade4={this.courseData.grades.grade4}
          grade5={this.courseData.grades.grade5}
        />
        <ResultExamResults />
        <ResultFooter />
      </section>
    );
  }
});

module.exports = ResultView;
