module.exports = function ( _req, _res, _next ) {
	grailed.service.user.logout( _req.grailed.user, {
		req: _req,
		res: _res
	}, function ( _error, _user ) {
		if ( _error ) return _next( _error );
		_res.json();
	} );
};