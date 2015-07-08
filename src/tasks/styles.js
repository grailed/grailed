var _ = require( 'underscore' ),
	config = require( './config/index' ),
	less = require( 'gulp-less' ),
	path = require( 'path' ),
	plumber = require( 'gulp-plumber' ),
	rename = require( 'gulp-rename' );

/**
 * Styles
 */
gulp.task( 'src/client/styles', function () {
	var stream = gulp.src( path.join( config.PATH_CLIENT, 'styles/index.less' ) )
		.pipe( plumber() )
		.pipe( less() )
		.pipe( rename( 'styles.css' ) )
		.pipe( gulp.dest( path.join( config.PATH_PUBLIC ) ) );

	if ( GLOBAL.livereload ) stream.pipe( GLOBAL.livereload() );

	return stream;
} );