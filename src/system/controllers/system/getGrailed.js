module.exports = function ( _req, _res, _next ) {
	_req.grailed = grailed;
	_next();
};