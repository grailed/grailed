var _ = require( 'underscore' ),
	path = require( 'path' ),
	env = require( path.join( process.env.GRAILED_PATH_GRAILED, '/bin/env' ) );

exports = module.exports = _.extend( {}, env );
exports.PATH_COMPONENTS_APP = path.join( exports.PATH_CLIENT, 'components' );
exports.PATH_COMPONENTS_PUBLIC = path.join( exports.PATH_PUBLIC, 'components' );