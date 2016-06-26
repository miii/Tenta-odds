var React = require('react');

var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

var Footer = require('./Footer.jsx');

var Package = require('../../package.json');

var ResultFooter = React.createClass({
  render: function () {
    var lastUpdate = TentaStore.getLastUpdateString();

    return (
      <section id="ResultFooter">
        <h6 className="update">Senast uppdaterad {lastUpdate}</h6>
        <Footer />

        <div id="fab" className="fixed-action-btn">
          <a onClick={this.report} className="btn-floating btn-large waves-effect waves-light grey darken-4 report">
            <i title="Rapportera problem" className="examicon material-icons">announcement</i>
          </a>
          <a onClick={this.showSearchBox} className="btn-floating btn-large waves-effect waves-light blue darken-2">
            <i title="Sök ny kurs" className="examicon material-icons">search</i>
          </a>
        </div>
      </section>
    );
  },
  showSearchBox: function() {
    window.courseCode = '';
    window.history.pushState({data: null}, 'Tentaresultat', window.baseUrl);
    TentaStore.trigger(APP.EVENT_NO_DATA);
  },
  report: function() {
    if (confirm('Vill du rapportera ett problem eller har förslag på förbättringar?'))
      window.open('https://docs.google.com/forms/d/1KxtyWRRT74VezvVNV3cmBjAB8Wx6rkimwlQh5iV5yQk/viewform?entry.1609124048=' + window.courseCode);
  }
});

module.exports = ResultFooter;
