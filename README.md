# Diffy - A tool for sharing diff output online

https://diffy.org

## How to contribute

Diffy is a Node.js application. Appart from Node.js, the only other
thing you'll need is mongodb. To get you started these are the steps:

1. Install Node.js and NPM
2. Install MongoDB and make it listen on localhost with default port
3. Clone the repo: `git clone https://github.com/pbu88/diffy.git`
4. Install dependencies: `npm install`
5. Build it: `npm run build`
6. Run the tests: `npm test`
7. Run it: `npm start`

### Docker

If you want to run Diffy using Docker, you don't need to follow any of the above manual steps:

1. Install [docker](https://docs.docker.com/engine/installation/) and
           [docker-compose](https://docs.docker.com/compose/install/)
2. Run the tests: `docker-compose run web npm test`
3. Launch diffy: `docker-compose up`

The mongodb data will be stored on the `data/` folder.

That should get you with a basic working dev environment. Now, go ahead
and fill your pull request :)

Also, feel free to create an issue if you find a bug or if something isn't working as expected when
setting up the development environment.