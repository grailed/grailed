module.exports = {
	init: function ( _next ) {
		var _ = require( 'underscore' ),
			fs = require( 'fs' ),
			path = require( 'path' );

		grailed.use( require( 'grailed-module-system' ) );

		try {
			var moduleFolders = fs.readdirSync( path.join( process.env.GRAILED_PATH_API, 'modules' ) );

			moduleFolders.forEach( function ( _directory ) {
				var directory = path.join( process.env.GRAILED_PATH_API, 'modules', _directory );

				if ( !fs.statSync( directory ).isDirectory() ) return;
				if ( /^\./.test( _directory ) ) return;

				grailed.use( requireDirectory( module, directory, {
					blacklist: /\/\.[\w]+]/
				} ) );

			} );
		} catch ( e ) {
			console.error( e, e.stack );
			return;
		}

		_next();
	}
};