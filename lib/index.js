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
  var value = this.value;
  if(this(val)) {
    process.env.NODE_ENV = val;
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
 *
 *  @return An environment object.
 */
function nenv(available, get, set) {
  if(typeof available === 'function') {
    get = available;
    available = null;
  }
  var k, arr, l
    , args = [].slice.call(arguments);

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
    value = (arguments.length ? '' + value : query.value).toLowerCase();
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

  // initial value
  query.value = get();

  // object map
  query.map = map;

  // array of keys
  query.keys = Object.keys(map);

  // get and set functions
  query.get = get.bind(query);
  query.set = set.bind(query);

  return query;
}

nenv.defaults = defaults;
nenv.dget = dget;
nenv.dset = dset;

module.exports = nenv;
