#!/bin/bash
echo 'Dumping data tables...'
pg_dump -U vanilla harbinger -a --column-inserts \
 -t vanilla_demo_items > vanilla-data.sql
