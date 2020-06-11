#!/bin/sh
echo "running tests in docker"
docker-compose run -v "$(pwd):/diffy/" -w '/diffy/backend' --rm web npm test
