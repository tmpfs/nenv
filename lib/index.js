var defaults = ['test', 'devel', 'stage', 'production'];

/**
 *  Default function for extracting the current environment.
 */
function extract() {
  return process.env.NODE_ENV;
}

/**
 *  Get an environment object.
 *
 *  @param available Array or map of available environments.
 *  @param opts Options used to control the behaviour.
 *
 *  @return An environment object.
 */
function nenv(available) {
  var init
    , k
    , arr
    , l
    , args = [].slice.call(arguments);

  // last arg is extract function
  if(args.length
    && typeof args[args.length - 1] === 'function') {
    init = args[args.length - 1];
  }

  // use default function
  if(typeof init !== 'function') {
    init = extract;
  }

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
  query.value = init();

  // object map
  query.map = map;

  // array of keys
  query.keys = Object.keys(map);

  // reference function used to get
  // the current value
  query.get = extract;

  return query;
}

nenv.defaults = defaults;
nenv.extract = extract;

module.exports = nenv;
