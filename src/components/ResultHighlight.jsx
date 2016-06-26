var React = require('react');

var ResultHighlightCard = require('./ResultHighlightCard.jsx');

var ResultHighlight = React.createClass({
  courseData: {},
  getInitialState: function() {
    return {
      disableAll: false
    }
  },
  componentWillMount: function() {
    this.courseData.name = this.props.courseName;
    this.courseData.code = this.props.courseCode;
    this.courseData.hp = this.props.courseHP;

    var total = 0;
    total += parseInt(this.props.gradeU);
    total += parseInt(this.props.grade3);
    total += parseInt(this.props.grade4);
    total += parseInt(this.props.grade5);

    if (total < 1)
      this.setState({
        disableAll: true
      });

    this.courseData.gradeU = Math.round(100 * this.props.gradeU / total);
    this.courseData.grade3 = Math.round(100 * this.props.grade3 / total);
    this.courseData.grade4 = Math.round(100 * this.props.grade4 / total);
    this.courseData.grade5 = Math.round(100 * this.props.grade5 / total);

    if (this.courseData.grade4 + this.courseData.grade5 > 0)
      this.passOnly = false;
    else
      this.passOnly = true;

    var totalPercentage = this.courseData.gradeU + this.courseData.grade3 + this.courseData.grade4 + this.courseData.grade5;
    if (totalPercentage != 100 && !this.disableAll) {
      if (this.courseData.gradeU < 1 && totalPercentage > 100)
        this.courseData.grade3 += 100 - totalPercentage;
      else
        this.courseData.gradeU += 100 - totalPercentage;
    }
  },
  render: function() {
    if (this.state.disableAll)
      return (
        <section id="ResultHighlight">
          <div className="row">
            <div className="col s12 center">
              <h2 id="courseTitle">{this.courseData.name}</h2>
              <h5 id="courseInfo">{this.courseData.code} - {this.courseData.hp} HP</h5>
            </div>
          </div>
        </section>
      );

    return (
      <section id="ResultHighlight">
        <div className="row">
          <div className="col s12 center">
            <h2 id="courseTitle">{this.courseData.name}</h2>
            <h5 id="courseInfo">{this.courseData.code} - {this.courseData.hp} HP</h5>
          </div>
        </div>
        <div className="row">
          <ResultHighlightCard
            gradeString="U"
            percentage={this.courseData.gradeU}
            color="red lighten-1"
            disabled={this.disableAll}
          />
          <ResultHighlightCard
            gradeString="3"
            percentage={this.courseData.grade3}
            color="light-green"
            disabled={this.disableAll}
          />
          <ResultHighlightCard
            gradeString="4"
            percentage={this.courseData.grade4}
            color="green"
            disabled={this.passOnly}
          />
          <ResultHighlightCard
            gradeString="5"
            percentage={this.courseData.grade5}
            color="red green darken-2"
            disabled={this.passOnly}
          />
        </div>
      </section>
    );
  }
});

module.exports = ResultHighlight;
