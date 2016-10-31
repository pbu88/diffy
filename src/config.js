var config = {};

config.host = process.env.DIFFY_WEB_HOST || '127.0.0.1';
config.port = parseInt(process.env.DIFFY_WEB_PORT) || 3000;

config.db_host = process.env.DIFFY_DB_HOST || 'localhost';
config.db_port = process.env.DIFFY_DB_PORT || 27017;
config.db_url = `mongodb://${config.db_host}:${config.db_port}/diffy`;

module.exports = config;