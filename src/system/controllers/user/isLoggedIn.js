module.exports = function ( _req, _res, _next ) {
	_next( _req.grailed.user ? null : grailed.service.system.error( 401, 'Not authorised' ) );
};