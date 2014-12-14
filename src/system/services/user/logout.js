var _ = require( 'underscore' ),
	async = require( 'async' ),
	hasKey = require( 'sc-haskey' );

module.exports = function ( _loggedInUser, _options, _callback ) {
	var self = this,
		SessionToken = grailed.model.sessionToken,
		options = _.extend( {}, _options );

	async.waterfall( [

		// Clear the session token cookie
		function ( _wcallback ) {
			if ( hasKey( options, 'res.clearCookie', 'function' ) ) options.res.clearCookie( 'grailed-token' );
			_wcallback();
		},

		// Find the session token
		function ( _wcallback ) {
			if ( !hasKey( options, 'req.cookies.grailed-token', 'string' ) ) return _wcallback( null, null );
			SessionToken.$findOne( {
				token: options.req.cookies[ 'grailed-token' ]
			}, function ( _error, _sessionToken ) {
				_wcallback( _error, _sessionToken );
			} );
		},

		// Destroy the session token
		function ( _sessionToken, _wcallback ) {
			if ( !_sessionToken ) return _wcallback();

			_sessionToken.$destroy( function ( _error ) {
				_wcallback( _error );
			} );
		}

	], function ( _error ) {
		_callback( _error );
	} );
};