var merge = require( 'sc-merge' ),
	path = require( 'path' ),
	appDatabase = require( path.join( process.env.GRAILED_PATH_CONFIG, 'database' ) );

var defaultDatabaseConfig = {
	databaseName: process.env.GRAILED_DATABASE_NAME || 'grailed',
	username: process.env.GRAILED_DATABASE_USERNAME || '',
	password: process.env.GRAILED_DATABASE_PASSWORD || '',
	primaryServer: process.env.GRAILED_DATABASE_PRIMARY_SERVER || '127.0.0.1',
	primaryServerPort: process.env.GRAILED_DATABASE_PRIMARY_SERVER_PORT || '27017',
	secondaryServer: process.env.GRAILED_DATABASE_SECONDARY_SERVER || '',
	secondaryServerPort: process.env.GRAILED_DATABASE_SECONDARY_SERVER_PORT || ''
}

module.exports = merge( true, defaultDatabaseConfig, appDatabase.default, appDatabase[ process.env.NODE_ENV ] );