#!/bin/bash
TMPDIR=$(mktemp -d)
trap "echo Removing ${TMPDIR}; rm -rf ${TMPDIR}" exit
GRAVITY="gravity --state-dir=${TMPDIR}"
make import OPS_URL= GRAVITY="${GRAVITY}"
${GRAVITY} package export $1 $2
