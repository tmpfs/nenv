var nenv = require('./')
  , env = nenv();

// environment value fixed at creation time
console.log(env.value);

// get current value of environment
console.log(env.get());

// check environment is valid
console.log(env(env.TEST));
console.log(env(env.DEVEL));
console.log(env(env.STAGE));
console.log(env(env.PRODUCTION));
console.log(env('unknown'));

// set current value
var revert = env.set(env.DEVEL);
console.log(env.get());           // devel
revert();
console.log(env.get());           // reverted to previous value
