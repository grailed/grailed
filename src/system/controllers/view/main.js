module.exports = function ( _req, _res, _next ) {
	_res.render( 'main.ejs', {
		grailed: _req.grailed
	} );
};