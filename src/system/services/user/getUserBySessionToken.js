module.exports = function ( _sessionToken, _callback ) {

	if ( !_sessionToken ) return _callback();

	var self = this,
		async = require( 'async' ),
		cast = require( 'sc-cast' ),
		is = require( 'sc-is' ),
		SessionToken = grailed.model.sessionToken,
		User = grailed.model.user;

	async.waterfall( [

		// Get session token
		function ( _wcallback ) {
			SessionToken.$findOne( {
				token: _sessionToken
			}, function ( _error, _sessionToken ) {
				_wcallback( _error, _sessionToken );
			} );
		},

		// Validate the session token
		function ( _sessionToken, _wcallback ) {
			if ( !_sessionToken ) return _wcallback( null, null );

			var expiresAt = cast( _sessionToken.expires, 'date', new Date() );

			if ( _sessionToken.userId && expiresAt.getTime() - Date.now() > 0 ) {
				_wcallback( null, _sessionToken.userId );
			}
		},

		// Get the user
		function ( _userId, _wcallback ) {
			if ( !_userId ) return _wcallback();

			self.getUserById( _userId, function ( _error, _user ) {
				_wcallback( _error, _user );
			} );
		}

	], function ( _error, _user ) {
		_callback( _error, _user );
	} );
};