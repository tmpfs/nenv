var defaults = ['test', 'devel', 'stage', 'production'];

/**
 *  Default function for getting the current environment.
 */
function dget() {
  return process.env.NODE_ENV;
}

/**
 *  Default function for setting the current environment.
 */
function dset(val) {
  var value = '' + this.value;

  if(this(val)) {
    process.env.NODE_ENV = val;
    this.current = val;
    // considered defined the first time the setter
    // is called explicitly
    this.defined = true;
    return function revert() {
      process.env.NODE_ENV = value;
    }
  }
  return false;
}

/**
 *  Get an environment object.
 *
 *  @param available Array or map of available environments.
 *  @param get A custom get function.
 *  @param set A custom set function.
 *  @param dbg String name of an environment variable that flags debugging.
 *
 *  @return An environment query object.
 */
function nenv(options = {}) {

  if(nenv.cache && !arguments.length) {
    return nenv.cache;
  }

  let available = options.available
  let get = options.get
  let set = options.set
  let dbg = options.dbg

  if(typeof available === 'function') {
    get = available;
    available = null;
  }
  var k, arr, l
    , args = [].slice.call(arguments);

  dbg = dbg || 'DEBUG';

  // last arg is get function
  if(args.length && typeof args[0] !== 'function') {
    args.shift();
  }

  // use default function(s)
  get = get || dget;
  set = set || dset;

  // available list as map is preferred
  var map = available;

  // default available modes
  if(!available || typeof available !== 'object') {
    available = nenv.defaults;
  }

  // allow arrays instead of object map
  if(Array.isArray(available)) {
    map = {};
    available.forEach(function(env) {
      if(env && typeof env === 'string') {
        map[env] = env;
      }
    })
  }

  /**
   *  Determine if an environment is valid comparing against
   *  all environment aliases.
   *
   *  If no value is specified the intial value is used for the
   *  comparison.
   *
   *  @param value An environment value alias.
   *
   *  @return The environment id or false if the alias is invalid.
   */
  function query(value) {
    value = (arguments.length ? '' + value : '' + query.value).toLowerCase();
    for(var z in map) {
      if(~map[z].indexOf(value)) {
        return z;
      }
    }
    return false;
  }

  // 1. ensure lowercase keys and values
  for(k in map) {
    if(map[k]) {
      l = k.toLowerCase();
      if(Array.isArray(map[k])) {
        arr = map[k].slice();
        arr = arr.filter(function(alias) {
          return alias && typeof alias === 'string';
        }).map(function(alias) {
          return alias.toLowerCase()
        })
        map[l] = arr;
      }else if(typeof map[k] === 'string') {
        map[l] = [map[k].toLowerCase()];

      // cannot handle this value
      }else{
        delete map[k];
      }

      // value was valid, set constant using first alias
      if(Array.isArray(map[l])) {
        query[l.toUpperCase()] = map[l][0];
      }
    // falsy values are deleted
    }else{
      delete map[k];
    }
  }

  query.debug = Boolean(process.env[dbg]);

  // initial value
  query.value = get();

  // current value
  query.current = query.value;

  // initial value validity
  query.valid = Boolean(query());

  // determine if it was specified
  query.defined = query.value !== undefined;

  // object map
  query.map = map;

  // array of keys
  query.keys = Object.keys(map);

  // setup equality boolean aliases
  query.keys.forEach(function(key) {
    Object.defineProperty(query, key, {
      get: function equals() {
        return ('' + query.get()).toLowerCase() === key;
      }
    })
  })

  // get an object view suitable for json
  query.jsonify = function() {
    var o = {};
    for(var k in query) {
      if(typeof query[k] !== 'function') {
        o[k] = query[k];
      }
    }
    // pick up boolean aliases
    query.keys.forEach(function(key) {
      o[key] = query[key] ;
    })
    return o;
  }

  // get and set functions
  query.get = get.bind(query);
  query.set = set.bind(query);

  if(!nenv.cache) {
    nenv.cache = query;
  }

  if (options.strict === true) {
    if (!query.defined) {
      throw new TypeError('Expected NODE_ENV to be defined')
    }

    if (!query.valid) {
      throw new TypeError(
        'Unknown value for NODE_ENV "' +
          query.value +
          '", should be one of: ' +
          query.keys.join(', '))
    }
  }

  return query;
}

nenv.defaults = defaults;
nenv.dget = dget;
nenv.dset = dset;

module.exports = nenv;
