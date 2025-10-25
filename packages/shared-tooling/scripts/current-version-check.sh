#!/bin/bash

CURR_VERSION=$(awk -F \" '/"version": ".+"/ { print $4; exit; }' package.json)
echo $CURR_VERSION
