var glob = require( 'glob' );

module.exports = function ( _pattern ) {
	var glob = require( 'glob' ),
		specs = glob.sync( _pattern ).filter( function ( _path ) {
			return _path !== __dirname + '/index.js';
		} );
};