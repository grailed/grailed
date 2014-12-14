var _ = require( 'underscore' ),
	async = require( 'async' ),
	cast = require( 'sc-cast' ),
	is = require( 'sc-is' );

module.exports = function ( _email, _password, _options, _callback ) {
	var self = this,
		SessionToken = grailed.model.sessionToken,
		User = grailed.model.user,
		options = _.extend( {}, _options );

	async.waterfall( [

		// Get by email
		function ( _wcallback ) {
			self.getUserByEmail( _email, function ( _error, _user ) {
				if ( !_error && !_user ) _error = grailed.service.system.error( 401, 'The username or password is incorrect' );
				_wcallback( _error, _user );
			} );
		},

		// Validate the password
		function ( _user, _wcallback ) {
			var error;

			if ( _user.password !== self.hashPassword( _user.salt, _password ) ) {
				error = grailed.service.system.error( 401, 'The username or password is incorrect' );
			}

			_wcallback( error, _user );
		},

		// Create a session token
		function ( _user, _wcallback ) {
			var sessionToken = SessionToken.create( {
				token: grailed.service.system.createHash( _user.id, _user.salt, Date.now(), Math.random() ),
				userId: _user.id,
				date: new Date(),
				expires: new Date( Date.now() + cast( process.env.GRAILED_SESSION_TOKEN_EXPIRE_LENGTH, 'number' ) )
			} );

			sessionToken.$save( function ( _error, _sessionToken ) {
				options.res.cookie( 'grailed-token', _sessionToken.token );
				_wcallback( _error, _user, _sessionToken );
			} );
		}

	], function ( _error, _user ) {
		_callback( _error, _user );
	} );

};