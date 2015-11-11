# Grailed 2.0

Grailed is a skinny framework using a divorced client & api pattern to help glue your monolith together using Node.js, Mongo & Express.

## Contents

- [Install Dependencies](#install-dependencies)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
	- [Database](#database)
	- [Environment](#environment)
	- [Middleware](#middleware)
- [Start the App](#start-the-app)
- [API](#api)
    - [Creating API Files](#creating-api-files)
    - [Controllers](#controllers)
    - [Models](#models)
    - [Routes](#routes)
    - [Services](#services)
- [Client](#client)
    - [Components](#components)
    - [Dependencies](#dependencies)
    - [Views](#views)
- [Public](#public)
- [Tasks](#tasks)
- [Tests](#tests)
	- [Create Tests](#create-tests)
- [Data Migration](#data-migration)
- [Roadmap](#roadmap)

### Install Dependencies

1. Install mongo [read how](http://docs.mongodb.org/manual)
2. Install node [read how](http://nodejs.org)
3. Install gulp `[sudo] npm install -g gulp`

### Getting Started

1. Run `make`
2. Configure the database `config/database.js`
3. Run the tests `npm test` to ensure everything is working

### Configuration

Grailed is pre-configured to work immediately.

File                    | Value
----------------------- | -----
`config/database.js`    | Database
`config/environment.js` | Environment
`config/middleware.js`  | Middleware

> Even though Grailed has been pre-configured the first thing you will want to do is change the database config.

#### Database

MongoDB database config. Ensure `default` is properly populated. Make changes to each environment as required.

```javascript
module.exports = {

	default: {
		databaseName: grailed.env.DATABASE_NAME || 'grailed',
		username: grailed.env.DATABASE_USERNAME || '',
		password: grailed.env.DATABASE_PASSWORD || '',
		primaryServer: grailed.env.DATABASE_PRIMARY_SERVER || '127.0.0.1',
		primaryServerPort: grailed.env.DATABASE_PRIMARY_SERVER_PORT || '27017',
		secondaryServer: grailed.env.DATABASE_SECONDARY_SERVER || '',
		secondaryServerPort: grailed.env.DATABASE_SECONDARY_SERVER_PORT || ''
	},

	development: {},
	production: {},
	test: {
	    databaseName: 'grailed_test'
	}

}
```

What happens behind the scenes:

```javascript
extend({db}.default, {db}[process.env.NODE_ENV]
```

To access the database settings:

```javascript
grailed.database[databaseName...]
```

#### Environment

Grailed environment config.

```javascript
module.exports = {

	default: {
	    SALT: 'these pretzels are making me thirsty'
	},
	development: {},
	production: {},
	test: {}

}
```

What happens behind the scenes:

```javascript
extend({env}.default, {env}[process.env.NODE_ENV]
```

To access the environment settings:

```javascript
grailed.env.SALT
```


#### Middleware

The middleware stack.

Middleware object represented by a `name` & `method`.


```javascript
{
    name: an arbitrary string
    method: the middleware function (or 'default')
}
```

Defaults are provided using the following names:

- `logger` (https://npmjs.com/morgan)
- `bodyParser` (https://npmjs.com/body-parser)
- `cookieParser` (https://npmjs.com/cookie-parser)
- `static` (http://expressjs.com/4x/api.html#express.static)
- `getGrailed` (attaches the `grailed` object to the request)
- `getUserBySessionToken` (attaches the logged in user to the request object)
- `routes` (A placeholder for Grailed to know where the routes are in the stack)
- `404Handler` (Grailed 404 handler)
- `errorHandler` (Grailed error handler)


### Start the App

`npm start` or `gulp run`


### API

Grailed's API uses an (S)MVC design pattern.

When a request is made the work-flow is designed like this:

1. A `route` is triggered
2. The `route` calls a `controller`
3. The `controller` calls a `service`
4. The `service` handles the logic & requires relevant `models`
5. The `service` calls the `controllers` callback
6. The `controller` responds

Folder                  | Description
----------------------- | -----------
`src/api/controllers`   | App controllers
`src/api/models`        | App models
`src/api/routes`        | App routes
`src/api/services`      | App services

#### Creating API Files

Creating controllers, models, routes or services is easy. Just place a file in the relevant folder and it is then registered using the file name for the name of the object.

For example, adding a controller called `userController`

Create a file in `src/api/controllers/userController.js`

```
module.exports = {
	follow: function () {...},
	block: function () {...}
}
```

This is now a controller `grailed.controller.userController`

For monoliths, you can break down the object methods even further.

1. Create a folder `src/api/controllers/userController`
2. Add a file `src/api/controllers/userController/follow.js`
3. Add a file `src/api/controllers/userController/block.js`

`src/api/controllers/userController/follow.js`

```javascript
module.exports = function () {...}
```

`src/api/controllers/userController/block.js`

```javascript
module.exports = function () {...}
```

```javascript
grailed.controller.userController.follow();
grailed.controller.userController.block();
```


#### Controllers

Typically a controller is only responsible for 3 small processes hence the title 'skinny controller'.

1. Accept the request
2. Call a service
3. Respond or forward if an error exists

```javascript
module.exports = {
	block: function ( _req, _res, _next ) {
		grailed.service.user.block( _req.body, function ( _error, _user ) {
			if ( _error ) return _next( _error );
			_res.json( _user );
		} );
	}
}
```

#### Models

In Grailed, a model describes data usually in some sort of schema. Typically a service would pass dirty data to a model. The model would sanitise/validate the data and in some cases provide methods for saving, finding and destroying.

Grailed recommends [Moldy](http://moldy.io) for modelling.

An example model setup using Moldy.

`src/api/models/user/index.js`

```javascript
module.exports = grailed.module.moldy.extend( 'user', require( './schema' ) );
```

`src/api/models/user/schema.json`

```javascript
{
	"properties": {
		"active": "boolean",
		"email": "string",
		"name": "string",
		"password": "string",
		"salt": "string"
	}
}
```

#### Routes

Straight forward routing thanks to [Express](https://www.npmjs.com/package/express).

```javascript
module.exports = {
	'/': {
		get: grailed.controller.view.main
	},
	'/api/user/:id': {
	    get: [grailed.controller.user.isLoggedIn, grailed.controller.user.get],
	    put: [grailed.controller.user.isLoggedIn, grailed.controller.user.update]
	}
};
```

#### Services

Services usually handle the majority of the logic and are therefore 'fat'. Typically services are asynchronous and have a callback as the last argument. If data modelling is required a service may call a model.

```javascript
module.exports = {
	block: function( _user, _callback ){
	    var user = grailed.model.user.create( _user );
	    user.isBlocked = true;
	    user.$save( _callback );
	}
};
```

> This example is using [Moldy](http://moldy.io) models.

### Client

The client aka front-end. Grailed tasks are responsible for building and moving the relevant files to a publicly available folder.

Key                         | Description
--------------------------- | -----------
`/src/client/components`    | App components
`/src/client/dependencies`  | App dependencies (jQuery, angular etc)
`/src/client/views`         | App views (ejs, jade etc)

#### Components

Client components are defined as coupled javascript and css (less). Grailed tasks automatically bundle components.

Say you want to create a custom carousel component.

1. Create a file/folder structure

- `/src/client/components/myCustomCarousel/assets/map.png`
- `/src/client/components/myCustomCarousel/scripts/index.js`
- `/src/client/components/myCustomCarousel/styles/index.less`

> The javascript is processed with [browserify](http://browserify.org). The folder name becomes the global variable name (e.g. `myCustomCarousel `)

> The css is process with [less](http://lesscss.org)

2. To build the component, run `gulp`

> The built in tasks will automatically pick up new components.

> Components are processed and placed in `/public/components/{app name}/{component name}`


#### Dependencies

Dependencies are typically javascript libraries like jQuery, angular and underscore. This feature in Grailed is simple. Grailed's tasks will simply concat these files and place a single file in `/public/components/{app name}/dependencies.js`.

The dependency manifest file:

`/src/client/dependencies/scripts.js`

```javascript
/**
 * Dependency stack. Preferably use the pre-minified versions as grailed will
 * simply concat this list.
 */
module.exports = [
	grailed.env.PATH_PUBLIC + '/components/jquery/dist/jquery.min.js',
	grailed.env.PATH_PUBLIC + '/components/angular/angular.min.js'
];
```

> It was a design decision not to bake in a css dependency. css dependency is tricky when the css refers to relative assets. css dependency can be handled with in your own components by @import or you can extend the Grailed tasks to suit your own needs.

#### Views

The express view folder.

Given the controller referencing a view called `main.ejs`

```javascript
module.exports = function ( _req, _res, _next ) {
	_res.render( 'main.ejs', {...} );
};
```

Where `main.ejs` is stored `/src/client/views/main.ejs`

### Public

The public folder is where Express serves static content from.

### Tasks

The task runner is [gulp](http://gulpjs.com) which should be installed globally.

Grailed has built in common tasks such as:

Task   | Description
------ | -----------
build  | Builds all css/less & javascript
minify | Minifys all javascript
run    | Runs the server & starts watching files for changes

To run the tasks:

`gulp` or `gulp {task}`

The built in tasks can be extended. See `/tasks` folder.

Given `/tasks/build.js`

```javascript
gulp.task( 'anotherTask', function () {} );
module.exports = ['anotherTask'];
```


### Tests

`npm test` or `mocha test/api/specs/${file}`

These functional tests are designed to test the api end to end. So in a normal test the following automatically will occur.

- setup
	- Grailed starts in a test environment
	- a setup hook is available here `/test/api/setup.js`
- specs are run in serial using mocha
	- specs are defined in `/test/api/config.js`
	- data is stored in a test database defined in `/config/database.js`
- tearDown
	- the test database is dropped
	- a tearDown hook is available here `/test/api/tearDown.js`

#### Create Tests

`/test/api/specs`

In a "normal" setup, all you need to do is duplicate `/test/api/specs/.example` and name it something like `mytest.js` and the default globbing pattern will include it.

Perhaps a bad design decision, some globals are defined to help write less code.

Key       | Description
--------- | -----------
`test`    | The test helper Object
`request` | Request (npmjs.org/request)
`_`       | Underscore (npmjs.org/underscore)
`async`   | Async (npmjs.org/async)
`should`  | Should (npmjs.org/should)


#### Test Config

`test/api/config.js`

Key         | Description
----------- | -----------
`specs`     | An Array strings that represent the paths of your specs (globbing supported)
`baseUrl`   | A String that defines the API's base url
`setup`     | A Function that defines your custom setup hook
`tearDown`  | A Function that defines your custom tearDown hook

### Data Migration

Basic data migration is built in using [migration](https://www.npmjs.com/package/migration).

1. Install migration globally `[sudo] npm install migration -g`
2. Create a migration
    3. `migrate create {name}`
    4. Copy the contents from `/migrations/.example` to the new migration file e.g. `/migrations/001-{name}.js`
    5. Duplicate `/migrations/dump/.example`, populate it & name it the same name as the newly created migration file e.g. `/migrations/dump/001-{name}.json`

So you should have ended up with:

* `migrate create initial`
* `/migrations/001-initial.js`
* `/migrations/dump/001-initial.json`

The dump file is the JSON data you are migrating. In the example below `user` is the MongoDB collection.

```javascript
{
	"user": [ {
		"_id": {
			"$oid": "53a21ed266fa537e1559a24d",
			"__insertMethod": "mergeIfExists"
		},
		"name": "david"
	} ]
}
```

The `__insertMethod` parameter is optional, and specifies what happens when the item already exists in the database. The following actions are available:

__insertMethod | Description         
---------------|---------------------
skipIfExists   | Default. Don't do anything if the entry already exists.
mergeIfExists  | Merge the provided values over the top of the existing values.

### Roadmap

- Add database adapters
- Add config to choose a css processors e.g. less, sass
- Add API components e.g. grailed-user-component which includes routes, controllers, models etc
- Add a Grailed-ClI
- i18n support

> More to come
