var Grailed = require( './grailed' ),
	GrailedApp = {};

GrailedApp.create = function () {
	return new Grailed();
};

module.exports = GrailedApp;