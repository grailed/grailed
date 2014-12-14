var _ = require( 'underscore' ),
	async = require( 'async' );

module.exports = function ( _user, _callback ) {
	var self = this;

	async.waterfall( [

		// Validate the given data
		function ( _wcallback ) {
			var error,
				user = grailed.model.user.create( _.extend( {}, _user ) );

			if ( !_.every( [ _user.email, _user.password ] ) ) {
				error = grailed.service.system.error( 400, 'Either an email or password was not supplied' );
			}

			_wcallback( error, user );
		},

		// Check if a user exists with the given email
		function ( _user, _wcallback ) {
			self.getUserByEmail( _user.email, function ( _error, _existingUser ) {
				if ( _existingUser ) _error = grailed.service.system.error( 400, 'The given email already exists.' );
				_wcallback( _error, _user );
			} );
		},

		// Create the user
		function ( _user, _wcallback ) {

			_user.active = true;
			_user.salt = grailed.service.system.createHash();
			_user.password = self.hashPassword( _user.salt, _user.password );

			_user.$save( function ( _error, _user ) {
				_wcallback( _error, self.getUsersPublicProperties( _user ) );
			} );
		}

	], function ( _error, _user ) {
		_callback( _error, _user );
	} );
};