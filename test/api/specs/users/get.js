var config = require( process.cwd() + '/test/api/config' );

describe( 'user getting their details', function () {
	this.timeout( 10000 );
	this.slow( 10000 );

	before( test.setup );
	after( test.tearDown );

	describe( 'when unauthorised', function () {

		it( 'should fail', function ( _done ) {
			request.get( config.baseUrl + '/api/user', function ( _error, _res, _user ) {
				_res.statusCode.should.eql( 401 );
				_user.error.status.should.eql( 401 );
				_user.error.message.should.not.be.empty;
				_done( _error );
			} );
		} );

	} );

	describe( 'when authorised', function () {

		before( function ( _done ) {
			async.waterfall( [
				test.register( request, 'stan@smith' ),
				test.login( request, 'stan@smith' )
			], _done );
		} );

		it( 'should get stans details', function ( _done ) {
			request.get( config.baseUrl + '/api/user', function ( _error, _res, _user ) {
				_res.statusCode.should.eql( 200 );
				_user.should.have.a.properties( [ 'name', 'id', 'email' ] );
				_done( _error );
			} );
		} );

	} );

} );