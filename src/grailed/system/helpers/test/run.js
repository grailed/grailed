var _ = require( 'underscore' ),
	glob = require( 'glob' );

module.exports = function ( _specs ) {
	_.each( _specs, function ( _spec ) {
		_.each( glob.sync( _spec ), function ( _file ) {
			require( _file );
		} );
	} );
};