var config = require( './config/index' ),
	concat = require( 'gulp-concat' ),
	path = require( 'path' ),
	str = require( 'underscore.string' ),
	uglify = require( 'gulp-uglify' );

gulp.task( 'src/client/dependencies/scripts', function () {
	var dependencies;

	try {
		dependencies = require( path.join( config.PATH_CLIENT, 'dependencies/scripts' ) );
	} catch ( e ) {
		return;
	}

	var stream = gulp.src( dependencies )
		.pipe( concat( 'dependencies.js', {
			newLine: ';\n'
		} ) )
		.pipe( uglify( {
			mangle: false,
			compress: false
		} ) )
		.pipe( gulp.dest( path.join( config.PATH_COMPONENTS_PUBLIC, str.slugify( config.APP_NAME ) ) ) );

	if ( GLOBAL.livereload ) stream.pipe( livereload() );

	return stream;
} );

gulp.task( 'src/client/dependencies', [ 'src/client/dependencies/scripts' ] );