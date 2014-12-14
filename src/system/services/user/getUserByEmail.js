var async = require( 'async' ),
	is = require( 'sc-is' );

module.exports = function ( _email, _callback ) {
	var self = this,
		User = grailed.model.user;

	async.waterfall( [

		// Get by email
		function ( _wcallback ) {
			var email = is.a.string( _email ) && _email ? _email : null;

			if ( !email ) return _wcallback( grailed.service.system.error( 400, 'An invalid email was given' ) );

			User.$findOne( {
				active: true,
				email: email
			}, function ( _error, _user ) {
				_wcallback( _error, _user );
			} );
		}

	], function ( _error, _user ) {
		_callback( _error, _user );
	} );
};