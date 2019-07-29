pipeline {

    agent {
        node {
            label 'pb/jenkins-build-wf:1.0.0'
        }
    }

    environment {
        JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
        PATH="/opt/jruby/bin/:$PATH"
    }

    parameters {
        string(name: 'COMMIT_ID', defaultValue: '', description: '')
    }

    stages {

        stage('Cloning-Checkout-withTag') {
            when {
                expression {
                    return env.COMMIT_ID == '';
                }
            }
            steps {
                step([$class: 'WsCleanup'])
                sh '''
                    git clone ssh://tfsemea1.ta.philips.com:22/tfs/TPC_Region13/PARAM/_git/airflow ${WORKSPACE}
                    cd ${WORKSPACE}
                    git config --unset-all remote.origin.fetch;
                    git config --add remote.origin.fetch +refs/pull/*/merge:refs/remotes/origin/pr/*
                    git fetch --all
                    TAG=$(git describe --tags $(git rev-list --tags --max-count=1))
                    git checkout $TAG
                    git show --oneline -s
                '''
            }
        }

        stage('Cloning-Checkout-WithCommitId') {
            when {
                expression {
                    return env.COMMIT_ID != '';
                }
            }
            steps {
                step([$class: 'WsCleanup'])
                sh '''
                    git clone ssh://tfsemea1.ta.philips.com:22/tfs/TPC_Region13/PARAM/_git/airflow ${WORKSPACE}
                    cd ${WORKSPACE}
                    git show --oneline -s
                    git config --unset-all remote.origin.fetch;
                    git config --add remote.origin.fetch +refs/pull/*/merge:refs/remotes/origin/pr/*
                    git fetch --all
                    git checkout ${COMMIT_ID}
                '''
            }
        }

        stage('Build-Archive-WithTag') {
            when {
                expression {
                    return env.COMMIT_ID == '';
                }
            }
            steps {
                sh '''
                    cd ${WORKSPACE}
                    sed -i 's#git://#http://#g' Gemfile
                    sed -i 's#^VERSION=`git describe --always`$#VERSION=$( basename -- `git describe --always` )#' circle-package-application.sh
                    bash -l circle-package-application.sh
                '''
                script {
                    def artifact = sh(script: 'cd ${WORKSPACE} && ls patient-flow-*.zip', returnStdout: true).trim()
                    env.artifact = artifact
                    sh 'cp -rf ${WORKSPACE}/${artifact} /sftp'
					}
            }
        }

        stage('Build-Archive-WithCommitId') {
            when {
                expression {
                    return env.COMMIT_ID != '';
                }
            }
            steps {
                sh '''
                    cd ${WORKSPACE}
                    sed -i 's#git://#http://#g' Gemfile
                    sed -i 's#^VERSION=`git describe --always`$#VERSION=$( cut -d '-' -f 1-2 <<< `git describe --always` )#' circle-package-application.sh
					sed -i 's/$PACKAGEDIR-$GIT_COMMIT_HASH/$PACKAGEDIR-$BUILD_NUMBER-$GIT_COMMIT_HASH/g' circle-package-application.sh 
                    bash -l circle-package-application.sh
                '''
            }
        }

		stage('Deploy-Artifact'){
            steps {
                script {
                    def res = sh( script: "cd ${workspace} && git describe --always | grep -E -- '-rc[0-9]+'" , returnStatus: true) == 0
                    env.result = res
                    deploy_path = "/philips/rs/pbas/patient-flow/"
                    if ( env.COMMIT_ID != '' ) {
                         deploy_path = "RS_Dev"+"${deploy_path}"
                    }
                    if ( env.result  == 'true' && env.COMMIT_ID == '' ) {
                         deploy_path = "RS_QATest"+"${deploy_path}"
                    }
                    if ( env.result  == 'false' && env.COMMIT_ID == '' ) {
                         deploy_path = "RS_Release"+"${deploy_path}"
                    }
                    withEnv(['no_proxy="${ARTIFACT_HOST}"']) {
                        def server = Artifactory.newServer url: "${ARTIFACT_URL}", credentialsId: '310209258'
                        server.bypassProxy = "true"
                        def uploadSpec = """{
                        "files": [
                            { "pattern": "patient-flow-*.zip", "target": "${deploy_path}" }
                            ]
                        }"""
                        def buildInfo1 = server.upload spec: uploadSpec
                    }
                }
            }
		}

		stage('Deploy-sftp'){
            when {
                expression {
                    return env.COMMIT_ID == '';
                }
            }
            steps {
                build job: 'sftp', parameters: [[$class: 'StringParameterValue', name: 'ARTIFACT', value: artifact],[$class: 'BooleanParameterValue', name: 'RCTAG', value: env.result]]
            }
        }
		
        stage('Checkout-Deploy') {
            steps {
                sh '''
                    echo "Checked out deployment scripts from dev-tools"
                    #cd ${WORKSPACE}
                    #git clone -b dev -n ssh://tfsemea1.ta.philips.com:22/tfs/TPC_Region13/PARAM/_git/dev-tools --depth 1 ${WORKSPACE}/scripts
                    #cd ${WORKSPACE}/scripts ; git checkout HEAD build/scripts
                '''
            }
        }

        stage('Deployment-WithTag'){
            when {
                expression {
                    return env.COMMIT_ID == '';
                }
            }
            steps {
                script {
                    def res = sh( script: "cd ${workspace} && git describe --always | grep -E -- '-rc[0-9]+'" , returnStatus: true) == 0
                    env.result = res
                    if ( env.result  == 'true') {
                    sh '''
                        #scp  ${WORKSPACE}/scripts/build/scripts/*.sh bridgeadm@${STAGING_URL}:/home/bridgeadm/
                        cd ${WORKSPACE}
                        APPNAME=`cat ${WORKSPACE}/config/application.name`
                        VAR=`ls patient-flow*.zip`
                        export URL="${ARTIFACT_URL}/RS_QATest/philips/rs/pbas/$APPNAME/$VAR"
                        ssh bridgeadm@${STAGING_URL} bash /home/bridgeadm/deploy.sh TAG_NAME BUILD_TYPE $URL
                    '''
                    }
                    if ( env.result  == 'false') {
                    sh '''
                        #scp  ${WORKSPACE}/scripts/build/scripts/*.sh bridgeadm@${STAGING_URL}:/home/bridgeadm/
                        cd ${WORKSPACE}
                        APPNAME=`cat ${WORKSPACE}/config/application.name`
                        VAR=`ls patient-flow*.zip`
                        export URL="${ARTIFACT_URL}/RS_Release/philips/rs/pbas/$APPNAME/$VAR"
                        ssh bridgeadm@${STAGING_URL} bash /home/bridgeadm/deploy.sh TAG_NAME BUILD_TYPE $URL
                    '''
                    }
                }
            }
        }

        stage('Deployment-WithCommitId') {
            when {
                expression {
                    return env.COMMIT_ID != '';
                }
            }
            steps {
                sh '''
                    #scp  ${WORKSPACE}/scripts/build/scripts/*.sh bridgeadm@${STAGING_URL}:/home/bridgeadm/
                    cd ${WORKSPACE}
                    APPNAME=`cat ${WORKSPACE}/config/application.name`
                    VAR=`ls patient-flow*.zip`
                    export URL="${ARTIFACT_URL}/RS_Dev/philips/rs/pbas/$APPNAME/$VAR"
                    ssh bridgeadm@${STAGING_URL} bash /home/bridgeadm/deploy.sh TAG_NAME BUILD_TYPE $URL
                '''
            }
        }

        stage('Sonar-Scan') {
            steps {
                sh '''
                    cd ${WORKSPACE}
                    /opt/sonar-scanner-3.3.0.1492-linux/bin/sonar-repo-setup airflow 82c933c824739c94ac836c42c0a6460c79766f0d
                '''
            }
        }
        
        stage('Sanity') {
            steps {
                 script {
                    def handle = triggerRemoteJob(remoteJenkinsName: "RJS", job: "AirflowSanity", parameters: "${env.SERVER_URL}", maxConn: 5, useCrumbCache: false, useJobInfoCache: false, pollInterval: 20, blockBuildUntilComplete: false, shouldNotFailBuild: true )
                    def status = handle.getBuildStatus()
                    def buildUrl = handle.getBuildUrl()
                    echo buildUrl.toString() + " finished with " + status.toString()
                }
            }
        }
    }
}