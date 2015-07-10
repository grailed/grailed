module.exports = function ( gulp ) {
	global.gulp = gulp;

	require( './assets' );
	require( './components' );
	require( './dependencies' );
	require( './reload' );
	require( './server' );
	require( './styles' );
	require( './watch' );

	return {
		'build': [ 'src/client/dependencies', 'src/client/styles', 'src/client/assets', 'src/client/components' ],
		'default': [ 'build', 'minify' ],
		'minify': [ 'src/client/components/minify' ],
		'run': [ 'default', 'server', 'watch' ],
		'watch': [ 'src/watch' ]
	};
};