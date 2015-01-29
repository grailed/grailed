var _ = require( 'underscore' );

module.exports = function ( _request ) {
	var config = require( grailed.env.PATH_TEST + '/api/config' );

	return function () {
		var cb = _.last( arguments );
		_request.post( config.baseUrl + '/api/user/logout', function ( _error, _res, _user ) {
			cb( _error );
		} );
	};
};