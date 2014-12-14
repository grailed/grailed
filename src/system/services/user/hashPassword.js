module.exports = function ( _salt, _password ) {
	return grailed.service.system.createHash( grailed.env.SALT, _salt, _password );
};