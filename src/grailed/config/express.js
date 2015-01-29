module.exports = {
	init: function ( _next ) {
		var async = require( 'async' ),
			express = require( 'express' ),
			is = require( 'sc-is' ),
			path = require( 'path' ),
			error = grailed.system.helpers.error;

		var app = grailed.express = express();

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
				 * Bootstrap
				 */
					function ( _next ) {
					grailed.config.bootstrap.init( _next );
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

							case 'grailed':
								app.use( method || grailed.module.system.middleware.grailed );
								_next();
								break;

							case 'i18n':
								try {

									if ( method ) {
										app.use( method );
									} else {
										var i18n = grailed.i18n = require( 'i18n' ),
											i18nConfig = require( path.join( grailed.env.PATH_CONFIG, 'i18n' ) );

										if ( is.not.an.object( i18nConfig ) ) return _next();
										i18n.configure( i18nConfig );
										app.use( i18n.init );
									}
									_next();
								} catch ( e ) {
									console.log( 'error', e );
									_next();
								}
								break;

							case 'routes':
								var router = express.Router();

								var initRoute = function ( _route ) {
									var routePath = _route.route;
									Object.keys( _route ).forEach( function ( _method ) {
										if ( _method === 'route' || _method === 'methods' ) {
											return;
										}
										var routeController = _route[ _method ],
											routeControllers = Array.isArray( routeController ) ? routeController : [ routeController ],
											routeArgs = [ routePath ];

										routeControllers.forEach( function ( _routeController ) {
											if ( !_routeController ) {
												error( 'Undefined middleware on route ' + _method.toUpperCase() + ' ' + routePath + ' index: ' + routeControllers.indexOf( _routeController ) );
												//Will throw undefined error on the next line.
											}
											routeArgs.push( _routeController.bind( grailed.routes[ _route ] ) );
										} );

										router[ _method ].apply( router, routeArgs );
									} );
								};

								for ( var i = 0; i < grailed.routes.length; i++ ) {
									initRoute( grailed.routes[ i ] );
								}

								grailed.router = router;
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
									grailed.module.system.controller.error[ '404' ].apply( this, arguments );
								} );
								_next();

								break;

							case 'errorHandler':

								app.use( function ( err, req, res, next ) {
									var status = err.status || 500;

									if ( app.get( 'env' ) !== 'production' ) {
										if ( status === 500 ) {
											console.error( 'Unexpected server error:', err.stack );
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
					function ( _next ) {
					var debug = require( 'debug' )( grailed.env.APP_NAME );

					debug( 'env', app.get( 'env' ) );

					app.set( 'port', process.env.PORT || 3000 );

					var server = app.listen( app.get( 'port' ), function () {
						debug( 'Express server listening on port ' + server.address().port );
						_next();
					} );
				}

			],
			_next );
	}
};