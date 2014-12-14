module.exports = function ( _req, _res, _next ) {
	_res.status( 404 ).render( '404.ejs', {
		grailed: _req.grailed
	} );
};