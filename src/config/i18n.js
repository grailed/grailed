var path = require( 'path' ),
	glob = require( 'glob' ),
	hasKey = require( 'sc-haskey' ),
	merge = require( 'sc-merge' );

var i18n = {},
	config = {
		defaultLocale: 'en',
		locale: ''
	};

exports = module.exports = function ( _config ) {
	config = merge( config, _config );
}

glob.sync( path.join( process.env.GRAILED_PATH_CONFIG, 'i18n/*.json' ) ).forEach( function ( _path ) {
	var code = _path.match( /([\w-]+)\.json$/i )[ 1 ],
		locale = require( _path );

	i18n[ code ] = locale;

	Object.keys( locale ).forEach( function ( _localeKey ) {
		if ( exports.hasOwnProperty( _localeKey ) ) return;

		Object.defineProperty( exports, _localeKey, {
			get: function () {
				var locale = config.locale || config.defaultLocale;
				return i18n[ locale ][ _localeKey ];
			}
		} );
	} );
} );