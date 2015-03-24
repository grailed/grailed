var config = require( './config/index' );

gulp.task( 'src/watch', function () {
	if ( !GLOBAL.livereload ) GLOBAL.livereload = require( 'gulp-livereload' );

	livereload.listen();

	gulp.watch( [ config.CWD + '/config/**/*' ], [ 'server' ] );
	gulp.watch( [ config.PATH_API + '/**/*' ], [ 'server' ] );
	gulp.watch( [ config.PATH_CLIENT + '/**/*.ejs' ], [ 'reload' ] );
	gulp.watch( [ config.PATH_CLIENT + '/components/**/*.html' ], [ 'src/client/components/assets' ] );
	gulp.watch( [ config.PATH_CLIENT + '/components/**/*.js' ], [ 'src/client/components/scripts' ] );
	gulp.watch( [ config.PATH_CLIENT + '/components/**/*.less' ], [ 'src/client/components/styles' ] );
	gulp.watch( [ config.PATH_CLIENT + '/dependencies/**/*.js' ], [ 'src/client/dependencies' ] );
	gulp.watch( [ 'gulpfile.js' ], [ 'default' ] );

} );