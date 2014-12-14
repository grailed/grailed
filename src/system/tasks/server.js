var config = require( './config' ),
	cluster = require( 'cluster' ),
	worker;

gulp.task( 'server', function () {
	cluster.setupMaster( {
		exec: 'bin/grailed'
	} );
	if ( worker ) worker.kill();
	worker = cluster.fork();

	var stream = gulp.src( '' );
	if ( GLOBAL.livereload ) stream.pipe( livereload() );

	return stream;
} );