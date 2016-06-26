var React = require('react');

var SearchHeader = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="col s12 m6 offset-m3">
          <div id="SearchHeader">
            <img src="img/logo.png" id="logo" />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SearchHeader;
