var async = require( 'async' );

module.exports = function ( _userId, _callback ) {
	var self = this,
		User = grailed.model.user;

	async.waterfall( [

		// Get by id
		function ( _wcallback ) {
			if ( !_userId ) return _wcallback();
			User.$findOne( {
				id: _userId,
				active: true
			}, function ( _error, _user ) {
				if ( !_error && !_user ) _error = self.error( 404, 'A user could not be found with the given id' );
				_wcallback( _error, _user );
			} );
		}

	], function ( _error, _user ) {
		_callback( _error, _user );
	} );

};