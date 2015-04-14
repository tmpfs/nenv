var expect = require('chai').expect
  , nenv = require('../../');

function defaults(env) {
  expect(env).to.be.a('function');
  expect(env.get).to.be.a('function');

  expect(env.TEST).to.be.a('string');
  expect(env.DEVEL).to.be.a('string');
  expect(env.STAGE).to.be.a('string');
  expect(env.PRODUCTION).to.be.a('string');

  // we are running in test env
  expect(env.value).to.be.a('string')
    .to.eql(env.TEST);

  // get should return the same value
  expect(env.get()).to.be.a('string')
    .to.eql(env.TEST);

  expect(env.map).to.be.an('object');
  expect(env.keys).to.be.an('array');

  for(var k in env.map) {
    expect(env.map[k]).to.be.an('array');
  }

  // initial value should be valid
  expect(env()).to.eql(env.TEST);

  // check invalid value
  expect(env('unknown')).to.eql(false);

  // boolean property aliases
  expect(env.test).to.eql(true);
  expect(env.devel).to.eql(false);
  expect(env.stage).to.eql(false);
  expect(env.production).to.eql(false);
}

describe('nenv: ', function() {

  it('should use default options', function(done) {
    var env = nenv();
    defaults(env);
    done();
  });

  it('should use extract function', function(done) {
    var env = nenv(nenv.dget);
    defaults(env);
    done();
  });

  it('should use available array list', function(done) {
    // add undefined to trigger code path
    var list = nenv.defaults.slice(0).concat('live', undefined);
    var env = nenv(list);
    defaults(env);
    expect(env.LIVE).to.eql('live');
    expect(env(env.LIVE)).to.eql(env.LIVE);
    expect(env(undefined)).to.eql(false);
    done();
  });

  it('should use available object', function(done) {
    var env = nenv({test: 'test'});
    expect(env.TEST).to.be.a('string');
    expect(env.DEVEL).to.eql(undefined);
    expect(env.keys.length).to.eql(1);
    expect(Object.keys(env.map).length).to.eql(1);
    expect(env.map.test).to.eql(['test']);
    done();
  });

  it('should use alias list', function(done) {
    var env = nenv(
      {test: ['test', 't'], live: 'live', ignored: null, truthy: true});
    expect(env.TEST).to.be.a('string');
    expect(env.LIVE).to.be.a('string');
    expect(env.IGNORED).to.eql(undefined);
    expect(env.TRUTHY).to.eql(undefined);
    expect(env.keys.length).to.eql(2);
    expect(Object.keys(env.map).length).to.eql(2);
    expect(env.map.test).to.eql(['test', 't']);
    expect(env.map.live).to.eql(['live']);

    expect(env('t')).to.eql(env.TEST);
    done();
  });

  it('should set and revert environment', function(done) {
    var env = nenv();
    defaults(env);
    done();
  });

  it('should set and revert environment', function(done) {
    var env = nenv();
    expect(env.get()).to.eql(env.TEST);
    var revert = env.set(env.DEVEL);
    expect(revert).to.be.a('function');
    expect(env.get()).to.eql(env.DEVEL);

    // original value is unchanged
    expect(env.value).to.eql(env.TEST);

    // revert to previous value
    revert();

    expect(env.get()).to.eql(env.TEST);

    done();
  });

  it('should refuse to set invalid environment', function(done) {
    var env = nenv();
    expect(env.get()).to.eql(env.TEST);
    var revert = env.set('unknown');
    expect(revert).to.eql(false);
    expect(env.get()).to.eql(env.TEST);
    done();
  });

});
