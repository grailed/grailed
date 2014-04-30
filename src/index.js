var Grail = require( './grail' ),
	GrailedApp = {};

GrailedApp.create = function () {
	return new Grail();
};

module.exports = GrailedApp;