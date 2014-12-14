var Grailed = require( '../src' );

describe( 'start', function () {

	var app = Grailed.create();

	it( 'start() should emit an `start` event', function ( _done ) {
		app.once( 'start', _done );
		app.start();
	} );

	it( 'start() should provide a callback', function ( _done ) {
		[ {},
			[], null, undefined
		].forEach( function ( _invalidArgument ) {
			app.start( _invalidArgument );
		} );
		app.start( _done );
	} );

} );