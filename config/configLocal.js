var config = {};

config.applicationKey = 'ntalk.sid';
config.applicationSecret = 'ntalk';

config.serverAddress = '127.0.0.1';
config.serverPort = 8080;

config.serverExternalAddress = 'localhost';
config.socketio = config.serverExternalAddress + ':' + config.serverPort;

config.mongoHost = '127.0.0.1';
config.mongoPort = 27017;
config.mongoDB = 'ntalk';

config.redisAddress = '127.0.0.1';
config.redisPort = '6379';

config.mongoConnectionString = 'mongodb://' + config.mongoHost + ':'
		+ config.mongoPort + '/' + config.mongoDB;

module.exports = config;
