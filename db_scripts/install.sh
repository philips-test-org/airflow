#!/bin/bash
echo 'Creating schema, user, tables, etc.'
psql -e -f create.sql -U postgres harbinger
export PGPASSWORD=2893ourj8923urjl
psql -e -f schema.sql -U starterapp harbinger
./create-glassfish-jdbc.sh
