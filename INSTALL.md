## Requirements

| Bridge Version | Required Data Elements | Context Integration URL |
|----------------|------------------------|-------------------------|
| >= 3.9.0 | Core Radiology | N/A |

## Installation

```bash
cd /servers/tmp
unzip patient-flow-VERSION.zip
/servers/harbinger/management/pb_support_console.sh
#within the container:
cd /servers/tmp/patient-flow-VERSION/db_scripts
./install.sh
exit #leave support container
cd patient-flow-VERSION/db_scripts
./create-datasources.sh
pb_run wf_app_deploy.sh /servers/tmp/exam-resolver-VERSION/patient-flow.war
```
