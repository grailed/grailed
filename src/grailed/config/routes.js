module.exports = {
	init: function ( _next ) {
		var merge = require( 'sc-merge' ),
			path = require( 'path' ),
			appRoutes = [];

		try {
			appRoutes = require( path.join( process.env.GRAILED_PATH_API, 'routes' ) );
		} catch ( e ) {}

		appRoutes.forEach( function ( _route ) {
			grailed.routes.push( _route );
		} );

		_next();
	}
};