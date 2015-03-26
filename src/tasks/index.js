module.exports = function ( gulp ) {
	global.gulp = gulp;

	require( './components' );
	require( './dependencies' );
	require( './reload' );
	require( './server' );
	require( './watch' );

	return {
		'build': [ 'src/client/dependencies', 'src/client/components' ],
		'default': [ 'build', 'minify' ],
		'minify': [ 'src/client/components/minify' ],
		'run': [ 'default', 'server', 'src/watch' ]
	};
};