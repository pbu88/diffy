#!/bin/sh
# Run where the Dockerfile lives (root of the project)
set -x

docker run -v "$(pwd):/diffy/" -w '/diffy' --rm diffy clang-format -i --glob='**/*.ts'
