## Requirements

| Bridge Version | Required Data Elements | Context Integration URL |
|----------------|------------------------|-------------------------|
| >= 3.9.0 | Core Radiology | N/A |

## Installation

```bash
cd /servers/tmp
unzip airflow-VERSION.zip
/servers/harbinger/management/pb_support_console.sh
#within the container:
cd /servers/tmp/airflow-VERSION/db_scripts
./install.sh
exit #leave support container
cd airflow-VERSION/db_scripts
./create-datasources.sh
cp ../airflow.war /servers/wildfly/deployments/airflow.war
```
