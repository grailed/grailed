module.exports = {
	init: function ( _next ) {

		var moduleNames = Object.keys( grailed.module ),
			mod;
		for ( var i = 0; i < moduleNames.length; i++ ) {
			mod = grailed.module[ moduleNames[ i ] ];
			if ( typeof mod.initRouter == 'function' ) {
				mod.initRouter();
			}
		}

		_next && _next();
	}
};