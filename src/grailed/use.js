module.exports = function ( _module ) {
	var is = require( 'sc-is' ),
		module = _module || null;

	if ( !module ) throw new Error( 'An invalid module was given', _module );
	if ( !module.name ) throw new Error( 'A module was given that did not have a `name` property', _module );

	grailed.module[ module.name ] = module;
};