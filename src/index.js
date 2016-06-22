var async = require( 'async' ),
	emitter = require( 'emitter-component' );

global.requireDirectory = require( 'require-directory' );
global.grailed = grailed = requireDirectory( module, __dirname + '/grailed' );

emitter( grailed );

async.waterfall( [

	grailed.config.environment.init,
	grailed.config.modules.init,
	grailed.config.routes.init,
	grailed.config.express.init

], function ( _error ) {
	if ( _error ) {
		throw _error;
	}
	grailed.emit( 'ready' );
} );
