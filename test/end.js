var Grailed = require( '../src' );

describe( 'end', function () {

	var app = Grailed.create();

	it( 'end() should emit an `end` event', function ( _done ) {
		app.once( 'end', _done );
		app.end();
	} );

	it( 'end() should provide a callback', function ( _done ) {
		[ {},
			[], null, undefined
		].forEach( function ( _invalidArgument ) {
			app.end( _invalidArgument );
		} );
		app.end( _done );
	} );

} );