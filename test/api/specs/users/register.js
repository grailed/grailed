var config = require( process.cwd() + '/test/api/config' );

describe( 'user registering', function () {
	this.timeout( 10000 );
	this.slow( 10000 );

	before( test.setup );
	after( test.tearDown );

	it( 'should register a user given an email address & password', function ( _done ) {
		request.post( config.baseUrl + '/api/user/register', {
			body: {
				email: 'stan@smith',
				password: 'password'
			}
		}, function ( _error, _res, _user ) {
			_res.statusCode.should.eql( 200 );
			_user.should.have.properties( [ 'id', 'email' ] );
			_user.email.should.eql( 'stan@smith' );
			_done( _error );
		} );
	} );

	describe( 'after successfully registering', function () {

		it( 'should be able to log in', function ( _done ) {
			request.post( config.baseUrl + '/api/user/login', {
				body: {
					email: 'stan@smith',
					password: 'password'
				}
			}, function ( _error, _res, _user ) {
				_res.statusCode.should.eql( 200 );
				_user.should.have.properties( [ 'id', 'email' ] );
				_user.email.should.eql( 'stan@smith' );
				_done( _error );
			} );
		} );

	} );

} );