pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'nodejs', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        PATH = "${NODEJS_HOME};${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '🔄 Baixando código do Git...'
                checkout scm
            }
        }

        // stage('Verificar Node e NPM') {
        //     steps {
        //         bat 'node -v'
        //         bat 'npm -v'
        //     }
        // }

        // stage('Backend - Install dependencies') {
        //     steps {
        //         echo '📦 Instalando dependências do backend...'
        //         dir('backend') {
        //             bat 'npm ci'
        //         }
        //     }
        // }

        // stage('Backend - Run Tests') {
        //     steps {
        //         echo '🧪 Rodando testes do backend...'
        //         dir('backend') {
        //             bat 'npx jest --json --outputFile=test-results.json'
        //         }
        //     }
        //     post {
        //         always {
        //             echo '📄 Publicando resultados dos testes...'
        //             junit testResults: 'backend/test-results.json', allowEmptyResults: true
        //         }
        //     }
        // }

        // stage('Frontend - Install dependencies') {
        //     steps {
        //         echo '📦 Instalando dependências do frontend...'
        //         dir('frontend') {
        //             bat 'npm ci'
        //         }
        //     }
        // }

        // stage('Frontend - Build') {
        //     steps {
        //         echo '🛠️ Construindo frontend...'
        //         dir('frontend') {
        //             bat 'npm run build'
        //         }
        //     }
        }

    }

    post {
        success {
            echo '🎉 Pipeline finalizada com sucesso!'
        }
        failure {
            echo '❌ A pipeline falhou.'
        }
    }
}
