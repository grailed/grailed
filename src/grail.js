var emitter = require( 'emitter-component' ),
	extendify = require( 'sc-extendify' ),
	is = require( 'sc-is' );

var Grail = extendify( {

	init: function () {
		var self = this;

		Object.defineProperties( self, {
			__base: {
				value: extendify()
			},
			__class: {
				value: {},
				writable: true
			},
			__config: {
				value: {},
				writable: true
			},
			__controller: {
				value: {},
				writable: true
			},
			__engine: {
				value: {},
				writable: true
			},
			__model: {
				value: {},
				writable: true
			},
			__module: {
				value: {},
				writable: true
			},
			__route: {
				value: {},
				writable: true
			},
			classes: {
				get: function () {
					return this.__class;
				}
			},
			configs: {
				get: function () {
					return this.__config;
				}
			},
			controllers: {
				get: function () {
					return this.__controller;
				}
			},
			models: {
				get: function () {
					return this.__model;
				}
			},
			modules: {
				get: function () {
					return this.__module;
				}
			},
			routes: {
				get: function () {
					return this.__route;
				}
			}
		} );

		self.class.extend = function ( _class ) {
			return self.__base.extend( _class );
		};

	},

	class: function ( _name, _class ) {
		var self = this;

		if ( is.not.nullOrUndefined( _class ) ) {
			self.__class[ _name ] = _class;
			Object.defineProperty( self.class, _name, {
				get: function () {
					return self.__class[ _name ];
				}
			} );
		} else {
			return self.__class[ _name ];
		}

		return self;
	},

	config: function ( _name, _config ) {
		var self = this;

		if ( is.not.nullOrUndefined( _config ) ) {
			self.__config[ _name ] = _config;
			Object.defineProperty( self.config, _name, {
				get: function () {
					return self.__config[ _name ];
				}
			} );
		} else {
			return self.__config[ _name ];
		}

		return self;
	},

	controller: function ( _name, _controller ) {
		var self = this;

		if ( is.not.nullOrUndefined( _controller ) ) {

			// If this is an instance of `sc-extendify` and has not been
			// instantiated, instantiate it
			if ( is.a.func( _controller ) && is.a.func( _controller.extend ) ) {
				try {
					_controller = new _controller();
				} catch ( e ) {}
			}

			self.__controller[ _name ] = _controller;
			Object.defineProperty( self.controller, _name, {
				get: function () {
					return self.__controller[ _name ];
				}
			} );
		} else {
			return self.__controller[ _name ];
		}

		return self;
	},

	engine: function ( _engine ) {
		var self = this;

		if ( is.not.a.func( _engine ) ) {
			throw new Error( 'The given Grailed engine must be a function' );
		}

		self.__engine = _engine;
		self.__engine( self );

		return self;
	},

	end: function ( _callback ) {
		var self = this;

		self.emit( 'end' );

		if ( typeof _callback === 'function' ) {
			_callback();
		}

		return self;
	},

	model: function ( _name, _schema ) {
		var self = this;

		if ( is.not.nullOrUndefined( _schema ) ) {
			self.__model[ _name ] = _schema;
			Object.defineProperty( self.model, _name, {
				get: function () {
					return self.__model[ _name ];
				}
			} );
		} else {
			return self.__model[ _name ];
		}

		return self;
	},

	module: function ( _name, _module ) {
		var self = this;

		if ( is.not.nullOrUndefined( _module ) ) {
			self.__module[ _name ] = _module;
			Object.defineProperty( self.module, _name, {
				get: function () {
					return self.__module[ _name ];
				}
			} );
		} else {
			return self.__module[ _name ];
		}

		return self;
	},

	route: function ( _name, _options ) {
		var self = this;

		if ( is.not.nullOrUndefined( _options ) ) {
			self.__route[ _name ] = _options;
			Object.defineProperty( self.route, _name, {
				get: function () {
					return self.__route[ _name ];
				}
			} );
		} else {
			return self.__route[ _name ];
		}

		return self;
	},

	set: function ( _key, _value ) {
		var self = this;

		if ( is.not.nullOrUndefined( _value ) ) {
			self[ _key ] = _value;
		} else {
			return self[ _key ];
		}

		return self;
	}

} );

emitter( Grail.prototype );
exports = module.exports = Grail;