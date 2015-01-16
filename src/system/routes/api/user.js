var user = grailed.controller.user;

module.exports = [ {
	route: '/api/user',
	get: [ user.isLoggedIn, user.getLoggedInUser ],
	put: [ user.isLoggedIn, user.updateUser ]
}, {
	route: '/api/user/login',
	post: user.login
}, {
	route: '/api/user/logout',
	post: user.logout
}, {
	route: '/api/user/register',
	post: user.registerUser
} ];