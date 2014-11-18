!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.grailed=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(_dereq_,module,exports){
var extend = function ( object ) {

	/**
	 * John Resig's "Simple JavaScript Inheritance"
	 * @url http://ejohn.org/blog/simple-javascript-inheritance
	 */
	var initializing = false,
		fnTest = /xyz/.test( function () {
			xyz;
		} ) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	var Class = function () {};

	// Create a new Class that inherits from this class
	Class.extend = function ( prop ) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for ( var name in prop ) {
			// Check if we're overwriting an existing function
			prototype[ name ] = typeof prop[ name ] == "function" &&
				typeof _super[ name ] == "function" && fnTest.test( prop[ name ] ) ?
				( function ( name, fn ) {
				return function () {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[ name ];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply( this, arguments );
					this._super = tmp;

					return ret;
				};
			} )( name, prop[ name ] ) :
				prop[ name ];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if ( !initializing && this.init )
				this.init.apply( this, arguments );
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;

	};
	/* ---- */

	return Class.extend( object );

};

module.exports = extend;
},{}],3:[function(_dereq_,module,exports){
var hasKey = _dereq_( "sc-haskey" ),
  merge = _dereq_( "sc-merge" ),
  omit = _dereq_( "sc-omit" ),
  extend = _dereq_( "./extend.johnresig.js" ),
  noop = function () {};

var extendify = function ( fn ) {

  var object,
    protos;

  fn = typeof fn === "function" || typeof fn === "object" ? fn : {};
  protos = fn.prototype || fn;
  object = merge( omit( protos, [ "constructor", "init" ] ) );
  object.init = hasKey( fn, "prototype.constructor", "function" ) ? fn.prototype.constructor : hasKey( fn, "init", "function" ) ? fn.init : typeof fn === "function" ? fn : noop;

  return extend( object );

};

module.exports = extendify;
},{"./extend.johnresig.js":2,"sc-haskey":4,"sc-merge":6,"sc-omit":8}],4:[function(_dereq_,module,exports){
var type = _dereq_( "type-component" ),
  has = Object.prototype.hasOwnProperty;

function hasKey( object, keys, keyType ) {

  object = type( object ) === "object" ? object : {}, keys = type( keys ) === "array" ? keys : [];
  keyType = type( keyType ) === "string" ? keyType : "";

  var key = keys.length > 0 ? keys.shift() : "",
    keyExists = has.call( object, key ) || object[ key ] !== void 0,
    keyValue = keyExists ? object[ key ] : undefined,
    keyTypeIsCorrect = type( keyValue ) === keyType;

  if ( keys.length > 0 && keyExists ) {
    return hasKey( object[ key ], keys, keyType );
  }

  return keys.length > 0 || keyType === "" ? keyExists : keyExists && keyTypeIsCorrect;

}

module.exports = function ( object, keys, keyType ) {

  keys = type( keys ) === "string" ? keys.split( "." ) : [];

  return hasKey( object, keys, keyType );

};
},{"type-component":5}],5:[function(_dereq_,module,exports){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val === Object(val)) return 'object';

  return typeof val;
};

},{}],6:[function(_dereq_,module,exports){
var type = _dereq_( "type-component" );

var merge = function () {

  var args = Array.prototype.slice.call( arguments ),
    deep = type( args[ 0 ] ) === "boolean" ? args.shift() : false,
    objects = args,
    result = {};

  objects.forEach( function ( objectn ) {

    if ( type( objectn ) !== "object" ) {
      return;
    }

    Object.keys( objectn ).forEach( function ( key ) {
      if ( Object.prototype.hasOwnProperty.call( objectn, key ) ) {
        if ( deep && type( objectn[ key ] ) === "object" ) {
          result[ key ] = merge( deep, {}, result[ key ], objectn[ key ] );
        } else {
          result[ key ] = objectn[ key ];
        }
      }
    } );

  } );

  return result;
};

module.exports = merge;
},{"type-component":7}],7:[function(_dereq_,module,exports){
module.exports=_dereq_(5)
},{}],8:[function(_dereq_,module,exports){
function omit( object, omittedKeys ) {
  var parsedObject = {};

  if ( object !== Object( object ) ) {
    return parsedObject;
  }

  omittedKeys = Array.isArray( omittedKeys ) ? omittedKeys : [];

  Object.keys( object ).forEach( function ( key ) {
    var keyOk = true;

    omittedKeys.forEach( function ( omittedKey ) {

      if ( keyOk === true && key === omittedKey ) {
        keyOk = false;
      }

    } );

    if ( keyOk === true ) {
      parsedObject[ key ] = object[ key ];
    }

  } );

  return parsedObject;
}

module.exports = omit;
},{}],9:[function(_dereq_,module,exports){
var type = _dereq_( "./ises/type" ),
  is = {
    a: {},
    an: {},
    not: {
      a: {},
      an: {}
    }
  };

var ises = {
  "arguments": [ "arguments", type( "arguments" ) ],
  "array": [ "array", type( "array" ) ],
  "boolean": [ "boolean", type( "boolean" ) ],
  "date": [ "date", type( "date" ) ],
  "function": [ "function", "func", "fn", type( "function" ) ],
  "null": [ "null", type( "null" ) ],
  "number": [ "number", "integer", "int", type( "number" ) ],
  "object": [ "object", type( "object" ) ],
  "regexp": [ "regexp", type( "regexp" ) ],
  "string": [ "string", type( "string" ) ],
  "undefined": [ "undefined", type( "undefined" ) ],
  "empty": [ "empty", _dereq_( "./ises/empty" ) ],
  "nullorundefined": [ "nullOrUndefined", "nullorundefined", _dereq_( "./ises/nullorundefined" ) ],
  "guid": [ "guid", _dereq_( "./ises/guid" ) ]
}

Object.keys( ises ).forEach( function ( key ) {

  var methods = ises[ key ].slice( 0, ises[ key ].length - 1 ),
    fn = ises[ key ][ ises[ key ].length - 1 ];

  methods.forEach( function ( methodKey ) {
    is[ methodKey ] = is.a[ methodKey ] = is.an[ methodKey ] = fn;
    is.not[ methodKey ] = is.not.a[ methodKey ] = is.not.an[ methodKey ] = function () {
      return fn.apply( this, arguments ) ? false : true;
    }
  } );

} );

exports = module.exports = is;
exports.type = type;
},{"./ises/empty":10,"./ises/guid":11,"./ises/nullorundefined":12,"./ises/type":13}],10:[function(_dereq_,module,exports){
var type = _dereq_("../type");

module.exports = function ( value ) {
  var empty = false;

  if ( type( value ) === "null" || type( value ) === "undefined" ) {
    empty = true;
  } else if ( type( value ) === "object" ) {
    empty = Object.keys( value ).length === 0;
  } else if ( type( value ) === "boolean" ) {
    empty = value === false;
  } else if ( type( value ) === "number" ) {
    empty = value === 0 || value === -1;
  } else if ( type( value ) === "array" || type( value ) === "string" ) {
    empty = value.length === 0;
  }

  return empty;

};
},{"../type":15}],11:[function(_dereq_,module,exports){
var guid = _dereq_( "sc-guid" );

module.exports = function ( value ) {
  return guid.isValid( value );
};
},{"sc-guid":14}],12:[function(_dereq_,module,exports){
module.exports = function ( value ) {
	return value === null || value === undefined || value === void 0;
};
},{}],13:[function(_dereq_,module,exports){
var type = _dereq_( "../type" );

module.exports = function ( _type ) {
  return function ( _value ) {
    return type( _value ) === _type;
  }
}
},{"../type":15}],14:[function(_dereq_,module,exports){
var guidRx = "{?[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}}?";

exports.generate = function () {
  var d = new Date().getTime();
  var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function ( c ) {
    var r = ( d + Math.random() * 16 ) % 16 | 0;
    d = Math.floor( d / 16 );
    return ( c === "x" ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
  } );
  return guid;
};

exports.match = function ( string ) {
  var rx = new RegExp( guidRx, "g" ),
    matches = ( typeof string === "string" ? string : "" ).match( rx );
  return Array.isArray( matches ) ? matches : [];
};

exports.isValid = function ( guid ) {
  var rx = new RegExp( guidRx );
  return rx.test( guid );
};
},{}],15:[function(_dereq_,module,exports){
var toString = Object.prototype.toString;

module.exports = function ( val ) {
  switch ( toString.call( val ) ) {
  case '[object Function]':
    return 'function';
  case '[object Date]':
    return 'date';
  case '[object RegExp]':
    return 'regexp';
  case '[object Arguments]':
    return 'arguments';
  case '[object Array]':
    return 'array';
  }

  if ( val === null ) return 'null';
  if ( val === undefined ) return 'undefined';
  if ( val === Object( val ) ) return 'object';

  return typeof val;
};
},{}],16:[function(_dereq_,module,exports){
var Grail = _dereq_( './grail' ),
	GrailedApp = {};

GrailedApp.create = function () {
	return new Grail();
};

module.exports = GrailedApp;
},{"./grail":17}],17:[function(_dereq_,module,exports){
var emitter = _dereq_( 'emitter-component' ),
	extendify = _dereq_( 'sc-extendify' ),
	is = _dereq_( 'sc-is' );

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
},{"emitter-component":1,"sc-extendify":3,"sc-is":9}]},{},[16])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZHRzdWppL1NpdGVzL2dyYWlsZWQvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL1NpdGVzL2dyYWlsZWQvbm9kZV9tb2R1bGVzL2VtaXR0ZXItY29tcG9uZW50L2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvU2l0ZXMvZ3JhaWxlZC9ub2RlX21vZHVsZXMvc2MtZXh0ZW5kaWZ5L2V4dGVuZC5qb2hucmVzaWcuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9TaXRlcy9ncmFpbGVkL25vZGVfbW9kdWxlcy9zYy1leHRlbmRpZnkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9TaXRlcy9ncmFpbGVkL25vZGVfbW9kdWxlcy9zYy1leHRlbmRpZnkvbm9kZV9tb2R1bGVzL3NjLWhhc2tleS9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL1NpdGVzL2dyYWlsZWQvbm9kZV9tb2R1bGVzL3NjLWV4dGVuZGlmeS9ub2RlX21vZHVsZXMvc2MtaGFza2V5L25vZGVfbW9kdWxlcy90eXBlLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL1NpdGVzL2dyYWlsZWQvbm9kZV9tb2R1bGVzL3NjLWV4dGVuZGlmeS9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9TaXRlcy9ncmFpbGVkL25vZGVfbW9kdWxlcy9zYy1leHRlbmRpZnkvbm9kZV9tb2R1bGVzL3NjLW9taXQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9TaXRlcy9ncmFpbGVkL25vZGVfbW9kdWxlcy9zYy1pcy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL1NpdGVzL2dyYWlsZWQvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZW1wdHkuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9TaXRlcy9ncmFpbGVkL25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL2d1aWQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9TaXRlcy9ncmFpbGVkL25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL251bGxvcnVuZGVmaW5lZC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL1NpdGVzL2dyYWlsZWQvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvdHlwZS5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL1NpdGVzL2dyYWlsZWQvbm9kZV9tb2R1bGVzL3NjLWlzL25vZGVfbW9kdWxlcy9zYy1ndWlkL2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvU2l0ZXMvZ3JhaWxlZC9ub2RlX21vZHVsZXMvc2MtaXMvdHlwZS5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL1NpdGVzL2dyYWlsZWQvc3JjL2Zha2VfNWNlNzIxZjQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9TaXRlcy9ncmFpbGVkL3NyYy9ncmFpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgc2VsZi5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwidmFyIGV4dGVuZCA9IGZ1bmN0aW9uICggb2JqZWN0ICkge1xuXG5cdC8qKlxuXHQgKiBKb2huIFJlc2lnJ3MgXCJTaW1wbGUgSmF2YVNjcmlwdCBJbmhlcml0YW5jZVwiXG5cdCAqIEB1cmwgaHR0cDovL2Vqb2huLm9yZy9ibG9nL3NpbXBsZS1qYXZhc2NyaXB0LWluaGVyaXRhbmNlXG5cdCAqL1xuXHR2YXIgaW5pdGlhbGl6aW5nID0gZmFsc2UsXG5cdFx0Zm5UZXN0ID0gL3h5ei8udGVzdCggZnVuY3Rpb24gKCkge1xuXHRcdFx0eHl6O1xuXHRcdH0gKSA/IC9cXGJfc3VwZXJcXGIvIDogLy4qLztcblxuXHQvLyBUaGUgYmFzZSBDbGFzcyBpbXBsZW1lbnRhdGlvbiAoZG9lcyBub3RoaW5nKVxuXHR2YXIgQ2xhc3MgPSBmdW5jdGlvbiAoKSB7fTtcblxuXHQvLyBDcmVhdGUgYSBuZXcgQ2xhc3MgdGhhdCBpbmhlcml0cyBmcm9tIHRoaXMgY2xhc3Ncblx0Q2xhc3MuZXh0ZW5kID0gZnVuY3Rpb24gKCBwcm9wICkge1xuXHRcdHZhciBfc3VwZXIgPSB0aGlzLnByb3RvdHlwZTtcblxuXHRcdC8vIEluc3RhbnRpYXRlIGEgYmFzZSBjbGFzcyAoYnV0IG9ubHkgY3JlYXRlIHRoZSBpbnN0YW5jZSxcblx0XHQvLyBkb24ndCBydW4gdGhlIGluaXQgY29uc3RydWN0b3IpXG5cdFx0aW5pdGlhbGl6aW5nID0gdHJ1ZTtcblx0XHR2YXIgcHJvdG90eXBlID0gbmV3IHRoaXMoKTtcblx0XHRpbml0aWFsaXppbmcgPSBmYWxzZTtcblxuXHRcdC8vIENvcHkgdGhlIHByb3BlcnRpZXMgb3ZlciBvbnRvIHRoZSBuZXcgcHJvdG90eXBlXG5cdFx0Zm9yICggdmFyIG5hbWUgaW4gcHJvcCApIHtcblx0XHRcdC8vIENoZWNrIGlmIHdlJ3JlIG92ZXJ3cml0aW5nIGFuIGV4aXN0aW5nIGZ1bmN0aW9uXG5cdFx0XHRwcm90b3R5cGVbIG5hbWUgXSA9IHR5cGVvZiBwcm9wWyBuYW1lIF0gPT0gXCJmdW5jdGlvblwiICYmXG5cdFx0XHRcdHR5cGVvZiBfc3VwZXJbIG5hbWUgXSA9PSBcImZ1bmN0aW9uXCIgJiYgZm5UZXN0LnRlc3QoIHByb3BbIG5hbWUgXSApID9cblx0XHRcdFx0KCBmdW5jdGlvbiAoIG5hbWUsIGZuICkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciB0bXAgPSB0aGlzLl9zdXBlcjtcblxuXHRcdFx0XHRcdC8vIEFkZCBhIG5ldyAuX3N1cGVyKCkgbWV0aG9kIHRoYXQgaXMgdGhlIHNhbWUgbWV0aG9kXG5cdFx0XHRcdFx0Ly8gYnV0IG9uIHRoZSBzdXBlci1jbGFzc1xuXHRcdFx0XHRcdHRoaXMuX3N1cGVyID0gX3N1cGVyWyBuYW1lIF07XG5cblx0XHRcdFx0XHQvLyBUaGUgbWV0aG9kIG9ubHkgbmVlZCB0byBiZSBib3VuZCB0ZW1wb3JhcmlseSwgc28gd2Vcblx0XHRcdFx0XHQvLyByZW1vdmUgaXQgd2hlbiB3ZSdyZSBkb25lIGV4ZWN1dGluZ1xuXHRcdFx0XHRcdHZhciByZXQgPSBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0XHRcdFx0dGhpcy5fc3VwZXIgPSB0bXA7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0XHR9O1xuXHRcdFx0fSApKCBuYW1lLCBwcm9wWyBuYW1lIF0gKSA6XG5cdFx0XHRcdHByb3BbIG5hbWUgXTtcblx0XHR9XG5cblx0XHQvLyBUaGUgZHVtbXkgY2xhc3MgY29uc3RydWN0b3Jcblx0XHRmdW5jdGlvbiBDbGFzcygpIHtcblx0XHRcdC8vIEFsbCBjb25zdHJ1Y3Rpb24gaXMgYWN0dWFsbHkgZG9uZSBpbiB0aGUgaW5pdCBtZXRob2Rcblx0XHRcdGlmICggIWluaXRpYWxpemluZyAmJiB0aGlzLmluaXQgKVxuXHRcdFx0XHR0aGlzLmluaXQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdH1cblxuXHRcdC8vIFBvcHVsYXRlIG91ciBjb25zdHJ1Y3RlZCBwcm90b3R5cGUgb2JqZWN0XG5cdFx0Q2xhc3MucHJvdG90eXBlID0gcHJvdG90eXBlO1xuXG5cdFx0Ly8gRW5mb3JjZSB0aGUgY29uc3RydWN0b3IgdG8gYmUgd2hhdCB3ZSBleHBlY3Rcblx0XHRDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGFzcztcblxuXHRcdC8vIEFuZCBtYWtlIHRoaXMgY2xhc3MgZXh0ZW5kYWJsZVxuXHRcdENsYXNzLmV4dGVuZCA9IGFyZ3VtZW50cy5jYWxsZWU7XG5cblx0XHRyZXR1cm4gQ2xhc3M7XG5cblx0fTtcblx0LyogLS0tLSAqL1xuXG5cdHJldHVybiBDbGFzcy5leHRlbmQoIG9iamVjdCApO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDsiLCJ2YXIgaGFzS2V5ID0gcmVxdWlyZSggXCJzYy1oYXNrZXlcIiApLFxuICBtZXJnZSA9IHJlcXVpcmUoIFwic2MtbWVyZ2VcIiApLFxuICBvbWl0ID0gcmVxdWlyZSggXCJzYy1vbWl0XCIgKSxcbiAgZXh0ZW5kID0gcmVxdWlyZSggXCIuL2V4dGVuZC5qb2hucmVzaWcuanNcIiApLFxuICBub29wID0gZnVuY3Rpb24gKCkge307XG5cbnZhciBleHRlbmRpZnkgPSBmdW5jdGlvbiAoIGZuICkge1xuXG4gIHZhciBvYmplY3QsXG4gICAgcHJvdG9zO1xuXG4gIGZuID0gdHlwZW9mIGZuID09PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIGZuID09PSBcIm9iamVjdFwiID8gZm4gOiB7fTtcbiAgcHJvdG9zID0gZm4ucHJvdG90eXBlIHx8IGZuO1xuICBvYmplY3QgPSBtZXJnZSggb21pdCggcHJvdG9zLCBbIFwiY29uc3RydWN0b3JcIiwgXCJpbml0XCIgXSApICk7XG4gIG9iamVjdC5pbml0ID0gaGFzS2V5KCBmbiwgXCJwcm90b3R5cGUuY29uc3RydWN0b3JcIiwgXCJmdW5jdGlvblwiICkgPyBmbi5wcm90b3R5cGUuY29uc3RydWN0b3IgOiBoYXNLZXkoIGZuLCBcImluaXRcIiwgXCJmdW5jdGlvblwiICkgPyBmbi5pbml0IDogdHlwZW9mIGZuID09PSBcImZ1bmN0aW9uXCIgPyBmbiA6IG5vb3A7XG5cbiAgcmV0dXJuIGV4dGVuZCggb2JqZWN0ICk7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kaWZ5OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCJ0eXBlLWNvbXBvbmVudFwiICksXG4gIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGhhc0tleSggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICkge1xuXG4gIG9iamVjdCA9IHR5cGUoIG9iamVjdCApID09PSBcIm9iamVjdFwiID8gb2JqZWN0IDoge30sIGtleXMgPSB0eXBlKCBrZXlzICkgPT09IFwiYXJyYXlcIiA/IGtleXMgOiBbXTtcbiAga2V5VHlwZSA9IHR5cGUoIGtleVR5cGUgKSA9PT0gXCJzdHJpbmdcIiA/IGtleVR5cGUgOiBcIlwiO1xuXG4gIHZhciBrZXkgPSBrZXlzLmxlbmd0aCA+IDAgPyBrZXlzLnNoaWZ0KCkgOiBcIlwiLFxuICAgIGtleUV4aXN0cyA9IGhhcy5jYWxsKCBvYmplY3QsIGtleSApIHx8IG9iamVjdFsga2V5IF0gIT09IHZvaWQgMCxcbiAgICBrZXlWYWx1ZSA9IGtleUV4aXN0cyA/IG9iamVjdFsga2V5IF0gOiB1bmRlZmluZWQsXG4gICAga2V5VHlwZUlzQ29ycmVjdCA9IHR5cGUoIGtleVZhbHVlICkgPT09IGtleVR5cGU7XG5cbiAgaWYgKCBrZXlzLmxlbmd0aCA+IDAgJiYga2V5RXhpc3RzICkge1xuICAgIHJldHVybiBoYXNLZXkoIG9iamVjdFsga2V5IF0sIGtleXMsIGtleVR5cGUgKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzLmxlbmd0aCA+IDAgfHwga2V5VHlwZSA9PT0gXCJcIiA/IGtleUV4aXN0cyA6IGtleUV4aXN0cyAmJiBrZXlUeXBlSXNDb3JyZWN0O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBvYmplY3QsIGtleXMsIGtleVR5cGUgKSB7XG5cbiAga2V5cyA9IHR5cGUoIGtleXMgKSA9PT0gXCJzdHJpbmdcIiA/IGtleXMuc3BsaXQoIFwiLlwiICkgOiBbXTtcblxuICByZXR1cm4gaGFzS2V5KCBvYmplY3QsIGtleXMsIGtleVR5cGUgKTtcblxufTsiLCJcbi8qKlxuICogdG9TdHJpbmcgcmVmLlxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogUmV0dXJuIHRoZSB0eXBlIG9mIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCl7XG4gIHN3aXRjaCAodG9TdHJpbmcuY2FsbCh2YWwpKSB7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOiByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgICBjYXNlICdbb2JqZWN0IERhdGVdJzogcmV0dXJuICdkYXRlJztcbiAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOiByZXR1cm4gJ3JlZ2V4cCc7XG4gICAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzogcmV0dXJuICdhcmd1bWVudHMnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJyYXldJzogcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICBpZiAodmFsID09PSBudWxsKSByZXR1cm4gJ251bGwnO1xuICBpZiAodmFsID09PSB1bmRlZmluZWQpIHJldHVybiAndW5kZWZpbmVkJztcbiAgaWYgKHZhbCA9PT0gT2JqZWN0KHZhbCkpIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07XG4iLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApO1xuXG52YXIgbWVyZ2UgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAgZGVlcCA9IHR5cGUoIGFyZ3NbIDAgXSApID09PSBcImJvb2xlYW5cIiA/IGFyZ3Muc2hpZnQoKSA6IGZhbHNlLFxuICAgIG9iamVjdHMgPSBhcmdzLFxuICAgIHJlc3VsdCA9IHt9O1xuXG4gIG9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24gKCBvYmplY3RuICkge1xuXG4gICAgaWYgKCB0eXBlKCBvYmplY3RuICkgIT09IFwib2JqZWN0XCIgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoIG9iamVjdG4gKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgIGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmplY3RuLCBrZXkgKSApIHtcbiAgICAgICAgaWYgKCBkZWVwICYmIHR5cGUoIG9iamVjdG5bIGtleSBdICkgPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgICAgcmVzdWx0WyBrZXkgXSA9IG1lcmdlKCBkZWVwLCB7fSwgcmVzdWx0WyBrZXkgXSwgb2JqZWN0blsga2V5IF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRbIGtleSBdID0gb2JqZWN0blsga2V5IF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgfSApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlOyIsImZ1bmN0aW9uIG9taXQoIG9iamVjdCwgb21pdHRlZEtleXMgKSB7XG4gIHZhciBwYXJzZWRPYmplY3QgPSB7fTtcblxuICBpZiAoIG9iamVjdCAhPT0gT2JqZWN0KCBvYmplY3QgKSApIHtcbiAgICByZXR1cm4gcGFyc2VkT2JqZWN0O1xuICB9XG5cbiAgb21pdHRlZEtleXMgPSBBcnJheS5pc0FycmF5KCBvbWl0dGVkS2V5cyApID8gb21pdHRlZEtleXMgOiBbXTtcblxuICBPYmplY3Qua2V5cyggb2JqZWN0ICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgdmFyIGtleU9rID0gdHJ1ZTtcblxuICAgIG9taXR0ZWRLZXlzLmZvckVhY2goIGZ1bmN0aW9uICggb21pdHRlZEtleSApIHtcblxuICAgICAgaWYgKCBrZXlPayA9PT0gdHJ1ZSAmJiBrZXkgPT09IG9taXR0ZWRLZXkgKSB7XG4gICAgICAgIGtleU9rID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICB9ICk7XG5cbiAgICBpZiAoIGtleU9rID09PSB0cnVlICkge1xuICAgICAgcGFyc2VkT2JqZWN0WyBrZXkgXSA9IG9iamVjdFsga2V5IF07XG4gICAgfVxuXG4gIH0gKTtcblxuICByZXR1cm4gcGFyc2VkT2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9taXQ7IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4vaXNlcy90eXBlXCIgKSxcbiAgaXMgPSB7XG4gICAgYToge30sXG4gICAgYW46IHt9LFxuICAgIG5vdDoge1xuICAgICAgYToge30sXG4gICAgICBhbjoge31cbiAgICB9XG4gIH07XG5cbnZhciBpc2VzID0ge1xuICBcImFyZ3VtZW50c1wiOiBbIFwiYXJndW1lbnRzXCIsIHR5cGUoIFwiYXJndW1lbnRzXCIgKSBdLFxuICBcImFycmF5XCI6IFsgXCJhcnJheVwiLCB0eXBlKCBcImFycmF5XCIgKSBdLFxuICBcImJvb2xlYW5cIjogWyBcImJvb2xlYW5cIiwgdHlwZSggXCJib29sZWFuXCIgKSBdLFxuICBcImRhdGVcIjogWyBcImRhdGVcIiwgdHlwZSggXCJkYXRlXCIgKSBdLFxuICBcImZ1bmN0aW9uXCI6IFsgXCJmdW5jdGlvblwiLCBcImZ1bmNcIiwgXCJmblwiLCB0eXBlKCBcImZ1bmN0aW9uXCIgKSBdLFxuICBcIm51bGxcIjogWyBcIm51bGxcIiwgdHlwZSggXCJudWxsXCIgKSBdLFxuICBcIm51bWJlclwiOiBbIFwibnVtYmVyXCIsIFwiaW50ZWdlclwiLCBcImludFwiLCB0eXBlKCBcIm51bWJlclwiICkgXSxcbiAgXCJvYmplY3RcIjogWyBcIm9iamVjdFwiLCB0eXBlKCBcIm9iamVjdFwiICkgXSxcbiAgXCJyZWdleHBcIjogWyBcInJlZ2V4cFwiLCB0eXBlKCBcInJlZ2V4cFwiICkgXSxcbiAgXCJzdHJpbmdcIjogWyBcInN0cmluZ1wiLCB0eXBlKCBcInN0cmluZ1wiICkgXSxcbiAgXCJ1bmRlZmluZWRcIjogWyBcInVuZGVmaW5lZFwiLCB0eXBlKCBcInVuZGVmaW5lZFwiICkgXSxcbiAgXCJlbXB0eVwiOiBbIFwiZW1wdHlcIiwgcmVxdWlyZSggXCIuL2lzZXMvZW1wdHlcIiApIF0sXG4gIFwibnVsbG9ydW5kZWZpbmVkXCI6IFsgXCJudWxsT3JVbmRlZmluZWRcIiwgXCJudWxsb3J1bmRlZmluZWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvbnVsbG9ydW5kZWZpbmVkXCIgKSBdLFxuICBcImd1aWRcIjogWyBcImd1aWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvZ3VpZFwiICkgXVxufVxuXG5PYmplY3Qua2V5cyggaXNlcyApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuXG4gIHZhciBtZXRob2RzID0gaXNlc1sga2V5IF0uc2xpY2UoIDAsIGlzZXNbIGtleSBdLmxlbmd0aCAtIDEgKSxcbiAgICBmbiA9IGlzZXNbIGtleSBdWyBpc2VzWyBrZXkgXS5sZW5ndGggLSAxIF07XG5cbiAgbWV0aG9kcy5mb3JFYWNoKCBmdW5jdGlvbiAoIG1ldGhvZEtleSApIHtcbiAgICBpc1sgbWV0aG9kS2V5IF0gPSBpcy5hWyBtZXRob2RLZXkgXSA9IGlzLmFuWyBtZXRob2RLZXkgXSA9IGZuO1xuICAgIGlzLm5vdFsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYVsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYW5bIG1ldGhvZEtleSBdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9XG4gIH0gKTtcblxufSApO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBpcztcbmV4cG9ydHMudHlwZSA9IHR5cGU7IiwidmFyIHR5cGUgPSByZXF1aXJlKFwiLi4vdHlwZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICB2YXIgZW1wdHkgPSBmYWxzZTtcblxuICBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwibnVsbFwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgZW1wdHkgPSB0cnVlO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm9iamVjdFwiICkge1xuICAgIGVtcHR5ID0gT2JqZWN0LmtleXMoIHZhbHVlICkubGVuZ3RoID09PSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcImJvb2xlYW5cIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSBmYWxzZTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJudW1iZXJcIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAtMTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJhcnJheVwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICByZXR1cm4gZW1wdHk7XG5cbn07IiwidmFyIGd1aWQgPSByZXF1aXJlKCBcInNjLWd1aWRcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIHJldHVybiBndWlkLmlzVmFsaWQoIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcblx0cmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IHZvaWQgMDtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4uL3R5cGVcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX3R5cGUgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcbiAgICByZXR1cm4gdHlwZSggX3ZhbHVlICkgPT09IF90eXBlO1xuICB9XG59IiwidmFyIGd1aWRSeCA9IFwiez9bMC05QS1GYS1mXXs4fS1bMC05QS1GYS1mXXs0fS00WzAtOUEtRmEtZl17M30tWzAtOUEtRmEtZl17NH0tWzAtOUEtRmEtZl17MTJ9fT9cIjtcblxuZXhwb3J0cy5nZW5lcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgdmFyIGd1aWQgPSBcInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eFwiLnJlcGxhY2UoIC9beHldL2csIGZ1bmN0aW9uICggYyApIHtcbiAgICB2YXIgciA9ICggZCArIE1hdGgucmFuZG9tKCkgKiAxNiApICUgMTYgfCAwO1xuICAgIGQgPSBNYXRoLmZsb29yKCBkIC8gMTYgKTtcbiAgICByZXR1cm4gKCBjID09PSBcInhcIiA/IHIgOiAoIHIgJiAweDcgfCAweDggKSApLnRvU3RyaW5nKCAxNiApO1xuICB9ICk7XG4gIHJldHVybiBndWlkO1xufTtcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICggc3RyaW5nICkge1xuICB2YXIgcnggPSBuZXcgUmVnRXhwKCBndWlkUngsIFwiZ1wiICksXG4gICAgbWF0Y2hlcyA9ICggdHlwZW9mIHN0cmluZyA9PT0gXCJzdHJpbmdcIiA/IHN0cmluZyA6IFwiXCIgKS5tYXRjaCggcnggKTtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG1hdGNoZXMgKSA/IG1hdGNoZXMgOiBbXTtcbn07XG5cbmV4cG9ydHMuaXNWYWxpZCA9IGZ1bmN0aW9uICggZ3VpZCApIHtcbiAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCggZ3VpZFJ4ICk7XG4gIHJldHVybiByeC50ZXN0KCBndWlkICk7XG59OyIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWwgKSB7XG4gIHN3aXRjaCAoIHRvU3RyaW5nLmNhbGwoIHZhbCApICkge1xuICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6XG4gICAgcmV0dXJuICdmdW5jdGlvbic7XG4gIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgIHJldHVybiAnZGF0ZSc7XG4gIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgcmV0dXJuICdyZWdleHAnO1xuICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOlxuICAgIHJldHVybiAnYXJndW1lbnRzJztcbiAgY2FzZSAnW29iamVjdCBBcnJheV0nOlxuICAgIHJldHVybiAnYXJyYXknO1xuICB9XG5cbiAgaWYgKCB2YWwgPT09IG51bGwgKSByZXR1cm4gJ251bGwnO1xuICBpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAoIHZhbCA9PT0gT2JqZWN0KCB2YWwgKSApIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07IiwidmFyIEdyYWlsID0gcmVxdWlyZSggJy4vZ3JhaWwnICksXG5cdEdyYWlsZWRBcHAgPSB7fTtcblxuR3JhaWxlZEFwcC5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBuZXcgR3JhaWwoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR3JhaWxlZEFwcDsiLCJ2YXIgZW1pdHRlciA9IHJlcXVpcmUoICdlbWl0dGVyLWNvbXBvbmVudCcgKSxcblx0ZXh0ZW5kaWZ5ID0gcmVxdWlyZSggJ3NjLWV4dGVuZGlmeScgKSxcblx0aXMgPSByZXF1aXJlKCAnc2MtaXMnICk7XG5cbnZhciBHcmFpbCA9IGV4dGVuZGlmeSgge1xuXG5cdGluaXQ6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyggc2VsZiwge1xuXHRcdFx0X19iYXNlOiB7XG5cdFx0XHRcdHZhbHVlOiBleHRlbmRpZnkoKVxuXHRcdFx0fSxcblx0XHRcdF9fY2xhc3M6IHtcblx0XHRcdFx0dmFsdWU6IHt9LFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdF9fY29uZmlnOiB7XG5cdFx0XHRcdHZhbHVlOiB7fSxcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRfX2NvbnRyb2xsZXI6IHtcblx0XHRcdFx0dmFsdWU6IHt9LFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdF9fZW5naW5lOiB7XG5cdFx0XHRcdHZhbHVlOiB7fSxcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRfX21vZGVsOiB7XG5cdFx0XHRcdHZhbHVlOiB7fSxcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRfX21vZHVsZToge1xuXHRcdFx0XHR2YWx1ZToge30sXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0X19yb3V0ZToge1xuXHRcdFx0XHR2YWx1ZToge30sXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0Y2xhc3Nlczoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fX2NsYXNzO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Y29uZmlnczoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fX2NvbmZpZztcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNvbnRyb2xsZXJzOiB7XG5cdFx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLl9fY29udHJvbGxlcjtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fX21vZGVsO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0bW9kdWxlczoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fX21vZHVsZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHJvdXRlczoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fX3JvdXRlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0c2VsZi5jbGFzcy5leHRlbmQgPSBmdW5jdGlvbiAoIF9jbGFzcyApIHtcblx0XHRcdHJldHVybiBzZWxmLl9fYmFzZS5leHRlbmQoIF9jbGFzcyApO1xuXHRcdH07XG5cblx0fSxcblxuXHRjbGFzczogZnVuY3Rpb24gKCBfbmFtZSwgX2NsYXNzICkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGlmICggaXMubm90Lm51bGxPclVuZGVmaW5lZCggX2NsYXNzICkgKSB7XG5cdFx0XHRzZWxmLl9fY2xhc3NbIF9uYW1lIF0gPSBfY2xhc3M7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYuY2xhc3MsIF9uYW1lLCB7XG5cdFx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBzZWxmLl9fY2xhc3NbIF9uYW1lIF07XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHNlbGYuX19jbGFzc1sgX25hbWUgXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc2VsZjtcblx0fSxcblxuXHRjb25maWc6IGZ1bmN0aW9uICggX25hbWUsIF9jb25maWcgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0aWYgKCBpcy5ub3QubnVsbE9yVW5kZWZpbmVkKCBfY29uZmlnICkgKSB7XG5cdFx0XHRzZWxmLl9fY29uZmlnWyBfbmFtZSBdID0gX2NvbmZpZztcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZi5jb25maWcsIF9uYW1lLCB7XG5cdFx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBzZWxmLl9fY29uZmlnWyBfbmFtZSBdO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBzZWxmLl9fY29uZmlnWyBfbmFtZSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiBzZWxmO1xuXHR9LFxuXG5cdGNvbnRyb2xsZXI6IGZ1bmN0aW9uICggX25hbWUsIF9jb250cm9sbGVyICkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGlmICggaXMubm90Lm51bGxPclVuZGVmaW5lZCggX2NvbnRyb2xsZXIgKSApIHtcblxuXHRcdFx0Ly8gSWYgdGhpcyBpcyBhbiBpbnN0YW5jZSBvZiBgc2MtZXh0ZW5kaWZ5YCBhbmQgaGFzIG5vdCBiZWVuXG5cdFx0XHQvLyBpbnN0YW50aWF0ZWQsIGluc3RhbnRpYXRlIGl0XG5cdFx0XHRpZiAoIGlzLmEuZnVuYyggX2NvbnRyb2xsZXIgKSAmJiBpcy5hLmZ1bmMoIF9jb250cm9sbGVyLmV4dGVuZCApICkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdF9jb250cm9sbGVyID0gbmV3IF9jb250cm9sbGVyKCk7XG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge31cblx0XHRcdH1cblxuXHRcdFx0c2VsZi5fX2NvbnRyb2xsZXJbIF9uYW1lIF0gPSBfY29udHJvbGxlcjtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZi5jb250cm9sbGVyLCBfbmFtZSwge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gc2VsZi5fX2NvbnRyb2xsZXJbIF9uYW1lIF07XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHNlbGYuX19jb250cm9sbGVyWyBfbmFtZSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiBzZWxmO1xuXHR9LFxuXG5cdGVuZ2luZTogZnVuY3Rpb24gKCBfZW5naW5lICkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGlmICggaXMubm90LmEuZnVuYyggX2VuZ2luZSApICkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCAnVGhlIGdpdmVuIEdyYWlsZWQgZW5naW5lIG11c3QgYmUgYSBmdW5jdGlvbicgKTtcblx0XHR9XG5cblx0XHRzZWxmLl9fZW5naW5lID0gX2VuZ2luZTtcblx0XHRzZWxmLl9fZW5naW5lKCBzZWxmICk7XG5cblx0XHRyZXR1cm4gc2VsZjtcblx0fSxcblxuXHRlbmQ6IGZ1bmN0aW9uICggX2NhbGxiYWNrICkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdHNlbGYuZW1pdCggJ2VuZCcgKTtcblxuXHRcdGlmICggdHlwZW9mIF9jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdF9jYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdHJldHVybiBzZWxmO1xuXHR9LFxuXG5cdG1vZGVsOiBmdW5jdGlvbiAoIF9uYW1lLCBfc2NoZW1hICkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGlmICggaXMubm90Lm51bGxPclVuZGVmaW5lZCggX3NjaGVtYSApICkge1xuXHRcdFx0c2VsZi5fX21vZGVsWyBfbmFtZSBdID0gX3NjaGVtYTtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZi5tb2RlbCwgX25hbWUsIHtcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHNlbGYuX19tb2RlbFsgX25hbWUgXTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gc2VsZi5fX21vZGVsWyBfbmFtZSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiBzZWxmO1xuXHR9LFxuXG5cdG1vZHVsZTogZnVuY3Rpb24gKCBfbmFtZSwgX21vZHVsZSApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRpZiAoIGlzLm5vdC5udWxsT3JVbmRlZmluZWQoIF9tb2R1bGUgKSApIHtcblx0XHRcdHNlbGYuX19tb2R1bGVbIF9uYW1lIF0gPSBfbW9kdWxlO1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLm1vZHVsZSwgX25hbWUsIHtcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHNlbGYuX19tb2R1bGVbIF9uYW1lIF07XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHNlbGYuX19tb2R1bGVbIF9uYW1lIF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNlbGY7XG5cdH0sXG5cblx0cm91dGU6IGZ1bmN0aW9uICggX25hbWUsIF9vcHRpb25zICkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGlmICggaXMubm90Lm51bGxPclVuZGVmaW5lZCggX29wdGlvbnMgKSApIHtcblx0XHRcdHNlbGYuX19yb3V0ZVsgX25hbWUgXSA9IF9vcHRpb25zO1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLnJvdXRlLCBfbmFtZSwge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gc2VsZi5fX3JvdXRlWyBfbmFtZSBdO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBzZWxmLl9fcm91dGVbIF9uYW1lIF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNlbGY7XG5cdH0sXG5cblx0c2V0OiBmdW5jdGlvbiAoIF9rZXksIF92YWx1ZSApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRpZiAoIGlzLm5vdC5udWxsT3JVbmRlZmluZWQoIF92YWx1ZSApICkge1xuXHRcdFx0c2VsZlsgX2tleSBdID0gX3ZhbHVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gc2VsZlsgX2tleSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiBzZWxmO1xuXHR9XG5cbn0gKTtcblxuZW1pdHRlciggR3JhaWwucHJvdG90eXBlICk7XG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBHcmFpbDsiXX0=
(16)
});
