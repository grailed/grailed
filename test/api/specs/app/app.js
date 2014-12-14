var config = require( process.cwd() + '/test/api/config' );

describe( 'grailed', function () {

	this.timeout( 5000 );
	this.slow( 5000 );

	before( test.setup );
	after( test.tearDown );

	it( 'should exist', function () {
		grailed.should.exist;
	} );

	it( 'should have controllers setup', function () {
		[ 'system', 'user', 'view' ].forEach( function ( _controller ) {
			grailed.controller[ _controller ].should.exist;
		} );
	} );

	it( 'should have services setup', function () {
		[ 'system' ].forEach( function ( _service ) {
			grailed.service[ _service ].should.exist;
		} );
	} );

	it( 'should have models setup', function () {
		[ 'user', 'sessionToken' ].forEach( function ( _model ) {
			grailed.model[ _model ].should.exist;
		} );
	} );

} );