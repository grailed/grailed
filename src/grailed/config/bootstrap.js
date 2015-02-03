module.exports = {
	init: function ( _next ) {
		var path = require( 'path' ),
			appBootstrap;

		try {
			appBootstrap = require( path.join( process.env.GRAILED_PATH_CONFIG, 'bootstrap' ) );
			appBootstrap( function () {
				grailed.emit( 'bootstrap' );
				_next && _next();
			} );
		} catch ( e ) {
			console.warn( '`/config/bootstrap.js` is missing', e );
			grailed.emit( 'bootstrap' );
			_next && _next();
		}
	}
};