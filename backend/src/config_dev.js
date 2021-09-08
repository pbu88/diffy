var config = {};

config.host = process.env.DIFFY_WEB_HOST || '127.0.0.1';
config.port = parseInt(process.env.DIFFY_WEB_PORT) || 3000;

config.session_collection = 'sessions';
config.session_secret = process.env.DIFFY_SESSION_SECRET || 'not-that-secret';

config.GA_ANALITYCS_KEY = process.env.DIFFY_GA_ANALYTICS_KEY;
config.GA_DIFFY_API_KEY = "diffApi";
config.GA_API_DEFAULT_KEY = "<no_ga_cookie>";

config.MAX_DIFF_SIZE = '1mb';
config.DIFF_REPO = {
    type: "memory",
};

module.exports = config;
