var gulp = require( 'gulp' ),
	jshint = require( 'gulp-jshint' ),
	jshintReporter = require( "jshint-stylish" );

gulp.task( "jshint", function () {
	return gulp.src( [ "./src/**/*.js", "test/**/*.js" ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( jshintReporter ) );
} );

gulp.task( 'watch', function () {
	gulp.watch( [ './src/**/*.js' ], [ 'scripts' ] );
} );

gulp.task( 'default', [ 'build' ] );
gulp.task( 'build', [ 'scripts' ] );
gulp.task( 'scripts', [ 'jshint' ] );