#bash script to build and run tests and set env variables for tests

npm run build;
export DIFFY_GA_ANALYTICS_KEY='fake key'
mocha dist/tests/
# the testURL hack is necessary because of: https://github.com/jsdom/jsdom/issues/2304
jest --testURL http://localhost
