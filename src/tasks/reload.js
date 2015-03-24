var config = require( './config/index' );

gulp.task( 'reload', function () {

	var stream = gulp.src( '' );
	if ( GLOBAL.livereload ) stream.pipe( livereload() );

	return stream;
} );