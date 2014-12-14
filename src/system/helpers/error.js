module.exports = function ( _message, _error ) {
	var clc = require( 'cli-color' );

	var error = typeof _message === 'object' ? _message : _error || {},
		message = typeof _message === 'string' ? _message : error.message || 'An unknown error occurred';

	console.error( clc.red( 'Grailed Error:' ), message );

	if ( error.stack ) {
		console.error( clc.blackBright( error.stack ) );
	}
};