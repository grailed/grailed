module.exports = function ( _path ) {
	var obj = {},
		glob = require( 'glob' );

	var getMethod = function ( _file ) {
		var method = _file.match( /\/([\w-]*)(\.js)?$/i );
		return method && method[ 1 ] ? method[ 1 ] : null;
	};

	glob.sync( _path ).forEach( function ( _file ) {
		var method = getMethod( _file );
		if ( method ) {

			obj[ method ] = obj[ method ] || {};

			try {
				obj[ method ] = require( _file );
			} catch ( e ) {
				glob.sync( _file + '/*' ).forEach( function ( _file ) {
					var subMethod = getMethod( _file );
					if ( subMethod ) {
						obj[ method ][ subMethod ] = require( _file );
					}
				} );
			}
		}
	} );

	return obj;
};