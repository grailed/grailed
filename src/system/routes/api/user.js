var user = grailed.controller.user;

module.exports = {
	'/api/user': {
		get: [ user.isLoggedIn, user.getLoggedInUser ],
		put: [ user.isLoggedIn, user.updateUser ]
	},
	'/api/user/login': {
		post: user.login
	},
	'/api/user/logout': {
		post: user.logout
	},
	'/api/user/register': {
		post: user.registerUser
	}
};