var React = require('react');
var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

var SearchHeader = require('./SearchHeader.jsx');
var SearchBox = require('./SearchBox.jsx');
var SearchLoadingIndicator = require('./SearchLoadingIndicator.jsx');
var Footer = require('./Footer.jsx');

var SearchView = React.createClass({
  getInitialState: function() {
    return {
      isLoading: false
    };
  },
  componentWillMount: function() {
    document.title = "Tentan.se - Tentamensresultat på Linköpings Universitet";
  },
  componentDidMount: function() {
    TentaStore.bind(APP.STATUS_ERROR_OCCURED, this.onError);
  },
  componentWillUmMount: function() {
    TentaStore.unbind(APP.STATUS_ERROR_OCCURED, this.onError);
  },
  render: function() {
    if (window.courseCode.length > 0)
      return (
        <section id="SearchView">
          <SearchHeader />
          <SearchLoadingIndicator />
        </section>
      );

    else
      return (
        <section id="SearchView">
          <SearchHeader />
          <SearchBox />
          <Footer />
          <SearchLoadingIndicator />
        </section>
      );
  },

  onError: function() {
    switch(TentaStore.getErrorCode()) {
      case 1:
        console.log('Kursen hittades inte :(');
        $('#course').addClass('course-error');
        TentaStore.trigger(APP.EVENT_NO_DATA);
        break;
    }
  }
});

module.exports = SearchView;
