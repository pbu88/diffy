#!/bin/sh
docker-compose run -v "$(pwd):/diffy/" -w '/diffy/backend' --rm web npm test
