var config = require( process.cwd() + '/test/api/config' );

describe( '404 page', function () {
	this.timeout( 5000 );
	this.slow( 5000 );

	before( test.setup );
	after( test.tearDown );

	it( 'should respond with a 404 page when getting a route that does not exist', function ( _done ) {
		request.get( config.baseUrl + '/a-route-that-does-not-exist', function ( _error, _res, _body ) {
			_res.statusCode.should.eql( 404 );
			_done( _error );
		} );
	} );

} );