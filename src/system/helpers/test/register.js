var _ = require( 'underscore' );

module.exports = function ( _request, _email, _password ) {
	var config = require( grailed.env.PATH_TEST + '/api/config' );

	return function () {
		var cb = _.last( arguments );
		_request.post( config.baseUrl + '/api/user/register', {
			body: {
				email: _email,
				password: _password || 'password'
			}
		}, function ( _error, _res, _user ) {
			cb( _error );
		} );
	};
};