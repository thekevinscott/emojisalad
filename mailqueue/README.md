# Things you need for a functioning queue

Make sure the `package.json` has the following dependencies:

```
...
"dependencies": {
  "app-module-path": "^1.0.5",
  "babel-polyfill": "^6.6.0",
  "babel-register": "^6.3.13",
  "bluebird": "^3.3.3",
  "gulp": "^3.9.1",
  "gulp-nodemon": "^2.0.6",
  "gulp-util": "^3.0.7",
  "microservice-registry": "https://github.com/scottlabs/microservice-registry.git",
  "pmx": "^0.6.0",
  "queue": "git+ssh://git@bitbucket.org/slipper-siblings/queue.git",
  "squel": "^4.3.1",
  "twilio": "^2.8.0"
},
"devDependencies": {
  "chai": "^3.5.0",
  "chai-datetime": "^1.4.1",
  "gulp-mocha": "^2.2.0",
  "mocha": "^2.4.5",
  "ngrok": "^0.2.2"
}
...
```

Make sure you have an app.json file with the following structure:

```
[{
  "name" : "email",
  "script" : "./index.js",
  "env": {
    "LOG_LEVEL": "info",
    "PORT" : "5010",
    "ENVIRONMENT": "production"
  }
}]
```

Make sure you have a `gulpfile.babel.js`.

```
'use strict';
// set require path

require('app-module-path').addPath(__dirname);
require('babel-polyfill');
//require('app-module-path').addPath(__dirname);
const gulp = require('gulp');
const util = require('gulp-util');
const childExec = require('child_process').exec;
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const chalk = require('chalk');
const squel = require('squel');

const shared = require('../shared/gulp');
const app = require('config/app');

gulp.task('server', (opts) => {
  const PORT = util.env.PORT || app.port;
  const LOG_LEVEL = util.env.LOG_LEVEL || app.log_level;
  return shared.server({ LOG_LEVEL: LOG_LEVEL, PORT: PORT })();
});

/**
 * Seed the test suite from the saved SQL file,
 * and some seed commands in here, then run the test suite
 */
gulp.task('test', (cb) => {
  process.env.LOG_LEVEL = util.env.LOG_LEVEL || 'warning';
  return gulp.src(['test/index.js'], { read: false })
  .pipe(mocha({
    timeout: 10000,
    slow: 500,
    bail: true
  }))
  .on('error', function(data) {
    console.error(data.message);
    process.exit(1);
  })
  .once('end', function() {
    process.exit();
  });
});

gulp.task('default', () => {
  console.log('* server - Spins up the server with default arguments');
  console.log('* test - Run tests for SMS Queue');
});
```

Make sure you have an `index.js` file.
```
'use strict';
require("babel-register", { });

// set require path
require('app-module-path').addPath(__dirname);

require('../shared/scaffolding');
require('lib/server'); 
```

# Extending
By convention, the bootstrap code will live in `lib/server.js`.

When spinning up a queue, arguments are passed to the queue object.
