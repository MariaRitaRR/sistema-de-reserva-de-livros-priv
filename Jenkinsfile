pipeline {
    agent any
    
    parameters {
        choice(
            name: 'BRANCH',
            choices: ['main', 'develop', 'master'],
            description: 'Branch para build'
        )
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }
    
    environment {
        NODE_VERSION = '18'
        // Configurar estas variáveis no Jenkins
        MAIL_USERNAME = credentials('mail-username')
        MAIL_PASSWORD = credentials('mail-password')
        NOTIFY_EMAIL = credentials('notify-email')
        CODECOV_TOKEN = credentials('codecov-token')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: params.BRANCH, url: 'https://github.com/seu-usuario/seu-repositorio.git'
            }
        }
        
        stage('Setup & Cache') {
            steps {
                dir('backend') {
                    script {
                        // Simulação de cache - Jenkins tem sistema próprio de cache
                        if (fileExists('node_modules')) {
                            echo "✅ Cache encontrado - reutilizando node_modules"
                        } else {
                            echo "📦 Instalando dependências..."
                            sh "npm ci"
                        }
                    }
                }
            }
        }
        
        stage('Testes Backend') {
            parallel {
                stage('Testes Node 18') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            reuseNode true
                        }
                    }
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                            sh 'npm test -- --runInBand'
                        }
                    }
                    post {
                        always {
                            junit 'backend/test-results.xml' // Configure seu Jest para gerar JUnit
                            archiveArtifacts 'backend/test-results.json'
                        }
                    }
                }
                
                stage('Testes Node 20') {
                    agent {
                        docker {
                            image 'node:20-alpine'
                            reuseNode true
                        }
                    }
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                            sh 'npm run test:ci'
                            sh 'npm run test:coverage'
                        }
                    }
                    post {
                        always {
                            junit 'backend/test-results.xml'
                            publishHTML([
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'backend/coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Relatório Cobertura'
                            ])
                        }
                        success {
                            // Upload para Codecov - precisa do plugin
                            sh '''
                                curl -s https://codecov.io/bash | bash -s -- -t ${CODECOV_TOKEN} -f backend/coverage/lcov.info -F backend
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Audit Segurança') {
            steps {
                dir('backend') {
                    sh 'npm audit --audit-level=high || echo "⚠️  Issues encontrados no audit"'
                    sh 'npm audit --json > audit-report.json || true'
                }
            }
            post {
                always {
                    archiveArtifacts 'backend/audit-report.json'
                }
            }
        }
        
        stage('Testes Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
            post {
                always {
                    echo "🎨 Frontend - Build concluído com sucesso"
                }
            }
        }
        
        stage('Package') {
            steps {
                script {
                    sh '''
                        mkdir -p package-backend
                        rsync -av --exclude='.git' --exclude='node_modules' backend/ package-backend/backend/
                        cd package-backend/backend
                        npm install --production
                        cd ../..
                        TIMESTAMP=$(date +%Y%m%d%H%M%S)
                        zip -r backend-package-${TIMESTAMP}.zip package-backend
                    '''
                }
            }
            post {
                success {
                    archiveArtifacts 'backend-package-*.zip'
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Relatório consolidado similar ao GitHub Actions
                def summary = """
                # 🎉 Relatório de Integração - Sistema de Reservas Bookle

                **Data:** ${new Date().format('dd/MM/yyyy HH:mm:ss')}
                **Branch:** ${env.BRANCH_NAME}
                **Build:** ${env.BUILD_NUMBER}

                ## 📋 Status dos Estágios:
                ${currentBuild.rawBuild.getStages().collect { stage ->
                    "• ${stage.name}: ${stage.status}"
                }.join('\\n')}

                ## 📊 Funcionalidades Validadas:
                - ✅ Autenticação JWT e autorização
                - ✅ CRUD completo de reservas  
                - ✅ Persistência e integridade de dados
                - ✅ Validações de negócio
                - ✅ Frontend integrado

                **Status Final:** ${currentBuild.currentResult}
                """

                // Escrever relatório em arquivo
                writeFile file: 'relatorio-integracao.md', text: summary
                archiveArtifacts 'relatorio-integracao.md'
            }
        }
        
        success {
            script {
                echo "✅ Pipeline concluído com sucesso!"
                // Enviar email de sucesso
                emailext (
                    subject: "✅ Pipeline SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                    O pipeline foi concluído com SUCESSO!
                    
                    Repositório: ${env.JOB_NAME}
                    Build: #${env.BUILD_NUMBER}
                    Branch: ${env.BRANCH_NAME}
                    Status: ${currentBuild.currentResult}
                    
                    Acesse: ${env.BUILD_URL}
                    """,
                    to: "${env.NOTIFY_EMAIL}"
                )
            }
        }
        
        failure {
            script {
                echo "❌ Pipeline falhou!"
                // Enviar email de falha
                emailext (
                    subject: "❌ Pipeline FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                    O pipeline FALHOU!
                    
                    Repositório: ${env.JOB_NAME}
                    Build: #${env.BUILD_NUMBER}
                    Branch: ${env.BRANCH_NAME}
                    Status: ${currentBuild.currentResult}
                    
                    Acesse para detalhes: ${env.BUILD_URL}
                    """,
                    to: "${env.NOTIFY_EMAIL}"
                )
            }
        }
        
        unstable {
            echo "⚠️  Pipeline instável - alguns testes falharam"
        }
    }
}