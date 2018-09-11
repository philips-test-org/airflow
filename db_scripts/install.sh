#!/bin/bash
echo 'Creating schema, user, tables, etc.' # TODO: The Schema related steps needs to be run on Postgres container
psql -h dockerhost -e -f create.sql -U postgres harbinger
psql -h dockerhost -e -f schema.sql -U airflow harbinger
