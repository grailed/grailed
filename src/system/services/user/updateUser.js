module.exports = function ( _loggedInUser, _userUpdates, _callback ) {
	var self = this,
		_ = require( 'underscore' ),
		async = require( 'async' );

	async.waterfall( [

		// If this is an email change, verify the email does not already exist
		function ( _wcallback ) {
			if ( !_userUpdates.email || _loggedInUser.email === _userUpdates.email ) return _wcallback( null, _loggedInUser );

			self.getUserByEmail( _userUpdates.email, function ( _error, _user ) {
				if ( !_error && _user && _loggedInUser.id !== _user.id ) _error = grailed.service.system.error( 401, 'Email already exists' );
				_wcallback( _error, _loggedInUser );
			} );
		},

		// Check if a user exists with the given email
		function ( _user, _wcallback ) {
			var user,
				updateableKeys = [ 'email', 'name', 'password' ];

			// Hash the given password
			if ( _userUpdates.hasOwnProperty( 'password' ) && _userUpdates.password ) {
				_userUpdates.password = self.hashPassword( _user.salt, _userUpdates.password );
			}

			_.each( updateableKeys, function ( _key ) {
				if ( _userUpdates.hasOwnProperty( _key ) ) {
					_user[ _key ] = _userUpdates[ _key ];
				}
			} );

			_user.$save( function ( _error, _user ) {
				_wcallback( _error, _user );
			} );
		}

	], function ( _error, _user ) {
		_callback( _error, _user );
	} );
};