module.exports = function ( _done ) {
	var config = require( grailed.env.PATH_TEST + '/api/config' ),
		done = _.last( arguments ) || _.noop,
		exec = require( 'child_process' ).exec;

	async.waterfall( [

		function ( _wcallback ) {
			if ( grailed.env.TEST_TEARDOWN_DO_NOT_DROP_DB !== 'true' ) {
				exec( 'mongo ' + grailed.database.databaseName + ' --eval \"db.dropDatabase()\" > /dev/null', function ( _error ) {
					_wcallback( _error );
				} );
			} else {
				_wcallback();
			}
		},

		function ( _wcallback ) {
			if ( !_.isFunction( config.tearDown ) ) return _wcallback();
			config.tearDown( _wcallback );
		}

	], done );
};