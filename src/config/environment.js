var merge = require( 'sc-merge' ),
	path = require( 'path' ),
	appEnvironment = require( path.join( process.env.GRAILED_PATH_CONFIG, 'environment' ) );

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

module.exports = environment;