pipeline {

    agent {
        node {
            label 'pb/jenkins-build-wf:1.0.0'
        }
    }

    environment {
        http_proxy="http://165.225.104.34:9480"
        https_proxy="http://165.225.104.34:9480"
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
                    sed -i 's#zip -rq "$PACKAGEDIR-$GIT_COMMIT_HASH.zip" $PACKAGEDIR#zip -rq "$PACKAGEDIR-$BUILD_NUMBER-$GIT_COMMIT_HASH.zip" $PACKAGEDIR#' circle-package-application.sh
                    bash -l circle-package-application.sh
                '''
            }
        }

        stage('Deploy-Artifact-WithTag'){
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
                            withEnv(['no_proxy=161.85.28.56']) {
                            def server = Artifactory.newServer url: 'http://161.85.28.56:8081/artifactory', credentialsId: '310209258'
                            server.bypassProxy = "true"
                            def uploadSpec = """{
                            "files": [
                                { "pattern": "patient-flow-*.zip", "target": "RS_QATest/philips/rs/pbas/patient-flow/" }
                                ]
                            }"""
                            def buildInfo1 = server.upload spec: uploadSpec
                            }
                        }
                        if ( env.result  == 'false') {
                            withEnv(['no_proxy=161.85.28.56']) {
                            def server = Artifactory.newServer url: 'http://161.85.28.56:8081/artifactory', credentialsId: '310209258'
                            server.bypassProxy = "true"
                            def uploadSpec = """{
                            "files": [
                                { "pattern": "patient-flow-*.zip", "target": "RS_Release/philips/rs/pbas/patient-flow/" }
                            ]
                            }"""
                            def buildInfo1 = server.upload spec: uploadSpec
                            }
                        }
                }
            }
        }

        stage('Deploy-Artifact-WithCommitId'){
            when {
                expression {
                    return env.COMMIT_ID != '';
                }
            }
            steps {
                script {
                    withEnv(['no_proxy=161.85.28.56']) {
                    def server = Artifactory.newServer url: 'http://161.85.28.56:8081/artifactory', credentialsId: '310209258'
                    server.bypassProxy = "true"
                    def uploadSpec = """{
                    "files": [
                        { "pattern": "patient-flow-*.zip", "target": "RS_Dev/philips/rs/pbas/patient-flow/" }
                    ]
                    }"""
                    def buildInfo1 = server.upload spec: uploadSpec
                    }
                }
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
                        #scp  ${WORKSPACE}/scripts/build/scripts/*.sh bridgeadm@btc5x338.code1.emi.philips.com:/home/bridgeadm/
                        cd ${WORKSPACE}
                        APPNAME=`cat ${WORKSPACE}/config/application.name`
                        VAR=`ls patient-flow*.zip`
                        export URL="http://161.85.28.56:8081/artifactory/RS_QATest/philips/rs/pbas/$APPNAME/$VAR"
                        ssh bridgeadm@btc5x338.code1.emi.philips.com bash /home/bridgeadm/deploy.sh TAG_NAME BUILD_TYPE $URL
                    '''
                    }
                    if ( env.result  == 'false') {
                    sh '''
                        #scp  ${WORKSPACE}/scripts/build/scripts/*.sh bridgeadm@btc5x338.code1.emi.philips.com:/home/bridgeadm/
                        cd ${WORKSPACE}
                        APPNAME=`cat ${WORKSPACE}/config/application.name`
                        VAR=`ls patient-flow*.zip`
                        export URL="http://161.85.28.56:8081/artifactory/RS_Release/philips/rs/pbas/$APPNAME/$VAR"
                        ssh bridgeadm@btc5x338.code1.emi.philips.com bash /home/bridgeadm/deploy.sh TAG_NAME BUILD_TYPE $URL
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
                    #scp  ${WORKSPACE}/scripts/build/scripts/*.sh bridgeadm@btc5x338.code1.emi.philips.com:/home/bridgeadm/
                    cd ${WORKSPACE}
                    APPNAME=`cat ${WORKSPACE}/config/application.name`
                    VAR=`ls patient-flow*.zip`
                    export URL="http://161.85.28.56:8081/artifactory/RS_Dev/philips/rs/pbas/$APPNAME/$VAR"
                    ssh bridgeadm@btc5x338.code1.emi.philips.com bash /home/bridgeadm/deploy.sh TAG_NAME BUILD_TYPE $URL
                '''
            }
        }
    }
}
