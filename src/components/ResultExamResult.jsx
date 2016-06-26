var React = require('react');

var ResultExamResult = React.createClass({
  grades: [],
  componentWillMount: function() {
    var total = 0;
    total += parseInt(this.props.gradeU);
    total += parseInt(this.props.grade3);
    total += parseInt(this.props.grade4);
    total += parseInt(this.props.grade5);

    this.grades.gradeU = Math.round(100 * this.props.gradeU / total);
    this.grades.grade3 = Math.round(100 * this.props.grade3 / total);
    this.grades.grade4 = Math.round(100 * this.props.grade4 / total);
    this.grades.grade5 = Math.round(100 * this.props.grade5 / total);

    var totalPercentage = this.grades.gradeU + this.grades.grade3 + this.grades.grade4 + this.grades.grade5;
    if (totalPercentage != 100)
      this.grades.gradeU += 100 - totalPercentage;
  },
  render: function() {

    if (this.props.hp == 0) {
      var icon = (<i title="Frivilligt kursmoment" className="examicon material-icons circle examicontext">fri</i>);
      var classNames = "collection-item avatar minorexam";
    } else {
      if (this.props.retry == -1)
        var icon = (<i title="Kursmoment" className="examicon material-icons circle">done</i>);
      else if (this.props.retry == 0)
        var icon = (<i title="Kursens huvudsakliga examination" className="examicon material-icons circle">star</i>);
      else
        var icon = (<i title="Omtentamen" className="examicon material-icons circle">replay</i>);

      var classNames = "collection-item avatar";
    }

    var participants = this.props.participants > 1 ? this.props.participants + ' personer' : this.props.participants + ' person';

    if (this.props.hp == 0) {
      var gradeTags = (<div className="tags"></div>);
    } else if (this.grades.grade4 + this.grades.grade5 > 0) {
      var titles = {
        gradeU: this.props.gradeU + ' person(er) fick betyget U',
        grade3: this.props.grade3 + ' person(er) fick betyget 3/G/D',
        grade4: this.props.grade4 + ' person(er) fick betyget 4',
        grade5: this.props.grade5 + ' person(er) fick betyget 5'
      }
      var gradeTags = (
        <div className="tags">
          <span title={titles.grade5} className="tag green darken-2">{this.grades.grade5}%</span>
          <span title={titles.grade4} className="tag green">{this.grades.grade4}%</span>
          <span title={titles.grade3} className="tag light-green">{this.grades.grade3}%</span>
          <span title={titles.gradeU} className="tag red lighten-1">{this.grades.gradeU}%</span>

        </div>
      );
    } else {
      var titles = {
        gradeU: this.props.gradeU + ' person(er) fick betyget U',
        grade3: this.props.grade3 + ' person(er) fick betyget 3/G/D'
      }
      var gradeTags = (
        <div className="tags">
          <span title={titles.grade3} className="tag light-green">{this.grades.grade3}%</span>
          <span title={titles.gradeU} className="tag red lighten-1">{this.grades.gradeU}%</span>
        </div>
      );
    }

    return (
      <li data-examid={this.props.examId} data-examtype={this.props.examType} onClick={this.props.onExamClick.bind(null, this.props.examId)} className={classNames}>
        {icon}
        <span className="title">{this.props.datestring}</span>
        <p>
          {this.props.examCode}: {this.props.type} ({this.props.hp} HP)<br />
          {participants}
        </p>
        <div className="secondary-content">
          {gradeTags}
        </div>
      </li>
    );
  }
});

module.exports = ResultExamResult;
