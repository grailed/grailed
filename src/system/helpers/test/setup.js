var _ = require( 'underscore' ),
	async = require( 'async' ),
	sh = require( 'execSync' );

module.exports = function ( _done ) {
	var config = require( grailed.env.PATH_TEST + '/api/config' ),
		done = _.last( arguments ) || _.noop;

	async.waterfall( [

		function ( _wcallback ) {
			if ( !global.serverRunning ) {
				global.serverRunning = true;
				require( process.cwd() + '/bin/grailed' );
				grailed.once( 'express:done', _wcallback );
			} else {
				_wcallback();
			}
		},

		function ( _wcallback ) {
			if ( !_.isFunction( config.setup ) ) return _wcallback();
			config.setup( _wcallback );
		}

	], done );
};