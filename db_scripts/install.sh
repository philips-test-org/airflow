#!/bin/bash
echo 'Creating schema, user, tables, etc.' # TODO: The Schema related steps needs to be run on Postgres container
psql -e -f create.sql -U postgres harbinger
export PGPASSWORD=2893ourj8923urjl
psql -e -f schema.sql -U airflow harbinger

echo 'Creating JDBC and Connection pools at Wildfly'
HOSTNAME=$(hostname -f)
cp create-wildfly-jdbc.sh /servers/wildfly/drivers/
sed -i "s/<PLATFORM_FQDN>/$HOSTNAME/g" /servers/wildfly/drivers/create-wildfly-jdbc.sh
chmod +x /servers/wildfly/drivers/create-wildfly-jdbc.sh && chown bridgeadm:bridgeadm /servers/wildfly/drivers/create-wildfly-jdbc.sh
docker exec philips-rs-wildfly /servers/wildfly/drivers/create-wildfly-jdbc.sh
rm -f /servers/wildfly/drivers/create-wildfly-jdbc.sh
echo 'JDBC & JNDI configurations applied'
