var gulp = require( 'gulp' ),
	jshint = require( 'gulp-jshint' ),
	jshintReporter = require( "jshint-stylish" ),
	rename = require( 'gulp-rename' ),
	mkdirp = require( 'mkdirp' ),
	shell = require( 'gulp-shell' ),
	uglify = require( 'gulp-uglify' );

var pkg = require( './package.json' );

gulp.task( "jshint", function () {
	return gulp.src( [ "./src/**/*.js", "test/**/*.js" ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( jshintReporter ) );
} );

gulp.task( 'scripts', [ 'jshint' ], function () {
	mkdirp( './dist' );
	return gulp.src( '' )
		.pipe( shell( [ './node_modules/.bin/browserify ' +
			'./src/index.js ' +
			'--ignore ./src/system/index.js ' +
			'--standalone ' + pkg.name + ' ' +
			'--outfile ./dist/' + pkg.name + '.js'
		] ) );
} );

gulp.task( 'scripts/minify', [ 'scripts' ], function () {
	return gulp.src( './dist/' + pkg.name + '.js' )
		.pipe( uglify() )
		.pipe( rename( pkg.name + '.min.js' ) )
		.pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'watch', function () {
	gulp.watch( [ './src/**/*.js' ], [ 'scripts' ] );
} );

gulp.task( 'default', [ 'build', 'minify' ] );
gulp.task( 'build', [ 'scripts' ] );
gulp.task( 'minify', [ 'scripts/minify' ] );
gulp.task( 'run', [ 'default', 'watch' ] );