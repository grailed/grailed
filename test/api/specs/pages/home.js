var config = require( process.cwd() + '/test/api/config' );

describe( 'home page', function () {
	this.timeout( 5000 );
	this.slow( 5000 );

	before( test.setup );
	after( test.tearDown );

	it( 'should respond with a 200 when getting the home page', function ( _done ) {
		request.get( config.baseUrl + '/', function ( _error, _res, _body ) {
			_res.statusCode.should.eql( 200 );
			_done( _error );
		} );
	} );

} );