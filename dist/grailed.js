!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.grailed=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){

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

},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
var hasKey = require( "sc-haskey" ),
  merge = require( "sc-merge" ),
  omit = require( "sc-omit" ),
  extend = require( "./extend.johnresig.js" ),
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
},{"./extend.johnresig.js":3,"sc-haskey":8,"sc-merge":5,"sc-omit":7}],5:[function(require,module,exports){
var type = require( "type-component" );

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
},{"type-component":6}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
var type = require( "type-component" ),
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
},{"type-component":9}],9:[function(require,module,exports){
module.exports=require(6)
},{"/Users/glen/sg/grailed/node_modules/sc-extendify/node_modules/sc-merge/node_modules/type-component/index.js":6}],10:[function(require,module,exports){
var type = require( "./ises/type" ),
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
  "empty": [ "empty", require( "./ises/empty" ) ],
  "nullorundefined": [ "nullOrUndefined", "nullorundefined", require( "./ises/nullorundefined" ) ],
  "guid": [ "guid", require( "./ises/guid" ) ]
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
},{"./ises/empty":11,"./ises/guid":12,"./ises/nullorundefined":13,"./ises/type":14}],11:[function(require,module,exports){
var type = require("../type");

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
},{"../type":16}],12:[function(require,module,exports){
var guid = require( "sc-guid" );

module.exports = function ( value ) {
  return guid.isValid( value );
};
},{"sc-guid":15}],13:[function(require,module,exports){
module.exports = function ( value ) {
	return value === null || value === undefined || value === void 0;
};
},{}],14:[function(require,module,exports){
var type = require( "../type" );

module.exports = function ( _type ) {
  return function ( _value ) {
    return type( _value ) === _type;
  }
}
},{"../type":16}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
(function (global){
var emitter = require( 'emitter-component' ),
	extendify = require( 'sc-extendify' ),
	is = require( 'sc-is' );

var Grail = extendify( {

	init: function () {
		var globalIsWindow = 'undefined' !== typeof window,
			globalIsGlobal = 'undefined' !== typeof global,
			glb = globalIsWindow ? window : globalIsGlobal ? global : undefined,
			self = glb.grailed = this;

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
			__service: {
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
			},
			services: {
				get: function () {
					return this.__service;
				}
			}
		} );

		// In a node env, setup the app
		if ( globalIsGlobal ) self.system = require( './system' )( self );

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

	// end: function ( _callback ) {
	// 	var self = this;
	// 	self.emit( 'end' );
	// 	if ( typeof _callback === 'function' ) {
	// 		_callback();
	// 	}
	// 	return self;
	// },

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

	service: function ( _name, _service ) {
		var self = this;

		if ( is.not.nullOrUndefined( _service ) ) {
			self.__service[ _name ] = _service;
			Object.defineProperty( self.service, _name, {
				get: function () {
					return self.__service[ _name ];
				}
			} );
		} else {
			return self.__service[ _name ];
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
	},

	start: function () {
		this.emit( 'start' );
	}

} );

emitter( Grail.prototype );
exports = module.exports = Grail;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./system":1,"emitter-component":2,"sc-extendify":4,"sc-is":10}],18:[function(require,module,exports){
var Grailed = require( './grailed' ),
	GrailedApp = {};

GrailedApp.create = function () {
	return new Grailed();
};

module.exports = GrailedApp;
},{"./grailed":17}]},{},[18])(18)
});