module.exports = function ( _req, _res, _next ) {
	var body = _req.body || {},
		email = body.email,
		password = body.password;

	grailed.service.user.login( email, password, {
		res: _res
	}, function ( _error, _user ) {
		if ( _error ) return _next( _error );
		_res.json( _user );
	} );
};