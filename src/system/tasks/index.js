var gulp = global.gulp = require( 'gulp' );

require( './components' );
require( './dependencies' );
require( './watch' );
require( './server' );

module.exports = {
	'build': [ 'src/client/dependencies', 'src/client/components' ],
	'default': [ 'build', 'minify' ],
	'minify': [ 'src/client/components/minify' ],
	'run': [ 'default', 'server', 'src/watch' ]
};