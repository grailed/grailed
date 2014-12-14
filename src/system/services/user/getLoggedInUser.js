var async = require( 'async' );

module.exports = function ( _loggedInUser, _callback ) {
	var self = this;

	async.waterfall( [

		// Validate the given logged in user
		function ( _wcallback ) {
			if ( _loggedInUser && _loggedInUser.__isMoldy && _loggedInUser.active === true ) {
				_wcallback( null, self.getUsersPublicProperties( _loggedInUser ) );
			} else {
				_wcallback( self.error( 401, 'Not authorised' ) );
			}
		}

	], function ( _error, _user ) {
		_callback( _error, _user );
	} );
};