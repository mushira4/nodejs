var config = {};

config.applicationKey = 'ntalk.sid';
config.applicationSecret = 'ntalk';

config.serverAddress = process.env.OPENSHIFT_NODEJS_IP;
config.serverPort = process.env.OPENSHIFT_NODEJS_PORT;

config.serverExternalAddress = 'ntalk-mushira4.rhcloud.com';
config.socketio = config.serverExternalAddress;

config.mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST;
config.mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT;
config.mongoDB = 'ntalk';
config.mongoCredentials = '';

config.redisAddress = process.env.OPENSHIFT_REDIS_HOST;
config.redisPort =  process.env.OPENSHIFT_REDIS_PORT;
config.redisAuth = '';

config.mongoConnectionString = 'mongodb://' + config.mongoCredentials
		+ config.mongoHost + ':' + config.mongoPort + '/' + config.mongoDB;

module.exports = config;