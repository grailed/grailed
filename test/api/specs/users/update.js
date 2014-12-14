var config = require( process.cwd() + '/test/api/config' );

describe( 'user updating their details', function () {
	this.timeout( 10000 );
	this.slow( 10000 );

	before( test.setup );
	after( test.tearDown );

	describe( 'when unauthorised', function () {

		it( 'should fail', function ( _done ) {
			request.put( config.baseUrl + '/api/user', {
				body: {
					name: 'mr stan'
				}
			}, function ( _error, _res, _user ) {
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
				test.register( request, 'fran@smith' ),
				test.registerAndLogin( request, 'stan@smith' ),
			], _done );
		} );

		it( 'as stan should be able to update my details', function ( _done ) {
			request.put( config.baseUrl + '/api/user', {
				body: {
					email: 'mrstan@smith',
					name: 'mr stan',
					password: 'fbi'
				}
			}, function ( _error, _res, _user ) {
				_res.statusCode.should.eql( 200 );
				_user.name.should.eql( 'mr stan' );
				_done( _error );
			} );
		} );

		it( 'should not be able to update private properties', function ( _done ) {
			request.put( config.baseUrl + '/api/user', {
				body: {
					id: '1',
					salt: '2'
				}
			}, function ( _error, _res, _user ) {
				_res.statusCode.should.eql( 200 );
				_user.id.should.not.eql( '1' );
				_done( _error );
			} );
		} );

		it( 'should be able to get my updated details', function ( _done ) {
			request.get( config.baseUrl + '/api/user', function ( _error, _res, _user ) {
				_res.statusCode.should.eql( 200 );
				_user.email.should.eql( 'mrstan@smith' );
				_user.name.should.eql( 'mr stan' );
				_done( _error );
			} );
		} );

		it( 'should fail updating to an existing email', function ( _done ) {
			request.put( config.baseUrl + '/api/user', {
				body: {
					email: 'fran@smith'
				}
			}, function ( _error, _res, _user ) {
				_res.statusCode.should.eql( 401 );
				_user.error.status.should.eql( 401 );
				_done( _error );
			} );
		} );

		describe( 'after I changed my password', function () {

			before( function ( _done ) {
				async.waterfall( [
					test.logout( request ),
					test.login( request, 'mrstan@smith', 'fbi' ),
				], _done );
			} );

			it( 'I should be able to log in with my new password', function ( _done ) {
				request.get( config.baseUrl + '/api/user', function ( _error, _res, _user ) {
					_res.statusCode.should.eql( 200 );
					_user.email.should.eql( 'mrstan@smith' );
					_user.name.should.eql( 'mr stan' );
					_done( _error );
				} );
			} );

		} );

	} );

} );