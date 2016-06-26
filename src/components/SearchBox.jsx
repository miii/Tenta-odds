var React = require('react');
var ReactDOM = require('react-dom');

var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

var SearchBox = React.createClass({
  getInitialState: function() {
    return {
      inputValue: ''
    };
  },
  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.searchbox).focus();
  },
  render: function() {
    return (
      <div className="row">
        <div className="col s12 m6 offset-m3">
          <div id="SearchBox" className="card">
            <div className="card-content">
              <div className="row nomargin">
                <div className="col s8">
                  <div className="row nomargin">
                    <div className="input-field col s12">
                      <form id="searchform-main" onSubmit={this.onSubmit}>
                        <input
                          ref="searchbox"
                          placeholder="TNA001"
                          id="course"
                          type="search"
                          pattern="^[A-Za-z0-9]{6}$"
                          onChange={this.onInputChange}
                          value={this.state.inputValue}
                          maxLength="6"
                          minLength="6"
                          spellCheck="false"
                          required
                          autofocus />
                        <label htmlFor="course-main">Kurskod</label>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col s4">
                  <button
                    type="submit"
                    form="searchform-main"
                    id="searchsubmit-main"
                    className="btn-flat blue darker-2 waves-effect waves-light submit"
                    onClick={this.onSubmit}
                  >
                    <i className="material-icons">search</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  onInputChange: function(event) {
    $(event.target).removeClass('course-error');

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
    return false;
  }
});

module.exports = SearchBox;
