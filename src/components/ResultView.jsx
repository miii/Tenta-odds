var React = require('react');
var AppDispatcher = require('../flux/AppDispatcher');
var APP = require('../flux/AppConstants');

var ResultView = React.createClass({
  render: function () {
    var classNames = "view " + this.props.difficulty;

    // If custom grades (U/3)
    if (this.props.grade4 + this.props.grade5 < 1) {
      var cols = (
        <div className="overflowfix customgrades">
          <div className="ResultCol">
            <h2>U</h2>
            <div className="circle" data-percent={this.props.gradeU} data-percent-last={this.props.lastGradeU}></div>
          </div>
          <div className="ResultCol">
            <h2>3</h2>
            <div className="circle" data-percent={this.props.grade3} data-percent-last={this.props.lastGrade3}></div>
          </div>
        </div>
      );

    // If not custom grades (U/3/4/5)
    } else {
      var cols = (
        <div className="overflowfix">
          <div className="ResultCol">
            <h2>U</h2>
            <div className="circle" data-percent={this.props.gradeU} data-percent-last={this.props.lastGradeU}></div>
          </div>
          <div className="ResultCol">
            <h2>3</h2>
            <div className="circle" data-percent={this.props.grade3} data-percent-last={this.props.lastGrade3}></div>
          </div>
          <div className="ResultCol">
            <h2>4</h2>
            <div className="circle" data-percent={this.props.grade4} data-percent-last={this.props.lastGrade4}></div>
          </div>
          <div className="ResultCol">
            <h2>5</h2>
            <div className="circle" data-percent={this.props.grade5} data-percent-last={this.props.lastGrade5}></div>
          </div>
        </div>
      );
    }

    return (
      <div id="ResultView" className={classNames}>
        <div id="Result">
          <h3>{this.props.courseCode} - {this.props.courseHP} HP</h3>
          <h1>{this.props.courseName}</h1>
          {cols}
          <h4>
            Senast uppdaterad {this.props.updated}<br />
            Omtentor är exkluderade från statistiken
            {/*<a href="#">Inkludera omtentor</a> - <a href="#">Rapportera bugg</a>*/}
          </h4>
        </div>
      </div>
    );
  }
});

module.exports = ResultView;
