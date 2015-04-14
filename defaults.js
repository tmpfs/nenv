var env = require('./')()
  , str = JSON.stringify(env.jsonify(), undefined, 2);
process.stdout.write(str);
