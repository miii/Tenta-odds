var React = require('react');

var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

var ResultExamResult = require('./ResultExamResult.jsx');

var ResultExamResults = React.createClass({
  getInitialState: function() {
    return {
      showMinorExams: true
    };
  },

  exams: [],
  examResults: null,
  minorExamExists: false,

  componentWillMount: function() {
    var exams = TentaStore.getCourseExams();
    var data = [];
    var year = null;

    this.exams = [];

    for (i = 0, j = -1; i < exams.length; i++) {
      if (year != exams[i].year) {
        year = exams[i].year;
        j++;
      }

      // July+ = 1, June- = 0
      var ay = (new Date(exams[i].time * 1000)).getMonth() > 5 ? 0 : 1;

      if (this.exams.length == j)
        this.exams[j] = {
          year: exams[i].year,
          exams: []
        };

      if (typeof this.exams[j].exams[ay] == "undefined")
        this.exams[j].exams[ay] = [];

      this.exams[j].exams[ay].push(exams[i]);
    }

    var self = this;
    var i = -1;

    this.examResults = this.exams.map(function(years) {
      var examsAyNodes = years.exams.map(function(ay) {
        var examsNodes = ay.map(function(exam) {
          var type = TentaStore.getCourseExamType(exam.examtype);
          var examCode = TentaStore.getCourseExamCode(exam.examtype);
          var retry = typeof exam.retry == "undefined" ? -1 : exam.retry;

          i++;

          if (exam.hp == 0)
            self.minorExamExists = true;

          return (
            <ResultExamResult
              type={type}
              examCode={examCode}
              examType={exam.examtype}
              key={i}
              examId={i}
              hp={exam.hp}
              participants={exam.participants}
              year={exam.year}
              datestring={exam.datestring}
              gradeU={exam.grades.gradeU}
              grade3={exam.grades.grade3}
              grade4={exam.grades.grade4}
              grade5={exam.grades.grade5}
              retry={retry}
              onExamClick={self.onExamClick} />
          );
        });

        i++;

        return (
          <ul key={i} className="collection" data-collapsible="accordion">
            {examsNodes}
          </ul>
        );
      });

      i++;

      return (
        <div key={i} className="ResultExamResults">
          <h5>{years.year}</h5>
          <div className="row">
            <div className="col s12">
              {examsAyNodes}
            </div>
          </div>
        </div>
      );
    });
  },
  render: function() {
    if (this.minorExamExists) {
      if (this.state.showMinorExams) {
        var examToggler = (
          <a
            id="includetests"
            className="right includetests"
            onClick={this.hideMinorExams}
          >
            Dölj frivilliga kursmoment
          </a>
        );
      } else {
        var examToggler = (
          <a
            id="includetests"
            className="right includetests"
            onClick={this.showMinorExams}
          >
            Visa samtliga kursmoment
          </a>
        );
      }
    } else {
      var examToggler = '';
    }

    return (
      <section id="ResultExamResults">
        {examToggler}
        {this.examResults}
      </section>
    );
  },
  hideMinorExams: function() {
    $('.minorexam').hide();
    this.setState({
      showMinorExams: false
    });
  },
  showMinorExams: function() {
    $('.minorexam').show();
    this.setState({
      showMinorExams: true
    });
  },
  onExamClick: function(i) {
    var examtype = $('li[data-examid=' + i + ']').attr('data-examtype');

    if (this.highlightExamType == null || examtype != this.highlightExamType) {
      this.highlightExamType = examtype;

      $('li').css('opacity', 0.3);
      $('li[data-examtype=' + examtype + ']').css('opacity', 1);
    } else {
      this.highlightExamType = null;

      $('li').css('opacity', 1);
    }
  }
});

module.exports = ResultExamResults;
