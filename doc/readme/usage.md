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
