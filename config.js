// DB and server config

module.exports = {
  mongo: {
    uri: 'mongodb://user:user@ds151528.mlab.com:51528/oauthdb'
  },
  mongoUser: {
    uri: 'mongodb://admin:admin@ds215019.mlab.com:15019/express-server'
  },
  seedMongoDB: false,
  db: 'mongo',
  sessionSecret: 'jwsSecret',
  // maxAge: 3600000 * 24 * 7 * 52
  maxAge: 5 * 60 * 1000
}
