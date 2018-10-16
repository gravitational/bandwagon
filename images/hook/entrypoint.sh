#!/bin/sh
set -e

echo "Assuming changeset from the envrionment: $RIG_CHANGESET"
if [ $1 = "update" ]; then
    echo "Checking: $RIG_CHANGESET"
    if rig status $RIG_CHANGESET --retry-attempts=1 --retry-period=1s; then exit 0; fi
    echo "Starting update, changeset: $RIG_CHANGESET"
    rig cs delete --force -c cs/$RIG_CHANGESET
    echo "Deleting old deployment"
    rig delete deployments/bandwagon --resource-namespace=kube-system --force
    echo "Creating new deployment"
    rig upsert -f /var/lib/gravity/resources/install.yaml --debug
    echo "Checking status"
    rig status $RIG_CHANGESET --retry-attempts=120 --retry-period=1s --debug
    echo "Freezing"
    rig freeze
elif [ $1 = "rollback" ]; then
    echo "Reverting changeset $RIG_CHANGESET"
    rig revert
    rig cs delete --force -c cs/$RIG_CHANGESET
else
    echo "Missing argument, should be either 'update' or 'rollback'"
fi
