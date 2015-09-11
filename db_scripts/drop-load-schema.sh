#!/bin/bash
echo 'Dropping/creating schema, user, tables, etc.'
psql -e -f recreate.sql -U postgres harbinger
export PGPASSWORD=r3sr3v13w!!
psql -e -f vanilla-schema.sql -U vanilla harbinger
psql -e -f vanilla-data.sql -U vanilla harbinger
