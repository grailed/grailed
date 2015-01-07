var async = require( 'async' ),
	express = require( 'express' ),
	is = require( 'sc-is' ),
	path = require( 'path' ),
	error = require( path.join( grailed.env.PATH_GRAILED, '/src/system/helpers/error' ) )

var app = express();

async.waterfall( [

	/**
	 * View Engine
	 */
	function ( _next ) {
		app.set( 'views', path.join( grailed.env.PATH_CLIENT, grailed.env.FOLDER_VIEWS ) );
		app.set( 'view engine', grailed.env.VIEW_ENGINE || 'ejs' );
		_next();
	},

	/**
	 * Middlware
	 */
	function ( _next ) {
		var middleware = require( path.join( grailed.env.PATH_CONFIG, 'middleware' ) );

		async.eachSeries( middleware, function ( _middleware, _next ) {
			var name = is.a.string( _middleware.name ) ? _middleware.name : '',
				method = is.a.func( _middleware.method ) ? _middleware.method : null;

			switch ( name ) {

			case 'logger':
				var logger = require( 'morgan' );

				if ( method ) {
					app.use( method );
				} else if ( !/^(test)$/i.test( process.env.NODE_ENV ) ) {
					app.use( logger( 'dev' ) );
				}
				_next();
				break;

			case 'bodyParser':
				var bodyParser = require( 'body-parser' );

				if ( method ) {
					app.use( method );
				} else {
					app.use( bodyParser.urlencoded( {
						extended: false
					} ) );
					app.use( bodyParser.json() );
				}
				_next();
				break;

			case 'cookieParser':
				var cookieParser = require( 'cookie-parser' );

				app.use( method || cookieParser() );
				_next();
				break;

			case 'getGrailed':
				app.use( method || grailed.controller.system.getGrailed );
				_next();
				break;

			case 'getUserBySessionToken':
				app.use( method || grailed.controller.user.getUserBySessionToken );
				_next();
				break;

			case 'routes':
				var router = express.Router();

				Object.keys( grailed.routes ).forEach( function ( _route ) {
					Object.keys( grailed.routes[ _route ] ).forEach( function ( _method ) {
						var routeController = grailed.routes[ _route ][ _method ],
							routeControllers = Array.isArray( routeController ) ? routeController : [ routeController ],
							routeArgs = [ _route ];

						routeControllers.forEach( function ( _routeController ) {
							if ( !_routeController ) {
								error( 'Undefined middleware on route ' + _method.toUpperCase() + ' ' + _route );
								//Will throw undefined error on the next line.
							}
							routeArgs.push( _routeController.bind( grailed.routes[ _route ] ) );
						} );

						router[ _method ].apply( router, routeArgs );
					} );
				} );

				app.use( router );

				_next();
				break;

			case 'static':
				app.use( method || express.static( grailed.env.PATH_PUBLIC ) );
				_next();
				break;

			case '404Handler':

				app.use( function ( req, res, next ) {
					if ( req instanceof Error ) return next( err );
					grailed.controller.view.error404.apply( this, arguments );
				} );
				_next();

				break;

			case 'errorHandler':

				app.use( function ( err, req, res, next ) {
					var status = err.status || 500;

					if ( app.get( 'env' ) !== 'production' ) {
						if ( status === 500 ) {
							grailed.service.system.error( 500, err );
						}
					}

					res.status( status ).json( {
						error: {
							message: err.message,
							status: status
						}
					} );
				} );
				_next();

				break;

			default:
				if ( is.a.func( method ) ) app.use( method );
				_next();
				break;

			}

		}, _next );
	},

	/**
	 * Listen
	 */
	function () {
		var debug = require( 'debug' )( grailed.env.APP_NAME );

		debug( 'env', app.get( 'env' ) );

		app.set( 'port', process.env.PORT || 3000 );

		var server = app.listen( app.get( 'port' ), function () {
			debug( 'Express server listening on port ' + server.address().port );
			grailed.emit( 'express:done' );
		} );
	}

], function () {
	grailed.emit( 'end' );
} );