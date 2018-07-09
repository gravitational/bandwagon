#!/bin/bash
TMPDIR=$(mktemp -d)
trap "echo Removing ${TMPDIR}; rm -rf ${TMPDIR}" exit
make import OPS_URL= STATE_DIR=${TMPDIR}
gravity package export $1 $2 --state-dir=${TMPDIR}
