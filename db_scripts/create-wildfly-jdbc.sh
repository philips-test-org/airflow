#!/bin/bash

JDBC_RESOURCE=/jdbc/airflow
JDBC_POOL=airflowPOOL
DB_HOST=philips-rs-postgresql
DB=harbinger
DB_USER=airflow
DB_PASSWORD=2893ourj8923urjl

MAX_POOL_SIZE=8
MIN_POOL_SIZE=2

$CLI -c "data-source add --jndi-name=java:$JDBC_RESOURCE --name=$JDBC_POOL --connection-url=jdbc:postgresql://$DB_HOST:5432/$DB --driver-name=postgres --user-name=$DB_USER --password=$DB_PASSWORD --max-pool-size=$MAX_POOL_SIZE --min-pool-size=$MIN_POOL_SIZE --idle-timeout-minutes=5 --flush-strategy=Gracefully"
