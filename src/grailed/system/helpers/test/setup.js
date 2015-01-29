var _ = require( 'underscore' ),
	async = require( 'async' ),
	sh = require( 'execSync' );

module.exports = function ( _done ) {
	var config = require( grailed.env.PATH_TEST + '/api/config' ),
		done = _.last( arguments ) || _.noop;

	async.waterfall( [

		// Start grailed & the server
		function ( _wcallback ) {
			if ( !global.serverRunning ) {
				global.serverRunning = true;
				require( process.cwd() + '/bin/grailed' );
				grailed.once( 'ready', _wcallback );
			} else {
				_wcallback();
			}
		},

		// Drop the test database
		function ( _wcallback ) {
			sh.run( 'mongo ' + grailed.database.databaseName + ' --eval \"db.dropDatabase()\" > /dev/null' );
			_wcallback();
		},

		// Migrate up
		function ( _wcallback ) {
			require( 'child_process' ).exec( 'migrate --state-file ' + '.tmp/.migrate', {
				cwd: process.cwd()
			}, function () {
				_wcallback();
			} );
		},

		// Call the setup hook
		function ( _wcallback ) {
			if ( !_.isFunction( config.setup ) ) return _wcallback();
			config.setup( _wcallback );
		}

	], done );
};