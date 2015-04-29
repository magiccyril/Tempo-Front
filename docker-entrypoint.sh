#!/bin/bash
set -e

bower install --allow-root --config.interactive=false
npm install

grunt $1

