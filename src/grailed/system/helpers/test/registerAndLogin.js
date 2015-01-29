var _ = require( 'underscore' ),
	async = require( 'async' );

module.exports = function ( _request, _email, _password ) {
	var config = require( grailed.env.PATH_TEST + '/api/config' );

	return function () {
		var cb = _.last( arguments );
		async.waterfall( [
			test.register( _request, _email, _password ),
			test.login( _request, _email, _password )
		], cb );
	};
};