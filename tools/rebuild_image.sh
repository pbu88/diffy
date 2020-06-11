#!/bin/sh
set -x

rm -r backend/node_modules
rm -r frontend/node_modules
docker build --no-cache --rm -t diffy .
docker run -v "$(pwd):/diffy/" -w '/diffy/frontend' --rm diffy npm install
docker run -v "$(pwd):/diffy/" -w '/diffy/backend' --rm diffy npm install

