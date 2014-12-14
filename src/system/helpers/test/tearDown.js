var _ = require( 'underscore' ),
	async = require( 'async' ),
	sh = require( 'execSync' );

module.exports = function ( _done ) {
	var config = require( grailed.env.PATH_TEST + '/api/config' ),
		done = _.last( arguments ) || _.noop;

	async.waterfall( [

		function ( _wcallback ) {
			sh.run( 'mongo ' + grailed.database.databaseName + ' --eval \"db.dropDatabase()\" > /dev/null' );
			_wcallback();
		},

		function ( _wcallback ) {
			if ( !_.isFunction( config.tearDown ) ) return _wcallback();
			config.tearDown( _wcallback );
		}

	], done );
};