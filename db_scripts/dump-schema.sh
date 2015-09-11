#!/bin/bash
echo 'Dumping schema structure...'
apgdiff --ignore-start-with /dev/null <(pg_dump -O -s -x -n vanilla -U postgres harbinger) > vanilla-schema.sql
