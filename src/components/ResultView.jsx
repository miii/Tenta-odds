var React = require('react');
var AppDispatcher = require('../flux/AppDispatcher');
var APP = require('../flux/AppConstants');

var ResultView = React.createClass({
  render: function () {
    var classNames = "view " + this.props.difficulty;
    return (
      <div id="ResultView" className={classNames}>
        <div id="Result">
          <h1>{this.props.course} <span className="hp">{this.props.hp} HP</span></h1>
          <div className="ResultCol">
            <h2>U</h2>
            <div className="circle" data-percent={this.props.gradeU}></div>
          </div>
          <div className="ResultCol">
            <h2>3</h2>
            <div className="circle" data-percent={this.props.grade3}></div>
          </div>
          <div className="ResultCol">
            <h2>4</h2>
            <div className="circle" data-percent={this.props.grade4}></div>
          </div>
          <div className="ResultCol">
            <h2>5</h2>
            <div className="circle" data-percent={this.props.grade5}></div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ResultView;
