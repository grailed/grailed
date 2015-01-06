module.exports = function () {
	var obj = {},
		glob = require( 'glob' ),
		paths = Array.prototype.slice.call( arguments );

	var getMethod = function ( _file ) {
		var method = _file.match( /\/([\w-]*)(\.js)?$/i );
		return method && method[ 1 ] ? method[ 1 ] : null;
	};

	paths.forEach( function ( _path ) {
		glob.sync( _path ).forEach( function ( _file ) {
			var method = getMethod( _file );
			if ( method ) {

				obj[ method ] = obj[ method ] || {};

				try {
					obj[ method ] = require( _file );
				} catch ( e ) {
					//Check if its a directory.
					var files = glob.sync( _file + '/*' );
					if ( files.length > 0 ) {
						files.forEach( function ( _file ) {
							var subMethod = getMethod( _file );
							if ( subMethod ) {
								obj[ method ][ subMethod ] = require( _file );
							}
						} );

					} else {
						console.log( 'ERROR requiring', _file, e.stack );
						throw e;
					}
				}
			}
		} );
	} );

	return obj;
};