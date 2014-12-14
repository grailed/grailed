var config = require( process.cwd() + '/test/api/config' );

describe( 'user log in', function () {
	this.timeout( 10000 );
	this.slow( 10000 );

	before( function ( _done ) {
		async.waterfall( [
			test.setup,
			test.register( request, 'stan@smith' )
		], _done );
	} );

	after( test.tearDown );

	it( 'should fail with invalid credentials', function ( _done ) {
		async.eachSeries( [ {
			email: 'stan@smith'
		}, {
			password: 'password'
		}, {
			email: 'a',
			password: 'password'
		}, {
			email: 'stan@smith',
			password: ''
		}, {
			email: 'stan@smith',
			password: 'a'
		} ], function ( _data, _next ) {
			request.post( config.baseUrl + '/api/user/login', {
				body: _data
			}, function ( _error, _res, _user ) {
				_res.statusCode.should.match( /400|401/ );
				_user.error.message.should.not.be.empty;
				_user.error.status.should.match( /400|401/ );
				_next( _error );
			} );
		}, _done );
	} );

	it( 'should pass with valid credentials', function ( _done ) {
		request.post( config.baseUrl + '/api/user/login', {
			body: {
				email: 'stan@smith',
				password: 'password'
			}
		}, function ( _error, _res, _stan ) {
			_res.statusCode.should.eql( 200 );
			_stan.should.have.properties( [ 'id', 'name', 'email' ] );
			_stan.email.should.eql( 'stan@smith' );
			_done( _error );
		} );
	} );

	it( 'should be logged in', function ( _done ) {
		request.get( config.baseUrl + '/api/user', function ( _error, _res, _user ) {
			_res.statusCode.should.eql( 200 );
			_user.email.should.eql( 'stan@smith' );
			_done( _error );
		} );
	} );

} );