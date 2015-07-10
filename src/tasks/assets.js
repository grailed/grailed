var _ = require( 'underscore' ),
	config = require( './config/index' ),
	path = require( 'path' ),
	plumber = require( 'gulp-plumber' );

/**
 * Copy assets to /public/assets
 */
gulp.task( 'src/client/assets', function () {
	var stream = gulp.src( path.join( config.PATH_CLIENT, 'assets/**/*' ), {
			basePath: path.join( config.PATH_CLIENT, 'assets' )
		} )
		.pipe( plumber() )
		.pipe( gulp.dest( path.join( config.PATH_PUBLIC, 'assets' ) ) );

	if ( GLOBAL.livereload ) stream.pipe( GLOBAL.livereload() );

	return stream;
} );