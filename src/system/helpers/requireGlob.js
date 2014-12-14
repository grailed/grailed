module.exports = function ( _path ) {
	var glob = require( 'glob' ),
		paths = [];

	glob.sync( _path ).forEach( function ( _file ) {
		try {
			paths.push( {
				module: require( _file ),
				file: _file
			} );
		} catch ( e ) {}
	} );

	return paths;
};