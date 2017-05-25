## Requirements

| Bridge Version | Required Data Elements | Context Integration URL |
|----------------|------------------------|-------------------------|
| >= 3.6.6 | Core Radiology | N/A |

## Installation

```bash
unzip airflow-VERSION.zip
cd airflow-VERSION
cp airflow.war.VERSION /tmp/airflow.war
cd db_scripts
./install.sh
./create-glassfish-jdbc.sh
cd ..
gf_app_deploy.sh /tmp/airflow.war
