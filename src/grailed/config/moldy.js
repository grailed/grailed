module.exports = {
	init: function ( _next ) {
		var _ = require( 'underscore' ),
			cast = require( 'sc-cast' ),
			is = require( 'sc-is' ),
			moldy = grailed.moldy = require( 'moldy' );

		/**
		 * Override all moldy models so when they are created the find methods mixin
		 * `deleted $ne true` as we're not physically deleting items
		 */
		moldy.__extend = moldy.extend;
		moldy.extend = function ( _name, _schema ) {
			var model = moldy.__extend( _name, _schema );

			model.__$find = model.$find;
			model.__$findOne = model.$findOne;
			model.__create = model.create;
			model.__$destroy = model.$destroy;

			model.$find = function ( _query, _callback ) {
				var query = is.an.object( _query ) ? _query : {},
					callback = is.a.func( _query ) ? _query : _callback,
					includeDeleted = cast( query.includeDeleted, 'boolean', false );

				if ( !includeDeleted ) {
					query.deleted = {
						$ne: true
					};
				}

				delete query.includeDeleted;

				return model.__$find( query, callback );
			};

			model.$findOne = function ( _query, _callback ) {
				var query = is.an.object( _query ) ? _query : {},
					callback = is.a.func( _query ) ? _query : _callback,
					includeDeleted = cast( query.includeDeleted, 'boolean', false );

				if ( !includeDeleted ) {
					query.deleted = {
						$ne: true
					};
				}

				delete query.includeDeleted;

				return model.__$findOne( query, callback );
			};

			model.create = function ( _initial ) {
				var createdModel = model.__create( _initial );

				createdModel.__$save = createdModel.$save;
				createdModel.__$destroy = createdModel.$destroy;

				createdModel.$save = function ( _options, _callback ) {
					var options = is.an.object( _options ) ? _options : null,
						cb = _.last( arguments );

					if ( !options || !options.doNotChangeModDates ) {
						if ( !createdModel.id ) {
							createdModel.createdAt = new Date();
						}
						createdModel.updatedAt = new Date();
					}

					if ( options ) {
						createdModel.__$save( options, cb );
					} else {
						createdModel.__$save( cb );
					}
				};

				// We only want modify $destroy if schema has it specified
				if ( createdModel.id && typeof createdModel.deleted !== 'undefined' ) {

					createdModel.$destroy = function ( _callback ) {
						createdModel.deletedAt = new Date();
						createdModel.deleted = true;

						createdModel.__$save( _callback );
					};

				}


				return createdModel;
			};


			return model;
		};

		var db = grailed.database,
			dbAddress = 'mongodb://' +
			( db.username ) +
			( db.password ? ':' + db.password : '' ) +
			( db.username ? '@' : '' ) +
			( db.secondaryServer ? db.secondaryServer + ( db.secondaryServerPort ? ':' + db.secondaryServerPort : '' ) + ',' : '' ) +
			( db.primaryServer + ( db.primaryServerPort ? ':' + db.primaryServerPort : '' ) ) +
			( '/' );

		try {
			var moldyMongoAdapter = require( 'moldy-mongo-adapter' );
			moldy.use( moldyMongoAdapter );
			moldy.adapters.mongodb.config.databaseName = db.databaseName;
			moldy.adapters.mongodb.config.connectionString = dbAddress;
		} catch ( _error ) {
			// moldy-mongo-adapter is an optional dependency. 
		}

		_next && _next();
	}
};