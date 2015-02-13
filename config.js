var path = require('path');
var rootPath = path.normalize(__dirname + '..');

module.exports = {
  development: {
    db: 'mongodb://localhost:27017/download-net-dev',
    port: 3000
  },
  test: {
    db: 'mongodb://localhost:27017/download-net-test',
    port: 8888
  },
  production: {
  }
};
