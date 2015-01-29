var _ = require( 'underscore' ),
	assetsTasks = [],
	components,
	config = require( './config/index' ),
	glob = require( 'glob' ),
	less = require( 'gulp-less' ),
	minifyTasks = [],
	mkdirp = require( 'mkdirp' ),
	path = require( 'path' ),
	shell = require( 'gulp-shell' ),
	str = require( 'underscore.string' ),
	rename = require( 'gulp-rename' ),
	slugifiedAppName = str.slugify( config.APP_NAME ),
	styleTasks = [],
	uglify = require( 'gulp-uglify' );

components = glob.sync( config.PATH_COMPONENTS_APP + '/*' ).filter( function ( _component ) {
	return /[^\/]+$/.test( _component ) ? true : false;
} ).map( function ( _component ) {
	var contextFolderName = _component.match( /[^\/]+$/ )[ 0 ];

	mkdirp( path.join( config.PATH_COMPONENTS_PUBLIC, slugifiedAppName, str.slugify( contextFolderName ), 'scripts' ) );
	mkdirp( path.join( config.PATH_COMPONENTS_PUBLIC, slugifiedAppName, str.slugify( contextFolderName ), 'styles' ) );

	return contextFolderName;
} );

/**
 * Scripts
 */
gulp.task( 'src/client/components/scripts', function () {
	var browserifyCommands = _.map( components, function ( _component ) {
		var slugifiedComponentName = str.slugify( _component );

		return './node_modules/grailed/node_modules/.bin/browserify ' +
			path.join( config.PATH_CLIENT, 'components', _component, 'scripts/index.js' ) + ' -d ' +
			' --standalone ' + str.camelize( slugifiedAppName + '-' + slugifiedComponentName ) +
			' --outfile ' + path.join( config.PATH_COMPONENTS_PUBLIC, slugifiedAppName, slugifiedComponentName, 'scripts/index.js' );
	} );

	var stream = gulp.src( '' ).pipe( shell( browserifyCommands ) );

	if ( GLOBAL.livereload ) stream.pipe( GLOBAL.livereload() );

	return stream;
} );

components.forEach( function ( _component ) {

	/**
	 * Minify Scripts
	 */
	var scriptTaskName = 'src/client/components/scripts/' + str.camelize( _component ) + '/minify';

	minifyTasks.push( scriptTaskName );

	gulp.task( scriptTaskName, [ 'src/client/components/scripts' ], function () {
		return gulp.src( path.join( config.PATH_COMPONENTS_PUBLIC, slugifiedAppName, str.slugify( _component ), 'scripts/index.js' ) )
			.pipe( uglify() )
			.pipe( rename( 'index.min.js' ) )
			.pipe( gulp.dest( path.join( config.PATH_COMPONENTS_PUBLIC, slugifiedAppName, str.slugify( _component ), 'scripts' ) ) );
	} );

	/**
	 * Styles
	 */
	var styleTaskName = 'src/client/components/styles/' + str.camelize( _component );

	styleTasks.push( styleTaskName );

	gulp.task( styleTaskName, function () {
		var stream = gulp.src( path.join( config.PATH_CLIENT, 'components', _component, 'styles/index.less' ) )
			.pipe( less() )
			.pipe( gulp.dest( path.join( config.PATH_COMPONENTS_PUBLIC, slugifiedAppName, str.slugify( _component ), 'styles' ) ) );

		if ( GLOBAL.livereload ) stream.pipe( GLOBAL.livereload() );

		return stream;
	} );

	/**
	 * Assets
	 */
	var assetTaskName = 'src/client/components/assets/' + str.camelize( _component );

	assetsTasks.push( assetTaskName );

	gulp.task( assetTaskName, function () {
		var stream = gulp.src( path.join( config.PATH_CLIENT, 'components', _component, 'assets/**/*' ), {
				basePath: path.join( config.PATH_CLIENT, 'components', _component, 'assets' )
			} )
			.pipe( gulp.dest( path.join( config.PATH_COMPONENTS_PUBLIC, slugifiedAppName, str.slugify( _component ), 'assets' ) ) );

		if ( GLOBAL.livereload ) stream.pipe( GLOBAL.livereload() );

		return stream;
	} );
} );


gulp.task( 'src/client/components', [
	'src/client/components/scripts',
	'src/client/components/styles',
	'src/client/components/assets'
] );

gulp.task( 'src/client/components/minify', minifyTasks );
gulp.task( 'src/client/components/styles', styleTasks );
gulp.task( 'src/client/components/assets', assetsTasks );