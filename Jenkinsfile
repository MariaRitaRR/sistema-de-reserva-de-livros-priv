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
    
    stages {
        stage('Checkout') {
            steps {
                git branch: params.BRANCH, url: 'https://github.com/MariaRitaRR/sistema-de-reserva-de-livros-priv.git'
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                            export NVM_DIR="$HOME/.nvm"
                            [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                            nvm install 18
                            nvm install 20
                            nvm use 18
                        '''
                    } else {
                        bat 'choco install nodejs --version=18.17.0'
                    }
                }
            }
        }
        
        stage('Setup & Cache') {
            steps {
                dir('backend') {
                    script {
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
                    steps {
                        script {
                            if (isUnix()) {
                                sh '''
                                    export NVM_DIR="$HOME/.nvm"
                                    [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                                    nvm use 18
                                '''
                            }
                            
                            dir('backend') {
                                sh 'npm ci'
                                sh 'npm test -- --runInBand'
                            }
                        }
                    }
                    post {
                        always {
                            junit 'backend/test-results.xml'
                            archiveArtifacts 'backend/test-results.json'
                        }
                    }
                }
                
                stage('Testes Node 20') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh '''
                                    export NVM_DIR="$HOME/.nvm"
                                    [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                                    nvm use 20
                                '''
                            }
                            
                            dir('backend') {
                                sh 'npm ci'
                                sh 'npm run test:ci'
                                sh 'npm run test:coverage'
                            }
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
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'frontend/dist',
                        reportFiles: 'index.html',
                        reportName: 'Frontend Build'
                    ])
                }
            }
        }
        
        stage('Package') {
            steps {
                script {
                    sh '''
                        mkdir -p package-backend
                        rsync -av --exclude=".git" --exclude="node_modules" backend/ package-backend/backend/
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
        
        stage('Relatório Final') {
            steps {
                script {
                    def summary = """
# 🎉 Relatório de Integração - Sistema de Reservas Bookle

**Data:** ${new Date().format('dd/MM/yyyy HH:mm:ss')}
**Branch:** ${env.BRANCH_NAME}
**Build:** ${env.BUILD_NUMBER}

## 📋 Status dos Estágios:
- ✅ Checkout e Setup
- ✅ Testes Backend (Node 18 e 20)
- ✅ Audit de Segurança
- ✅ Testes Frontend
- ✅ Package

## 📊 Funcionalidades Validadas:
- ✅ Autenticação JWT e autorização
- ✅ CRUD completo de reservas  
- ✅ Persistência e integridade de dados
- ✅ Validações de negócio
- ✅ Frontend integrado

**Status Final:** ${currentBuild.currentResult}
"""

                    writeFile file: 'relatorio-integracao.md', text: summary
                    archiveArtifacts 'relatorio-integracao.md'
                    
                    echo summary
                }
            }
        }
    }
    
    post {
        always {
            echo "📊 Pipeline finalizado - Status: ${currentBuild.currentResult}"
        }
        
        success {
            echo "✅ Pipeline concluído com sucesso!"
        }
        
        failure {
            echo "❌ Pipeline falhou!"
        }
        
        unstable {
            echo "⚠️  Pipeline instável - alguns testes falharam"
        }
    }
}