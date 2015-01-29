module.exports = function ( _module ) {
	var is = require( 'sc-is' ),
		module = _module || null;

	if ( !module ) throw new Error( 'An invalid module was given', _module );
	if ( module.routes && is.not.an.array( module.routes ) ) throw new Error( 'Unknown route type. You must export an array.', module );

	/**
	 * Routes
	 */
	if ( module.routes ) {
		grailed.routes = is.an.array( grailed.routes ) ? grailed.routes : [];
		module.routes.forEach( function ( _route ) {
			grailed.routes.push( _route );
		} );
	}

	grailed.module[ module.name ] = module;
};