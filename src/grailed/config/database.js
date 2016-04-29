module.exports = {
	init: function ( _next ) {
		var merge = require( 'sc-merge' ),
			path = require( 'path' ),
			appDatabase = {};

		try {
			appDatabase = require( path.join( process.env.GRAILED_PATH_CONFIG, 'database' ) );
		} catch ( e ) {}

		function isTrue( val ) {
			if ( typeof val === 'string' && val.toLowerCase() === 'true' ) return true;
			if ( val === '1' || val === 1 ) return true;
			return false;
		}

		var defaultDatabaseConfig = {
			databaseName: process.env.GRAILED_DATABASE_NAME || 'grailed',
			username: process.env.GRAILED_DATABASE_USERNAME || '',
			password: process.env.GRAILED_DATABASE_PASSWORD || '',
			primaryServer: process.env.GRAILED_DATABASE_PRIMARY_SERVER || '127.0.0.1',
			primaryServerPort: process.env.GRAILED_DATABASE_PRIMARY_SERVER_PORT || '27017',
			secondaryServer: process.env.GRAILED_DATABASE_SECONDARY_SERVER || '',
			secondaryServerPort: process.env.GRAILED_DATABASE_SECONDARY_SERVER_PORT || '',
			tertiaryServer: process.env.GRAILED_DATABASE_TERTIARY_SERVER || '',
			tertiaryServerPort: process.env.GRAILED_DATABASE_TERTIARY_SERVER_PORT || '',
			ssl: isTrue( process.env.GRAILED_DATABASE_SSL ) || false,
			sslValidate: isTrue( process.env.GRAILED_DATABASE_SSL_VALIDATE ) || false,
			sslKeyChain: process.env.GRAILED_DATABASE_SSL_KEYCHAIN || process.env.GRAILED_DATABASE_VALIDATE_SSL_KEYCHAIN || false,
			sslKey: process.env.GRAILED_DATABASE_SSL_KEY || process.env.GRAILED_DATABASE_VALIDATE_SSL_KEY || false,
			sslCert: process.env.GRAILED_DATABASE_SSL_CERT || process.env.GRAILED_DATABASE_VALIDATE_SSL_CERT || false,
			replSetName: process.env.GRAILED_DATABASE_REPL_SET_NAME || false
		};

		grailed.database = merge( true, defaultDatabaseConfig, appDatabase.default, appDatabase[ process.env.NODE_ENV ] );

		_next && _next();
	}
};