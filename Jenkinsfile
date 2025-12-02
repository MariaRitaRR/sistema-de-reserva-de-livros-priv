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

        stage('Verificar Node e NPM') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Backend - Install dependencies') {
            steps {
                echo '📦 Instalando dependências do backend...'
                dir('backend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Backend - Run Tests') {
            steps {
                echo '🧪 Rodando testes do backend...'
                dir('backend') {
                    bat 'npx jest --json --outputFile=test-results.json'
                }
            }
            post {
                always {
                    echo '📄 Publicando resultados dos testes...'
                    junit testResults: 'backend/reports/junit.xml', allowEmptyResults: true
                }
            }
        }

        stage('Frontend - Install dependencies') {
            steps {
                echo '📦 Instalando dependências do frontend...'
                dir('frontend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend - Run Tests') {
            environment {
                // CONFIGURAÇÕES ESSENCIAIS
                CI = 'true'
                JEST_JUNIT_OUTPUT_DIR = '.'
                JEST_JUNIT_OUTPUT_NAME = 'test-results.xml'
                JEST_JUNIT_SUITE_NAME = 'Frontend Tests'
                JEST_JUNIT_CLASSNAME = '{classname}'
                JEST_JUNIT_TITLE = '{title}'
                JEST_JUNIT_ANCESTOR_SEPARATOR = ' › '
                JEST_JUNIT_ADD_FILE_ATTRIBUTE = 'true'
                JEST_JUNIT_INCLUDE_SHORT_CONSOLE_OUTPUT = 'true'
            }
            steps {
                dir('frontend') {
                    // IMPORTANTE: Adicione --reporters=jest-junit
                    bat 'npm test -- --ci --passWithNoTests --watchAll=false --reporters=default --reporters=jest-junit'
                    
                    // Verifica se o arquivo foi criado
                    bat '''
                        if exist test-results.xml (
                            echo "✅ Arquivo test-results.xml criado com sucesso"
                            type test-results.xml
                        ) else (
                            echo "❌ Arquivo test-results.xml NÃO foi criado"
                            echo "Criando arquivo vazio para evitar falha no Jenkins..."
                            echo ^<?xml version="1.0" encoding="UTF-8"?^> > test-results.xml
                            echo ^<testsuites^> >> test-results.xml
                            echo   ^<testsuite name="Frontend Tests" tests="0" failures="0" skipped="0" errors="0" time="0"^> >> test-results.xml
                            echo   ^</testsuite^> >> test-results.xml
                            echo ^</testsuites^> >> test-results.xml
                        )
                    '''
                }
            }
            post {
                always {
                    junit 'frontend/test-results.xml'
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                echo '🛠️ Construindo frontend...'
                dir('frontend') {
                    bat 'npm run build'
                }
            }
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
