#!/bin/bash
echo 'Creating schema, user, tables, etc.' # TODO: The Schema related steps needs to be run on Postgres container
psql -h philips-rs-postgresql -e -f create.sql -U postgres harbinger
psql -h philips-rs-postgresql -e -f schema.sql -U airflow harbinger
