## Requirements

| Bridge Version | Required Data Elements | Context Integration URL |
|----------------|------------------------|-------------------------|
| >= 3.7.0 | Core Radiology | N/A |

## Installation

```bash
unzip airflow-VERSION.zip
cd airflow-VERSION
cp airflow.war.VERSION /tmp/analytics-core.war
cd db_scripts
./install.sh
./create-glassfish-jdbc.sh
cd ..
gf_app_deploy.sh /tmp/airflow.war
