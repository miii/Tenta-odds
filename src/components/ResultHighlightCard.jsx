var React = require('react');

var ResultHighlightCard = React.createClass({
  color: null,
  componentWillMount: function() {
    this.color = 'circle ' + this.props.color;
  },
  render: function () {
    if (this.props.disabled == true)
      var className = "col m3 s6 center offset disablecard";
    else
      var className = "col m3 s6 center offset";

    return (
      <div className={className}>
        <div className="card">
          <div className="card-content">
            <span className="card-title">Betyg {this.props.gradeString}</span>
            <h4 className={this.color}>{this.props.percentage}%</h4>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ResultHighlightCard;
