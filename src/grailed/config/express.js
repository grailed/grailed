module.exports = {
	init: function ( _next ) {
		var async = require( 'async' ),
			express = require( 'express' ),
			hasKey = require( 'sc-haskey' ),
			is = require( 'sc-is' ),
			path = require( 'path' ),
			http = require( 'http' ),
			error = grailed.system.helpers.error;

		var app = grailed.express = express();
		var server = http.Server( app );

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

					middleware.forEach( function ( _middleware ) {
						var method = is.a.func( _middleware.method ) ? _middleware.method : null,
							router = hasKey( _middleware, 'method.router', 'function' ) ? _middleware.method.router : null,
							baseUrl = hasKey( _middleware, 'baseUrl', 'string' ) ? _middleware.baseUrl : '',
							name = hasKey( _middleware, 'method.name', 'string' ) ? _middleware.method.name : is.a.string( _middleware.name ) ? _middleware.name : '';

						switch ( name ) {

						case 'logger':
							var logger = require( 'morgan' );

							if ( method ) {
								app.use( method );
							} else if ( !/^(test)$/i.test( process.env.NODE_ENV ) ) {
								app.use( logger( 'dev' ) );
							}
							break;

						case 'compression':
							var compression = require( 'compression' );

							if ( method ) {
								app.use( method );
							} else {
								app.use( compression() );
							}
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
							break;

						case 'socket.io':
							var io = grailed.io = require( 'socket.io' )( server );

							break;

						case 'cookieParser':
							var cookieParser = require( 'cookie-parser' );

							app.use( method || cookieParser() );
							break;

						case 'i18n':
							try {

								if ( method ) {
									app.use( method );
								} else {
									var i18n = grailed.i18n = require( 'i18n' ),
										i18nConfig = require( path.join( grailed.env.PATH_CONFIG, 'i18n' ) );

									if ( is.not.an.object( i18nConfig ) ) return;
									i18n.configure( i18nConfig );
									app.use( i18n.init );
								}
							} catch ( e ) {
								console.log( 'error', e );
							}
							break;

						case 'static':
							app.use( method || express.static( grailed.env.PATH_PUBLIC ) );
							break;

						case '404Handler':

							app.use( function ( req, res, next ) {
								if ( req instanceof Error ) return next( err );
								grailed.module.system.controller.error[ '404' ].apply( this, arguments );
							} );

							break;

						case 'errorHandler':

							app.use( function ( err, req, res, next ) {
								var status = err.status || 500;

								if ( app.get( 'env' ) !== 'production' ) {
									if ( status === 500 ) {
										console.error( 'Unexpected server error:', err.stack );
										grailed.system.helpers.error( 500, err );
									}
								}

								res.status( status ).json( {
									error: {
										message: err.message,
										status: status
									}
								} );
							} );

							break;

						default:
							if ( !grailed.module[ name ] ) grailed.module[ name ] = _middleware.method;
							if ( is.a.func( method ) ) {
								app.use( baseUrl, method );
							} else if ( router ) {
								app.use( baseUrl, router );
							}
							break;
						}
					} );

					_next();
				},

				/**
				 * Listen
				 */
				function ( _next ) {
					var debug = require( 'debug' )( grailed.env.APP_NAME );

					debug( 'env', app.get( 'env' ) );

					app.set( 'port', process.env.PORT || 3000 );

					server.listen( app.get( 'port' ), function () {
						debug( 'Express server listening on port ' + server.address().port );
						_next();
					} );
				}

			],
			_next );
	}
};