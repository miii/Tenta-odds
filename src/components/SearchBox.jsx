var React = require('react');
var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

var SearchBox = React.createClass({
  getInitialState: function() {
    return {
      inputValue: ''
    };
  },
  render: function() {
    return (
      <div id="SearchBox">
        <h1>Sök tentamensresultat på {this.props.university}</h1>
        <form id="searchform" onSubmit={this.onSubmit}>
          <input type="text"
            placeholder="TNA001"
            pattern="[A-Za-z]{3}[0-9]{3}"
            onChange={this.onInputChange}
            value={this.inputValue}
            maxLength="6"
            spellCheck="false"
            autoFocus required />
        </form>
      </div>
    );
  },

  onInputChange: function(event) {
    this.setState({
      inputValue: event.target.value
    });
  },
  onSubmit: function(event) {
    event.preventDefault();
    AppDispatcher.dispatch({
      eventName: APP.ACTION_GET_STATS,
      data: {
        courseName: this.state.inputValue
      }
    });
  }
});

module.exports = SearchBox;
