module.exports = function ( _user ) {
	var _ = require( 'underscore' ),
		hasKey = require( 'sc-haskey' ),
		user = hasKey( _user, '$json', 'function' ) ? _user.$json() : _user,
		propertiesToOmit = [ 'active', 'salt', 'password' ],
		userStrippedOfPrivateProperties = _.omit( user, propertiesToOmit );

	return userStrippedOfPrivateProperties;
};