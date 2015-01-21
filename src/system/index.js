module.exports = function ( grailed ) {
	var path = require( 'path' ),
		is = require( 'sc-is' ),
		requireMethods = require( './helpers/requireMethodsGlob' ),
		appApiPath = process.env.GRAILED_PATH_API,
		merge = require( 'sc-merge' );

	var system = {},
		app = {};

	/**
	 * Environment, Database & ODM
	 */
	grailed.module( 'moldy', require( 'moldy' ) );
	grailed.set( 'env', require( '../config/environment' ) );
	grailed.set( 'database', require( '../config/database' ) );
	grailed.config( 'moldy', require( '../config/moldy' ) );

	grailed.once( 'start', function () {

		/**
		 * Models, Services & Controllers
		 */
		system.model = requireMethods( __dirname + '/models/*' );
		app.model = requireMethods( appApiPath + '/models/*' );
		system.service = requireMethods( __dirname + '/services/*' );
		app.service = requireMethods( appApiPath + '/services/*' );
		system.controller = requireMethods( __dirname + '/controllers/*' );
		app.controller = requireMethods( appApiPath + '/controllers/*' );

		[ 'controller', 'service', 'model' ].forEach( function ( _entity ) {
			var methods = {};

			[ system, app ].forEach( function ( construct ) {
				var entity = construct[ _entity ];

				Object.keys( entity ).forEach( function ( _key ) {
					methods[ _key ] = methods[ _key ] || {};
					for ( var entityKey in entity[ _key ] ) {
						var method = entity[ _key ][ entityKey ];
						methods[ _key ][ entityKey ] = method;
					}
				} );
			} );

			Object.keys( methods ).forEach( function ( _key ) {
				grailed[ _entity ]( _key, methods[ _key ] );
			} );

		} );


		/**
		 * Routes
		 */
		system.route = [];

		var setupRoute = function ( _routesBatch ) {
			if ( is.an.object( _routesBatch ) ) {
				Object.keys( _routesBatch ).forEach( function ( _routeKey ) {
					setupRoute( _routesBatch[ _routeKey ] );
				} );
				return;
			} else if ( is.an.array( _routesBatch ) ) {
				_routesBatch.forEach( function ( _route ) {
					system.route.push( _route );
				} );
			} else {
				throw new Error( 'Unknown route type. You must export an array.' );
			}
		};

		setupRoute( requireMethods( __dirname + '/routes/*' ) || {} );
		setupRoute( requireMethods( appApiPath + '/routes/*' ) || {} );

		Object.keys( system.route ).forEach( function ( _key ) {
			grailed.route( _key, system.route[ _key ] );
		} );


		/**
		 * Execute the Bootstrap hook and then setup Express
		 */
		var bootstrap;

		try {
			bootstrap = require( path.join( process.env.GRAILED_PATH_CONFIG, 'bootstrap' ) );
		} catch ( e ) {};

		if ( bootstrap ) {
			bootstrap( function () {
				require( '../config/express' );
			} );
		} else {
			require( '../config/express' );
		}

	} );

	return system;
};