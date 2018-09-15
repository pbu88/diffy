var config = {};

config.host = process.env.DIFFY_WEB_HOST || '127.0.0.1';
config.port = parseInt(process.env.DIFFY_WEB_PORT) || 3000;

config.db_host = process.env.DIFFY_DB_HOST || 'localhost';
config.db_port = process.env.DIFFY_DB_PORT || 27017;
config.db_url  = `mongodb://${config.db_host}:${config.db_port}/diffy`;
config.db_name = 'diffy';

config.session_collection = 'sessions';

config.GA_ANALITYCS_KEY   = process.env.DIFFY_GA_ANALYTICS_KEY;
config.GA_DIFFY_API_KEY   = "diffApi";
config.GA_API_DEFAULT_KEY = "<no_ga_cookie>";

module.exports = config;
