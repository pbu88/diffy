#bash script to build and run tests and set env variables for tests

npm run build;
export DIFFY_GA_ANALYTICS_KEY='fake key'
mocha --recursive build/tests/;
