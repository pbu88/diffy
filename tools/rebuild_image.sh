#!/bin/sh
set -x

rm -r backend/node_modules
rm -r frontend/node_modules
docker build --no-cache --rm -t diffy .
