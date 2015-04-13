// environment modes
var env = (process.env.NODE_ENV ? process.env.NODE_ENV : 'devel').toLowerCase();
var modes = {
  test: 'test',
  devel: 'devel',
  stage: 'stage',
  production: 'production'
}

// mode aliases
modes.dev = modes.devel;
modes.prod = modes.production;
modes.live = modes.production;

// keys array
modes.keys = Object.keys(modes);

// constants
for(var k in modes) {
  modes[k.toUpperCase()] = modes[k];
}

// boolean tests
modes.is = {
  test: env === modes.TEST,
  devel: env === modes.DEVEL,
  stage: env === modes.STAGE,
  prod: env === modes.PRODUCTION
}

// boolean test aliases
modes.is.dev = modes.is.devel;
modes.is.prod = modes.is.production;
modes.is.live = modes.is.production;

modes.valid = Boolean(~modes.keys.indexOf(env));
modes.env = env;

module.exports = modes;
