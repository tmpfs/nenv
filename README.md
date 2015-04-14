Table of Contents
=================

* [nenv](#nenv)
  * [Install](#install)
  * [Usage](#usage)
  * [API](#api)
    * [env([value])](#envvalue)
    * [env.value](#envvalue)
    * [env.valid](#envvalid)
    * [env.defined](#envdefined)
    * [env.get()](#envget)
    * [env.set(val)](#envsetval)
    * [env.keys](#envkeys)
    * [env.map](#envmap)
    * [env.jsonify()](#envjsonify)
    * [nenv.defaults](#nenvdefaults)
    * [nenv.cache](#nenvcache)
    * [nenv.get](#nenvget)
    * [nenv.set](#nenvset)
  * [Environments](#environments)
  * [Getter](#getter)
  * [Example](#example)
  * [Developer](#developer)
    * [Test](#test)
    * [Readme](#readme)
  * [License](#license)

nenv
====

Utility for mananging node development environments.

Requires [node](http://nodejs.org) and [npm](http://www.npmjs.org).

## Install

```
npm i nenv --save
```

## Usage

```javascript
var env = require('nenv')();
if(!env.defined) {
  // do something when no environment was specified
  // maybe: env.set(env.DEVEL) or whichever default you want
}else if(!env.valid) {
  // do something when the specified environment is invalid
}else if(env.test) {
  // do something for test environment
}
```

## API

```javascript
function nenv([environments, get, set])
```

* `environments`: Array or object of custom environments, if not specified the `defaults` are used.
* `get`: A custom function for getting the environment value (optional).
* `set`: A custom function for setting the environment value (optional).

### env([value])

Determines if an environment value is valid. Returns `false` if the supplied value is invalid or the string key for the environment if valid.

If no value is supplied then `env.value` is used which allows testing whether the default value is valid by calling with no arguments.

### env.value

The value returned from `get()` when `nenv()` was called, the initial environment value.

### env.valid

Boolean that determines whether `env.value` is a recognised environment.

### env.defined

Determines whether an initial value (`env.value`) was defined.

### env.get()

Get the *current* value of the environment, the default implementation returns `process.env.NODE_ENV`.

### env.set(val)

Set the *current* value of the environment, the default implementation returns `false` if the supplied value is not a known environment alias otherwise a function that may be called to revert to the *previous* value.

### env.keys

Array of environment keys.

### env.map

Map of environment keys to arrays of string aliases for the environment.

### env.jsonify()

Return an object suitable for passing to `JSON.stringify`.

### nenv.defaults

Default values to use.

```javascript
['test', 'devel', 'stage', 'production'];
```

### nenv.cache

A cache created the first time `nenv()` was invoked. Typically you would always want to share the same environment query:

```javascript
var nenv = require('nenv')
  , env = nenv()
  , newenv = nenv()
  // bypass cache and get a new query function using defaults
  , altenv = nenv(true);
console.log(env === newenv);
console.log(env === altenv);
```

You can bypass the cached instance by passing arguments to `nenv()` or alternatively you could delete `nenv.cache` to force a new query to be created.

### nenv.get

Default `get` function.

### nenv.set

Default `set` function.

## Environments

Pass an object or array to define your available environments. Passing an object allows specifying multiple keys as aliases for the environment, useful to alias shortcuts for longer environment identifiers.

```javascript
var nenv = require('nenv');
console.dir(nenv(['test', 'dev', 'stage']));
console.dir(nenv({production: ['production', 'pro'], dev: 'dev', test: 'test'}));
```

## Getter

Use a fallback value by supplying a `get` function:

```javascript
var nenv = require('nenv');
function fallback() {
  return process.env.NODE_ENV || this.PRODUCTION;
}
var env = nenv(fallback);
console.dir(env);
```

Or apply override logic to prefer another variable:

```javascript
var nenv = require('nenv');
function override() {
  return process.env.ENV || process.env.NODE_ENV;
}
var env = nenv(override);
console.dir(env);
```

## Example

See [defaults.js](https://github.com/socialally/nenv/blob/master/defaults.js).

```javascript
var env = require('./')()
  , str = JSON.stringify(env.jsonify(), undefined, 2);
process.stdout.write(str);
```

Executed with `NODE_ENV=devel`, yields:

```json
{
  "TEST": "test",
  "DEVEL": "devel",
  "STAGE": "stage",
  "PRODUCTION": "production",
  "value": "devel",
  "valid": true,
  "defined": true,
  "map": {
    "test": [
      "test"
    ],
    "devel": [
      "devel"
    ],
    "stage": [
      "stage"
    ],
    "production": [
      "production"
    ]
  },
  "keys": [
    "test",
    "devel",
    "stage",
    "production"
  ],
  "test": false,
  "devel": true,
  "stage": false,
  "production": false
}
```

## Developer

### Test

Run the test specifications:

```
npm test
```

### Readme

Generate the project readme file (requires [mdp](https://github.com/freeformsystems/mdp)):

```
npm run readme
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/socialally/nenv/blob/master/LICENSE) if you feel inclined.

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[mdp]: https://github.com/freeformsystems/mdp
