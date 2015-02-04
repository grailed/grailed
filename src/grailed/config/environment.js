module.exports = {
	init: function ( _next ) {
		var merge = require( 'sc-merge' ),
			path = require( 'path' ),
			appEnvironment = {};

		try {
			appEnvironment = require( path.join( process.env.GRAILED_PATH_CONFIG, 'environment' ) );
		} catch ( e ) {
		}

		var defaultEnvironmentConfig = {
			SALT: 'GofDgugjnAEiPCtoeQTbUG2wVJR2JrQEMzBxodwwBDMEPuJnNh'
		};

		var environment = merge( true, defaultEnvironmentConfig, appEnvironment.default, appEnvironment[ process.env.NODE_ENV ], grailed.env );

		// Strip `GRAILED_` from process.env keys for consistancy
		Object.keys( process.env ).forEach( function ( _key ) {
			if ( /^GRAILED_/.test( _key ) ) {
				environment[ _key.replace( /^GRAILED_/, '' ) ] = process.env[ _key ];
			}
		} );

		Object.keys( environment ).forEach( function ( _key ) {
			process.env[ 'GRAILED_' + _key ] = environment[ _key ];
		} );

		grailed.env = environment;

		_next && _next();
	}
};