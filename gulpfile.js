var gulp = require( 'gulp' ),
	browserify = require( 'gulp-browserify' ),
	jshint = require( 'gulp-jshint' ),
	jshintReporter = require( "jshint-stylish" ),
	rename = require( 'gulp-rename' ),
	shell = require( 'gulp-shell' )
	uglify = require( 'gulp-uglify' );

var pkg = require( './package.json' );

gulp.task( "jshint", function () {
	return gulp.src( [ "./src/**/*.js", "test/**/*.js" ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( jshintReporter ) );
} );

gulp.task( 'scriptsApp', [ 'jshint' ], function () {
	return gulp.src( './src/index.js' )
		.pipe( browserify( {
			standalone: pkg.name,
			debug: true
		} ) )
		.pipe( rename( pkg.name + '.js' ) )
		.pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'scriptsAppMinify', [ 'scriptsApp' ], function () {
	return gulp.src( './dist/' + pkg.name + '.js' )
		.pipe( uglify() )
		.pipe( rename( pkg.name + '.min.js' ) )
		.pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'test', [ 'build' ], shell.task( [
	'npm test'
], {
	ignoreErrors: true
} ) );

gulp.task( 'watch', function () {
	gulp.watch( [ './src/**/*.js' ], [ 'scriptsApp' ] );
	gulp.watch( [ './test/**/*' ], [ 'test' ] );
	gulp.watch( [ './gulpfile.js' ], [ 'default' ] );
} );

gulp.task( 'default', [ 'build', 'minify', 'test' ] );
gulp.task( 'build', [ 'scripts' ] );
gulp.task( 'scripts', [ 'scriptsApp' ] );
gulp.task( 'minify', [ 'scriptsAppMinify' ] );
gulp.task( 'run', [ 'default', 'watch' ] );