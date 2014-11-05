var _ = require( 'underscore' ),
	Grailed = require( '../src' ),
	should = require( 'should' );

describe( 'grailed', function () {

	var app = Grailed.create();

	_.each( [ 'class', 'config', 'controller', 'model', 'module', 'route' ], function ( _method ) {

		it( 'should be able to set and retrieve ' + _method, function () {
			var plural = _method === 'class' ? 'es' : 's';

			app[ _method ]( 'a', 'a' );
			app[ _method ]( 'b', 'b' );
			app[ _method ]( 'a' ).should.eql( 'a' );
			app[ _method ]( 'b' ).should.eql( 'b' );
			app[ _method + plural ].a.should.eql( 'a' );
			app[ _method + plural ].b.should.eql( 'b' );
			app[ _method ].a.should.eql( 'a' );
			app[ _method ].b.should.eql( 'b' );
		} );

	} );

} );