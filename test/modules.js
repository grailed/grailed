var Grailed = require( '../src' );

describe( "modules", function () {

	var app = Grailed.create();

	it( 'add modules', function () {
		app
			.module( 'a', 'a' )
			.module( 'b', 'b' );
	} );

	it( 'retrieve modules', function () {
		app.module( 'a' ).should.equal( 'a' );
		app.module( 'b' ).should.equal( 'b' );
		app.modules.a.should.equal( 'a' );
		app.modules.b.should.equal( 'b' );
	} );

} );