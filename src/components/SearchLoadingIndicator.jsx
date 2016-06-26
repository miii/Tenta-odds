var React = require('react');
var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

var SearchLoadingIndicator = React.createClass({
  getInitialState: function() {
    return {
      isLoading: false
    }
  },
  componentDidMount: function() {
    var self = this;
    // Bind method to changes in store
    TentaStore.bind(APP.STATUS_FETCHING, function() {
      self.setState({ isLoading: true });
    });
    TentaStore.bind(APP.STATUS_FETCHING_OFF, function() {
      self.setState({ isLoading: false });
    });
  },
  componentWillUnmount: function() {
    TentaStore.unbind(APP.STATUS_FETCHING);
    TentaStore.unbind(APP.STATUS_FETCHING_OFF);
  },
  render: function() {
    if (this.state.isLoading)
      return (
        <div className="row nomargin">
          <div className="center" id="preloader">
            <div className="preloader-wrapper active big">
              <div className="spinner-layer spinner-blue-only">
                <div className="circle-clipper left">
                  <div className="circle"></div>
                </div>
                <div className="gap-patch">
                  <div className="circle"></div>
                </div>
                <div className="circle-clipper right">
                  <div className="circle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    else {
      return null;
    }
  }
});

module.exports = SearchLoadingIndicator;
