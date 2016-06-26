var React = require('react');

var AppDispatcher = require('../flux/AppDispatcher');
var TentaStore = require('../flux/stores/TentaStore');
var APP = require('../flux/AppConstants');

var Package = require('../../package.json');

var Footer = React.createClass({
  render: function () {
    var lastUpdate = TentaStore.getLastUpdateString();

    return (
      <h6 className="footer">
        Version {Package.version_long} -
        Utvecklad av <a href="http://jacob-andersson.com" target="_blank">Jacob Andersson</a>
      </h6>
    );
  }
});

module.exports = Footer;
