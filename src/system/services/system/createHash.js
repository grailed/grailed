var _ = require( 'underscore' ),
	cast = require( 'sc-cast' ),
	crypto = require( 'crypto' );

module.exports = function () {
	var randomString = function () {
		return Date.now().toString() + Math.random().toString();
	};

	var args = arguments.length ? _.toArray( arguments ) : [ randomString() ],
		sha = crypto.createHash( 'sha256' );

	_.each( args, function ( _arg ) {
		sha.update( cast( _arg, 'string', randomString() ) );
	} );

	return sha.digest( 'hex' );
};