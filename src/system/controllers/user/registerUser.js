module.exports = function ( _req, _res, _next ) {
	grailed.service.user.registerUser( _req.body, function ( _error, _user ) {
		if ( _error ) return _next( _error );
		_res.json( _user );
	} );
};