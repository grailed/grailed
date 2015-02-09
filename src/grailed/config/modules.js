module.exports = {
	init: function ( _next ) {
		var fs = require( 'fs' ),
			path = require( 'path' );

		grailed.use( require( 'grailed-module-system' ) );

		try {
			var moduleFolders = fs.readdirSync( path.join( process.env.GRAILED_PATH_API, 'modules' ) );

			moduleFolders.forEach( function ( _directory ) {
				var directory = path.join( process.env.GRAILED_PATH_API, 'modules', _directory );

				if ( !fs.statSync( directory ).isDirectory() ) return;
				if ( /^\./.test( _directory ) ) return;

				grailed.use( require( directory ) );
			} );
		} catch ( e ) {
			console.error( e.stack || e );
			return;
		}

		_next && _next();
	}
};