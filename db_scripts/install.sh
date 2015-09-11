#!/bin/bash
echo 'Creating schema, user, tables, etc.'
psql -e -f create.sql -U postgres harbinger
export PGPASSWORD=r3sr3v13w!!
psql -e -f vanilla-schema.sql -U vanilla harbinger
psql -e -f vanilla-data.sql -U vanilla harbinger
