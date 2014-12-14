module.exports = function ( _req, _res, _next ) {
	grailed.service.user.getUserBySessionToken( _req.cookies[ 'grailed-token' ], function ( _error, _user ) {
		_req.grailed.user = !_error ? _user : undefined;
		_next();
	} );
};