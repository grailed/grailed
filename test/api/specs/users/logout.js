var config = require( process.cwd() + '/test/api/config' );

describe( 'user log in', function () {
	this.timeout( 10000 );
	this.slow( 10000 );

	before( function ( _done ) {
		async.waterfall( [
			test.setup,
			test.registerAndLogin( request, 'stan@smith' )
		], _done );
	} );

	after( test.tearDown );

	it( 'should be logged in', function ( _done ) {
		request.get( config.baseUrl + '/api/user', function ( _error, _res, _user ) {
			_res.statusCode.should.eql( 200 );
			_done( _error );
		} );
	} );

	it( 'should logout', function ( _done ) {
		request.post( config.baseUrl + '/api/user/logout', function ( _error, _res, _user ) {
			_res.statusCode.should.eql( 200 );
			_done( _error );
		} );
	} );

	it( 'should not be logged in', function ( _done ) {
		request.get( config.baseUrl + '/api/user', function ( _error, _res, _user ) {
			_res.statusCode.should.eql( 401 );
			_done( _error );
		} );
	} );

} );