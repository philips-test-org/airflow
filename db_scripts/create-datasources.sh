#!/bin/bash

if [ ! -e ../application.name ]
then
  echo "Could not detect application name"
  exit 2
fi

if [ ! -e /usr/bin/docker ]
then
  echo "Do not run this inside the support container"
  exit 2
fi

if [ ! -e create-wildfly-jdbc.sh ]
then
  echo "Could not find create-wildfly-jdbc.sh\nThis is meant to be run from the db_scripts directory."
  exit 2
fi

APPLICATION_NAME=`cat ../application.name`
mkdir -p /servers/wildfly/tmp/$APPLICATION_NAME
cp ./create-wildfly-jdbc.sh /servers/wildfly/tmp/$APPLICATION_NAME
docker exec -it philips-rs-wildfly /servers/wildfly/tmp/$APPLICATION_NAME/create-wildfly-jdbc.sh
